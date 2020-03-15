# Phi for Visual Studio Code

Design components in Visual Studio Code, generate code you can trust.

## What is Phi for VS Code?

Phi is a VS Code extension that lets you define the specs of your components and then generate code you can use in your web apps. By limiting the scope to the web platform, Phi can leverage powerful CSS features like media queries and pseudo classes to generate a good part of your design system.

Phi is still in alpha so you will encounters some bugs.

## Code generation

### Gatsby

Install `gatsby-plugin-phi` in your gatsby app

```shell
npm install --save-dev gatsby-plugin-phi
```

Add `gatsby-plugin-phi` in your `gatsby-config.js` file

```javascript
module.exports = {
  //...
  plugins: [
    //...
    `gatsby-plugin-phi`
  ]
};
```

Import your component directly from your react code.

```javascript
import { Hello } from "./YourPhiFile.phi";

const IndexPage = () => <Hello name="world" />;
```

#### Conventions

Components are defined in `kebab-case` in Phi but are imported in `PascalCase`.
Example `hello-world` becomes `HelloWorld`.

Properties are defined in `kebab-case` in Phi but are imported in `camelCase`.
Example `my-prop` become `myProp`;

### Next.js _Coming soon_
