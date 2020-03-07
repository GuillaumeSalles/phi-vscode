(function () {
    const vscode = acquireVsCodeApi();

    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    document.body.append(cursor);

    class Stroke {
        constructor(/** @type {Array<[number, number]> | undefined} */ points) {
            /** @type {Array<[number, number]>} */
            this.points = points || [];
        }

        /**
         * @param {number} x 
         * @param {number} y 
         */
        add(x, y) {
            this.points.push([x, y])
        }
    }

    class Model {
        constructor() {
            /** @type {Array<Stroke>} */
            this.strokes = [];

            /** @type {Stroke | undefined} */
            this.currentStroke = undefined;

            /** @type {Array<() => void>} */
            this.listeners = [];
        }

        listen(/** @type {() => void} */ listener) {
            this.listeners.push(listener);
        }

        begin() {
            this.currentStroke = new Stroke();
            this.strokes.push(this.currentStroke);
        }

        end() {
            const previous = this.currentStroke;
            this.currentStroke = undefined;
            this.listeners.forEach(x => x());
            return previous;
        }

        /**
         * @param {number} x 
         * @param {number} y 
         */
        add(x, y) {
            if (!this.currentStroke) {
                return;
            }
            this.currentStroke.add(x, y)
        }

        setStrokes( /** @type {Array<Stroke>} */ newStrokes) {
            this.strokes = newStrokes;
            this.listeners.forEach(x => x());
        }
    }

    class View {
        constructor(
        /** @type {HTMLElement} */ parent,
        /** @type {Model} */ model,
        ) {
            this.ready = false;

            this.wrapper = document.createElement('div');
            this.wrapper.className = 'image-wrapper';
            this.wrapper.style.position = 'relative';
            parent.append(this.wrapper);

            this.initialCanvas = document.createElement('canvas');
            this.initialCanvas.className = 'initial-canvas';
            this.initialCtx = this.initialCanvas.getContext('2d');
            this.wrapper.append(this.initialCanvas);

            this.drawingCanvas = document.createElement('canvas');
            this.drawingCanvas.className = 'drawing-canvas';
            this.drawingCanvas.style.position = 'absolute';
            this.drawingCanvas.style.top = '0';
            this.drawingCanvas.style.left = '0';
            this.drawingCtx = this.drawingCanvas.getContext('2d');
            this.wrapper.append(this.drawingCanvas);

            let isDrawing = false

            document.body.addEventListener('mousedown', () => {
                if (!this.ready) {
                    return;
                }

                model.begin();
                isDrawing = true;
                document.body.classList.add('drawing');
                this.drawingCtx.beginPath();
            });

            document.body.addEventListener('mouseup', async () => {
                if (!isDrawing || !this.ready) {
                    return;
                }

                isDrawing = false;
                document.body.classList.remove('drawing');
                this.drawingCtx.closePath();

                const stroke = model.end();

                const data = await this.getData();
                vscode.postMessage({ type: 'stroke', value: { points: stroke.points, data } });
            });

            document.body.addEventListener('mousemove', e => {
                if (!isDrawing || !this.ready) {
                    return;
                }

                const rect = this.wrapper.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.drawingCtx.lineTo(x, y);
                this.drawingCtx.stroke();
                model.add(x, y);

                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            });

            model.listen(() => {
                this.redraw(model);
            });
        }

        redraw(model) {
            this.drawingCtx.clearRect(0, 0, this.drawingCanvas.width, this.drawingCanvas.height);
            for (const stroke of model.strokes) {
                this.drawingCtx.beginPath();
                for (const [x, y] of stroke.points) {
                    this.drawingCtx.lineTo(x, y);
                }
                this.drawingCtx.stroke();
                this.drawingCtx.closePath();
            }
        }

        async drawBackgroundImage(/** @type {string} */ uri) {
            const img = document.createElement('img');
            img.crossOrigin = 'anonymous';
            img.src = uri;
            await new Promise(resolve => img.onload = resolve);
            this.initialCanvas.width = this.drawingCanvas.width = img.naturalWidth;
            this.initialCanvas.height = this.drawingCanvas.height = img.naturalHeight;
            this.initialCtx.drawImage(img, 0, 0);
            this.ready = true;
        }

        /** @return {Promise<Uint8Array>} */
        async getData() {
            const outCanvas = document.createElement('canvas');
            outCanvas.width = this.drawingCanvas.width;
            outCanvas.height = this.drawingCanvas.height;

            const outCtx = outCanvas.getContext('2d');
            outCtx.drawImage(this.initialCanvas, 0, 0);
            outCtx.drawImage(this.drawingCanvas, 0, 0);

            const blob = await new Promise(resolve => {
                outCanvas.toBlob(resolve, 'image/jpeg')
            });

            return new Uint8Array(await blob.arrayBuffer());
        }
    }

    const model = new Model();
    model.listen(() => {
        updateState({ strokes: model.strokes.map(x => x.points) });
    });

    const view = new View(document.body, model);
    window.addEventListener('message', e => {
        switch (e.data.type) {
            case 'init':
                init(e.data.value);
                break;

            case 'setValue':
                model.setStrokes(e.data.value.map(x => new Stroke(x)))
                break;
        }
    });

    const state = vscode.getState();
    if (state) {
        model.setStrokes((state.strokes || []).map(x => new Stroke(x)));
        init(state.uri);
    }

    async function init(uri) {
        updateState({ uri });
        await view.drawBackgroundImage(uri);
        view.redraw(model);
    }

    function updateState(newState) {
        const s = vscode.getState();
        vscode.setState({ ...s, ...newState });
    }
}());