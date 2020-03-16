import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as util from "util";
import { Disposable } from "./dispose";

const readdir = util.promisify(fs.readdir);

interface Edit {
  readonly action: any;
}

export class PhiEditorProvider
  implements
    vscode.CustomEditorProvider,
    vscode.CustomEditorEditingDelegate<Edit> {
  public static readonly viewType = "testWebviewEditor.phi";

  private readonly editors = new Map<string, Set<PhiEditor>>();

  public readonly editingDelegate = this;

  public constructor(private readonly extensionPath: string) {}

  public register(): vscode.Disposable {
    return vscode.window.registerCustomEditorProvider(
      PhiEditorProvider.viewType,
      this
    );
  }

  async resolveCustomDocument(document: vscode.CustomDocument): Promise<void> {
    const model = await PhiModel.create(document.uri);
    document.userData = model;
    document.onDidDispose(() => {
      console.log("Dispose document");
      model.dispose();
    });
    model.onDidEdit(edit => {
      this._onDidEdit.fire({ document, edit });
    });
    model.onDidChange(() => {
      this.update(document.uri);
    });
  }

  public async resolveCustomEditor(
    document: DocumentType,
    panel: vscode.WebviewPanel
  ) {
    const editor = new PhiEditor(this.extensionPath, document, panel);

    let editorSet = this.editors.get(document.uri.toString());
    if (!editorSet) {
      editorSet = new Set();
      this.editors.set(document.uri.toString(), editorSet);
    }
    editorSet.add(editor);
    editor.onDispose(() => editorSet?.delete(editor));
  }

  private update(resource: vscode.Uri, trigger?: PhiEditor) {
    const editors = this.editors.get(resource.toString());
    if (!editors) {
      throw new Error(`No editors found for ${resource.toString()}`);
    }
    for (const editor of editors) {
      if (editor !== trigger) {
        editor.update();
      }
    }
  }

  private undo(resource: vscode.Uri, trigger?: PhiEditor) {
    const editors = this.editors.get(resource.toString());
    if (!editors) {
      throw new Error(`No editors found for ${resource.toString()}`);
    }
    for (const editor of editors) {
      if (editor !== trigger) {
        editor.undo();
      }
    }
  }

  //#region CustomEditorDelegate

  async save(
    document: DocumentType,
    _cancellation: vscode.CancellationToken
  ): Promise<void> {
    return document.userData?.save();
  }

  async saveAs(
    document: DocumentType,
    targetResource: vscode.Uri
  ): Promise<void> {
    return document.userData?.saveAs(targetResource);
  }

  private readonly _onDidEdit = new vscode.EventEmitter<
    vscode.CustomDocumentEditEvent<Edit>
  >();
  public readonly onDidEdit = this._onDidEdit.event;

  async applyEdits(
    document: DocumentType,
    edits: readonly Edit[]
  ): Promise<void> {
    document.userData?.applyEdits(edits);
    const editors = this.editors.get(document.uri.toString());
    if (!editors) {
      throw new Error(`No editors found for ${document.uri.toString()}`);
    }
    for (const editor of editors) {
      editor.applyEdits(edits);
    }
  }

  async undoEdits(
    document: DocumentType,
    edits: readonly Edit[]
  ): Promise<void> {
    document.userData?.undoEdits(edits);
    this.undo(document.uri);
  }

  async revert(
    document: DocumentType,
    edits: vscode.CustomDocumentRevert
  ): Promise<void> {
    return document.userData?.revert(edits);
  }

  async backup(
    document: DocumentType,
    cancellation: vscode.CancellationToken
  ): Promise<void> {
    return document.userData?.backup();
  }

  //#endregion
}

class PhiModel extends Disposable {
  private _lastContent: any;
  private readonly _edits: Edit[] = [];

  public static async create(resource: vscode.Uri): Promise<PhiModel> {
    const buffer = await vscode.workspace.fs.readFile(resource);
    return new PhiModel(resource, buffer);
  }

