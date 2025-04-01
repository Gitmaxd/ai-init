#!/usr/bin/env node

/**
 * CLI entry point for ai-init
 * Zero-dependency implementation
 */

const path = require('path');
const { createProject, addToProject, InstallerError } = require('../lib/installer');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Package version from package.json
const packageJson = require('../package.json');
const VERSION = packageJson.version;

/**
 * Prints help text to the console
 */
function printHelp() {
  console.log(`
${colors.cyan}AI Init v${VERSION}${colors.reset} - Initialize AI Project Starter scaffolding

${colors.yellow}Usage:${colors.reset}
  ai-init [project-name] [options]

${colors.yellow}Arguments:${colors.reset}
  project-name         Name of the directory to create (optional)

${colors.yellow}Options:${colors.reset}
  --help, -h           Show this help message
  --version, -v        Show version number
  --add                Add AI scaffolding to existing project
  --verbose            Show detailed logs
  --skip-symlink       Skip creating symlinks

${colors.yellow}Examples:${colors.reset}
  ai-init my-project   Create a new directory with scaffolding
  ai-init --add        Add scaffolding to current directory
  `);
}

/**
 * Parses command line arguments
 * @returns {Object} - Parsed options
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    projectName: null,
    add: false,
    verbose: false,
    skipSymlink: false,
    help: false,
    version: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg.startsWith('--')) {
      // Handle options
      switch (arg) {
        case '--add':
          options.add = true;
          break;
        case '--verbose':
          options.verbose = true;
          process.env.VERBOSE = 'true';
          break;
        case '--skip-symlink':
          options.skipSymlink = true;
          break;
        case '--help':
        case '-h':
          options.help = true;
          break;
        case '--version':
        case '-v':
          options.version = true;
          break;
        default:
          console.warn(`${colors.yellow}Warning:${colors.reset} Unknown option: ${arg}`);
      }
    } else if (!options.projectName && !options.add) {
      // First non-option argument is the project name
      options.projectName = arg;
    }
  }

  return options;
}

/**
 * Prompts the user for input
 * @param {string} question - The question to ask
 * @returns {Promise<string>} - User input
 */
function prompt(question) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

/**
 * Main execution function
 */
async function main() {
  try {
    const options = parseArgs();
    
    if (options.help) {
      printHelp();
      return;
    }
    
    if (options.version) {
      console.log(`ai-init v${VERSION}`);
      return;
    }
    
    if (options.add) {
      // Add to existing project
      console.log(`${colors.cyan}Adding AI Project Starter scaffolding to current directory...${colors.reset}`);
      
      try {
        const projectPath = await addToProject(options);
        console.log(`${colors.green}✓${colors.reset} Successfully added AI Project Starter scaffolding to ${projectPath}`);
      } catch (error) {
        handleError(error);
      }
    } else {
      // Create new project
      let projectName = options.projectName;
      
      if (!projectName) {
        // Prompt for project name if not provided
        projectName = await prompt('Name of directory to create (leave empty to add to current directory): ');
        
        if (!projectName.trim()) {
          // If still empty, add to current directory
          options.add = true;
          console.log(`${colors.cyan}Adding AI Project Starter scaffolding to current directory...${colors.reset}`);
          
          try {
            const projectPath = await addToProject(options);
            console.log(`${colors.green}✓${colors.reset} Successfully added AI Project Starter scaffolding to ${projectPath}`);
          } catch (error) {
            handleError(error);
          }
          return;
        }
      }
      
      console.log(`${colors.cyan}Creating a new directory with AI Project Starter scaffolding: ${projectName}${colors.reset}`);
      
      try {
        const projectPath = await createProject(projectName, options);
        console.log(`${colors.green}✓${colors.reset} Successfully created AI Project Starter scaffolding in ${projectPath}`);
      } catch (error) {
        handleError(error);
      }
    }
  } catch (error) {
    handleError(error);
  }
}

/**
 * Handles and displays errors
 * @param {Error} error - The error to handle
 */
function handleError(error) {
  if (error instanceof InstallerError) {
    console.error(`${colors.red}Error:${colors.reset} ${error.message}`);
    
    if (error.details && error.details.errors) {
      console.error(`${colors.yellow}Details:${colors.reset}`);
      error.details.errors.forEach(err => {
        console.error(`  - ${err}`);
      });
    }
    
    process.exit(1);
  } else {
    console.error(`${colors.red}Unexpected error:${colors.reset} ${error.message}`);
    if (process.env.VERBOSE) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run the main function
main();
