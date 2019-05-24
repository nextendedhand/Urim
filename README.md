# Urim
ToDo list tool with Urgency-Importance feature.

## For Developers
### Setup development Environment
1. Install Git.

1. Install [nvm-windows](https://github.com/coreybutler/nvm-windows).

1. Install Node.js v11.14.0.
Please launch Git Bash.

        $ nvm install 11.14.0
        $ nvm use 11.14.0
        $ node -v   # v11.14.0 

1. Update npm.

    ```
    $ npm -v
    $ npm update -g npm 
    ```

    However, you may get error.
    Therefore, your npm version has not been updated.
    Please try below process.

        ```
        $ cd "$PROGRAMFILES"/nodejs
        $ rm npm npx npm.cmd npx.cmd
        $ mv node_modules/npm node_modules/npm2
        $ node node_modules/npm2/bin/npm-cli.js i -g npm@latest
        $ rm -rf node_modules/npm2/
        $ npm -v # v6.9.0
        ```
