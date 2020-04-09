import * as vscode from "vscode";
import { PhiTextEditorProvider } from "./phiTextEditor";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(new PhiTextEditorProvider(context).register());
}

// this method is called when your extension is deactivated
export function deactivate() {}
