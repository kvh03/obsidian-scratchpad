# Contributing to Scratchpad

Thank you for your interest in contributing to Scratchpad! We welcome contributions of all forms, including bug fixes, feature requests, documentation updates, and UI/UX improvements.

To ensure a smooth and collaborative environment, please follow these guidelines.

---

## Getting Started

### Prerequisites
To work on this project, you need:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (installed automatically with Node.js)
- An installation of [Obsidian](https://obsidian.md/) for testing changes

### Local Development Setup

1. **Clone the repository:**
   Clone this repository directly into your Obsidian vault's plugin development folder (typically `.obsidian/plugins/`):
   ```bash
   cd /path/to/your/vault/.obsidian/plugins/
   git clone https://github.com/kvh03/obsidian-scratchpad.git scratchpad
   cd scratchpad
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development watch mode:**
   Run the development script to watch for changes. This will compile the TypeScript source files and rebuild `main.js` automatically whenever a file is modified:
   ```bash
   npm run dev
   ```

4. **Enable the plugin:**
   Open Obsidian, go to `Settings -> Community Plugins`, reload the list, and toggle on **Scratchpad**.

---

## Development Workflow

### Building for Production
Before submitting your changes, verify that the project compiles cleanly under production settings:
```bash
npm run build
```
This command runs the TypeScript compiler checking (`tsc`) and compiles the production-ready minimized bundle using `esbuild`.

### Code Style & Standards
We maintain strict quality and stylistic standards:
- **TypeScript:** Use strong types. Avoid the `any` keyword unless absolutely necessary.
- **Obsidian API Conventions:**
  - Prefer `activeDocument` over `document` to maintain compatibility with Obsidian popout windows.
  - Utilize helper utilities like `createEl()` and specialized parent methods (e.g., `this.contentEl.createDiv()`) rather than raw document object manipulation.
  - Properly handle floating promises in event handlers. Wrap asynchronous calls in event handlers using the `void` operator or handle rejection using `.then()` or `.catch()` (e.g. `void this.someAsyncCall()`).
- **Formatting:** Code formatting is managed via ESLint. Ensure your code passes linting checks before committing.

---

## Submitting Your Changes

### 1. Branch Naming Conventions
Create a descriptive branch for your changes:
- For features: `feat/your-feature-name`
- For bug fixes: `fix/your-bug-name`

### 2. Commit Guidelines
We appreciate descriptive and standard commit messages:
```text
feat: Add Copy to Scratchpad context menu option
fix: Resolve scrollbar overflow on small widths
```

### 3. Open a Pull Request
1. Push your branch to your fork.
2. Open a Pull Request against the `main` branch.
3. Provide a clear description of the problem you are solving, the approach you took, and any visual changes (screenshots or GIFs are highly appreciated for UI adjustments).

---

Thank you again for helping make Scratchpad better!
