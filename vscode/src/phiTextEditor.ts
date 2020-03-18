import pLimit from "p-limit";
import * as path from "path";
import * as vscode from "vscode";
import * as fs from "fs";
import * as util from "util";
import { Disposable } from "./dispose";

const readdir = util.promisify(fs.readdir);

export namespace Testing {
  export const abcEditorContentChangeCommand = "_abcEditor.contentChange";
  export const abcEditorTypeCommand = "_abcEditor.type";

  export interface CustomEditorContentChangeEvent {
    readonly content: string;
    readonly source: vscode.Uri;
  }
}

export class PhiTextEditorProvider implements vscode.CustomTextEditorProvider {
  public static readonly viewType = "testWebviewEditor.phi";

  private activeEditor?: PhiTextEditor;

  public constructor(private readonly context: vscode.ExtensionContext) {}

  public register(): vscode.Disposable {
    const provider = vscode.window.registerCustomEditorProvider(
      PhiTextEditorProvider.viewType,
      this,
      {
        enableFindWidget: true
      }
    );

    return vscode.Disposable.from(provider);
  }

  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    panel: vscode.WebviewPanel
  ) {
    const editor = new PhiTextEditor(
      document,
      this.context.extensionPath,
      panel
    );

    this.activeEditor = editor;

    panel.onDidChangeViewState(({ webviewPanel }) => {
      if (this.activeEditor === editor && !webviewPanel.active) {
        this.activeEditor = undefined;
      }
      if (webviewPanel.active) {
        this.activeEditor = editor;
      }
    });
  }
}

class PhiTextEditor extends Disposable {
  public readonly _onDispose = this._register(new vscode.EventEmitter<void>());
  public readonly onDispose = this._onDispose.event;

  private readonly limit = pLimit(1);
  private syncedVersion: number = -1;
  private currentWorkspaceEdit?: Thenable<void>;

  constructor(
    private readonly document: vscode.TextDocument,
    private readonly _extensionPath: string,
    private readonly panel: vscode.WebviewPanel
  ) {
    super();

    panel.webview.options = {
      enableScripts: true
    };

    this.setPanelHtml(panel);

    this._register(
      vscode.workspace.onDidChangeTextDocument(e => {
        if (e.document === this.document) {
          this.update();
        }
      })
    );

    this._register(
      panel.webview.onDidReceiveMessage(message => {
        switch (message.type) {
          case "edit":
            this.doEdit(message.value);
            break;

          case "didChangeContent":
            break;
        }
      })
    );

    this._register(
      panel.onDidDispose(() => {
        this.dispose();
      })
    );

    this.update();
  }

  private async setPanelHtml(panel: vscode.WebviewPanel) {
    panel.webview.html = await this.html();
  }

  private async doEdit(value: string) {
    const edit = new vscode.WorkspaceEdit();
    edit.replace(
      this.document.uri,
      this.document.validateRange(
        new vscode.Range(
          new vscode.Position(0, 0),
          new vscode.Position(999999, 999999)
        )
      ),
      value
    );
    this.limit(() => {
      this.currentWorkspaceEdit = vscode.workspace.applyEdit(edit).then(() => {
        this.syncedVersion = this.document.version;
        this.currentWorkspaceEdit = undefined;
      });
      return this.currentWorkspaceEdit;
    });
  }

  public dispose() {
    if (this.isDisposed) {
      return;
    }

    this._onDispose.fire();
    super.dispose();
  }

  async html() {
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

    const initialState = this.document.getText() || "undefined";

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

  public async update() {
    await this.currentWorkspaceEdit;

    if (this.isDisposed || this.syncedVersion >= this.document.version) {
      console.log("skip update");
      return;
    }

    this.panel.webview.postMessage({
      type: "setValue",
      value: this.document.getText()
    });
    this.syncedVersion = this.document.version;
  }
}