  private constructor(
    private readonly resource: vscode.Uri,
    private readonly initialValue: Uint8Array
  ) {
    super();

    this._lastContent = initialValue.toString();
  }

  private readonly _onDidChange = this._register(
    new vscode.EventEmitter<void>()
  );

  private readonly _onApplyEdits = this._register(
    new vscode.EventEmitter<readonly Edit[]>()
  );

  public readonly onDidChange = this._onDidChange.event;

  private readonly _onDidEdit = this._register(new vscode.EventEmitter<Edit>());
  public readonly onDidEdit = this._onDidEdit.event;

  public getContent() {
    return this._lastContent;
  }

  public onEdit(edit: Edit) {
    this._edits.push(edit);
    this._onDidEdit.fire(edit);
  }

  public setLastContent(data: any) {
    this._lastContent = data;
  }

  public async save(): Promise<void> {
    await vscode.workspace.fs.writeFile(
      this.resource,
      Buffer.from(this.getContent())
    );
  }

  public async saveAs(targetResource: vscode.Uri): Promise<void> {
    await vscode.workspace.fs.writeFile(
      targetResource,
      Buffer.from(this.getContent())
    );
  }

  applyEdits(edits: readonly Edit[]) {
    this._edits.push(...edits);
  }

  async revert(revert: vscode.CustomDocumentRevert): Promise<void> {
    // TODO
  }

  undoEdits(edits: readonly Edit[]) {
    for (let i = 0; i < edits.length; ++i) {
      this._edits.pop();
    }
  }

  async backup() {
    // TODO
    return;
  }
}

type DocumentType = vscode.CustomDocument<PhiModel>;

export class PhiEditor extends Disposable {
  public static readonly viewType = "testWebviewEditor.phi";

  private readonly _onEdit = new vscode.EventEmitter<Edit>();
  public readonly onEdit = this._onEdit.event;

  public readonly _onDispose = this._register(new vscode.EventEmitter<void>());
  public readonly onDispose = this._onDispose.event;

  constructor(
    private readonly _extensionPath: string,
    private readonly document: DocumentType,
    private readonly panel: vscode.WebviewPanel
  ) {
    super();

    panel.webview.options = {
      enableScripts: true
    };

    this.setPanelHtml(panel);

    panel.webview.onDidReceiveMessage(message => {
      switch (message.type) {
        case "action":
          const edit: Edit = {
            action: message.action
          };
          this.document.userData?.onEdit(edit);
          this.document.userData?.setLastContent(message.data);
          break;
      }
    });
    this._register(
      panel.onDidDispose(() => {
        this.dispose();
      })
    );

    this.update();
  }

  public async setPanelHtml(panel: vscode.WebviewPanel) {
    panel.webview.html = await this.html(panel);
  }

  public dispose() {
    if (this.isDisposed) {
      return;
    }

    this._onDispose.fire();
    super.dispose();
  }

