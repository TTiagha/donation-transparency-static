## Project Overview

This repository contains the Gemini CLI, a command-line interface for interacting with Gemini. It is a Node.js application written in TypeScript.

The repository also contains a static website and a Next.js blog, which are related to the Donation Transparency platform.

## Building and Running

The Gemini CLI project uses npm for dependency management and scripting.

### Key Commands

*   **Installation:** `npm install`
*   **Build:** `npm run build`
*   **Run:** `npm run start`
*   **Test:** `npm run test`
*   **Lint:** `npm run lint`
*   **Preflight Check:** `npm run preflight` (runs all checks)

## Development Conventions

### Testing

*   **Framework:** Vitest
*   **File Location:** Test files (`*.test.ts`) are co-located with the source files they test.
*   **Mocking:** `vi.mock` is used for mocking modules.

### Code Style

*   **Language:** TypeScript
*   **Style:** The project prefers plain JavaScript objects over classes and uses ES module syntax for encapsulation.
*   **Formatting:** Prettier is used for code formatting.

### React

The project uses React for its CLI UI (with Ink). The following conventions are followed:

*   Functional components with Hooks are used.
*   State is managed immutably.
*   `useEffect` is used for synchronization with external state.

## Other Projects

### Static Pages

The `static-pages` directory contains a static website for the Donation Transparency platform. It is built with HTML, CSS, and JavaScript.

### Blog

The `blog-nextjs` directory contains a Next.js blog for the Donation Transparency platform.

## Git Workflow & Deployment

This project uses a specific Git workflow for committing and deploying changes to the live site via AWS Amplify.

### Standard Sync Workflow

1.  **Check Status:** Always begin by checking the status of the repository.
    ```bash
    git status
    ```
2.  **Stage Changes:** Add the specific files you have modified.
    ```bash
    git add <file1> <file2>
    ```
3.  **Commit Changes:** Commit the changes with a descriptive message and the required signature.
    ```bash
    git commit -m "type(scope): Your descriptive commit message

    - Optional bullet point for details.

    🤖 Generated with [Claude Code](https://claude.ai/code)

    Co-Authored-By: Claude <noreply@anthropic.com>"
    ```
4.  **Push to Deploy:** Push the local `master` branch to the remote `main` branch. This will trigger the AWS Amplify auto-deployment.
    ```bash
    git push origin master:main
    ```