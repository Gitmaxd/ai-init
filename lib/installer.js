const fs = require('fs-extra');
const path = require('path');
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
 * Creates a new directory with AI Project Starter scaffolding
 * @param {string} projectName - Name of the directory to create
 * @param {Object} options - Configuration options
 * @returns {string} - Path to the created directory
 * @throws {InstallerError} - If creation fails
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
      `Invalid directory name: ${projectName}`,
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
    } else {
      // Create the directory if it doesn't exist
      await fs.ensureDir(projectPath);
      if (process.env.VERBOSE) {
        console.log(`Created directory: ${projectPath}`);
      }
    }
  } catch (error) {
    if (error instanceof InstallerError) {
      throw error;
    }
    throw new InstallerError(
      `Error creating project directory: ${error.message}`,
      'DIR_CREATE_FAILED',
      { originalError: error }
    );
  }
  
  // Copy Next.js template files
  try {
    await copyTemplateFiles(projectPath, false);
  } catch (error) {
    throw new InstallerError(
      `Failed to copy template files: ${error.message}`,
      'TEMPLATE_COPY_FAILED',
      { originalError: error }
    );
  }
  
  // Create symlinks for rules
  if (!options.skipSymlink) {
    try {
      const rulesPath = path.join(projectPath, 'rules.yaml');
      const windsurfRulesPath = path.join(projectPath, '.windsurfrules');
      const cursorRulesPath = path.join(projectPath, '.cursorrules');
      const clineRulesPath = path.join(projectPath, '.clinerules');
      
      if (await fs.pathExists(rulesPath)) {
        // Create symlinks based on OS
        if (process.platform === 'win32') {
          // Windows needs special handling for symlinks
          try {
            fs.copyFileSync(rulesPath, windsurfRulesPath);
            fs.copyFileSync(rulesPath, cursorRulesPath);
            fs.copyFileSync(rulesPath, clineRulesPath);
          } catch (error) {
            console.warn('Failed to create rule copies on Windows. You can manually copy rules.yaml to .windsurfrules, .cursorrules, and .clinerules');
          }
        } else {
          // Unix-based systems can use symlinks
          try {
            await fs.ensureSymlink(rulesPath, windsurfRulesPath);
            await fs.ensureSymlink(rulesPath, cursorRulesPath);
            await fs.ensureSymlink(rulesPath, clineRulesPath);
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
 * Adds AI Project Starter scaffolding to an existing project
 * @param {Object} options - Configuration options
 * @returns {string} - Path to the project
 * @throws {InstallerError} - If adding to project fails
 */
async function addToProject(options = {}) {
  const projectPath = process.cwd();
  
  // Copy Next.js template files, preserving existing files
  try {
    await copyTemplateFiles(projectPath, true);
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
  
  // Create symlinks for rules
  if (!options.skipSymlink) {
    try {
      const rulesPath = path.join(projectPath, 'rules.yaml');
      const windsurfRulesPath = path.join(projectPath, '.windsurfrules');
      const cursorRulesPath = path.join(projectPath, '.cursorrules');
      const clineRulesPath = path.join(projectPath, '.clinerules');
      
      if (await fs.pathExists(rulesPath)) {
        // Create symlinks based on OS
        if (process.platform === 'win32') {
          // Windows needs special handling for symlinks
          try {
            fs.copyFileSync(rulesPath, windsurfRulesPath);
            fs.copyFileSync(rulesPath, cursorRulesPath);
            fs.copyFileSync(rulesPath, clineRulesPath);
          } catch (error) {
            console.warn('Failed to create rule copies on Windows. You can manually copy rules.yaml to .windsurfrules, .cursorrules, and .clinerules');
          }
        } else {
          // Unix-based systems can use symlinks
          try {
            await fs.ensureSymlink(rulesPath, windsurfRulesPath);
            await fs.ensureSymlink(rulesPath, cursorRulesPath);
            await fs.ensureSymlink(rulesPath, clineRulesPath);
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
 * @param {boolean} preserveExisting - Whether to preserve existing files
 * @throws {InstallerError} - If template copying fails
 */
async function copyTemplateFiles(targetPath, preserveExisting = false) {
  const templatePath = path.join(__dirname, 'templates', 'next');
  
  // Make sure the template exists
  try {
    const templateExists = await fs.pathExists(templatePath);
    if (!templateExists) {
      throw new InstallerError(
        'Next.js template directory not found',
        'TEMPLATE_NOT_FOUND',
        { templatePath }
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
      console.log(`Reading template files from: ${templatePath}`);
    }
    files = await getAllFiles(templatePath);
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
      const relativePath = path.relative(templatePath, file);
      const targetFile = path.join(targetPath, relativePath);
      
      // Skip if file exists and we're preserving existing files
      if (preserveExisting && await fs.pathExists(targetFile)) {
        if (process.env.VERBOSE) {
          console.log(`Skipping existing file: ${relativePath}`);
        }
        continue;
      }
      
      // Ensure the target directory exists
      await fs.ensureDir(path.dirname(targetFile));
      
      // Copy the file
      await fs.copyFile(file, targetFile);
      if (process.env.VERBOSE) {
        console.log(`Copied: ${relativePath}`);
      }
    } catch (error) {
      console.warn(`Failed to copy file ${file}: ${error.message}`);
    }
  }
}

/**
 * Recursively gets all files in a directory
 * @param {string} dir - Directory to get files from
 * @returns {Promise<string[]>} - Array of file paths
 * @throws {Error} - If directory reading fails
 */
async function getAllFiles(dir) {
  const files = [];
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const subFiles = await getAllFiles(fullPath);
        files.push(...subFiles);
      } else {
        files.push(fullPath);
      }
    }
  } catch (error) {
    throw new Error(`Failed to read directory ${dir}: ${error.message}`);
  }
  
  return files;
}

module.exports = {
  createProject,
  addToProject,
  InstallerError
};
