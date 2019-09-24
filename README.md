# Phi Studio

Design components for the web, generate code you can trust.

## What is Phi Studio?

Phi Studio lets you define the specs of your components and then generate code you can use in your web apps. By limiting the scope to the web platform, Phi Studio can leverage powerful CSS features like media queries and pseudo classes to generate a good part of your design system.

Phi Studio is not a creativity tool.

Phi is still at a really early stage so you will probably encounters some bugs.

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

Components are defined in `kebab-case` in Phi Studio but are imported in `PascalCase`.
Example `hello-world` becomes `HelloWorld`.

Properties are defined in `kebab-case` in Phi Studio but are imported in `camelCase`.
Example `my-prop` become `myProp`;

### Next.js _Coming soon_