  async html(panel: vscode.WebviewPanel) {
    const contentRoot = path.join(this._extensionPath, "content");
    const jsFolder = path.join(contentRoot, "static", "js");
    const cssFolder = path.join(contentRoot, "static", "css");

    const jsFiles = await readdir(jsFolder);
    const jsTags = jsFiles
      .map(file => path.parse(file))
      .filter(
        parseResult =>
          parseResult.ext === ".js" && !parseResult.base.includes("runtime")
      )
      .map(parseResult => {
        const uri = this.panel.webview.asWebviewUri(
          vscode.Uri.file(path.join(jsFolder, parseResult.base))
        );
        return `<script src="${uri}"></script>`;
      })
      .join("");

    const cssFiles = await readdir(cssFolder);
    const cssTags = cssFiles
      .map(file => path.parse(file))
      .filter(parseResult => parseResult.ext === ".css")
      .map(parseResult => {
        const uri = this.panel.webview.asWebviewUri(
          vscode.Uri.file(path.join(cssFolder, parseResult.base))
        );
        return `<link href="${uri}" rel="stylesheet" />`;
      })
      .join("");

    const initialState = this.document.userData?.getContent() || "undefined";

    return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="shortcut icon" href="./favicon.ico" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <link rel="manifest" href="./manifest.json" />
    <title>React App</title>
    ${cssTags}
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <div id="modal-root"></div>
    <div
      id="popover-root"
      style="position:absolute;top:0;bottom:0;left:0;right:0;z-index:20;display:none"
    ></div>
    <script>
      window.__vscode__ = {
        api: acquireVsCodeApi(),
        initialState: ${initialState},
        fileDir: \`${path.parse(this.document.uri.toString()).dir}\`
      };

      !(function(e) {
        function r(r) {
          for (
            var n, l, i = r[0], p = r[1], f = r[2], c = 0, s = [];
            c < i.length;
            c++
          )
            (l = i[c]),
              Object.prototype.hasOwnProperty.call(o, l) &&
                o[l] &&
                s.push(o[l][0]),
              (o[l] = 0);
          for (n in p)
            Object.prototype.hasOwnProperty.call(p, n) && (e[n] = p[n]);
          for (a && a(r); s.length; ) s.shift()();
          return u.push.apply(u, f || []), t();
        }
        function t() {
          for (var e, r = 0; r < u.length; r++) {
            for (var t = u[r], n = !0, i = 1; i < t.length; i++) {
              var p = t[i];
              0 !== o[p] && (n = !1);
            }
            n && (u.splice(r--, 1), (e = l((l.s = t[0]))));
          }
          return e;
        }
        var n = {},
          o = { 1: 0 },
          u = [];
        function l(r) {
          if (n[r]) return n[r].exports;
          var t = (n[r] = { i: r, l: !1, exports: {} });
          return e[r].call(t.exports, t, t.exports, l), (t.l = !0), t.exports;
        }
        (l.m = e),
          (l.c = n),
          (l.d = function(e, r, t) {
            l.o(e, r) ||
              Object.defineProperty(e, r, { enumerable: !0, get: t });
          }),
          (l.r = function(e) {
            "undefined" != typeof Symbol &&
              Symbol.toStringTag &&
              Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
              Object.defineProperty(e, "__esModule", { value: !0 });
          }),
          (l.t = function(e, r) {
            if ((1 & r && (e = l(e)), 8 & r)) return e;
            if (4 & r && "object" == typeof e && e && e.__esModule) return e;
            var t = Object.create(null);
            if (
              (l.r(t),
              Object.defineProperty(t, "default", { enumerable: !0, value: e }),
              2 & r && "string" != typeof e)
            )
              for (var n in e)
                l.d(
                  t,
                  n,
                  function(r) {
                    return e[r];
                  }.bind(null, n)
                );
            return t;
          }),
          (l.n = function(e) {
            var r =
              e && e.__esModule
                ? function() {
                    return e.default;
                  }
                : function() {
                    return e;
                  };
            return l.d(r, "a", r), r;
          }),
          (l.o = function(e, r) {
            return Object.prototype.hasOwnProperty.call(e, r);
          }),
          (l.p = "./");
        var i = (this["webpackJsonpphi-electron"] =
            this["webpackJsonpphi-electron"] || []),
          p = i.push.bind(i);
        (i.push = r), (i = i.slice());
        for (var f = 0; f < i.length; f++) r(i[f]);
        var a = p;
        t();
      })([]);
    </script>
    ${jsTags}
  </body>
</html>
`;
  }

  public async undo() {
    if (this.isDisposed) {
      return;
    }

    this.panel.webview.postMessage({
      type: "undo"
    });
  }

  public async applyEdits(edits: readonly Edit[]) {
    if (this.isDisposed) {
      return;
    }

    this.panel.webview.postMessage({
      type: "applyActions",
      actions: edits.map(edit => edit.action)
    });
  }

  public async update() {
    if (this.isDisposed) {
      return;
    }
  }
}
