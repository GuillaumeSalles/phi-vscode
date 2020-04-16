# Phi for Visual Studio Code

Design components for the web in Visual Studio Code. Generate code you ~~can trust~~ (ok, maybe not yet).

## What is Phi for VS Code?

Phi is a Visual Studio Code extension that lets you define the specs of your components and then generate code you can use in your web apps (only [Gatsby](https://www.gatsbyjs.org/) and [Next.js](https://nextjs.org/) are supported right now). By limiting the scope to the web platform, Phi can leverage powerful CSS features like media queries and pseudo classes to generate a good part of your design system.

**Phi is still in alpha so you will encounters some bugs.**

## How it works

### Design your components in VS Code

![Phi Extension Demo](/assets/PhiEditor.png)

### Import component from .phi file

![Code example](/assets/CodeExample.png)

## Getting Started

### Install the Phi Extension

Download the VSCode extension https://marketplace.visualstudio.com/items?itemName=GuillaumeSalles.phi-vscode

Create a new a file with a `.phi` extension and save it.

At this point, you should be able to see the Phi Editor in VSCode
  ![Phi Extension preview in vscode](/assets/HelloWorld.png)

You are now ready to design your own components!

## Gatsby integration

Install `@phijs/gatsby-plugin-phi` in your Gatsby project

```shell
npm install --save-dev gatsby-plugin-phi
```

Add `@phijs/gatsby-plugin-phi` in your plugins list in your `gatsby-config.js`.

```javascript
module.exports = {
  plugins: [
    /* Other plugins */
    `@phijs/gatsby-plugin-phi`,
  ],
};
```

Import your component directly from your react code.

```jsx
import { HelloWorld } from "./path/to/file.phi";

const IndexPage = () => <HelloWorld />;
```

## Next.js integration

Install `@phijs/next-plugin` in your Next.js project

```shell
npm install --save-dev @phijs/next-plugin
```

Create a `next.config.js` at the root of your project

```javascript
const withPhi = require("@phijs/next-plugin")();
module.exports = withPhi();
```

Import your component directly from your react code.

```jsx
import { HelloWorld } from "./path/to/file.phi";

const IndexPage = () => <HelloWorld />;
```

## Conventions

Components names are defined as `kebab-case` in Phi but are imported as `PascalCase`.
Example `hello-world` becomes `HelloWorld`.

Properties are defined as `kebab-case` in Phi but are imported as `camelCase`.
Example `my-prop` become `myProp`;
