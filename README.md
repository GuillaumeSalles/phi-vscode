# Phi for Visual Studio Code

Design components in Visual Studio Code, generate code you can trust.

## What is Phi for VS Code?

Phi is a VS Code extension that lets you define the specs of your components and then generate code you can use in your web apps. By limiting the scope to the web platform, Phi can leverage powerful CSS features like media queries and pseudo classes to generate a good part of your design system.

Phi is still in alpha so you will encounters some bugs.

## Getting Started

Phi is using a VS Code the [Custom webview editor API](https://github.com/microsoft/vscode/issues/77131). It's only available in the insiders build so there is no way to download it from the VS Code extensions marketplace (yet).

### Install the Phi Extension

- Donwload [VS Code insiders](https://code.visualstudio.com/insiders/)
- Open VS Code insiders and Add `code-insiders` to PATH like [this]( https://github.com/Microsoft/vscode/issues/6627#issuecomment-267456703)
- Download the last release .vsix package of Phi [here](https://github.com/GuillaumeSalles/phi-vscode/releases/download/v0.1.0/phi-0.1.0.vsix) or in the [releases tab](https://github.com/GuillaumeSalles/phi-vscode/releases)
- Open your gatsby project on VS Code insiders with this command

```shell
code-insiders {path-to-your-gatsby-project} --enable-proposed-api GuillaumeSalles.phi
```

The `--enable-proposed-api` flag is to allow Phi to use the not yet release `Custom webview editor API`.

- Install the vsix previously downloaded via the Extensions tab.
  ![Install VSIX menu in vscode](/assets/InstallVSIX.png)

- Create a new a file with a `.phi` extension and save it.

- At this point, you should be able to see the Phi custom editor in your VS Code instance
  ![Phi Extension preview in vscode](/assets/HelloWorld.png)

- You are now ready to design your own components!

### Import component in your Gatsby project

- Install `gatsby-plugin-phi` in your gatsby app

```shell
npm install --save-dev gatsby-plugin-phi
```

- Add `gatsby-plugin-phi` in your `gatsby-config.js` file

```javascript
module.exports = {
  //...
  plugins: [
    //...
    `gatsby-plugin-phi`
  ]
};
```

- Import your component directly from your react code.

```javascript
import { HelloWorld } from "./path/to/file.phi";

const IndexPage = () => <HelloWorld name="world" />;
```

#### Conventions

Components names are defined in `kebab-case` in Phi but are imported in `PascalCase`.
Example `hello-world` becomes `HelloWorld`.

Properties are defined in `kebab-case` in Phi but are imported in `camelCase`.
Example `my-prop` become `myProp`;


### Import component in your Next.js project _Coming soon_
