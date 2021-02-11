// Creates an interface to access extra features from a graph (like play, stop, live, etc)
import LGraph from "./LGraph";
import LGraphCanvas from "./LGraphCanvas";

/**
 * @class Editor
 * @param containerId
 * @param options
 */
export default class Editor {
    constructor(containerId, options) {
        options = options || {};

        // fill container
        const html = "<div class='content'><div class='editor-area'><canvas class='graphcanvas' width='1000' height='500' tabindex=10></canvas></div></div>";

        const root = document.createElement("div");
        this.root = root;
        root.className = "litegraph litegraph-editor";
        root.innerHTML = html;

        this.content = root.querySelector(".content");
        this.footer = root.querySelector(".footer");

        const canvas = root.querySelector(".graphcanvas");

        // create graph
        const graph = (this.graph = new LGraph());
        const graphcanvas = (this.graphcanvas = new LGraphCanvas(canvas, graph));
        graphcanvas.background_image = "imgs/grid.png";
        graph.onAfterExecute = function () {
            graphcanvas.draw(true);
        };

        graphcanvas.onDropItem = this.onDropItem.bind(this);

        if (options.miniwindow) {
            this.addMiniWindow(300, 200);
        }

        // append to DOM
        const parent = document.getElementById(containerId);
        if (parent) {
            parent.appendChild(root);
        }

        graphcanvas.resize();
        // graphcanvas.draw(true,true);
    }

    onDropItem(e) {
        for (const file of e.dataTransfer.files) {
            const ext = LGraphCanvas.getFileExtension(file.name);
            const reader = new FileReader();
            if (ext === "json") {
                reader.onload = (event) => {
                    this.graph.configure(JSON.parse(event.target.result));
                };
                reader.readAsText(file);
            }
        }
    }

    addMiniWindow(w, h) {
        const miniwindow = document.createElement("div");
        miniwindow.className = "litegraph miniwindow";
        miniwindow.innerHTML = `<canvas class='graphcanvas' width='${
            w
        }' height='${
            h
        }' tabindex=10></canvas>`;
        const canvas = miniwindow.querySelector("canvas");
        const that = this;

        const graphcanvas = new LGraphCanvas(canvas, this.graph);
        graphcanvas.show_info = false;
        graphcanvas.background_image = "imgs/grid.png";
        graphcanvas.scale = 0.25;
        graphcanvas.allow_dragnodes = false;
        graphcanvas.allow_interaction = false;
        graphcanvas.render_shadows = false;
        graphcanvas.max_zoom = 0.25;
        this.miniwindow_graphcanvas = graphcanvas;
        graphcanvas.onClear = function () {
            graphcanvas.scale = 0.25;
            graphcanvas.allow_dragnodes = false;
            graphcanvas.allow_interaction = false;
        };
        graphcanvas.onRenderBackground = function (canvas, ctx) {
            ctx.strokeStyle = "#567";
            let tl = that.graphcanvas.convertOffsetToCanvas([0, 0]);
            let br = that.graphcanvas.convertOffsetToCanvas([
                that.graphcanvas.canvas.width,
                that.graphcanvas.canvas.height,
            ]);
            tl = this.convertCanvasToOffset(tl);
            br = this.convertCanvasToOffset(br);
            ctx.lineWidth = 1;
            ctx.strokeRect(
                Math.floor(tl[0]) + 0.5,
                Math.floor(tl[1]) + 0.5,
                Math.floor(br[0] - tl[0]),
                Math.floor(br[1] - tl[1]),
            );
        };

        miniwindow.style.position = "absolute";
        miniwindow.style.top = "4px";
        miniwindow.style.right = "4px";

        const close_button = document.createElement("div");
        close_button.className = "corner-button";
        close_button.innerHTML = "&#10060;";
        close_button.addEventListener("click", (e) => {
            graphcanvas.setGraph(null);
            miniwindow.remove();
        });
        miniwindow.appendChild(close_button);

        this.root.querySelector(".content").appendChild(miniwindow);
    }
}
