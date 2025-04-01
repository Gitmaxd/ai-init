# AI Init

[![npm version](https://img.shields.io/npm/v/ai-init.svg)](https://www.npmjs.com/package/ai-init)
[![License](https://img.shields.io/npm/l/ai-init.svg)](https://github.com/Gitmaxd/ai-init/blob/main/LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/Gitmaxd/ai-init)](https://github.com/Gitmaxd/ai-init)
[![Version 1.6.4](https://img.shields.io/badge/version-1.6.4-blue)](https://www.npmjs.com/package/ai-init)

A **zero-dependency** lightweight scaffolding tool for adding AI-assisted development structure to Next.js projects (Python support coming soon).

## 🤔 What is AI Init?

AI Init helps you quickly set up the foundation for AI-assisted development by creating a standardized structure of files and directories. This structure helps AI tools like GitHub Copilot, Cursor, and WindSurf better understand your project context and maintain knowledge across sessions.

Designed specifically for Next.js projects (with Python support in development), AI Init creates the necessary directory structure and files that enable AI assistants to better understand and help with your development.

## 💭 Why I Created AI Init

As a developer working primarily with Next.js and Python, I found myself spending too much valuable time on repetitive scaffolding tasks when using AI-powered IDEs like Cursor, Windsurf, and Cline. Each new project required the same manual setup to properly direct the AI and help it understand my codebase.

I created AI Init because I believe our time is better spent solving real problems, not configuring environments. The tool allows you to immediately take advantage of AI using standardized rules and persistent memories across sessions, without wasting hours on setup and troubleshooting.

What makes AI Init special is its unopinionated approach. Since I regularly use all three major AI-powered IDEs and recognize that each has its place in a developer's toolbox, I designed this template to work seamlessly with any of them.

By using the `--add` flag, you can quickly outfit existing projects with AI-friendly structure, or create new directories that follow current best practices. My roadmap includes extending this to other platforms, with Python support currently in development.

I sincerely believe this tool will help others, and I'm sharing it because I believe a rising tide floats all boats. Let's all spend less time configuring and more time building amazing things.

## 🔄 How It Works

AI Init is a one-time scaffolding tool - it sets up the structure and gets out of your way. There's no ongoing dependency or library to maintain. The created files provide context to AI assistants, helping them:

- Understand your project's goals and requirements
- Follow your coding standards and patterns
- Maintain knowledge between sessions
- Make better suggestions based on your project context

## 🌟 Features

- **Zero Dependencies**: Built with native Node.js modules only
- **Standardized Project Rules**: Define coding standards and best practices in a structured format
- **AI Memory Bank**: Persistent knowledge storage for AI assistants across sessions
- **Architecture Decision Records**: Track and document important technical decisions
- **Automated Scaffolding**: One-command setup of the required project structure
- **Lightweight**: No dependencies added to your project, just structure

## 🚀 Installation & Usage

### NPX Installation (Recommended)

The easiest way to use AI Init is with npx, which comes with npm 5.2+ and higher:

```bash
# Create a new directory with AI scaffolding
npx ai-init my-directory

# Add scaffolding to an existing project (run in the project directory)
npx ai-init --add
```

### Global Installation

If you prefer, you can install AI Init globally:

```bash
# Install globally
npm install -g ai-init

# Then use without npx
ai-init my-directory
```

### Package Version

The current version is **1.6.4**. You can specify a version with npx if needed:

```bash
npx ai-init@1.6.4 my-directory
```

### Command Options

```bash
npx ai-init [directory-name] [options]
```

Options:
- `--add` - Add scaffolding to existing project
- `--verbose` - Show detailed logs
- `--skip-symlink` - Skip creating symlinks
- `--help` or `-h` - Show help message
- `--version` or `-v` - Show version number

### Interactive Mode

Run without arguments for interactive prompts:

```bash
npx ai-init
```

## 📁 Project Structure

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
├── .clinerules               # Symlink to rules.yaml for command-line tools
└── rules.yaml                # Main configuration file
```

## 🏁 Getting Started After Installation

After installing AI Init, you'll need to set up your project's rules and memory bank using AI prompts.

### 🔗 Step 1: Verify Symlinks

AI Init automatically creates symlinks from `rules.yaml` to `.windsurfrules`, `.cursorrules`, and `.clinerules` in your project root. These ensure that AI assistants and command-line tools can detect and apply your project rules.

### 🔄 Step 2: Populate the Rules File

Use your AI assistant to intelligently populate the placeholders in `rules.yaml` with this prompt:

```markdown
## Prompt: Analyze and Populate `@rules.yaml`

### Objective

Deeply analyze the `@rules.yaml` file to understand its **intent and purpose** within the context of the project.

### Your Role

You are tasked with the following responsibilities:

1. **Analyze the Project Structure**  
   - Review the project's directory and codebase in detail.
   - Identify core features, modules, and functionalities.
   - Infer the application's primary purpose and architectural qualities.

2. **Interpret and Populate `@rules.yaml`**  
   - Understand the placeholders and schema definitions in the `@rules.yaml` file.
   - Replace all placeholder content with accurate, context-specific information derived from the codebase.
   - Maintain the structure and syntax of the YAML file.

### Output Requirements

- Use **clear, concise, and informative** language.
- Think in terms of **dense technical documentation**: descriptive but not overly verbose.
- Ensure every populated section in the `@rules.yaml` reflects the **real capabilities and structure** of the application.
- When uncertain, make educated inferences based on patterns in the codebase—but flag assumptions as such.
```

### 📝 Step 3: Initialize Memory Bank Files

After setting up the rules.yaml file, populate your memory bank files with this prompt:

```markdown
## Prompt: Initialize Memory Bank Files

### Objective

Create a comprehensive knowledge foundation across the memory bank files to enable effective AI assistance for this project.

### Your Role

You are tasked with analyzing the project and populating the memory bank files:

1. **Analyze Project Structure and Purpose**
   - Review the project's codebase, structure, and documentation
   - Identify core technologies, architecture, and patterns
   - Determine project goals and target audience
   - Map out feature areas and development priorities

2. **Populate Each Memory Bank File**
   - **projectbrief.md**: Summarize purpose, goals, audience, stakeholders, and success criteria
   - **techContext.md**: Document technology stack, architecture, APIs, and environment setup
   - **systemPatterns.md**: Identify coding patterns, naming conventions, and architectural approaches
   - **activeContext.md**: Outline current development status, active features, and immediate challenges
   - **progress.md**: Record completed features, milestones, and upcoming development phases

### Content Guidelines

- Be specific and factual based on actual project code and structure
- Organize information with clear headings and concise bulleted lists
- Include code examples where relevant (especially in systemPatterns.md)
- Cross-reference related information between memory files
- Flag content as "Initial assessment based on codebase" where appropriate
- Prioritize information that would be most valuable for ongoing development

### Expected Format

For each file, use markdown with consistent structure:
- Clear main heading matching the file purpose
- Logical subheadings for different categories of information
- Bulleted lists for related items
- Code blocks for examples and patterns
- Brief, information-dense paragraphs
```

### 🎉 Step 4: Start Using with Your AI Assistant

Once your rules and memory bank are populated:

1. Open your project in an AI-enabled IDE (WindSurf, Cursor, etc.)
2. The AI assistant will automatically use your rules and memory bank files
3. Enjoy enhanced AI assistance tailored to your project's specific context and standards

## 📚 Memory Bank System

The memory bank is a structured knowledge base for AI assistants with five key files:

### 1. `projectbrief.md`

Contains high-level project information:
- Project purpose and goals
- Target audience/users
- Key stakeholders
- Success criteria

### 2. `techContext.md`

Details the technical foundation:
- Technology stack
- Architecture overview
- External APIs and services
- Development environment setup

### 3. `systemPatterns.md`

Documents recurring patterns:
- Design patterns used
- Coding conventions
- Common problem-solving approaches
- Architectural principles

### 4. `activeContext.md`

Tracks current development focus:
- Active feature development
- Current sprint objectives
- Recent changes and contributions
- Immediate roadblocks or challenges

### 5. `progress.md`

Records project milestones:
- Completed features
- Version release history
- Known issues
- Upcoming milestones

## 📏 Rule System

The rule system enforces project standards through both structural rules and automated checks.

### Rule Files

Rules are stored as Markdown files with YAML front matter (.mdc) in the `.cursor/rules/` directory:

1. **`naming_conventions.mdc`**: Standardizes naming across the project
   - File naming rules
   - Function/variable naming patterns
   - Component naming guidelines

2. **`ui_component_patterns.mdc`**: Defines UI development standards
   - Component structure
   - State management approaches
   - Styling conventions

3. **`memory_bank_enforcement.mdc`**: Validates memory bank structure
   - Ensures required files exist
   - Enforces correct file naming
   - Provides guidance for missing files

## 📚 Architecture Decision Records (ADRs)

ADRs document important architectural decisions in a structured format:

- **Title**: Clear indication of the decision
- **Status**: Proposed, accepted, rejected, deprecated, superseded
- **Context**: Background and situation leading to the decision
- **Decision**: The architectural choice made
- **Consequences**: Resulting outcomes, both positive and negative

A template is provided in `doc-files/adr/template.md`.

## 🔄 Git Workflow

The project enforces a standardized commit message format:

```
<type>[scope]: <description>

[body]

[footer]
```

### Types
`feat` (feature), `fix` (bugfix), `docs` (documentation), `style` (formatting), `refactor`, `perf` (performance), `test`, `build`, `ci`, `chore` (maintenance), `revert`

### Guidelines
- Description: imperative, lowercase, no period, ≤50 chars
- Body: explain WHY, not HOW, wrap at 72 chars
- Footer: reference issues (`Fixes #123`), breaking changes (`BREAKING CHANGE: description`)

## 🛠️ Compatible AI Tools

For the best experience, use with:

- [WindSurf](https://windsurf.sail.dev) - The world's first agentic IDE
- [Cursor](https://cursor.sh) - AI-native code editor
- [Cline](https://cline.dev) - AI-powered command-line interface
- GitHub Copilot compatible editors (VS Code, JetBrains IDEs)

## 🔍 Troubleshooting

If you encounter issues during installation or setup:

1. **Symlink Creation**: Some environments may require administrative privileges to create symlinks. Try running with elevated permissions if symlinks aren't created.

2. **Missing Files**: Use the `--verbose` flag to see detailed logs for debugging file copying issues.

3. **Windows Users**: On Windows, symlinks will be replaced with file copies due to permission restrictions.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>
    <a href="https://github.com/Gitmaxd/ai-init">
      <img src="https://github.com/simple-icons/simple-icons/raw/develop/icons/github.svg" width="30" alt="GitHub"/>
    </a>
    &nbsp;&nbsp;
    <a href="https://x.com/GitMaxd">
      <img src="https://github.com/simple-icons/simple-icons/raw/develop/icons/x.svg" width="30" alt="X (Twitter)"/>
    </a>
  </p>
  <p>
    <b>Created by <a href="https://github.com/Gitmaxd">GitMaxd</a></b>
  </p>
  <p>
    <small>&copy; {{ site.time | date: '%Y' }} GitMaxd. Open Source (Free like beer) and Experimental (not medicinal).</small>
  </p>
</div>
