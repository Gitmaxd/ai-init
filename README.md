# AI Init

[![npm version](https://img.shields.io/npm/v/ai-init.svg)](https://www.npmjs.com/package/ai-init)
[![License](https://img.shields.io/npm/l/ai-init.svg)](https://github.com/yourusername/ai-init/blob/main/LICENSE)

A command-line tool for bootstrapping AI-assisted development projects with structured rules and memory scaffolding.

## Features

- **Standardized Project Rules**: Define and enforce coding standards and best practices
- **AI Memory Bank**: Structured knowledge persistence for AI assistants across sessions
- **Architecture Decision Records**: Track and document important technical decisions
- **Automated Scaffolding**: Quick setup of required project structure
- **Consistent Git Workflow**: Standardized commit message format and branch management

## Installation

```bash
# Create a new project
npx ai-init my-project

# Add to an existing project
cd existing-project
npx ai-init --add
```

## Usage

### Creating a New Project

```bash
npx ai-init my-project [options]
```

Options:
- `--type <type>` - Project type (next, react, node, etc.)
- `--skip-git` - Skip git initialization
- `--skip-install` - Skip dependency installation
- `--template <template>` - Use specific template variant
- `--verbose` - Show detailed logs

### Adding to an Existing Project

```bash
cd existing-project
npx ai-init --add [options]
```

Options:
- `--verbose` - Show detailed logs

### Interactive Mode

If you run `npx ai-init` without a project name, it will start in interactive mode with prompts:

```bash
npx ai-init
```

## Project Structure

After initialization, your project will have the following structure:

```
project-root/
├── .cursor/                  # Cursor-specific configurations
│   └── rules/                # Individual rule files
│       ├── naming_conventions.mdc
│       ├── ui_component_patterns.mdc
│       └── ...
├── doc-files/                # Project documentation
│   └── adr/                  # Architecture Decision Records
│       ├── 001-initial-framework.md
│       └── template.md
├── memory-bank/              # AI assistant persistent memory
│   ├── projectbrief.md       # High-level project goals
│   ├── techContext.md        # Technical stack information
│   ├── systemPatterns.md     # Common patterns and conventions
│   ├── activeContext.md      # Current work in progress
│   ├── progress.md           # Project status tracking
│   └── roadmap.md            # Future development plans
├── mem-scripts/              # Installation and validation scripts
│   └── validate.sh           # Structure and rule validation
└── rules.yaml                # Main configuration file
```

## Getting Started After Installation

1. Update placeholder values in `rules.yaml`:
   - Project name, type, goal
   - Technology stack
   - Project features
   - Testing, security, and architecture settings

2. Initialize memory bank files with project-specific content:
   - Update `projectbrief.md` with project goals and requirements
   - Add your technology stack to `techContext.md`
   - Document project patterns in `systemPatterns.md`
   - Start tracking progress in `activeContext.md` and `progress.md`

3. Set up symlinks for optimal AI assistant functionality:

```bash
# For WindSurf IDE
ln -s rules.yaml .windsurfrules

# For Cursor IDE
ln -s rules.yaml .cursorrules
```

## IDE Integration

For the best experience, use an IDE with AI assistant capabilities:

- [Cursor](https://cursor.sh) - AI-native code editor
- [WindSurf](https://windsurf.sail.dev) - AI-powered IDE
- GitHub Copilot compatible editors (VS Code, JetBrains IDEs)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgments

- [Gitmaxd/rules-memory-scaffolding](https://github.com/Gitmaxd/rules-memory-scaffolding) - Original project that inspired this npm package
