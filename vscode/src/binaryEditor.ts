import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as util from "util";
import { Disposable } from "./dispose";

const readdir = util.promisify(fs.readdir);

interface Edit {
  readonly action: any;
}

export class PaletteEditorProvider implements vscode.CustomEditorProvider {
  public static readonly viewType = "testWebviewEditor.catDraw";

  private readonly editors = new Map<string, Set<PaletteEditor>>();

  public constructor(private readonly extensionPath: string) {}

  public register(): vscode.Disposable {
    return vscode.window.registerCustomEditorProvider(
      PaletteEditorProvider.viewType,
      this
    );
  }

  async resolveCustomDocument(
    document: vscode.CustomDocument
  ): Promise<vscode.CustomEditorCapabilities> {
    const model = await CatDrawModel.create(document.uri);
    document.userData = model;
    document.onDidDispose(() => {
      console.log("Dispose document");
      model.dispose();
    });
    model.onDidChange(() => {
      this.update(document.uri);
    });
    model.onUndo(() => {
      this.undo(document.uri)
    })
    model.onApplyEdits((edits) => {
      this.applyEdits(document.uri, edits);
    });
    return model;
  }

  public async resolveCustomEditor(
    document: DocumentType,
    panel: vscode.WebviewPanel
  ) {
    const editor = new PaletteEditor(this.extensionPath, document, panel);

    let editorSet = this.editors.get(document.uri.toString());
    if (!editorSet) {
      editorSet = new Set();
      this.editors.set(document.uri.toString(), editorSet);
    }
    editorSet.add(editor);
    editor.onDispose(() => editorSet?.delete(editor));
  }

  private update(resource: vscode.Uri, trigger?: PaletteEditor) {
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

  private undo(resource: vscode.Uri, trigger?: PaletteEditor) {
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

  private applyEdits(resource: vscode.Uri, edits: readonly Edit[], trigger?: PaletteEditor) {
    const editors = this.editors.get(resource.toString());
    if (!editors) {
      throw new Error(`No editors found for ${resource.toString()}`);
    }
    for (const editor of editors) {
      if (editor !== trigger) {
        editor.applyEdits(edits);
      }
    }
  }
}

class CatDrawModel extends Disposable
  implements
    vscode.CustomEditorCapabilities,
    vscode.CustomEditorEditingCapability<Edit> {
  private readonly _edits: Edit[] = [];

  public static async create(resource: vscode.Uri): Promise<CatDrawModel> {
    const buffer = await vscode.workspace.fs.readFile(resource);
    return new CatDrawModel(resource, buffer);
  }

  public readonly editing = this;

  private constructor(
    private readonly resource: vscode.Uri,
    private readonly initialValue: Uint8Array
  ) {
    super();
  }

  private readonly _onDidChange = this._register(
    new vscode.EventEmitter<void>()
  );

  private readonly _onUndo = this._register(
    new vscode.EventEmitter<void>()
  );

  private readonly _onApplyEdits = this._register(
    new vscode.EventEmitter<readonly Edit[]>()
  );

  public readonly onDidChange = this._onDidChange.event;

  private readonly _onDidEdit = this._register(new vscode.EventEmitter<Edit>());
  public readonly onDidEdit = this._onDidEdit.event;
  public readonly onUndo = this._onUndo.event;
  public readonly onApplyEdits = this._onApplyEdits.event;

  public getContent() {
    // TODO
    return "";
    // return this._edits.length
    //   ? this._edits[this._edits.length - 1].data
    //   : this.initialValue;
  }

  public onEdit(edit: Edit) {
    this._edits.push(edit);
    this._onDidEdit.fire(edit);
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

  async applyEdits(edits: readonly Edit[]): Promise<void> {
    this._edits.push(...edits);
    this._onApplyEdits.fire(edits);
  }

  async undoEdits(edits: readonly Edit[]): Promise<void> {
    for (let i = 0; i < edits.length; ++i) {
      this._edits.pop();
    }
    this._onUndo.fire();
  }

  private update() {
    this._onDidChange.fire();
  }

  async backup() {
    // TODO
    return true;
  }
}

type DocumentType = vscode.CustomDocument<CatDrawModel>;

export class PaletteEditor extends Disposable {
  public static readonly viewType = "testWebviewEditor.catDraw";

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
            action: message.action,
          };
          this.document.userData?.onEdit(edit);
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
      window.__MODE__ = "VSCODE";
      window.__vscode__ = acquireVsCodeApi();

      !(function(e) {
        function t(t) {
          for (
            var n, i, l = t[0], f = t[1], a = t[2], c = 0, s = [];
            c < l.length;
            c++
          )
            (i = l[c]),
              Object.prototype.hasOwnProperty.call(o, i) &&
                o[i] &&
                s.push(o[i][0]),
              (o[i] = 0);
          for (n in f)
            Object.prototype.hasOwnProperty.call(f, n) && (e[n] = f[n]);
          for (p && p(t); s.length; ) s.shift()();
          return u.push.apply(u, a || []), r();
        }
        function r() {
          for (var e, t = 0; t < u.length; t++) {
            for (var r = u[t], n = !0, l = 1; l < r.length; l++) {
              var f = r[l];
              0 !== o[f] && (n = !1);
            }
            n && (u.splice(t--, 1), (e = i((i.s = r[0]))));
          }
          return e;
        }
        var n = {},
          o = { 1: 0 },
          u = [];
        function i(t) {
          if (n[t]) return n[t].exports;
          var r = (n[t] = { i: t, l: !1, exports: {} });
          return e[t].call(r.exports, r, r.exports, i), (r.l = !0), r.exports;
        }
        (i.m = e),
          (i.c = n),
          (i.d = function(e, t, r) {
            i.o(e, t) ||
              Object.defineProperty(e, t, { enumerable: !0, get: r });
          }),
          (i.r = function(e) {
            "undefined" != typeof Symbol &&
              Symbol.toStringTag &&
              Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
              Object.defineProperty(e, "__esModule", { value: !0 });
          }),
          (i.t = function(e, t) {
            if ((1 & t && (e = i(e)), 8 & t)) return e;
            if (4 & t && "object" == typeof e && e && e.__esModule) return e;
            var r = Object.create(null);
            if (
              (i.r(r),
              Object.defineProperty(r, "default", { enumerable: !0, value: e }),
              2 & t && "string" != typeof e)
            )
              for (var n in e)
                i.d(
                  r,
                  n,
                  function(t) {
                    return e[t];
                  }.bind(null, n)
                );
            return r;
          }),
          (i.n = function(e) {
            var t =
              e && e.__esModule
                ? function() {
                    return e.default;
                  }
                : function() {
                    return e;
                  };
            return i.d(t, "a", t), t;
          }),
          (i.o = function(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t);
          }),
          (i.p = "./");
        var l = (this.webpackJsonpstudio = this.webpackJsonpstudio || []),
          f = l.push.bind(l);
        (l.push = t), (l = l.slice());
        for (var a = 0; a < l.length; a++) t(l[a]);
        var p = f;
        r();
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
    })
  }

  public async applyEdits(edits: readonly Edit[]) {
    if (this.isDisposed) {
      return;
    }

    this.panel.webview.postMessage({
      type: "applyActions",
      actions: edits.map(edit => edit.action)
    })
  }

  public async update() {
    if (this.isDisposed) {
      return;
    }

    // TODO;
    // this.panel.webview.postMessage({
    //   type: "setValue",
    //   value: this.document.userData!.getStrokes()
    // });
  }
}
