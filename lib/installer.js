const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const validateProjectName = require('validate-npm-package-name');

/**
 * Error class for installation errors
 */
class InstallerError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.name = 'InstallerError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Creates a new project with AI Project Starter framework
 * @param {string} projectName - Name of the project to create
 * @param {Object} options - Configuration options
 * @returns {string} - Path to the created project
 * @throws {InstallerError} - If project creation fails
 */
async function createProject(projectName, options = {}) {
  // Validate project name
  const nameValidation = validateProjectName(projectName);
  if (!nameValidation.validForNewPackages) {
    const errors = [
      ...(nameValidation.errors || []),
      ...(nameValidation.warnings || [])
    ];
    throw new InstallerError(
      `Invalid project name: ${projectName}`,
      'INVALID_NAME',
      { errors }
    );
  }
  
  const projectPath = path.resolve(process.cwd(), projectName);
  
  // Check if directory already exists and is not empty
  try {
    const exists = await fs.pathExists(projectPath);
    if (exists) {
      const files = await fs.readdir(projectPath);
      if (files.length > 0) {
        throw new InstallerError(
          `Directory ${projectName} already exists and is not empty. Please choose another name or empty the directory.`,
          'DIR_NOT_EMPTY'
        );
      }
    }
  } catch (error) {
    if (error instanceof InstallerError) {
      throw error;
    }
    throw new InstallerError(
      `Error checking project directory: ${error.message}`,
      'FS_ERROR',
      { originalError: error }
    );
  }
  
  // Create project directory
  try {
    await fs.ensureDir(projectPath);
  } catch (error) {
    throw new InstallerError(
      `Failed to create project directory: ${error.message}`,
      'DIR_CREATE_FAILED',
      { originalError: error }
    );
  }
  
  // Copy template files
  try {
    await copyTemplateFiles(projectPath, options.type || 'next');
  } catch (error) {
    throw new InstallerError(
      `Failed to copy template files: ${error.message}`,
      'TEMPLATE_COPY_FAILED',
      { originalError: error }
    );
  }
  
  // Initialize git repository (if not skipped)
  if (!options.skipGit) {
    try {
      execSync('git init', { cwd: projectPath, stdio: 'ignore' });
      
      // Add initial .gitignore
      const gitignorePath = path.join(projectPath, '.gitignore');
      if (!await fs.pathExists(gitignorePath)) {
        await fs.writeFile(gitignorePath, 
          '# Dependencies\nnode_modules/\n\n# Build artifacts\n.next/\ndist/\nbuild/\n\n' +
          '# Environment variables\n.env\n.env.local\n.env.*\n\n# Editor directories\n.vscode/\n.idea/\n\n' +
          '# OS files\n.DS_Store\nThumbs.db\n');
      }
    } catch (error) {
      console.warn('Git initialization failed. Do you have Git installed?');
    }
  }
  
  // Install dependencies (if not skipped)
  if (!options.skipInstall) {
    // Detect and use appropriate package manager
    try {
      const packageManager = detectPackageManager(projectPath);
      try {
        execSync(`${packageManager} install`, { cwd: projectPath, stdio: 'ignore' });
      } catch (error) {
        console.warn(`Dependency installation failed using ${packageManager}. You can install them manually later.`);
      }
    } catch (error) {
      console.warn('Failed to detect package manager. Skipping dependency installation.');
    }
  }
  
  // Create symlink for rules if not skipped
  if (!options.skipSymlink) {
    try {
      const rulesPath = path.join(projectPath, 'rules.yaml');
      const windsurfRulesPath = path.join(projectPath, '.windsurfrules');
      const cursorRulesPath = path.join(projectPath, '.cursorrules');
      
      if (await fs.pathExists(rulesPath)) {
        // Create symlinks based on OS
        if (process.platform === 'win32') {
          // Windows needs special handling for symlinks
          try {
            fs.copyFileSync(rulesPath, windsurfRulesPath);
            fs.copyFileSync(rulesPath, cursorRulesPath);
          } catch (error) {
            console.warn('Failed to create rule copies on Windows. You can manually copy rules.yaml to .windsurfrules and .cursorrules');
          }
        } else {
          // Unix-based systems can use symlinks
          try {
            await fs.ensureSymlink(rulesPath, windsurfRulesPath);
            await fs.ensureSymlink(rulesPath, cursorRulesPath);
          } catch (error) {
            console.warn('Failed to create rule symlinks. You can manually create them later.');
          }
        }
      }
    } catch (error) {
      console.warn('Failed to set up rule symlinks. You can create them manually later.');
    }
  }
  
  return projectPath;
}

