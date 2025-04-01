#!/usr/bin/env node

/**
 * CLI entry point for ai-init
 */

// Check for required dependencies before proceeding
function checkDependencies() {
  const requiredDeps = ['commander', 'inquirer', 'chalk', 'ora', 'fs-extra', 'validate-npm-package-name'];
  const missing = [];
  
  for (const dep of requiredDeps) {
    try {
      require.resolve(dep);
    } catch (e) {
      missing.push(dep);
    }
  }
  
  if (missing.length > 0) {
    console.error('\x1b[31m%s\x1b[0m', 'Error: Missing dependencies detected!');
    console.error('\x1b[33m%s\x1b[0m', `The following dependencies are required but not installed: ${missing.join(', ')}`);
    console.error('\x1b[36m%s\x1b[0m', 'Please install dependencies by running:');
    console.error('\x1b[36m%s\x1b[0m', '  npm install');
    console.error('\x1b[36m%s\x1b[0m', 'Or link the package after installing dependencies:');
    console.error('\x1b[36m%s\x1b[0m', '  npm install && npm link');
    process.exit(1);
  }
}

// Run dependency check before importing modules
checkDependencies();

// Only import dependencies after checking they exist
const { program } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const { createProject, addToProject } = require('../lib/installer');

program
  .name('ai-init')
  .description('Initialize AI Project Starter scaffolding')
  .version('1.5.0');

program
  .argument('[project-name]', 'Name of the directory to create')
  .option('--add', 'Add AI Project Starter scaffolding to existing project')
  .option('--verbose', 'Show detailed logs')
  .option('--skip-symlink', 'Skip creating symlinks')
  .action(async (projectName, options) => {
    try {
      if (options.verbose) {
        process.env.VERBOSE = 'true';
      }

      if (options.add) {
        // Add to existing project mode
        const spinner = ora('Adding AI Project Starter scaffolding to existing project').start();
        await addToProject(options);
        spinner.succeed('AI Project Starter scaffolding added successfully!');
        
        console.log(chalk.cyan('\n✨ Installation complete!'));
        console.log(chalk.cyan('📖 Next steps:'));
        console.log(chalk.cyan('  1. Set up symlinks (automatically created for you)'));
        console.log(chalk.cyan('  2. Use AI prompts to populate rules.yaml (see README.md)'));
        console.log(chalk.cyan('  3. Use AI prompts to initialize your memory bank files (see README.md)'));
      } else if (projectName) {
        // Create new directory with scaffolding
        const spinner = ora(`Creating scaffolding in new directory: ${projectName}`).start();
        await createProject(projectName, options);
        spinner.succeed(`Directory ${projectName} created successfully with AI Project Starter scaffolding!`);
        
        console.log(chalk.cyan('\n✨ Installation complete!'));
        console.log(chalk.cyan('📖 Next steps:'));
        console.log(chalk.cyan('  1. Set up symlinks (automatically created for you)'));
        console.log(chalk.cyan('  2. Use AI prompts to populate rules.yaml (see README.md)'));
        console.log(chalk.cyan('  3. Use AI prompts to initialize your memory bank files (see README.md)'));
      } else {
        // Interactive mode with prompts
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'projectName',
            message: 'Name of directory to create (leave empty to add to current directory):',
            validate: (_input) => true
          }
        ]);
        
        if (answers.projectName) {
          // Create new directory with scaffolding
          const spinner = ora(`Creating scaffolding in new directory: ${answers.projectName}`).start();
          await createProject(answers.projectName, options);
          spinner.succeed(`Directory ${answers.projectName} created successfully with AI Project Starter scaffolding!`);
          
          console.log(chalk.cyan('\n✨ Installation complete!'));
          console.log(chalk.cyan('📖 Next steps:'));
          console.log(chalk.cyan('  1. Set up symlinks (automatically created for you)'));
          console.log(chalk.cyan('  2. Use AI prompts to populate rules.yaml (see README.md)'));
          console.log(chalk.cyan('  3. Use AI prompts to initialize your memory bank files (see README.md)'));
        } else {
          // Add to current directory
          const spinner = ora('Adding AI Project Starter scaffolding to current directory').start();
          await addToProject(options);
          spinner.succeed('AI Project Starter scaffolding added successfully!');
          
          console.log(chalk.cyan('\n✨ Installation complete!'));
          console.log(chalk.cyan('📖 Next steps:'));
          console.log(chalk.cyan('  1. Set up symlinks (automatically created for you)'));
          console.log(chalk.cyan('  2. Use AI prompts to populate rules.yaml (see README.md)'));
          console.log(chalk.cyan('  3. Use AI prompts to initialize your memory bank files (see README.md)'));
        }
      }
    } catch (error) {
      if (ora.isSpinning) {
        ora().fail(error.message);
      } else {
        console.error(chalk.red(`Error: ${error.message}`));
      }
      
      if (process.env.VERBOSE) {
        console.error(error);
      }
      
      process.exit(1);
    }
  });

program.parse(process.argv);
