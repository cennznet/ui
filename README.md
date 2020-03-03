# CENNZnet ui

[Get started to run cennznet-ui in your local](cennznet/README.md)
[Developement: How to publish cennznet-ui docker image](cennznet/docs/PUBLISH.md)

## cennznet-ui dependencies

`cennznet/ui:latest` docker image contains latest changes in `cennznet/apps develop branch`, which depends on:

- @cennznet/types: 1.0.0-beta.1
- @cennznet/cennznet: 1.0.0-rc2
- @polkadot/apps: 0.40.0-beta.45
- @polkadot/api.js: ^1.1.1
- @polkadot/types: ^1.1.1

---

[![polkadotjs](https://img.shields.io/badge/polkadot-js-orange?style=flat-square)](https://polkadot.js.org)
![license](https://img.shields.io/badge/License-Apache%202.0-blue?logo=apache&style=flat-square)
[![npm](https://img.shields.io/npm/v/@polkadot/apps?logo=npm&style=flat-square)](https://www.npmjs.com/package/@polkadot/apps)
[![beta](https://img.shields.io/npm/v/@polkadot/apps/beta?label=beta&logo=npm&style=flat-square)](https://www.npmjs.com/package/@polkadot/apps)
[![maintainability](https://img.shields.io/codeclimate/maintainability-percentage/polkadot-js/apps?logo=code-climate&style=flat-square)](https://codeclimate.com/github/polkadot-js/apps)

# @polkadot/apps

A Portal into the Polkadot and Substrate networks. Provides a view and interaction layer from a browser.

This can be accessed as a hosted application via [https://polkadot.js.org/apps/](https://polkadot.js.org/apps/) to explorer any of the supported Polkadot and Substrate chains

## overview

The repo is split into a number of packages, each representing an application. These are -

- [apps](packages/apps/) This is the main entry point. It handles the selection sidebar and routing to the specific application being displayed.
- [app-accounts](packages/app-accounts/) A basic account management app.
- [app-address-book](packages/app-address-book/) A basic address management app.
- [app-democracy](packages/app-democracy/) A basic voting app, allowing votes on activate proposals and referenda.
- [app-explorer](packages/app-explorer/) A simple block explorer. It only shows the most recent blocks, updating as they become available.
- [app-extrinsics](packages/app-extrinsics/) Submission of extrinsics to a node.
- [app-js](packages/app-js/) An online code editor with [@polkadot-js/api](https://github.com/polkadot-js/api/tree/master/packages/api) access to the currently connected node.
- [app-settings](packages/app-settings/) A basic settings management app, allowing choice of language, node to connect to, and theme
- [app-staking](packages/app-staking/) A basic staking management app, allowing staking and nominations.
- [app-storage](packages/app-storage/) A simple node storage query application. Multiple queries can be queued and updates as new values become available.
- [app-toolbox](packages/app-toolbox/) Submission of raw data to RPC endpoints and utility hashing functions.
- [app-transfer](packages/app-transfer/) A basic account management app, allowing transfer of Units/DOTs between accounts.

In addition the following libraries are also included in the repo. These are to be moved to the [@polkadot/ui](https://github.com/polkadot-js/ui/) repository once it reaches a base level of stability and usability. (At this point with the framework being tested on the apps above, it makes development easier having it close)

- [react-components](packages/react-components/) A reactive (using RxJS) application framework with a number of useful shared components.
- [react-signer](packages/react-signer/) Signer implementation for apps.
- [react-query](packages/react-query) Base components that use the RxJS Observable APIs

## development

Contributions are welcome!

To start off, this repo (along with others in the [@polkadot](https://github.com/polkadot-js/) family) uses yarn workspaces to organize the code. As such, after cloning dependencies _should_ be installed via `yarn`, not via npm, the latter will result in broken dependencies.

To get started -

1. Clone the repo locally, via `git clone https://github.com/polkadot-js/apps <optional local path>`
2. Ensure that you have a recent LTS version of Node.js, for development purposes [Node >=10.13.0](https://nodejs.org/en/) is recommended.
3. Ensure that you have a recent version of Yarn, for development purposes [Yarn >=1.10.1](https://yarnpkg.com/docs/install) is required.
4. Install the dependencies by running `yarn`
5. Ready! Now you can launch the UI (assuming you have a local Polkadot Node running), via `yarn run start`
6. Access the UI via [http://localhost:3000](http://localhost:3000)

## I want to code around

There is a base template available [app-123code](packages/app-123code/) that acts as a simple starting point for adding additional apps to the UI. Alternatively if you just want some place where you can write some code, it does the trick.

While it is hidden from the sidebar, it is accessible via [http://127.0.0.1:3000/#/123code](http://127.0.0.1:3000/#/123code)

Be sure to follow the [app-123code/README.md](packages/app-123code/README.md) instructions.

## Docker

You can run a docker container via -

docker run --rm -it --name polkadot-ui -p 80:80 chevdor/polkadot-ui:latest

To build a docker container containing local changes -

docker build -t chevdor/polkadot-ui:latest .

When using these Docker commands, you can access the UI via http://localhost:80 (or just http://localhost)