/**
 * Adds AI Project Starter framework to an existing project
 * @param {Object} options - Configuration options
 * @returns {string} - Path to the project
 * @throws {InstallerError} - If adding to project fails
 */
async function addToProject(options = {}) {
  const projectPath = process.cwd();
  
  // Check if directory is a valid project
  try {
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJsonExists = await fs.pathExists(packageJsonPath);
    
    if (!packageJsonExists) {
      throw new InstallerError(
        'Current directory does not appear to be a valid project (no package.json found).',
        'INVALID_PROJECT'
      );
    }
  } catch (error) {
    if (error instanceof InstallerError) {
      throw error;
    }
    throw new InstallerError(
      `Error checking project: ${error.message}`,
      'FS_ERROR',
      { originalError: error }
    );
  }
  
  // Copy template files, preserving existing files
  try {
    // Use 'next' as the default template type
    await copyTemplateFiles(projectPath, options.type || 'next', true);
  } catch (error) {
    throw new InstallerError(
      `Failed to copy template files: ${error.message}`,
      'TEMPLATE_COPY_FAILED',
      { originalError: error }
    );
  }
  
  // Ensure directories exist
  try {
    await fs.ensureDir(path.join(projectPath, '.cursor/rules'));
    await fs.ensureDir(path.join(projectPath, 'doc-files/adr'));
    await fs.ensureDir(path.join(projectPath, 'memory-bank'));
    await fs.ensureDir(path.join(projectPath, 'mem-scripts'));
  } catch (error) {
    throw new InstallerError(
      `Failed to create required directories: ${error.message}`,
      'DIR_CREATE_FAILED',
      { originalError: error }
    );
  }
  
  // Create symlink for rules if not skipped
  if (!options.skipSymlink) {
    try {
      const rulesPath = path.join(projectPath, 'rules.yaml');
      const windsurfRulesPath = path.join(projectPath, '.windsurfrules');
      const cursorRulesPath = path.join(projectPath, '.cursorrules');
      
      if (await fs.pathExists(rulesPath)) {
        // Create symlinks based on OS
        if (process.platform === 'win32') {
          // Windows needs special handling for symlinks
          try {
            fs.copyFileSync(rulesPath, windsurfRulesPath);
            fs.copyFileSync(rulesPath, cursorRulesPath);
          } catch (error) {
            console.warn('Failed to create rule copies on Windows. You can manually copy rules.yaml to .windsurfrules and .cursorrules');
          }
        } else {
          // Unix-based systems can use symlinks
          try {
            await fs.ensureSymlink(rulesPath, windsurfRulesPath);
            await fs.ensureSymlink(rulesPath, cursorRulesPath);
          } catch (error) {
            console.warn('Failed to create rule symlinks. You can manually create them later.');
          }
        }
      }
    } catch (error) {
      console.warn('Failed to set up rule symlinks. You can create them manually later.');
    }
  }
  
  return projectPath;
}

/**
 * Copies template files to the target directory
 * @param {string} targetPath - Path to copy files to
 * @param {string} templateType - Type of template to use
 * @param {boolean} preserveExisting - Whether to preserve existing files
 * @throws {InstallerError} - If template copying fails
 */
