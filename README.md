# Contributing to SplunkKafkaConnectUi

## Overview

The project contains a variety of packages that are published and versioned collectively. Each package lives in its own directory in the `/packages` directory. Each package is self contained, and defines its dependencies in a package.json file.

We use [Lerna](https://github.com/lerna/lerna) for managing multiple packages in the same repository.


## Getting Started

1. Clone the repo.
2. Install yarn if you haven't already: `npm install --global yarn`.
3. Install dependencies: `yarn install`.

After this step, the following tasks will be available:

* `bootstrap` – Install dependencies for each project and establish links between them
* `start` – Run the `start` task for each project
* `build` – Create a production bundle for all projects
* `test` – Run unit tests for each project
* `lint` – Run JS and CSS linters for each project
* `format` – Run prettier to auto-format `*.js` and `*.jsx` files. This command will overwrite files without asking, `format:verify` won't.

Running `yarn run bootstrap` once is required to enable all other tasks (except `format` and `format:verify`).
The command might take a few minutes to finish, especially the first time it is run.


## Developer Scripts

Commands run from the root directory will be applied to all packages. This is handy when working on multiple packages simultaneously. Commands can also be run from individual packages. This may be better for performance and reporting when only working on a single package. All of the packages have similar developer scripts, but not all scripts are implemented for every package. See the `package.json` of the package in question to see which scripts are available there.

For more granular control of development scripts, consider installing and using [Lerna](https://github.com/lerna/lerna) directly.


## Code Formatting

SplunkKafkaConnectUi uses [prettier](https://github.com/prettier/prettier) to ensure consistent code formatting. It is recommended to [add a prettier plugin to your editor/ide](https://github.com/prettier/prettier#editor-integration).
