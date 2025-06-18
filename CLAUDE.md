# Claude.md - Project Documentation

## Git Sync Configuration

### Repository Information
- **Repository Name**: donation-transparency-static
- **GitHub URL**: https://github.com/TTiagha/donation-transparency-static
- **Personal Access Token**: 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
- **Repository URL with Token**: https://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@github.com/TTiagha/donation-transparency-static.git

### Git Sync Process

#### Initial Setup (if repository not initialized)
```bash
git init
git config user.email "admin@donationtransparency.com"
git config user.name "Donation Transparency"
git remote add origin https://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@github.com/TTiagha/donation-transparency-static.git
```

#### Standard Sync Workflow
```bash
# Check status
git status

# Add changes
git add .

# Commit with descriptive message
git commit -m "Your commit message here

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to GitHub
git push origin master:main
```

#### Handling Merge Conflicts
```bash
# If conflicts occur during pull
git config pull.rebase false  # Use merge strategy
git pull origin main --allow-unrelated-histories
git add .  # Accept all changes
git commit -m "Merge with existing repository"
git push origin master:main
```

### Notes
- Always use the repository URL with embedded token for authentication
- The local branch is `master` but pushes to `main` on GitHub
- Include the Claude Code signature in commit messages
- Use descriptive commit messages that explain the "why" not just the "what"