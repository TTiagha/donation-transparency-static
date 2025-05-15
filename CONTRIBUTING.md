# Contributing to Donation Transparency Plugins

Thank you for your interest in contributing to the Donation Transparency platform plugins! This document provides guidelines and workflow information for contributing to this project.

## Repository Structure

This repository follows a monorepo approach for the four core plugins:

1. **base_system** - Foundation layer with user management and common utilities
2. **financial_connections** - Integration layer for Stripe and Plaid connections
3. **transactions_donations** - Functional layer for transaction display and donation processing
4. **discovery** - Presentation layer for public-facing search and display

## Development Workflow

### Local Development Setup

1. Clone this repository into your WordPress plugins directory:

```bash
cd /path/to/wordpress/wp-content/plugins
git clone git@github.com:TTiagha/donation-transparency-plugins.git .
```

2. Install dependencies for each plugin (if applicable):

```bash
cd base_system && composer install
cd ../financial_connections && composer install
cd ../transactions_donations && composer install
cd ../discovery && composer install
```

### Branching Strategy

- `main` branch should always be stable and production-ready
- Create feature branches from `main` using the format: `feature/plugin-name-feature-description`
- Create bugfix branches using the format: `bugfix/plugin-name-issue-description`

Example:
```bash
git checkout -b feature/financial-connections-plaid-security-upgrade
```

### Commit Messages

Commit messages should be clear and descriptive, following this format:

```
[plugin-name] Short summary of changes (max 50 chars)

More detailed explanatory text, if necessary. Wrap it to about 72
characters. The blank line separating the summary from the body is
critical.
```

Examples:
- `[base_system] Fix user role capability issue for receivers`
- `[financial_connections] Add Stripe Connect webhook handling`

### Pull Request Process

1. Ensure your code follows WordPress coding standards
2. Update documentation in the plugin's `memory-bank` directory if applicable
3. Run tests if available
4. Submit a pull request to `main` with a clear description of the changes

## Documentation

All significant code, particularly for bug fixes or new features, should be documented in the appropriate plugin's `memory-bank` directory. 

Documentation should follow this format:

1. Overview of the feature or bug fix
2. Technical details of implementation
3. Integration points with other plugins
4. Any important considerations for future maintenance

## Testing

Before submitting a pull request, ensure you've tested your changes locally:

1. Test functionality directly related to your changes
2. Test integration points with other plugins
3. Run any automated tests if available

## Questions

If you have questions about contributing, please reach out to the project maintainers.
