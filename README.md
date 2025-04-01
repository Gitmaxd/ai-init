# AI Init

[![npm version](https://img.shields.io/npm/v/ai-init.svg)](https://www.npmjs.com/package/ai-init)
[![License](https://img.shields.io/npm/l/ai-init.svg)](https://github.com/Gitmaxd/ai-init/blob/main/LICENSE)

A lightweight, one-time scaffolding tool for bootstrapping AI-assisted development projects with structured rules and memory management.

## What is AI Init?

AI Init helps you quickly set up the foundation for AI-assisted development by creating a standardized structure of files and directories. This structure helps AI tools like GitHub Copilot, Cursor, and WindSurf better understand your project context and maintain knowledge across sessions.

## Features

- **Standardized Project Rules**: Define coding standards and best practices in a structured format
- **AI Memory Bank**: Persistent knowledge storage for AI assistants across sessions
- **Architecture Decision Records**: Track and document important technical decisions
- **Automated Scaffolding**: One-command setup of the required project structure
- **Git-Friendly**: Includes standard gitignore and supports conventional commit formats

## Installation & Usage

### Creating a New Project

```bash
npx ai-init my-project
```

### Adding to an Existing Project

```bash
cd existing-project
npx ai-init --add
```

### Command Options

```bash
npx ai-init my-project [options]
```

Options:
- `--type <type>` - Project type (next, react, node, default)
- `--skip-git` - Skip git initialization
- `--skip-install` - Skip dependency installation
- `--verbose` - Show detailed logs
- `--add` - Add scaffolding to an existing project

### Interactive Mode

Run without arguments for interactive prompts:

```bash
npx ai-init
```

## Project Structure

After initialization, your project will have the following structure:

```
project-root/
├── .cursor/                  # Cursor-specific configurations
│   └── rules/                # Individual rule files
├── doc-files/                # Project documentation
│   └── adr/                  # Architecture Decision Records
├── memory-bank/              # AI assistant persistent memory
│   ├── projectbrief.md       # High-level project goals
│   ├── techContext.md        # Technical stack information
│   ├── systemPatterns.md     # Common patterns and conventions
│   ├── activeContext.md      # Current work in progress
│   ├── progress.md           # Project status tracking
│   └── roadmap.md            # Future development plans
├── mem-scripts/              # Helper scripts
├── .windsurfrules            # Symlink to rules.yaml for WindSurf IDE
├── .cursorrules              # Symlink to rules.yaml for Cursor IDE
└── rules.yaml                # Main configuration file
```

## Getting Started After Installation

1. **Update the rules.yaml file**:
   - Customize project name, type, and goals
   - Define your technology stack
   - Set project-specific conventions

2. **Initialize memory bank files**:
   - Add project requirements to `projectbrief.md`
   - Document your tech stack in `techContext.md`
   - Define coding patterns in `systemPatterns.md`

3. **Start using with your AI assistant**:
   - The symlinks `.windsurfrules` and `.cursorrules` are automatically created
   - AI assistants will use these files to understand your project context

## Compatible AI Tools

For the best experience, use with:

- [WindSurf](https://windsurf.sail.dev) - The world's first agentic IDE
- [Cursor](https://cursor.sh) - AI-native code editor
- GitHub Copilot compatible editors (VS Code, JetBrains IDEs)

## How It Works

AI Init is a one-time scaffolding tool - it sets up the structure and then gets out of your way. There's no ongoing dependency or library to maintain. The created files provide context to AI assistants, helping them:

- Understand your project's goals and requirements
- Follow your coding standards and patterns
- Maintain knowledge between sessions
- Make better suggestions based on your project context

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
