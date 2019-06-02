# Urim
ToDo list tool with Urgency-Importance feature.

## For Developers
### Setup Development Environment
1. Install Git.

1. Install [nvm-windows](https://github.com/coreybutler/nvm-windows).

1. Install Node.js v11.14.0.
Please launch Git Bash.

    ```
    $ nvm install 11.14.0
    $ nvm use 11.14.0
    $ node -v   # v11.14.0 
    ```

1. Update npm.

    ```
    $ npm -v
    $ npm update -g npm 
    ```

    However, you may get error.
    Therefore, your npm version has not been updated.
    Please try below commands.

    ```
    $ cd "$PROGRAMFILES"/nodejs
    $ rm npm npx npm.cmd npx.cmd
    $ mv node_modules/npm node_modules/npm2
    $ node node_modules/npm2/bin/npm-cli.js i -g npm@latest
    $ rm -rf node_modules/npm2/
    $ npm -v # v6.9.0
    ```

### Development Procedure
1. Watch your error log when you save your editing code.

    ```
    $ npm run watch
    ```
    
1. Edit your code.

1. Debug.
    
    ```
    $ npm run start
    ```
    
### Branch Rule
- `master`

    In this branch, all commits are guaranteed to execute.
- `develop`

    To synchronize some feature branches.
- `feature/xxx/userName`

    `xxx`: feature name wrote in camelCase
    
    `userName`: TauXdev, GadPulse, asaiasa, or narugit
    
    To synchronize some user's branches to complete xxx feature.
    You can create any branches under `feature/xxx/userName`. 
    It's OK if you push the branches under `feature/xxx/userName` or not.
    
### Commit Message Rule
Follow [this guide](https://qiita.com/itosho/items/9565c6ad2ffc24c09364).

### Pull Request Rule
You can pull reqest and merge in any branch by yourself.

### Documentation generator
Use [TypeStrong/typedoc](https://github.com/TypeStrong/typedoc). 
Here is [the guidline](https://typedoc.org/guides/doccomments/).

### Style Guide
Use [TypeScript Deep Dive](https://basarat.gitbooks.io/typescript/content/docs/styleguide/styleguide.html).

### UI Component (Will Do)
Use [Material Design Lite](https://getmdl.io/index.html).
