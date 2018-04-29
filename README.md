<div align="center">
  <h1>babel-plugin-source</h1>
  Extract source code to strings at build-time
</div>

<hr />

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![version][version-badge]][package]
[![downloads][downloads-badge]][npm-stat]
[![MIT License][license-badge]][license]

[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs]
[![Donate][donate-badge]][donate]
[![Code of Conduct][coc-badge]][coc]
[![Examples][examples-badge]][examples]

[![Star on GitHub][github-star-badge]][github-star]
[![Watch on GitHub][github-watch-badge]][github-watch]
[![Tweet][twitter-badge]][twitter]

## The problem

You are writing code that needs to both function and be displayed as raw text. You shouldn't have to write and maintain the code snippet twice (once as real code, and again as a template string).

## This solution

`babel-plugin-source` allows you to extract arbitrary code blocks into string variables within the file they are located. This allows you to write the code once, then utilize it's raw text immediately in the same file. You can display it, log it, export it, etc.

**Before**:

```js
let MyCompSource;

// @source MyCompSource
const MyComp = () => <div>Hello there!</div>;
// @source MyCompSource
```

**After**:

```javascript
let MyCompSource = `const MyComp = () => <div>Hello there!</div>`;

const MyComp = () => <div>Hello there!</div>;
```

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

* [Installation](#installation)
* [Usage](#usage)
* [Configure with Babel](#configure-with-babel)
  * [Via `.babelrc` (Recommended)](#via-babelrc-recommended)
  * [Via CLI](#via-cli)
  * [Via Node API](#via-node-api)
* [Examples](#examples)
* [FAQ](#faq)
  * [How is this different from [webpack][webpack] [loaders][webpack-loaders]?](#how-is-this-different-from-webpackwebpack-loaderswebpack-loaders)
* [Other Solutions](#other-solutions)
* [Contributors](#contributors)
* [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```
npm install --save-dev babel-plugin-source
```

## Usage

**Before**:

```javascript
let MyCompSource;

// @source MyCompSource
const MyComp = () => <div>Hello there!</div>;
// @Source
```

**After**:

```javascript
let MyCompSource = `const MyComp = () => <div>Hello there!</div>`;

const MyComp = () => <div>Hello there!</div>;
```

## Configure with Babel

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["source"]
}
```

### Via CLI

```sh
babel --plugins source script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["source"]
});
```

## Examples

* [React-Charts.js.org](https:react-charts.js.org) - Source code examples

## FAQ

### How is this different from [webpack][webpack] [loaders][webpack-loaders]?

This plugin was inspired by webpack's [raw-loader][raw-loader]. The benefit of
using this over that loader (or any other loader) is that it allows more fine-grained
control over the extraction process and integrates tightlyo with
your existing babel pipeline. This is also extremely useful if
you aren't bundling your code with `webpack`, but still using
babel.

<!--
## Related Projects

* [`source.macro`][source.macro] - nicer integration with `babel-plugin-macros` -->

## Other Solutions

I'm not aware of any, so if you are, please [make a pull request][prs] and add it
here!

## Contributors

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

<!-- prettier-ignore -->
| [<img src="https://avatars0.githubusercontent.com/u/5580297?v=4" width="100px;"/><br /><sub><b>Tanner Linsley</b></sub>](http://Nozzle.io)<br />[💻](https://github.com/tannerlinsley/babel-plugin-sourcer/commits?author=tannerlinsley "Code") [🎨](#design-tannerlinsley "Design") [📖](https://github.com/tannerlinsley/babel-plugin-sourcer/commits?author=tannerlinsley "Documentation") [💡](#example-tannerlinsley "Examples") | [<img src="https://avatars0.githubusercontent.com/u/1500684?v=4" width="100px;"/><br /><sub><b>Kent C. Dodds</b></sub>](https://kentcdodds.com)<br />[💬](#question-kentcdodds "Answering Questions") [💻](https://github.com/tannerlinsley/babel-plugin-sourcer/commits?author=kentcdodds "Code") [🤔](#ideas-kentcdodds "Ideas, Planning, & Feedback") [🔌](#plugin-kentcdodds "Plugin/utility libraries") [📢](#talk-kentcdodds "Talks") [🔧](#tool-kentcdodds "Tools") |
| :---: | :---: |

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/tannerlinsley/babel-plugin-source.svg?style=flat-square
[build]: https://travis-ci.org/tannerlinsley/babel-plugin-source
[coverage-badge]: https://img.shields.io/codecov/c/github/tannerlinsley/babel-plugin-source.svg?style=flat-square
[coverage]: https://codecov.io/github/tannerlinsley/babel-plugin-source
[version-badge]: https://img.shields.io/npm/v/babel-plugin-source.svg?style=flat-square
[package]: https://www.npmjs.com/package/babel-plugin-source
[downloads-badge]: https://img.shields.io/npm/dm/babel-plugin-source.svg?style=flat-square
[npm-stat]: http://npm-stat.com/charts.html?package=babel-plugin-source&from=2016-04-01
[license-badge]: https://img.shields.io/npm/l/babel-plugin-source.svg?style=flat-square
[license]: https://github.com/tannerlinsley/babel-plugin-source/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[donate-badge]: https://img.shields.io/badge/$-support-green.svg?style=flat-square
[donate]: http://kcd.im/donate
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/tannerlinsley/babel-plugin-source/blob/master/other/CODE_OF_CONDUCT.md
[examples-badge]: https://img.shields.io/badge/%F0%9F%92%A1-examples-8C8E93.svg?style=flat-square
[examples]: https://github.com/tannerlinsley/babel-plugin-source/blob/master/other/EXAMPLES.md
[github-watch-badge]: https://img.shields.io/github/watchers/tannerlinsley/babel-plugin-source.svg?style=social
[github-watch]: https://github.com/tannerlinsley/babel-plugin-source/watchers
[github-star-badge]: https://img.shields.io/github/stars/tannerlinsley/babel-plugin-source.svg?style=social
[github-star]: https://github.com/tannerlinsley/babel-plugin-source/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20babel-plugin-source!%20https://github.com/tannerlinsley/babel-plugin-source%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/tannerlinsley/babel-plugin-source.svg?style=social
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
[prepack]: https://github.com/facebook/prepack

<!-- [source.macro]: https://github.com/kentcdodds/source.macro -->

[webpack]: https://webpack.js.org/
[webpack-loaders]: https://webpack.js.org/concepts/loaders/
[val-loader]: https://github.com/webpack-contrib/val-loader
