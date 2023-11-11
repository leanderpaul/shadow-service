# shadow-service

Library containing code for all shadow microservices

## Installation

```bash
$ npm install
```

## Test

The command below will run end to end testing on the nestjs application.

```bash
# e2e testing
$ npm test
```

## Utility scripts

```bash
# code linting
$ bun run lint

# lint code and fix
$ bun run lint:fix
```

# Commit Messages

The commit message should follow the following syntax

    type(scope?): subject

The possible values for type are:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies (example scopes: nest, npm)
- **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, Github, Jenkins)
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

**Add an exclamation mark `!` before the semicolon, if it is a breaking change (example: `feat!: breaking change`)**

scope: What is the scope of this change (e.g. component or file name)

subject: Write a short, imperative tense description of the change

Both the scope and subject should be in lowercase.