async function copyTemplateFiles(targetPath, templateType = 'next', preserveExisting = false) {
  const templatePath = path.join(__dirname, 'templates', templateType);
  
  // If template doesn't exist, fall back to next
  let actualTemplatePath;
  try {
    const templateExists = await fs.pathExists(templatePath);
    if (templateExists) {
      actualTemplatePath = templatePath;
      if (process.env.VERBOSE) {
        console.log(`Using template: ${templateType}`);
      }
    } else {
      // Only show fallback message if we're not already using 'next'
      actualTemplatePath = path.join(__dirname, 'templates', 'next');
      if (templateType !== 'next') {
        console.log(`Template '${templateType}' not found, falling back to 'next' template`);
      }
    }
    
    const nextTemplateExists = await fs.pathExists(actualTemplatePath);
    if (!nextTemplateExists) {
      throw new InstallerError(
        'Template directory not found',
        'TEMPLATE_NOT_FOUND',
        { templatePath, actualTemplatePath }
      );
    }
  } catch (error) {
    if (error instanceof InstallerError) {
      throw error;
    }
    throw new InstallerError(
      `Error checking template path: ${error.message}`,
      'FS_ERROR',
      { originalError: error }
    );
  }
  
  // Read all files from the template directory
  let files;
  try {
    if (process.env.VERBOSE) {
      console.log(`Reading template files from: ${actualTemplatePath}`);
    }
    files = await getAllFiles(actualTemplatePath);
    if (process.env.VERBOSE) {
      console.log(`Found ${files.length} files to copy`);
    }
  } catch (error) {
    throw new InstallerError(
      `Failed to read template files: ${error.message}`,
      'TEMPLATE_READ_FAILED',
      { originalError: error }
    );
  }
  
  // Copy each file to the target directory
  for (const file of files) {
    try {
      const relativePath = path.relative(actualTemplatePath, file);
      const targetFile = path.join(targetPath, relativePath);
      
      // Skip package.json for existing projects
      if (path.basename(file) === 'package.json' && preserveExisting && await fs.pathExists(targetFile)) {
        console.log(`Skipping package.json as it already exists.`);
        console.log(`If needed, you can manually add these dependencies to your package.json:`);
        try {
          const templatePackage = await fs.readJson(file);
          if (templatePackage.dependencies) {
            console.log(`\nDependencies:`);
            for (const [pkg, version] of Object.entries(templatePackage.dependencies)) {
              console.log(`  "${pkg}": "${version}"`);
            }
          }
          if (templatePackage.devDependencies) {
            console.log(`\nDev Dependencies:`);
            for (const [pkg, version] of Object.entries(templatePackage.devDependencies)) {
              console.log(`  "${pkg}": "${version}"`);
            }
          }
          console.log('');
        } catch (err) {
          // Just skip if we can't read the template package.json
        }
        continue;
      }
      
      // Skip if file exists and we're preserving existing files
      if (preserveExisting && await fs.pathExists(targetFile)) {
        if (process.env.VERBOSE) {
          console.log(`Skipping existing file: ${relativePath}`);
        }
        continue;
      }
      
      // Ensure the directory exists
      await fs.ensureDir(path.dirname(targetFile));
      
      // Copy the file
      await fs.copy(file, targetFile);
      if (process.env.VERBOSE) {
        console.log(`Copied: ${relativePath}`);
      }
    } catch (error) {
      throw new InstallerError(
        `Failed to copy file ${file}: ${error.message}`,
        'FILE_COPY_FAILED',
        { originalError: error }
      );
    }
  }
}

/**
 * Detects the package manager used in the project
 * @param {string} directory - Directory to check for lockfiles
 * @returns {string} - Detected package manager
 * @throws {Error} - If package manager detection fails
 */
function detectPackageManager(directory = process.cwd()) {
  try {
    // Check for lockfiles to determine package manager
    if (fs.existsSync(path.join(directory, 'yarn.lock'))) {
      return 'yarn';
    } else if (fs.existsSync(path.join(directory, 'pnpm-lock.yaml'))) {
      return 'pnpm';
    } else {
      return 'npm';
    }
  } catch (error) {
    throw new Error(`Failed to detect package manager: ${error.message}`);
  }
}

// NOTE: This function is kept for potential future use but is currently unused
// /**
//  * Detects the project type from package.json
//  * @param {string} projectPath - Path to the project
//  * @returns {string} - Detected project type
//  * @throws {InstallerError} - If project type detection fails
//  */
// async function detectProjectType(projectPath) {
//   try {
//     const packageJsonPath = path.join(projectPath, 'package.json');
//     const packageJson = await fs.readJson(packageJsonPath);
//     
//     // Check dependencies and devDependencies
//     const allDeps = {
//       ...(packageJson.dependencies || {}),
//       ...(packageJson.devDependencies || {})
//     };
//     
//     // Detect project type based on dependencies
//     if (allDeps['next']) {
//       return 'next';
//     } else if (allDeps['react'] && !allDeps['next']) {
//       return 'react';
//     } else if (allDeps['express'] || allDeps['koa'] || allDeps['fastify']) {
//       return 'node';
//     } else {
//       // Default to basic template if can't determine
//       return 'default';
//     }
//   } catch (error) {
//     throw new Error(`Failed to detect project type: ${error.message}`);
//   }
// }

/**
 * Recursively gets all files in a directory
 * @param {string} dir - Directory to get files from
 * @returns {Promise<string[]>} - Array of file paths
 * @throws {Error} - If directory reading fails
 */
async function getAllFiles(dir) {
  try {
    const files = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Debug log for directory traversal
        if (process.env.DEBUG || process.env.VERBOSE) {
          console.log(`Traversing directory: ${fullPath}`);
        }
        const subFiles = await getAllFiles(fullPath);
        files.push(...subFiles);
      } else {
        // Debug log for file discovery
        if (process.env.DEBUG || process.env.VERBOSE) {
          console.log(`Found file: ${fullPath}`);
        }
        files.push(fullPath);
      }
    }
    
    return files;
  } catch (error) {
    throw new Error(`Failed to read directory ${dir}: ${error.message}`);
  }
}

module.exports = {
  createProject,
  addToProject,
  InstallerError
};
