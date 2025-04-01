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
  .description('Initialize AI Project Starter framework')
  .version('1.0.0');

program
  .argument('[project-name]', 'Name of the project to create')
  .option('--add', 'Add AI Project Starter to existing project')
  .option('--type <type>', 'Project type (next, react, node, etc.)')
  .option('--skip-git', 'Skip git initialization')
  .option('--skip-install', 'Skip dependency installation')
  .option('--template <template>', 'Use specific template variant')
  .option('--verbose', 'Show detailed logs')
  .action(async (projectName, options) => {
    try {
      if (options.add) {
        // Add to existing project mode
        const spinner = ora('Adding AI Project Starter to existing project').start();
        await addToProject(options);
        spinner.succeed('AI Project Starter added successfully!');
      } else if (projectName) {
        // Create new project mode
        const spinner = ora(`Creating new project: ${projectName}`).start();
        await createProject(projectName, options);
        spinner.succeed(`Project ${projectName} created successfully!`);
      } else {
        // Interactive mode with prompts
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'projectName',
            message: 'What is the name of your project?',
            validate: (input) => input ? true : 'Project name is required'
          },
          {
            type: 'list',
            name: 'projectType',
            message: 'What type of project are you creating?',
            choices: ['next', 'react', 'node', 'other']
          },
          {
            type: 'confirm',
            name: 'initGit',
            message: 'Initialize git repository?',
            default: true
          },
          {
            type: 'confirm',
            name: 'installDeps',
            message: 'Install dependencies?',
            default: true
          }
        ]);
        
        const spinner = ora(`Creating new project: ${answers.projectName}`).start();
        await createProject(answers.projectName, { 
          type: answers.projectType, 
          skipGit: !answers.initGit, 
          skipInstall: !answers.installDeps,
          ...options 
        });
        spinner.succeed(`Project ${answers.projectName} created successfully!`);
      }
      
      console.log(chalk.green('\n✨ Installation complete!'));
      console.log('📖 Next steps:');
      console.log('  1. Set up symlinks (automatically created for you)');
      console.log('  2. Use AI prompts to populate rules.yaml (see README.md)');
      console.log('  3. Use AI prompts to initialize your memory bank files (see README.md)');
      
    } catch (error) {
      console.error(chalk.red('Error during installation:'), error.message);
      if (options.verbose) {
        console.error(error);
      }
      process.exit(1);
    }
  });

program.parse();
