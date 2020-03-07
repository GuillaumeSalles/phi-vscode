import * as vscode from 'vscode';
import { PaletteEditorProvider } from './binaryEditor';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(new PaletteEditorProvider(context.extensionPath).register()); 
}

// this method is called when your extension is deactivated
export function deactivate() {}
