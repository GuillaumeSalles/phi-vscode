import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as util from 'util';
import { Disposable } from "./dispose";


const readdir = util.promisify(fs.readdir);

interface Edit {
  readonly points: [number, number][];
  readonly data: Uint8Array;
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
  public readonly onDidChange = this._onDidChange.event;

  private readonly _onDidEdit = this._register(new vscode.EventEmitter<Edit>());
  public readonly onDidEdit = this._onDidEdit.event;

  public getContent() {
    return this._edits.length
      ? this._edits[this._edits.length - 1].data
      : this.initialValue;
  }

  public onEdit(edit: Edit) {
    this._edits.push(edit);
    this._onDidEdit.fire(edit);
  }

  public getStrokes() {
    return this._edits.map(x => x.points);
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
    this.update();
  }

  async undoEdits(edits: readonly Edit[]): Promise<void> {
    for (let i = 0; i < edits.length; ++i) {
      this._edits.pop();
    }
    this.update();
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
        case "stroke":
          const edit: Edit = {
            points: message.value.points,
            data: new Uint8Array(message.value.data.data)
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
      .filter(parseResult => parseResult.ext === '.js' && !parseResult.base.includes("runtime"))
      .map(parseResult => {
        const uri = this.panel.webview.asWebviewUri(vscode.Uri.file(path.join(jsFolder, parseResult.base)));
        return `<script src="${uri}"></script>`
      })
      .join("");


    const cssFiles = await readdir(cssFolder)
    const cssTags = cssFiles
      .map(file => path.parse(file))
      .filter(parseResult => parseResult.ext === '.css')
      .map(parseResult => {
        const uri = this.panel.webview.asWebviewUri(vscode.Uri.file(path.join(cssFolder, parseResult.base)));
        return `<link href="${uri}" rel="stylesheet" />`
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

      !(function(l) {
        function e(e) {
          for (
            var r, t, n = e[0], o = e[1], u = e[2], f = 0, i = [];
            f < n.length;
            f++
          )
            (t = n[f]), p[t] && i.push(p[t][0]), (p[t] = 0);
          for (r in o)
            Object.prototype.hasOwnProperty.call(o, r) && (l[r] = o[r]);
          for (s && s(e); i.length; ) i.shift()();
          return c.push.apply(c, u || []), a();
        }
        function a() {
          for (var e, r = 0; r < c.length; r++) {
            for (var t = c[r], n = !0, o = 1; o < t.length; o++) {
              var u = t[o];
              0 !== p[u] && (n = !1);
            }
            n && (c.splice(r--, 1), (e = f((f.s = t[0]))));
          }
          return e;
        }
        var t = {},
          p = { 1: 0 },
          c = [];
        function f(e) {
          if (t[e]) return t[e].exports;
          var r = (t[e] = { i: e, l: !1, exports: {} });
          return l[e].call(r.exports, r, r.exports, f), (r.l = !0), r.exports;
        }
        (f.m = l),
          (f.c = t),
          (f.d = function(e, r, t) {
            f.o(e, r) ||
              Object.defineProperty(e, r, { enumerable: !0, get: t });
          }),
          (f.r = function(e) {
            "undefined" != typeof Symbol &&
              Symbol.toStringTag &&
              Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
              Object.defineProperty(e, "__esModule", { value: !0 });
          }),
          (f.t = function(r, e) {
            if ((1 & e && (r = f(r)), 8 & e)) return r;
            if (4 & e && "object" == typeof r && r && r.__esModule) return r;
            var t = Object.create(null);
            if (
              (f.r(t),
              Object.defineProperty(t, "default", { enumerable: !0, value: r }),
              2 & e && "string" != typeof r)
            )
              for (var n in r)
                f.d(
                  t,
                  n,
                  function(e) {
                    return r[e];
                  }.bind(null, n)
                );
            return t;
          }),
          (f.n = function(e) {
            var r =
              e && e.__esModule
                ? function() {
                    return e.default;
                  }
                : function() {
                    return e;
                  };
            return f.d(r, "a", r), r;
          }),
          (f.o = function(e, r) {
            return Object.prototype.hasOwnProperty.call(e, r);
          }),
          (f.p = "./");
        var r = (window.webpackJsonp = window.webpackJsonp || []),
          n = r.push.bind(r);
        (r.push = e), (r = r.slice());
        for (var o = 0; o < r.length; o++) e(r[o]);
        var s = n;
        a();
      })([]);
    </script>
    ${jsTags}
    <script>
      const vscode = acquireVsCodeApi();
      console.log(vscode.getState());
    </script>
  </body>
</html>
`;
  }

  public async update() {
    if (this.isDisposed) {
      return;
    }

    this.panel.webview.postMessage({
      type: "setValue",
      value: this.document.userData!.getStrokes()
    });
  }
}
