const fs = require('fs-extra');
const path = require('path');

/**
 * Creates a symlink between two files
 * @param {string} source - Source file path
 * @param {string} target - Target file path
 */
async function createSymlink(source, target) {
  try {
    await fs.ensureSymlink(source, target);
    return true;
  } catch (error) {
    console.warn(`Failed to create symlink from ${source} to ${target}: ${error.message}`);
    return false;
  }
}

/**
 * Creates standard memory bank files with placeholder content
 * @param {string} directoryPath - Path to the memory-bank directory
 */
async function createMemoryBankFiles(directoryPath) {
  const memoryFiles = [
    { name: 'projectbrief.md', title: 'Project Brief', content: 'Add your project goals and requirements here.' },
    { name: 'techContext.md', title: 'Technical Context', content: 'Document your technology stack and architecture decisions here.' },
    { name: 'systemPatterns.md', title: 'System Patterns', content: 'Document coding patterns, conventions, and architectural approaches.' },
    { name: 'activeContext.md', title: 'Active Context', content: 'Track current development state and active features.' },
    { name: 'progress.md', title: 'Progress Tracking', content: 'Record completed features and milestones.' },
    { name: 'roadmap.md', title: 'Development Roadmap', content: 'Plan future development phases and features.' }
  ];
  
  await fs.ensureDir(directoryPath);
  
  for (const file of memoryFiles) {
    const filePath = path.join(directoryPath, file.name);
    if (!await fs.pathExists(filePath)) {
      const content = `# ${file.title}\n\n${file.content}\n`;
      await fs.writeFile(filePath, content);
    }
  }
}

/**
 * Creates an ADR directory with template file
 * @param {string} directoryPath - Path to the ADR directory
 */
async function createAdrFiles(directoryPath) {
  await fs.ensureDir(directoryPath);
  
  const templatePath = path.join(directoryPath, 'template.md');
  if (!await fs.pathExists(templatePath)) {
    const content = `# Architecture Decision Record: [Title]

## Status
[Proposed, Accepted, Deprecated, Superseded]

## Context
[Describe the problem or background that led to this decision]

## Decision
[Describe the decision that was made]

## Consequences
[Describe the effects of this decision, both positive and negative]

## Alternatives Considered
[Describe other options that were considered and why they were rejected]

## References
[Add any relevant links or references]
`;
    await fs.writeFile(templatePath, content);
  }
  
  const examplePath = path.join(directoryPath, '001-initial-framework.md');
  if (!await fs.pathExists(examplePath)) {
    const content = `# Architecture Decision Record: Initial Framework Setup

## Status
Accepted

## Context
Setting up a new project requires consistent standards and structure for AI-assisted development.

## Decision
Implement the AI Project Starter framework with rules and memory bank structure.

## Consequences
- Improved AI guidance and consistency
- Standardized development practices
- Structured documentation

## Alternatives Considered
- Manual documentation approach
- Various other scaffolding tools

## References
- https://github.com/Gitmaxd/rules-memory-scaffolding
`;
    await fs.writeFile(examplePath, content);
  }
}

module.exports = {
  createSymlink,
  createMemoryBankFiles,
  createAdrFiles
};
