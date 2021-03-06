import DragAndScale from "./DragAndScale";
import { getFileExtension } from "./utils/file";
import ContextMenu from "./ContextMenu";
import { isValidConnection } from "./utils/function";
import LGraphNode from "./LGraphNode";
import {
    distance, isInsideRectangle, overlapBounding, clamp,
} from "./utils/math";
import LGraphGroup from "./LGraphGroup";
import * as registry from "./utils/registry";
import defaultConfig from "./utils/defaultConfig";
import getTime from "./utils/time";

const temp = new Float32Array(4);
const tempVC2 = new Float32Array(2);
const tempArea = new Float32Array(4);
const marginArea = new Float32Array(4);
const linkBounding = new Float32Array(4);
const tempA = new Float32Array(2);
const tempB = new Float32Array(2);

/**
 * This class is in charge of rendering one graph inside a canvas. And provides all the
 * interaction required. Valid callbacks are: onNodeSelected, onNodeDeselected,
 * onShowNodePanel, onNodeDblClicked
 * @class LGraphCanvas
 * @constructor
 * @param {HTMLCanvasElement} canvas the canvas where you want to render
 *  (it accepts a selector in string format or the canvas element itself)
 * @param {LGraph} graph [optional]
 * @param {Object} options [optional] { skip_rendering, autoresize }
 */
export default class LGraphCanvas {
    constructor(canvas, graph, options = {}) {
        // if(graph === undefined)
        // throw ("No graph assigned");
        this.background_image = LGraphCanvas.DEFAULT_BACKGROUND_IMAGE;

        if (canvas && canvas.constructor === String) {
            canvas = document.querySelector(canvas);
        }

        this.ds = new DragAndScale();
        this.zoom_modify_alpha = true; // otherwise it generates ugly patterns when scaling down
        // too much

        this.title_text_font = `${defaultConfig.NODE_TEXT_SIZE}px Arial`;
        this.inner_text_font = `normal ${defaultConfig.NODE_SUBTEXT_SIZE}px Arial`;
        this.node_title_color = defaultConfig.NODE_TITLE_COLOR;
        this.default_link_color = defaultConfig.LINK_COLOR;
        this.default_connection_color = {
            input_off: "#778",
            input_on: "#7F7",
            output_off: "#778",
            output_on: "#7F7",
        };

        this.highquality_render = true;
        this.use_gradients = false; // set to true to render titlebar with gradients
        this.editor_alpha = 1; // used for transition
        this.pause_rendering = false;
        this.clear_background = true;

        this.read_only = false; // if set to true users cannot modify the graph
        this.render_only_selected = true;
        this.live_mode = false;
        this.show_info = true;
        this.allow_dragcanvas = true;
        this.allow_dragnodes = true;
        this.allow_interaction = true; // allow to control widgets, buttons, collapse, etc
        this.allow_searchbox = true;
        this.allow_reconnect_links = false; // allows to change a connection with having to redo it
        // again

        this.drag_mode = false;
        this.dragging_rectangle = null;

        this.filter = null; // allows to filter to only accept some type of nodes in a graph

        this.set_canvas_dirty_on_mouse_event = true; // forces to redraw the canvas if the mouse
        // does anything
        this.always_render_background = false;
        this.render_shadows = true;
        this.render_canvas_border = true;
        this.render_connections_shadows = false; // too much cpu
        this.render_connections_border = true;
        this.render_curved_connections = false;
        this.render_connection_arrows = false;
        this.render_collapsed_slots = true;
        this.render_execution_order = false;
        this.render_title_colored = true;
        this.render_link_tooltip = true;

        this.links_render_mode = defaultConfig.SPLINE_LINK;

        this.mouse = [0, 0]; // mouse in canvas coordinates, where 0,0 is the top-left corner of
        // the blue rectangle
        this.graph_mouse = [0, 0]; // mouse in graph coordinates, where 0,0 is the top-left corner
        // of the blue rectangle
        this.canvas_mouse = this.graph_mouse; // LEGACY: REMOVE THIS, USE GRAPH_MOUSE INSTEAD

        // to personalize the search box
        this.onSearchBox = null;
        this.onSearchBoxSelection = null;

        // callbacks
        this.onMouse = null;
        this.onDrawBackground = null; // to render background objects (behind nodes and
        // connections) in the canvas affected by transform
        this.onDrawForeground = null; // to render foreground objects (above nodes and connections)
        // in the canvas affected by transform
        this.onDrawOverlay = null; // to render foreground objects not affected by transform (for
        // GUIs)
        this.onDrawLinkTooltip = null; // called when rendering a tooltip
        this.onNodeMoved = null; // called after moving a node
        this.onSelectionChange = null; // called if the selection changes
        this.onConnectingChange = null; // called before any link changes
        this.onBeforeChange = null; // called before modifying the graph
        this.onAfterChange = null; // called after modifying the graph

        this.connections_width = 3;
        this.round_radius = 8;

        this.current_node = null;
        this.node_widget = null; // used for widgets
        this.over_link_center = null;
        this.last_mouse_position = [0, 0];
        this.visible_area = this.ds.visible_area;
        this.visible_links = [];

        // link canvas and graph
        if (graph) {
            graph.attachCanvas(this);
        }

        this.setCanvas(canvas);
        this.clear();

        if (!options.skip_render) {
            this.startRendering();
        }

        this.autoresize = options.autoresize;
    }

    static DEFAULT_BACKGROUND_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQBJREFUeNrs1rEKwjAUhlETUkj3vP9rdmr1Ysammk2w5wdxuLgcMHyptfawuZX4pJSWZTnfnu/lnIe/jNNxHHGNn//HNbbv+4dr6V+11uF527arU7+u63qfa/bnmh8sWLBgwYJlqRf8MEptXPBXJXa37BSl3ixYsGDBMliwFLyCV/DeLIMFCxYsWLBMwSt4Be/NggXLYMGCBUvBK3iNruC9WbBgwYJlsGApeAWv4L1ZBgsWLFiwYJmCV/AK3psFC5bBggULloJX8BpdwXuzYMGCBctgwVLwCl7Be7MMFixYsGDBsu8FH1FaSmExVfAxBa/gvVmwYMGCZbBg/W4vAQYA5tRF9QYlv/QAAAAASUVORK5CYII=";

    static link_type_colors = {
        "-1": defaultConfig.EVENT_LINK_COLOR,
        number: "#AAA",
        node: "#DCA",
    }

    static gradients = {}

    /**
     * clears all the data inside
     *
     * @method clear
     * @memberOf LGraphCanvas
     */
    clear() {
        this.frame = 0;
        this.last_draw_time = 0;
        this.render_time = 0;
        this.fps = 0;

        // this.scale = 1;
        // this.offset = [0,0];

        this.dragging_rectangle = null;

        this.selected_nodes = {};
        this.selected_group = null;

        this.visible_nodes = [];
        this.node_dragged = null;
        this.node_over = null;
        this.node_capturing_input = null;
        this.connecting_node = null;
        this.highlighted_links = {};

        this.dragging_canvas = false;

        this.dirty_canvas = true;
        this.dirty_bgcanvas = true;
        this.dirty_area = null;

        this.node_in_panel = null;
        this.node_widget = null;

        this.last_mouse = [0, 0];
        this.last_mouseclick = 0;
        this.visible_area.set([0, 0, 0, 0]);

        if (this.onClear) this.onClear();
    }

    /**
     * assigns a graph, you can reassign graphs to the same canvas
     *
     * @method setGraph
     * @param {LGraph} graph
     * @param {boolean=} skipClear
     * @memberOf LGraphCanvas
     */
    setGraph(graph, skipClear) {
        if (this.graph === graph) {
            return;
        }

        if (!skipClear) this.clear();

        if (!graph && this.graph) {
            this.graph.detachCanvas(this);
            return;
        }

        graph.attachCanvas(this);

        // remove the graph stack in case a subgraph was open
        if (this._graph_stack) this._graph_stack = null;

        this.setDirty(true, true);
    }

    /**
     * returns the top level graph (in case there are subgraphs open on the canvas)
     *
     * @method getTopGraph
     * @return {LGraph} graph
     * @memberOf LGraphCanvas
     */
    getTopGraph() {
        if (this._graph_stack.length) return this._graph_stack[0];
        return this.graph;
    }

    /**
     * opens a graph contained inside a node in the current graph
     *
     * @method openSubgraph
     * @param {LGraph} graph
     * @memberOf LGraphCanvas
     */
    openSubgraph(graph) {
        if (!graph) {
            throw new Error("graph cannot be null");
        }

        if (this.graph === graph) {
            throw new Error("graph cannot be the same");
        }

        this.clear();

        if (this.graph) {
            if (!this._graph_stack) {
                this._graph_stack = [];
            }
            this._graph_stack.push(this.graph);
        }

        graph.attachCanvas(this);
        this.checkPanels();
        this.setDirty(true, true);
    }

    /**
     * closes a subgraph contained inside a node
     *
     * @method closeSubgraph
     * @memberOf LGraphCanvas
     */
    closeSubgraph() {
        if (!this._graph_stack || this._graph_stack.length === 0) {
            return;
        }
        const subgraphNode = this.graph._subgraph_node;
        const graph = this._graph_stack.pop();
        this.selected_nodes = {};
        this.highlighted_links = {};
        graph.attachCanvas(this);
        this.setDirty(true, true);
        if (subgraphNode) {
            this.centerOnNode(subgraphNode);
            this.selectNodes([subgraphNode]);
        }
    }

    /**
     * returns the visualy active graph (in case there are more in the stack)
     * @method getCurrentGraph
     * @return {LGraph} the active graph
     * @memberOf LGraphCanvas
     */
    getCurrentGraph() {
        return this.graph;
    }

    /**
     * assigns a canvas
     *
     * @method setCanvas
     * @param {HTMLCanvasElement | string | HTMLElement} canvas assigns a canvas
     *  (also accepts the ID of the element (not a selector))
     * @param {boolean} skipEvents
     * @memberOf LGraphCanvas
     */
    setCanvas(canvas, skipEvents) {
        if (canvas?.constructor === String) {
            canvas = document.getElementById(canvas);
            if (!canvas) {
                throw new Error("Error creating LiteGraph canvas: Canvas not found");
            }
        }

        if (canvas === this.canvas) {
            return;
        }

        if (!canvas && this.canvas) {
            // maybe detach events from old_canvas
            if (!skipEvents) {
                this.unbindEvents();
            }
        }

        this.canvas = canvas;
        this.ds.element = canvas;

        if (!canvas) return;

        // this.canvas.tabindex = "1000";
        canvas.className += " lgraphcanvas";
        canvas.data = this;
        canvas.tabindex = "1"; // to allow key events

        // bg canvas: used for non changing stuff
        this.bgcanvas = null;
        this.bgcanvas = document.createElement("canvas");
        this.bgcanvas.width = this.canvas.width;
        this.bgcanvas.height = this.canvas.height;

        if (canvas.getContext === null) {
            if (canvas.localName !== "canvas") {
                throw new Error(`Element supplied for LGraphCanvas must be a <canvas> element, you passed a ${
                    canvas.localName}`);
            }
            throw new Error("This browser doesn't support Canvas");
        }

        this.ctx = canvas.getContext("2d");
        if (this.ctx == null) {
            if (!canvas.webgl_enabled) {
                console.warn(
                    "This canvas seems to be WebGL, enabling WebGL renderer",
                );
            }
            this.enableWebGL();
        }

        // input:  (move and up could be unbinded)
        this._mousemove_callback = this.processMouseMove.bind(this);
        this._mouseup_callback = this.processMouseUp.bind(this);

        if (!skipEvents) this.bindEvents();
    }

    _doNothing(e) {
        e.preventDefault();
        return false;
    }

    _doReturnTrue(e) {
        e.preventDefault();
        return true;
    }

    /**
     * binds mouse, keyboard, touch and drag events to the canvas
     * @method bindEvents
     * @memberOf LGraphCanvas
     * */
    bindEvents() {
        if (this._events_binded) {
            console.warn("LGraphCanvas: events already binded");
            return;
        }

        const { canvas } = this;

        const refWindow = this.getCanvasWindow();
        const { document } = refWindow; // hack used when moving canvas between windows

        this._mousedown_callback = this.processMouseDown.bind(this);
        this._mousewheel_callback = this.processMouseWheel.bind(this);

        canvas.addEventListener("mousedown", this._mousedown_callback, true); // down do not need
        // to store the binded
        canvas.addEventListener("mousemove", this._mousemove_callback);
        canvas.addEventListener("mousewheel", this._mousewheel_callback);

        canvas.addEventListener("contextmenu", this._doNothing);
        canvas.addEventListener("DOMMouseScroll", this._mousewheel_callback);

        canvas.addEventListener("touchstart", this.touchHandler, true);
        canvas.addEventListener("touchmove", this.touchHandler, true);
        canvas.addEventListener("touchend", this.touchHandler, true);
        canvas.addEventListener("touchcancel", this.touchHandler, true);

        // Keyboard ******************
        this._key_callback = this.processKey.bind(this);

        canvas.addEventListener("keydown", this._key_callback, true);
        document.addEventListener("keyup", this._key_callback, true); // in document, otherwise it
        // doesn't fire keyup

        // Dropping Stuff over nodes ************************************
        this._ondrop_callback = this.processDrop.bind(this);

        canvas.addEventListener("dragover", this._doNothing, false);
        canvas.addEventListener("dragend", this._doNothing, false);
        canvas.addEventListener("drop", this._ondrop_callback, false);
        canvas.addEventListener("dragenter", this._doReturnTrue, false);

        this._events_binded = true;
    }

    /**
     * unbinds mouse events from the canvas
     * @method unbindEvents
     * @memberOf LGraphCanvas
     * */
    unbindEvents() {
        if (!this._events_binded) {
            console.warn("LGraphCanvas: no events binded");
            return;
        }

        const refWindow = this.getCanvasWindow();
        const { document } = refWindow;

        this.canvas.removeEventListener("mousedown", this._mousedown_callback);
        this.canvas.removeEventListener(
            "mousewheel",
            this._mousewheel_callback,
        );
        this.canvas.removeEventListener(
            "DOMMouseScroll",
            this._mousewheel_callback,
        );
        this.canvas.removeEventListener("keydown", this._key_callback);
        document.removeEventListener("keyup", this._key_callback);
        this.canvas.removeEventListener("contextmenu", this._doNothing);
        this.canvas.removeEventListener("drop", this._ondrop_callback);
        this.canvas.removeEventListener("dragenter", this._doReturnTrue);

        this.canvas.removeEventListener("touchstart", this.touchHandler);
        this.canvas.removeEventListener("touchmove", this.touchHandler);
        this.canvas.removeEventListener("touchend", this.touchHandler);
        this.canvas.removeEventListener("touchcancel", this.touchHandler);

        this._mousedown_callback = null;
        this._mousewheel_callback = null;
        this._key_callback = null;
        this._ondrop_callback = null;

        this._events_binded = false;
    }

    /**
     * this function allows to render the canvas using WebGL instead of Canvas2D
     * this is useful if you plant to render 3D objects inside your nodes, it uses litegl.js for
     * webgl and canvas2DtoWebGL to emulate the Canvas2D calls in webGL
     * @method enableWebGL
     * @memberOf LGraphCanvas
     * */
    enableWebGL() {
        if (!GL) throw new Error("litegl.js must be included to use a WebGL canvas");
        if (!enableWebGLCanvas) throw new Error("webglCanvas.js must be included to use this feature");

        this.ctx = enableWebGLCanvas(this.canvas);
        this.gl = this.ctx;
        this.ctx.webgl = true;
        this.bgcanvas = this.canvas;
        this.bgctx = this.gl;
        this.canvas.webgl_enabled = true;
    }

    /**
     * marks as dirty the canvas, this way it will be rendered again
     *
     * @class LGraphCanvas
     * @method setDirty
     * @param {boolean} [fgcanvas] if the foreground canvas is dirty (the one containing the nodes)
     * @param {boolean} [bgcanvas] if the background canvas is dirty (the one containing the wires)
     * @memberOf LGraphCanvas
     */
    setDirty(fgcanvas, bgcanvas) {
        if (fgcanvas) this.dirty_canvas = true;
        if (bgcanvas) this.dirty_bgcanvas = true;
    }

    /**
     * Used to attach the canvas in a popup
     *
     * @method getCanvasWindow
     * @return {Window} returns the window where the canvas is attached (the DOM root node)
     * @memberOf LGraphCanvas
     */
    getCanvasWindow() {
        if (!this.canvas) return window;
        const doc = this.canvas.ownerDocument;
        return doc.defaultView;
    }

    /**
     * starts rendering the content of the canvas when needed
     *
     * @method startRendering
     * @memberOf LGraphCanvas
     */
    startRendering() {
        if (this.is_rendering) return;

        this.is_rendering = true;
        this.renderFrame();
    }

    /**
     * render a frame
     *
     * @method renderFrame
     * @memberOf LGraphCanvas
     */
    renderFrame() {
        if (!this.pause_rendering) this.draw();

        const window = this.getCanvasWindow();
        if (this.is_rendering) window.requestAnimationFrame(() => this.renderFrame());
    }

    /**
     * stops rendering the content of the canvas (to save resources)
     *
     * @method stopRendering
     * @memberOf LGraphCanvas
     */
    stopRendering() {
        this.is_rendering = false;
    }

    /* LiteGraphCanvas input */

    /**
     * used to block future mouse events (because of im gui)
     *
     * @method blockClick
     * @memberOf LGraphCanvas
     */
    blockClick() {
        this.block_click = true;
        this.last_mouseclick = 0;
    }

    processMouseDown(e) {
        if (this.set_canvas_dirty_on_mouse_event) this.dirty_canvas = true;

        if (!this.graph) return;

        this.adjustMouseEvent(e);

        const refWindow = this.getCanvasWindow();
        LGraphCanvas.active_canvas = this;

        // move mouse move event to the window in case it drags outside of the canvas
        this.canvas.removeEventListener("mousemove", this._mousemove_callback);
        refWindow.document.addEventListener("mousemove", this._mousemove_callback, true); // catch for the entire window
        refWindow.document.addEventListener("mouseup", this._mouseup_callback, true);

        const node = this.graph.getNodeOnPos(e.canvasX, e.canvasY, this.visible_nodes, 5);
        let skipAction = false;
        const now = getTime();
        const isDoubleClick = now - this.last_mouseclick < 300;
        this.mouse[0] = e.localX;
        this.mouse[1] = e.localY;
        this.graph_mouse[0] = e.canvasX;
        this.graph_mouse[1] = e.canvasY;
        this.last_click_position = [this.mouse[0], this.mouse[1]];

        this.canvas.focus();

        ContextMenu.closeAllContextMenus(refWindow);

        if (this.onMouse) {
            if (this.onMouse(e)) return;
        }

        // left button mouse
        if (e.which === 1) {
            if (e.ctrlKey) {
                this.dragging_rectangle = new Float32Array(4);
                this.dragging_rectangle[0] = e.canvasX;
                this.dragging_rectangle[1] = e.canvasY;
                this.dragging_rectangle[2] = 1;
                this.dragging_rectangle[3] = 1;
                skipAction = true;
            }

            let clickingCanvasBg = false;

            // when clicked on top of a node
            // and it is not interactive
            if (node && this.allow_interaction && !skipAction && !this.read_only) {
                if (!this.live_mode && !node.flags.pinned) {
                    this.bringToFront(node);
                } // if it wasn't selected?

                // not dragging mouse to connect two slots
                if (!this.connecting_node && !node.flags.collapsed && !this.live_mode) {
                // Search for corner for resize
                    if (!skipAction
                    && node.resizable
                    && isInsideRectangle(
                        e.canvasX,
                        e.canvasY,
                        node.pos[0] + node.size[0] - 5,
                        node.pos[1] + node.size[1] - 5,
                        1010,
                    )
                    ) {
                        this.graph.beforeChange();
                        this.resizing_node = node;
                        this.canvas.style.cursor = "se-resize";
                        skipAction = true;
                    } else {
                    // search for outputs
                        if (node.outputs) {
                            for (let i = 0, l = node.outputs.length; i < l; i++) {
                                const output = node.outputs[i];
                                const linkPos = node.getConnectionPos(false, i);
                                if (isInsideRectangle(
                                    e.canvasX,
                                    e.canvasY,
                                    linkPos[0] - 15,
                                    linkPos[1] - 10,
                                    30,
                                    20,
                                )) {
                                    this.connecting_node = node;
                                    this.connecting_output = output;
                                    this.connecting_pos = node.getConnectionPos(false, i);
                                    this.connecting_slot = i;
                                    if (e.shiftKey) {
                                        node.disconnectOutput(i);
                                    }

                                    if (isDoubleClick) {
                                        if (node.onOutputDblClick) {
                                            node.onOutputDblClick(i, e);
                                        }
                                    } else if (node.onOutputClick) {
                                        node.onOutputClick(i, e);
                                    }

                                    skipAction = true;
                                    break;
                                }
                            }
                        }

                        // search for inputs
                        if (node.inputs) {
                            for (let i = 0, l = node.inputs.length; i < l; i++) {
                                const input = node.inputs[i];
                                const linkPos = node.getConnectionPos(true, i);
                                if (isInsideRectangle(
                                    e.canvasX,
                                    e.canvasY,
                                    linkPos[0] - 15,
                                    linkPos[1] - 10,
                                    30, 20,
                                )) {
                                    if (isDoubleClick) {
                                        if (node.onInputDblClick) {
                                            node.onInputDblClick(i, e);
                                        }
                                    } else if (node.onInputClick) {
                                        node.onInputClick(i, e);
                                    }

                                    if (input.link) {
                                        const linkInfo = this.graph.links[
                                            input.link
                                        ]; // before disconnecting
                                        node.disconnectInput(i);

                                        if (
                                            this.allow_reconnect_links
                                            || e.shiftKey
                                        ) {
                                            this.connecting_node = this.graph._nodes_by_id[
                                                linkInfo.origin_id
                                            ];
                                            this.connecting_slot = linkInfo.origin_slot;
                                            this.connecting_output = this.connecting_node.outputs[
                                                this.connecting_slot
                                            ];

                                            this.connecting_pos = this.connecting_node
                                                .getConnectionPos(false, this.connecting_slot);
                                        }

                                        this.dirty_bgcanvas = true;
                                        skipAction = true;
                                    }
                                }
                            }
                        }
                    } // not resizing
                }

                // it wasn't clicked on the links boxes
                if (!skipAction) {
                    let blockDragNote = false;
                    const pos = [e.canvasX - node.pos[0], e.canvasY - node.pos[1]];

                    // widgets
                    const widget = this.processNodeWidgets(node, this.graph_mouse, e);
                    if (widget) {
                        blockDragNote = true;
                        this.node_widget = [node, widget];
                    }

                    // double clicking
                    if (isDoubleClick && this.selected_nodes[node.id]) {
                        // double click node
                        if (node.onDblClick) {
                            node.onDblClick(e, pos, this);
                        }
                        this.processNodeDblClicked(node);
                        blockDragNote = true;
                    }

                    // if do not capture mouse
                    if (node.onMouseDown && node.onMouseDown(e, pos, this)) {
                        blockDragNote = true;
                    } else {
                        // open subgraph button
                        if (node.subgraph && !node.skip_subgraph_button) {
                            if (!node.flags.collapsed && pos[0]
                                > node.size[0] - defaultConfig.NODE_TITLE_HEIGHT
                                && pos[1] < 0) {
                                setTimeout(() => {
                                    this.openSubgraph(node.subgraph);
                                }, 10);
                            }
                        }

                        if (this.live_mode) {
                            clickingCanvasBg = true;
                            blockDragNote = true;
                        }
                    }

                    if (!blockDragNote) {
                        if (this.allow_dragnodes) {
                            this.graph.beforeChange();
                            this.node_dragged = node;
                        }
                        if (!this.selected_nodes[node.id]) {
                            this.processNodeSelected(node, e);
                        }
                    }

                    this.dirty_canvas = true;
                }
            } else {
                // search for link connector
                if (!this.read_only) {
                    for (const link of this.visible_links) {
                        const center = link._pos;
                        if (
                            !center
                            || e.canvasX < center[0] - 4
                            || e.canvasX > center[0] + 4
                            || e.canvasY < center[1] - 4
                            || e.canvasY > center[1] + 4
                        ) {
                            continue;
                        }
                        // link clicked
                        this.showLinkMenu(link, e);
                        this.over_link_center = null; // clear tooltip
                        break;
                    }
                }

                this.selected_group = this.graph.getGroupOnPos(e.canvasX, e.canvasY);
                this.selected_group_resizing = false;
                if (this.selected_group && !this.read_only) {
                    if (e.ctrlKey) this.dragging_rectangle = null;

                    const dist = distance([e.canvasX, e.canvasY],
                        [this.selected_group.pos[0] + this.selected_group.size[0],
                            this.selected_group.pos[1] + this.selected_group.size[1]]);
                    if (dist * this.ds.scale < 10) {
                        this.selected_group_resizing = true;
                    } else {
                        this.selected_group.recomputeInsideNodes();
                    }
                }

                if (isDoubleClick && !this.read_only && this.allow_searchbox) {
                    this.showSearchBox(e);
                }

                clickingCanvasBg = true;
            }

            if (!skipAction && clickingCanvasBg && this.allow_dragcanvas) {
                this.dragging_canvas = true;
            }
        } else if (e.which === 2) {
            // middle button
        } else if (e.which === 3) {
            // right button
            if (!this.read_only) this.processContextMenu(node, e);
        }

        // TODO
        // if(this.node_selected != prev_selected)
        //	this.onNodeSelectionChange(this.node_selected);

        this.last_mouse[0] = e.localX;
        this.last_mouse[1] = e.localY;
        this.last_mouseclick = getTime();
        this.last_mouse_dragging = true;

        /*
    if( (this.dirty_canvas || this.dirty_bgcanvas) && this.rendering_timer_id == null)
    this.draw();
    */

        this.graph.change();

        // this is to ensure to defocus(blur) if a text input element is on focus
        if (
            !refWindow.document.activeElement
            || (refWindow.document.activeElement.nodeName.toLowerCase()
            !== "input"
            && refWindow.document.activeElement.nodeName.toLowerCase()
            !== "textarea")) {
            e.preventDefault();
        }
        e.stopPropagation();

        if (this.onMouseDown) {
            this.onMouseDown(e);
        }

        return false;
    }

    /**
     * Called when a mouse move event has to be processed
     * @method processMouseMove
     * @memberOf LGraphCanvas
     * */
    processMouseMove(e) {
        if (this.autoresize) this.resize();

        if (this.set_canvas_dirty_on_mouse_event) this.dirty_canvas = true;

        if (!this.graph) return;

        LGraphCanvas.active_canvas = this;
        this.adjustMouseEvent(e);
        const mouse = [e.localX, e.localY];
        this.mouse[0] = mouse[0];
        this.mouse[1] = mouse[1];
        const delta = [
            mouse[0] - this.last_mouse[0],
            mouse[1] - this.last_mouse[1],
        ];
        this.last_mouse = mouse;
        this.graph_mouse[0] = e.canvasX;
        this.graph_mouse[1] = e.canvasY;

        if (this.block_click) {
            e.preventDefault();
            return false;
        }

        e.dragging = this.last_mouse_dragging;

        if (this.node_widget) {
            this.processNodeWidgets(this.node_widget[0], this.graph_mouse, e, this.node_widget[1]);
            this.dirty_canvas = true;
        }

        if (this.dragging_rectangle) {
            this.dragging_rectangle[2] = e.canvasX - this.dragging_rectangle[0];
            this.dragging_rectangle[3] = e.canvasY - this.dragging_rectangle[1];
            this.dirty_canvas = true;
        } else if (this.selected_group && !this.read_only) {
            // moving/resizing a group
            if (this.selected_group_resizing) {
                this.selected_group.size = [
                    e.canvasX - this.selected_group.pos[0],
                    e.canvasY - this.selected_group.pos[1],
                ];
            } else {
                const deltax = delta[0] / this.ds.scale;
                const deltay = delta[1] / this.ds.scale;
                this.selected_group.move(deltax, deltay, e.ctrlKey);
                if (this.selected_group._nodes.length) this.dirty_canvas = true;
            }
            this.dirty_bgcanvas = true;
        } else if (this.dragging_canvas) {
            this.ds.offset[0] += delta[0] / this.ds.scale;
            this.ds.offset[1] += delta[1] / this.ds.scale;
            this.dirty_canvas = true;
            this.dirty_bgcanvas = true;
        } else if (this.allow_interaction && !this.read_only) {
            if (this.connecting_node) this.dirty_canvas = true;

            // get node over
            const node = this.graph.getNodeOnPos(e.canvasX, e.canvasY, this.visible_nodes);

            // remove mouseover flag
            for (const _node of this.graph._nodes) {
                if (_node.mouseOver && node !== _node) {
                    // mouse leave
                    _node.mouseOver = false;
                    if (this.node_over && this.node_over.onMouseLeave) {
                        this.node_over.onMouseLeave(e);
                    }
                    this.node_over = null;
                    this.dirty_canvas = true;
                }
            }

            // mouse over a node
            if (node) {
                if (node.redraw_on_mouse) this.dirty_canvas = true;

                // this.canvas.style.cursor = "move";
                if (!node.mouseOver) {
                    // mouse enter
                    node.mouseOver = true;
                    this.node_over = node;
                    this.dirty_canvas = true;

                    if (node.onMouseEnter) node.onMouseEnter(e);
                }

                // in case the node wants to do something
                if (node.onMouseMove) {
                    node.onMouseMove(e, [e.canvasX - node.pos[0], e.canvasY - node.pos[1]], this);
                }

                // if dragging a link
                if (this.connecting_node) {
                    const pos = this._highlight_input || [0, 0];

                    // on top of input
                    if (this.isOverNodeBox(node, e.canvasX, e.canvasY)) {
                        // mouse on top of the corner box, don't know what to do
                    } else {
                        // check if I have a slot below de mouse
                        const slot = this.isOverNodeInput(node, e.canvasX, e.canvasY, pos);
                        if (slot !== -1 && node.inputs[slot]) {
                            const slotType = node.inputs[slot].type;
                            if (isValidConnection(this.connecting_output.type, slotType)) {
                                this._highlight_input = pos;
                            }
                        } else this._highlight_input = null;
                    }
                }

                // Search for corner
                if (this.canvas) {
                    if (isInsideRectangle(
                        e.canvasX,
                        e.canvasY,
                        node.pos[0] + node.size[0] - 5,
                        node.pos[1] + node.size[1] - 5,
                        5,
                        5,
                    )) {
                        this.canvas.style.cursor = "se-resize";
                    } else this.canvas.style.cursor = "crosshair";
                }
            } else { // not over a node
                // search for link connector
                let overLink = null;
                for (const link of this.visible_links) {
                    const center = link._pos;
                    if (!center
                        || e.canvasX < center[0] - 4
                        || e.canvasX > center[0] + 4
                        || e.canvasY < center[1] - 4
                        || e.canvasY > center[1] + 4) {
                        continue;
                    }
                    overLink = link;
                    break;
                }
                if (overLink !== this.over_link_center) {
                    this.over_link_center = overLink;
                    this.dirty_canvas = true;
                }

                if (this.canvas) this.canvas.style.cursor = "";
            } // end

            // send event to node if capturing input (used with widgets that allow drag outside of
            // the area of the node)
            if (this.node_capturing_input && this.node_capturing_input !== node && this.node_capturing_input.onMouseMove) {
                this.node_capturing_input.onMouseMove(e, [e.canvasX - this.node_capturing_input.pos[0], e.canvasY - this.node_capturing_input.pos[1]], this);
            }

            // node being dragged
            if (this.node_dragged && !this.live_mode) {
                for (const nKeys of Object.keys(this.selected_nodes)) {
                    const n = this.selected_nodes[nKeys];
                    n.pos[0] += delta[0] / this.ds.scale;
                    n.pos[1] += delta[1] / this.ds.scale;
                }

                this.dirty_canvas = true;
                this.dirty_bgcanvas = true;
            }

            if (this.resizing_node && !this.live_mode) {
                // convert mouse to node space
                const desiredSize = [
                    e.canvasX - this.resizing_node.pos[0],
                    e.canvasY - this.resizing_node.pos[1],
                ];
                const minSize = this.resizing_node.computeSize();
                desiredSize[0] = Math.max(minSize[0], desiredSize[0]);
                desiredSize[1] = Math.max(minSize[1], desiredSize[1]);
                this.resizing_node.setSize(desiredSize);

                this.canvas.style.cursor = "se-resize";
                this.dirty_canvas = true;
                this.dirty_bgcanvas = true;
            }
        }

        e.preventDefault();
        return false;
    }

    /**
     * Called when a mouse up event has to be processed
     * @method processMouseUp
     * @memberOf LGraphCanvas
     * */
    processMouseUp(e) {
        if (this.set_canvas_dirty_on_mouse_event) this.dirty_canvas = true;

        if (!this.graph) return;

        const window = this.getCanvasWindow();
        const { document } = window;
        LGraphCanvas.active_canvas = this;

        // restore the mousemove event back to the canvas
        document.removeEventListener("mousemove", this._mousemove_callback, true);
        this.canvas.addEventListener("mousemove", this._mousemove_callback, true);
        document.removeEventListener("mouseup", this._mouseup_callback, true);

        this.adjustMouseEvent(e);
        const now = getTime();
        e.click_time = now - this.last_mouseclick;
        this.last_mouse_dragging = false;
        this.last_click_position = null;

        if (this.block_click) this.block_click = false;
        // used to avoid sending twice a click in a immediate button

        if (e.which === 1) {
            if (this.node_widget) this.processNodeWidgets(this.node_widget[0], this.graph_mouse, e);

            // left button
            this.node_widget = null;

            if (this.selected_group) {
                const diffx = this.selected_group.pos[0]
                    - Math.round(this.selected_group.pos[0]);
                const diffy = this.selected_group.pos[1]
                    - Math.round(this.selected_group.pos[1]);

                this.selected_group.move(diffx, diffy, e.ctrlKey);

                this.selected_group.pos[0] = Math.round(this.selected_group.pos[0]);
                this.selected_group.pos[1] = Math.round(this.selected_group.pos[1]);

                if (this.selected_group._nodes.length) this.dirty_canvas = true;
                this.selected_group = null;
            }
            this.selected_group_resizing = false;

            if (this.dragging_rectangle) {
                if (this.graph) {
                    const nodes = this.graph._nodes;
                    const nodeBounding = new Float32Array(4);
                    this.deselectAllNodes();
                    // compute bounding and flip if left to right
                    const w = Math.abs(this.dragging_rectangle[2]);
                    const h = Math.abs(this.dragging_rectangle[3]);
                    const startx = this.dragging_rectangle[2] < 0
                        ? this.dragging_rectangle[0] - w
                        : this.dragging_rectangle[0];
                    const starty = this.dragging_rectangle[3] < 0
                        ? this.dragging_rectangle[1] - h
                        : this.dragging_rectangle[1];
                    this.dragging_rectangle[0] = startx;
                    this.dragging_rectangle[1] = starty;
                    this.dragging_rectangle[2] = w;
                    this.dragging_rectangle[3] = h;

                    // test against all nodes (not visible because the rectangle maybe start outside
                    const toSelect = [];

                    for (const node of nodes) {
                        node.getBounding(nodeBounding);
                        if (
                            !overlapBounding(
                                this.dragging_rectangle,
                                nodeBounding,
                            )
                        ) {
                            continue;
                        } // out of the visible area
                        toSelect.push(node);
                    }
                    if (toSelect.length) {
                        this.selectNodes(toSelect);
                    }
                }
                this.dragging_rectangle = null;
            } else if (this.connecting_node) {
                // dragging a connection
                this.dirty_canvas = true;
                this.dirty_bgcanvas = true;

                const node = this.graph.getNodeOnPos(
                    e.canvasX,
                    e.canvasY,
                    this.visible_nodes,
                );

                // node below mouse
                if (node) {
                    if (
                        this.connecting_output.type === defaultConfig.EVENT
                        && this.isOverNodeBox(node, e.canvasX, e.canvasY)
                    ) {
                        this.connecting_node.connect(this.connecting_slot, node, defaultConfig.EVENT);
                    } else {
                        // slot below mouse? connect
                        const slot = this.isOverNodeInput(node, e.canvasX, e.canvasY);
                        if (slot !== -1) {
                            this.connecting_node.connect(this.connecting_slot, node, slot);
                        } else {
                            // not on top of an input
                            const input = node.getInputInfo(0);
                            // auto connect
                            if (this.connecting_output.type === defaultConfig.EVENT) {
                                this.connecting_node.connect(
                                    this.connecting_slot, node,
                                    defaultConfig.EVENT,
                                );
                            } else if (
                                input
                                && !input.link
                                && isValidConnection(
                                    input.type && this.connecting_output.type,
                                )
                            ) {
                                this.connecting_node.connect(this.connecting_slot, node, 0);
                            }
                        }
                    }
                }

                this.connecting_output = null;
                this.connecting_pos = null;
                this.connecting_node = null;
                this.connecting_slot = -1;
            } else if (this.resizing_node) {
                this.dirty_canvas = true;
                this.dirty_bgcanvas = true;
                this.graph.afterChange(this.resizing_node);
                this.resizing_node = null;
            } else if (this.node_dragged) {
                // node being dragged?
                const node = this.node_dragged;
                if (
                    node
                    && e.click_time < 300
                    && isInsideRectangle(
                        e.canvasX,
                        e.canvasY,
                        node.pos[0],
                        node.pos[1] - defaultConfig.NODE_TITLE_HEIGHT,
                        defaultConfig.NODE_TITLE_HEIGHT,
                        defaultConfig.NODE_TITLE_HEIGHT,
                    )
                ) {
                    node.collapse();
                }

                this.dirty_canvas = true;
                this.dirty_bgcanvas = true;
                this.node_dragged.pos[0] = Math.round(this.node_dragged.pos[0]);
                this.node_dragged.pos[1] = Math.round(this.node_dragged.pos[1]);
                if (this.graph.config.align_to_grid) {
                    this.node_dragged.alignToGrid();
                }
                if (this.onNodeMoved) this.onNodeMoved(this.node_dragged);
                this.graph.afterChange(this.node_dragged);
                this.node_dragged = null;
            } else {
                // get node over
                const node = this.graph.getNodeOnPos(
                    e.canvasX,
                    e.canvasY,
                    this.visible_nodes,
                );

                if (!node && e.click_time < 300) {
                    this.deselectAllNodes();
                }

                this.dirty_canvas = true;
                this.dragging_canvas = false;

                if (this.node_over && this.node_over.onMouseUp) {
                    this.node_over.onMouseUp(e, [e.canvasX - this.node_over.pos[0], e.canvasY - this.node_over.pos[1]], this);
                }
                if (
                    this.node_capturing_input
                    && this.node_capturing_input.onMouseUp
                ) {
                    this.node_capturing_input.onMouseUp(e, [
                        e.canvasX - this.node_capturing_input.pos[0],
                        e.canvasY - this.node_capturing_input.pos[1],
                    ]);
                }
            }
        } else if (e.which === 2) {
            // middle button
            // trace("middle");
            this.dirty_canvas = true;
            this.dragging_canvas = false;
        } else if (e.which === 3) {
            // right button
            // trace("right");
            this.dirty_canvas = true;
            this.dragging_canvas = false;
        }

        this.graph.change();

        e.stopPropagation();
        e.preventDefault();
        return false;
    }

    /**
     * Called when a mouse wheel event has to be processed
     * @method processMouseWheel
     * @memberOf LGraphCanvas
     * */
    processMouseWheel(e) {
        if (!this.graph || !this.allow_dragcanvas) {
            return;
        }

        const delta = e.wheelDeltaY ?? e.detail * -60;

        this.adjustMouseEvent(e);

        let { scale } = this.ds;

        if (delta > 0) {
            scale *= 1.1;
        } else if (delta < 0) {
            scale *= 1 / 1.1;
        }

        // this.setZoom( scale, [ e.localX, e.localY ] );
        this.ds.changeScale(scale, [e.localX, e.localY]);

        this.graph.change();

        e.preventDefault();
        return false; // prevent default
    }

    /**
     * returns true if a position (in graph space) is on top of a node little corner box
     * @method isOverNodeBox
     * @memberOf LGraphCanvas
     * */
    isOverNodeBox(node, canvasx, canvasy) {
        const titleHeight = defaultConfig.NODE_TITLE_HEIGHT;
        return !!isInsideRectangle(
            canvasx,
            canvasy,
            node.pos[0] + 2,
            node.pos[1] + 2 - titleHeight,
            titleHeight - 4,
            titleHeight - 4,
        );
    }

    /**
     * returns true if a position (in graph space) is on top of a node input slot
     * @method isOverNodeInput
     * @memberOf LGraphCanvas
     * */
    isOverNodeInput(
        node,
        canvasx,
        canvasy,
        slotPos,
    ) {
        if (node.inputs) {
            for (let i = 0, l = node.inputs.length; i < l; ++i) {
                const linkPos = node.getConnectionPos(true, i);
                let isInside = false;
                if (node.horizontal) {
                    isInside = isInsideRectangle(
                        canvasx,
                        canvasy,
                        linkPos[0] - 5,
                        linkPos[1] - 10,
                        10,
                        20,
                    );
                } else {
                    isInside = isInsideRectangle(
                        canvasx,
                        canvasy,
                        linkPos[0] - 10,
                        linkPos[1] - 5,
                        40,
                        10,
                    );
                }
                if (isInside) {
                    if (slotPos) {
                        slotPos[0] = linkPos[0];
                        slotPos[1] = linkPos[1];
                    }
                    return i;
                }
            }
        }
        return -1;
    }

    /**
     * process a key event
     * @method processKey
     * @memberOf LGraphCanvas
     * */
    processKey(e) {
        if (!this.graph) return;

        let blockDefault = false;

        if (e.target.localName === "input") {
            return;
        }

        if (e.type === "keydown") {
            if (e.keyCode === 32) {
                // esc
                this.dragging_canvas = true;
                blockDefault = true;
            }

            // select all Control A
            if (e.keyCode === 65 && e.ctrlKey) {
                this.selectNodes();
                blockDefault = true;
            }

            if (e.code === "KeyC" && (e.metaKey || e.ctrlKey) && !e.shiftKey) {
                // copy
                if (this.selected_nodes) {
                    this.copyToClipboard();
                    blockDefault = true;
                }
            }

            if (e.code === "KeyV" && (e.metaKey || e.ctrlKey) && !e.shiftKey) {
                // paste
                this.pasteFromClipboard();
            }

            // delete or backspace
            if ((e.keyCode === 46 || e.keyCode === 8)
                && (e.target.localName !== "input" && e.target.localName !== "textarea")) {
                this.deleteSelectedNodes();
                blockDefault = true;
            }

            // collapse
            // ...

            // TODO
            if (this.selected_nodes) {
                for (var i in this.selected_nodes) {
                    if (this.selected_nodes[i].onKeyDown) {
                        this.selected_nodes[i].onKeyDown(e);
                    }
                }
            }
        } else if (e.type == "keyup") {
            if (e.keyCode == 32) {
                this.dragging_canvas = false;
            }

            if (this.selected_nodes) {
                for (var i in this.selected_nodes) {
                    if (this.selected_nodes[i].onKeyUp) {
                        this.selected_nodes[i].onKeyUp(e);
                    }
                }
            }
        }

        this.graph.change();

        if (blockDefault) {
            e.preventDefault();
            e.stopImmediatePropagation();
            return false;
        }
    }

    pasteFromClipboard() {
        const data = localStorage.getItem("litegrapheditor_clipboard");
        if (!data) return;

        this.graph.beforeChange();

        // create nodes
        const clipboardInfo = JSON.parse(data);
        const nodes = [];
        for (const node_data of clipboardInfo.nodes) {
            const node = LGraphNode.createNode(node_data.type);
            if (node) {
                node.configure(node_data);
                node.pos[0] += 5;
                node.pos[1] += 5;
                this.graph.add(node);
                nodes.push(node);
            }
        }

        for (const link_info of clipboardInfo.links) {
            const origin_node = nodes[link_info[0]];
            const target_node = nodes[link_info[2]];
            if (origin_node && target_node) origin_node.connect(link_info[1], target_node, link_info[3]);
            else console.warn("Warning, nodes missing on pasting");
        }

        this.selectNodes(nodes);

        this.graph.afterChange();
    }

    copyToClipboard() {
        const clipboardInfo = {
            nodes: [],
            links: [],
        };
        let index = 0;
        const selectedNodesArray = [];

        // eslint-disable-next-line guard-for-in, no-restricted-syntax
        for (const i in this.selected_nodes) {
            const node = this.selected_nodes[i];
            node.relative_id = index;
            selectedNodesArray.push(node);
            index += 1;
        }

        for (const node of selectedNodesArray) {
            const cloned = node.clone();
            if (!cloned) {
                console.warn(`node type not found: ${node.type}`);
                continue;
            }
            clipboardInfo.nodes.push(cloned.serialize());
            if (node.inputs && node.inputs.length) {
                for (let j = 0; j < node.inputs.length; ++j) {
                    const input = node.inputs[j];
                    if (!input || input.link == null) {
                        continue;
                    }
                    const link_info = this.graph.links[input.link];
                    if (!link_info) {
                        continue;
                    }
                    const target_node = this.graph.getNodeById(
                        link_info.origin_id,
                    );
                    if (!target_node || !this.selected_nodes[target_node.id]) {
                        // improve this by allowing connections to non-selected nodes
                        continue;
                    } // not selected
                    clipboardInfo.links.push([
                        target_node._relative_id,
                        link_info.origin_slot, // j,
                        node._relative_id,
                        link_info.target_slot,
                    ]);
                }
            }
        }

        localStorage.setItem("litegrapheditor_clipboard", JSON.stringify(clipboardInfo));
    }

    /**
     * process a item drop event on top the canvas
     * @method processDrop
     * @memberOf LGraphCanvas
     * */
    processDrop(e) {
        e.preventDefault();
        this.adjustMouseEvent(e);

        const pos = [e.canvasX, e.canvasY];
        const node = this.graph ? this.graph.getNodeOnPos(pos[0], pos[1]) : null;

        if (!node) {
            let r = null;
            if (this.onDropItem) r = this.onDropItem(e);
            if (!r) {
                this.checkDropItem(e);
            }
            return;
        }

        if (node.onDropFile || node.onDropData) {
            const { files } = e.dataTransfer;
            if (files && files.length) {
                for (const file of files) {
                    const filename = file.name;
                    // console.log(file);

                    if (node.onDropFile) {
                        node.onDropFile(file);
                    }

                    if (node.onDropData) {
                        // prepare reader
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            // console.log(event.target);
                            const data = event.target.result;
                            node.onDropData(data, filename, file);
                        };

                        // read data
                        const type = file.type.split("/")[0];
                        if (type === "text" || type === "") {
                            reader.readAsText(file);
                        } else if (type === "image") {
                            reader.readAsDataURL(file);
                        } else {
                            reader.readAsArrayBuffer(file);
                        }
                    }
                }
            }
        }

        if (node.onDropItem) {
            if (node.onDropItem(e)) {
                return true;
            }
        }

        if (this.onDropItem) {
            return this.onDropItem(e);
        }

        return false;
    }

    checkDropItem(e) {
        if (e.dataTransfer.files.length) {
            const file = e.dataTransfer.files[0];
            const ext = getFileExtension(file.name).toLowerCase();
            const nodetype = defaultConfig.node_types_by_file_extension[ext];
            if (nodetype) {
                this.graph.beforeChange();
                const node = LGraphNode.createNode(nodetype.type);
                node.pos = [e.canvasX, e.canvasY];
                this.graph.add(node);
                if (node.onDropFile) {
                    node.onDropFile(file);
                }
                this.graph.afterChange();
            }
        }
    }

    processNodeDblClicked(n) {
        if (this.onShowNodePanel) this.onShowNodePanel(n);
        else this.showShowNodePanel(n);

        if (this.onNodeDblClicked) this.onNodeDblClicked(n);

        this.setDirty(true);
    }

    processNodeSelected(node, e) {
        this.selectNode(node, e && e.shiftKey);
        if (this.onNodeSelected) {
            this.onNodeSelected(node);
        }
    }

    /**
     * selects a given node (or adds it to the current selection)
     * @method selectNode
     * @param {LGraphNode} node
     * @param {boolean} addToCurrentSelection
     * @memberOf LGraphCanvas
     * */
    selectNode(node, addToCurrentSelection) {
        if (node == null) {
            this.deselectAllNodes();
        } else {
            this.selectNodes([node], addToCurrentSelection);
        }
    }

    /**
     * selects several nodes (or adds them to the current selection)
     * @method selectNodes
     * @memberOf LGraphCanvas
     * */
    selectNodes(nodes = this.graph._nodes, addToCurrentSelection) {
        if (!addToCurrentSelection) this.deselectAllNodes();

        for (const node of nodes) {
            if (node.is_selected) continue;

            if (!node.is_selected && node.onSelected) node.onSelected();
            node.is_selected = true;
            this.selected_nodes[node.id] = node;

            if (node.inputs) {
                for (const input of node.inputs) this.highlighted_links[input.link] = true;
            }

            if (node.outputs) {
                for (const out of node.outputs) {
                    if (out.links) {
                        for (const link of out.links) this.highlighted_links[link] = true;
                    }
                }
            }
        }

        if (this.onSelectionChange) this.onSelectionChange(this.selected_nodes);

        this.setDirty(true);
    }

    /**
     * removes a node from the current selection
     * @method deselectNode
     * @memberOf LGraphCanvas
     * */
    deselectNode(node) {
        if (!node.is_selected) return;
        if (node.onDeselected) {
            node.onDeselected();
        }
        node.is_selected = false;

        if (this.onNodeDeselected) {
            this.onNodeDeselected(node);
        }

        // remove highlighted
        if (node.inputs) {
            for (const input of node.inputs) delete this.highlighted_links[input.link];
        }
        if (node.outputs) {
            for (const out of node.outputs) {
                if (out.links) {
                    for (const link of out.links) delete this.highlighted_links[link];
                }
            }
        }
    }

    /**
     * removes all nodes from the current selection
     * @method deselectAllNodes
     * @memberOf LGraphCanvas
     * */
    deselectAllNodes() {
        if (!this.graph) return;
        for (const node of this.graph._nodes) {
            if (!node.is_selected) {
                continue;
            }
            if (node.onDeselected) {
                node.onDeselected();
            }
            node.is_selected = false;
            if (this.onNodeDeselected) {
                this.onNodeDeselected(node);
            }
        }
        this.selected_nodes = {};
        this.current_node = null;
        this.highlighted_links = {};
        if (this.onSelectionChange) this.onSelectionChange(this.selected_nodes);
        this.setDirty(true);
    }

    /**
     * deletes all nodes in the current selection from the graph
     * @method deleteSelectedNodes
     * @memberOf LGraphCanvas
     * */
    deleteSelectedNodes() {
        this.graph.beforeChange();

        // eslint-disable-next-line guard-for-in, no-restricted-syntax
        for (const i in this.selected_nodes) {
            const node = this.selected_nodes[i];

            if (node.block_delete) continue;

            // autoconnect when possible (very basic, only takes into account first input-output)
            if (node.inputs
                && node.inputs.length
                && node.outputs
                && node.outputs.length
                && isValidConnection(node.inputs[0].type, node.outputs[0].type)
                && node.inputs[0].link
                && node.outputs[0].links
                && node.outputs[0].links.length) {
                const inputLink = node.graph.links[node.inputs[0].link];
                const outputLink = node.graph.links[node.outputs[0].links[0]];
                const inputNode = node.getInputNode(0);
                const outputNode = node.getOutputNodes(0)[0];
                if (inputNode && outputNode) {
                    inputNode.connect(inputLink.origin_slot, outputNode, outputLink.target_slot);
                }
            }
            this.graph.remove(node);
            if (this.onNodeDeselected) this.onNodeDeselected(node);
        }

        this.selected_nodes = {};
        this.current_node = null;
        this.highlighted_links = {};
        this.setDirty(true);
        this.graph.afterChange();
    }

    /**
     * centers the camera on a given node
     * @method centerOnNode
     * @memberOf LGraphCanvas
     * */
    centerOnNode(node) {
        this.ds.offset[0] = -node.pos[0]
            - node.size[0] * 0.5
            + (this.canvas.width * 0.5) / this.ds.scale;
        this.ds.offset[1] = -node.pos[1]
            - node.size[1] * 0.5
            + (this.canvas.height * 0.5) / this.ds.scale;
        this.setDirty(true, true);
    }

    /**
     * adds some useful properties to a mouse event, like the position in graph coordinates
     * @method adjustMouseEvent
     * @memberOf LGraphCanvas
     * */
    adjustMouseEvent(e) {
        if (this.canvas) {
            const b = this.canvas.getBoundingClientRect();
            e.localX = e.clientX - b.left;
            e.localY = e.clientY - b.top;
        } else {
            e.localX = e.clientX;
            e.localY = e.clientY;
        }

        e.deltaX = e.localX - this.last_mouse_position[0];
        e.deltaY = e.localY - this.last_mouse_position[1];

        this.last_mouse_position[0] = e.localX;
        this.last_mouse_position[1] = e.localY;

        e.canvasX = e.localX / this.ds.scale - this.ds.offset[0];
        e.canvasY = e.localY / this.ds.scale - this.ds.offset[1];
    }

    /**
     * changes the zoom level of the graph (default is 1), you can pass also a place used to pivot
     * the zoom
     * @method setZoom
     * @memberOf LGraphCanvas
     * */
    setZoom(value, zoomingCenter) {
        this.ds.changeScale(value, zoomingCenter);
        this.dirty_canvas = true;
        this.dirty_bgcanvas = true;
    }

    /**
     * converts a coordinate from graph coordinates to canvas2D coordinates
     * @method convertOffsetToCanvas
     * @memberOf LGraphCanvas
     * */
    convertOffsetToCanvas(pos) {
        return this.ds.convertOffsetToCanvas(pos);
    }

    /**
     * converts a coordinate from Canvas2D coordinates to graph space
     * @method convertCanvasToOffset
     * @memberOf LGraphCanvas
     * */
    convertCanvasToOffset(pos, out) {
        return this.ds.convertCanvasToOffset(pos, out);
    }

    /**
     * converts event coordinates from canvas2D to graph coordinates
     * @method convertEventToCanvasOffset
     * @param e
     * @returns {Array}
     * @memberOf LGraphCanvas
     */
    convertEventToCanvasOffset(e) {
        const rect = this.canvas.getBoundingClientRect();
        return this.convertCanvasToOffset([e.clientX - rect.left, e.clientY - rect.top]);
    }

    /**
     * brings a node to front (above all other nodes)
     * @method bringToFront
     * @param {LGraphNode} node
     * @memberOf LGraphCanvas
     * */
    bringToFront(node) {
        const i = this.graph._nodes.indexOf(node);
        if (i === -1) {
            return;
        }

        this.graph._nodes.splice(i, 1);
        this.graph._nodes.push(node);
    }

    /**
     * sends a node to the back (below all other nodes)
     * @method sendToBack
     * @param {LGraphNode} node
     * @memberOf LGraphCanvas
     * */
    sendToBack(node) {
        const i = this.graph._nodes.indexOf(node);
        if (i === -1) {
            return;
        }

        this.graph._nodes.splice(i, 1);
        this.graph._nodes.unshift(node);
    }

    /**
     * checks which nodes are visible (inside the camera area)
     * @method computeVisibleNodes
     * @param {LGraphNode[]} [nodes]
     * @param {LGraphNode[]} [out]
     * @return {LGraphNode[]}
     * @memberOf LGraphCanvas
     * */
    computeVisibleNodes(nodes, out = []) {
        const visibleNodes = out;
        nodes = this.graph._nodes;
        visibleNodes.length = 0;
        for (const n of nodes) {
            // skip rendering nodes in live mode
            if (this.live_mode && !n.onDrawBackground && !n.onDrawForeground) {
                continue;
            }

            if (!overlapBounding(this.visible_area, n.getBounding(temp))) {
                continue;
            } // out of the visible area

            visibleNodes.push(n);
        }
        return visibleNodes;
    }

    /**
     * renders the whole canvas content, by rendering in two separated canvas, one containing the
     * background grid and the connections, and one containing the nodes)
     * @method draw
     * @param {boolean} [force_canvas]
     * @param {boolean} [force_bgcanvas]
     * @memberOf LGraphCanvas
     * */
    draw(force_canvas, force_bgcanvas) {
        if (!this.canvas || this.canvas.width === 0 || this.canvas.height === 0) return;

        // fps counting
        const now = getTime();
        this.render_time = (now - this.last_draw_time) * 0.001;
        this.last_draw_time = now;

        if (this.graph) this.ds.computeVisibleArea();

        if (
            this.dirty_bgcanvas
            || force_bgcanvas
            || this.always_render_background
            || (this.graph
            && this.graph._last_trigger_time
            && now - this.graph._last_trigger_time < 1000)
        ) this.drawBackCanvas();

        if (this.dirty_canvas || force_canvas) this.drawFrontCanvas();

        this.fps = this.render_time ? 1.0 / this.render_time : 0;
        this.frame += 1;
    }

    /**
     * draws the front canvas (the one containing all the nodes)
     * @method drawFrontCanvas
     * @memberOf LGraphCanvas
     * */
    drawFrontCanvas() {
        this.dirty_canvas = false;

        if (!this.ctx) this.ctx = this.bgcanvas.getContext("2d");
        const { ctx } = this;
        if (!ctx) return;

        if (ctx.start2D) {
            ctx.start2D();
        }

        const { canvas } = this;

        // reset in case of error
        ctx.restore();
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // clip dirty area if there is one, otherwise work in full canvas
        if (this.dirty_area) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(
                this.dirty_area[0],
                this.dirty_area[1],
                this.dirty_area[2],
                this.dirty_area[3],
            );
            ctx.clip();
        }

        if (this.clear_background) ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw bg canvas
        if (this.bgcanvas === this.canvas) {
            this.drawBackCanvas();
        } else {
            ctx.drawImage(this.bgcanvas, 0, 0);
        }

        // rendering
        if (this.onRender) this.onRender(canvas, ctx);

        // info widget
        if (this.show_info) this.renderInfo(ctx);

        if (this.graph) {
            // apply transformations
            ctx.save();
            this.ds.toCanvasContext(ctx);

            // draw nodes
            let drawnNodes = 0;
            const visibleNodes = this.computeVisibleNodes(null, this.visible_nodes);

            for (const node of visibleNodes) {
                // transform coords system
                ctx.save();
                ctx.translate(node.pos[0], node.pos[1]);

                // Draw
                this.drawNode(node, ctx);
                drawnNodes += 1;

                // Restore
                ctx.restore();
            }

            // on top (debug)
            if (this.render_execution_order) this.drawExecutionOrder(ctx);

            // connections ontop?
            if (this.graph.config.links_ontop && !this.live_mode) this.drawConnections(ctx);

            // current connection (the one being dragged by the mouse)
            if (this.connecting_pos) {
                ctx.lineWidth = this.connections_width;
                let linkColor = null;
                switch (this.connecting_output.type) {
                    case defaultConfig.EVENT:
                        linkColor = defaultConfig.EVENT_LINK_COLOR;
                        break;
                    default:
                        linkColor = defaultConfig.CONNECTING_LINK_COLOR;
                }

                // the connection being dragged by the mouse
                this.renderLink(
                    ctx,
                    this.connecting_pos,
                    [this.graph_mouse[0], this.graph_mouse[1]],
                    null,
                    false,
                    null,
                    linkColor,
                    this.connecting_output.dir
                    || (this.connecting_node.horizontal ? defaultConfig.DOWN : defaultConfig.RIGHT),
                    defaultConfig.CENTER,
                );

                ctx.beginPath();
                if (
                    this.connecting_output.type === defaultConfig.EVENT
                    || this.connecting_output.shape === defaultConfig.BOX_SHAPE
                ) {
                    ctx.rect(
                        this.connecting_pos[0] - 6 + 0.5,
                        this.connecting_pos[1] - 5 + 0.5,
                        14,
                        10,
                    );
                } else {
                    ctx.arc(
                        this.connecting_pos[0],
                        this.connecting_pos[1],
                        4,
                        0,
                        Math.PI * 2,
                    );
                }
                ctx.fill();

                ctx.fillStyle = "#ffcc00";
                if (this._highlight_input) {
                    ctx.beginPath();
                    ctx.arc(
                        this._highlight_input[0],
                        this._highlight_input[1],
                        6,
                        0,
                        Math.PI * 2,
                    );
                    ctx.fill();
                }
            }

            // the selection rectangle
            if (this.dragging_rectangle) {
                ctx.strokeStyle = "#FFF";
                ctx.strokeRect(
                    this.dragging_rectangle[0],
                    this.dragging_rectangle[1],
                    this.dragging_rectangle[2],
                    this.dragging_rectangle[3],
                );
            }

            // on top of link center
            if (this.over_link_center && this.render_link_tooltip) {
                this.drawLinkTooltip(ctx, this.over_link_center);
            } else if (this.onDrawLinkTooltip) {
                this.onDrawLinkTooltip(ctx, null);
            }

            // custom info
            if (this.onDrawForeground) {
                this.onDrawForeground(ctx, this.visible_rect);
            }

            ctx.restore();
        }

        // draws panel in the corner
        if (this._graph_stack && this._graph_stack.length) this.drawSubgraphPanel(ctx);

        if (this.onDrawOverlay) this.onDrawOverlay(ctx);

        if (this.dirty_area) ctx.restore();

        if (ctx.finish2D) ctx.finish2D();
    }

    /**
     * draws the panel in the corner that shows subgraph properties
     * @method drawSubgraphPanel
     * @memberOf LGraphCanvas
     * */
    drawSubgraphPanel(ctx) {
        const subgraph = this.graph;
        const subnode = subgraph._subgraph_node;
        if (!subnode) {
            console.warn("subgraph without subnode");
            return;
        }

        const num = subnode.inputs ? subnode.inputs.length : 0;
        const w = 300;
        const h = Math.floor(defaultConfig.NODE_SLOT_HEIGHT * 1.6);

        ctx.fillStyle = "#111";
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.roundRect(10, 10, w, (num + 1) * h + 50, 8);
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.fillStyle = "#888";
        ctx.font = "14px Arial";
        ctx.textAlign = "left";
        ctx.fillText("Graph Inputs", 20, 34);

        if (this.drawButton(w - 20, 20, 20, 20, "X", "#151515")) {
            this.closeSubgraph();
            return;
        }

        let y = 50;
        ctx.font = "20px Arial";
        if (subnode.inputs) {
            for (const input of subnode.inputs) {
                if (input.not_subgraph_input) continue;

                // input button clicked
                if (this.drawButton(20, y + 2, w - 20, h - 2)) {
                    const type = subnode.constructor.input_node_type || "graph/input";
                    this.graph.beforeChange();
                    const newnode = createNode(type);
                    if (newnode) {
                        subgraph.add(newnode);
                        this.block_click = false;
                        this.last_click_position = null;
                        this.selectNodes([newnode]);
                        this.node_dragged = newnode;
                        this.dragging_canvas = false;
                        newnode.setProperty("name", input.name);
                        newnode.setProperty("type", input.type);
                        this.node_dragged.pos[0] = this.graph_mouse[0] - 5;
                        this.node_dragged.pos[1] = this.graph_mouse[1] - 5;
                        this.graph.afterChange();
                    } else {
                        console.error("graph input node not found:", type);
                    }
                }

                ctx.fillStyle = "#9C9";
                ctx.beginPath();
                ctx.arc(w - 16, y + h * 0.5, 5, 0, 2 * Math.PI);
                ctx.fill();

                ctx.fillStyle = "#AAA";
                ctx.fillText(input.name, 50, y + h * 0.75);
                const tw = ctx.measureText(input.name);
                ctx.fillStyle = "#777";
                ctx.fillText(input.type, 50 + tw.width + 10, y + h * 0.75);

                y += h;
            }
        }

        // add + button
        if (this.drawButton(20, y + 2, w - 20, h - 2, "+", "#151515", "#222")) {
            this.showSubgraphPropertiesDialog(subnode);
        }
    }

    /**
     * Draws a button into the canvas overlay and computes if it was clicked using the immediate
     * gui paradigm
     * @method drawButton
     * @param x
     * @param y
     * @param w
     * @param h
     * @param text
     * @param [bgcolor]
     * @param [hovercolor]
     * @param [textcolor]
     * @returns {*|boolean}
     * @memberOf LGraphCanvas
     */
    drawButton(x, y, w, h, text, bgcolor = defaultConfig.NODE_DEFAULT_COLOR, hovercolor = "#555", textcolor = defaultConfig.NODE_TEXT_COLOR) {
        const { ctx } = this;

        let pos = this.mouse;
        const hover = isInsideRectangle(pos[0], pos[1], x, y, w, h);
        pos = this.last_click_position;
        const clicked = pos && isInsideRectangle(pos[0], pos[1], x, y, w, h);

        ctx.fillStyle = hover ? hovercolor : bgcolor;
        if (clicked) ctx.fillStyle = "#AAA";
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 4);
        ctx.fill();

        if (text) {
            if (text.constructor === String) {
                ctx.fillStyle = textcolor;
                ctx.textAlign = "center";
                // eslint-disable-next-line
                ctx.font = `${(h * 0.65) | 0}px Arial`;
                ctx.fillText(text, x + w * 0.5, y + h * 0.75);
                ctx.textAlign = "left";
            }
        }

        if (clicked) this.blockClick();
        return clicked && !this.block_click;
    }

    isAreaClicked(x, y, w, h, holdClick) {
        const pos = this.last_click_position;
        const clicked = pos && isInsideRectangle(pos[0], pos[1], x, y, w, h);
        if (clicked && holdClick) this.blockClick();
        return clicked && !this.block_click;
    }

    /**
     * draws some useful stats in the corner of the canvas
     * @method renderInfo
     * @memberOf LGraphCanvas
     * */
    renderInfo(ctx, x = 10, y = this.canvas.height - 80) {
        ctx.save();
        ctx.translate(x, y);

        ctx.font = "10px Arial";
        ctx.fillStyle = "#888";
        if (this.graph) {
            ctx.fillText(`T: ${this.graph.globaltime.toFixed(2)}s`, 5, 13);
            ctx.fillText(`I: ${this.graph.iteration}`, 5, 13 * 2);
            ctx.fillText(`N: ${this.graph._nodes.length} [${this.visible_nodes.length}]`, 5, 13 * 3);
            ctx.fillText(`V: ${this.graph._version}`, 5, 13 * 4);
            ctx.fillText(`FPS:${this.fps.toFixed(2)}`, 5, 13 * 5);
        } else {
            ctx.fillText("No graph selected", 5, 13);
        }
        ctx.restore();
    }

    /**
     * draws the back canvas (the one containing the background and the connections)
     * @method drawBackCanvas
     * @memberOf LGraphCanvas
     * */
    drawBackCanvas() {
        const canvas = this.bgcanvas;
        if (canvas.width !== this.canvas.width || canvas.height !== this.canvas.height) {
            canvas.width = this.canvas.width;
            canvas.height = this.canvas.height;
        }

        if (!this.bgctx) this.bgctx = this.bgcanvas.getContext("2d");
        const ctx = this.bgctx;
        if (ctx.start) ctx.start();

        // clear
        if (this.clear_background) ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (this._graph_stack && this._graph_stack.length) {
            ctx.save();
            const subgraphNode = this.graph._subgraph_node;
            ctx.strokeStyle = subgraphNode.bgcolor;
            ctx.lineWidth = 10;
            ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
            ctx.lineWidth = 1;
            ctx.font = "40px Arial";
            ctx.textAlign = "center";
            ctx.fillStyle = subgraphNode.bgcolor || "#AAA";
            let title = "";

            for (const g of this._graph_stack) {
                title += `${g._subgraph_node.getTitle()} >> `;
            }

            ctx.fillText(
                title + subgraphNode.getTitle(),
                canvas.width * 0.5,
                40,
            );
            ctx.restore();
        }

        let bgAlreadyPainted = false;
        if (this.onRenderBackground) {
            bgAlreadyPainted = this.onRenderBackground(canvas, ctx);
        }

        // reset in case of error
        ctx.restore();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.visible_links.length = 0;

        if (this.graph) {
            // apply transformations
            ctx.save();
            this.ds.toCanvasContext(ctx);

            // render BG
            if (this.background_image && this.ds.scale > 0.5 && !bgAlreadyPainted) {
                ctx.globalAlpha = this.zoom_modify_alpha
                    ? (1.0 - 0.5 / this.ds.scale) * this.editor_alpha
                    : this.editor_alpha;

                ctx.imageSmoothingEnabled = false;
                ctx.mozImageSmoothingEnabled = false;
                ctx.imageSmoothingEnabled = false;
                if (
                    !this._bg_img
                    || this._bg_img.id !== this.background_image
                ) {
                    this._bg_img = new Image();
                    this._bg_img.id = this.background_image;
                    this._bg_img.src = this.background_image;
                    this._bg_img.onload = () => this.draw(true, true);
                }

                let pattern = null;
                if (this._pattern == null && this._bg_img.width > 0) {
                    pattern = ctx.createPattern(this._bg_img, "repeat");
                    this._pattern_img = this._bg_img;
                    this._pattern = pattern;
                } else {
                    pattern = this._pattern;
                }
                if (pattern) {
                    ctx.fillStyle = pattern;
                    ctx.fillRect(
                        this.visible_area[0],
                        this.visible_area[1],
                        this.visible_area[2],
                        this.visible_area[3],
                    );
                    ctx.fillStyle = "transparent";
                }

                ctx.globalAlpha = 1.0;
                ctx.imageSmoothingEnabled = true;
                ctx.mozImageSmoothingEnabled = true;
                ctx.imageSmoothingEnabled = true;
            }

            // groups
            if (this.graph._groups.length && !this.live_mode) this.drawGroups(canvas, ctx);

            if (this.onDrawBackground) this.onDrawBackground(ctx, this.visible_area);

            // bg
            if (this.render_canvas_border) {
                ctx.strokeStyle = "#235";
                ctx.strokeRect(0, 0, canvas.width, canvas.height);
            }

            if (this.render_connections_shadows) {
                ctx.shadowColor = "#000";
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = 6;
            } else {
                ctx.shadowColor = "rgba(0,0,0,0)";
            }

            // draw connections
            if (!this.live_mode) this.drawConnections(ctx);

            ctx.shadowColor = "rgba(0,0,0,0)";

            ctx.restore();
        }

        if (ctx.finish) ctx.finish();

        this.dirty_bgcanvas = false;
        this.dirty_canvas = true; // to force to repaint the front canvas with the bgcanvas
    }

    /**
     * draws the given node inside the canvas
     * @method drawNode
     * @memberOf LGraphCanvas
     * */
    drawNode(node, ctx) {
        let glow = false;
        this.current_node = node;

        const color = node.color || node.constructor.color || defaultConfig.NODE_DEFAULT_COLOR;
        let bgcolor = node.bgcolor || node.constructor.bgcolor || defaultConfig.NODE_DEFAULT_BGCOLOR;

        // shadow and glow
        if (node.mouseOver) glow = true;

        const lowQuality = this.ds.scale < 0.6; // zoomed out

        // only render if it forces it to do it
        if (this.live_mode) {
            if (!node.flags.collapsed) {
                ctx.shadowColor = "transparent";
                if (node.onDrawForeground) {
                    node.onDrawForeground(ctx, this, this.canvas);
                }
            }
            return;
        }

        ctx.globalAlpha = this.editor_alpha;

        if (this.render_shadows && !lowQuality) {
            ctx.shadowColor = defaultConfig.DEFAULT_SHADOW_COLOR;
            ctx.shadowOffsetX = 2 * this.ds.scale;
            ctx.shadowOffsetY = 2 * this.ds.scale;
            ctx.shadowBlur = 3 * this.ds.scale;
        } else {
            ctx.shadowColor = "transparent";
        }

        // custom draw collapsed method (draw after shadows because they are affected)
        if (node.flags.collapsed
            && node.onDrawCollapsed
            && node.onDrawCollapsed(ctx, this) == true
        ) {
            return;
        }

        // clip if required (mask)
        const shape = node._shape || defaultConfig.BOX_SHAPE;
        const size = tempVC2;
        tempVC2.set(node.size);
        const { horizontal } = node; // || node.flags.horizontal;

        if (node.flags.collapsed) {
            ctx.font = this.inner_text_font;
            const title = node.getTitle ? node.getTitle() : node.title;
            if (title) {
                node._collapsed_width = Math.min(
                    node.size[0],
                    ctx.measureText(title).width
                    + defaultConfig.NODE_TITLE_HEIGHT * 2,
                ); // LiteGraph.NODE_COLLAPSED_WIDTH;
                size[0] = node._collapsed_width;
                size[1] = 0;
            }
        }

        if (node.clip_area) {
            // Start clipping
            ctx.save();
            ctx.beginPath();
            if (shape === defaultConfig.BOX_SHAPE) ctx.rect(0, 0, size[0], size[1]);
            else if (shape === defaultConfig.ROUND_SHAPE) ctx.roundRect(0, 0, size[0], size[1], 10);
            else if (shape === defaultConfig.CIRCLE_SHAPE) {
                ctx.arc(
                    size[0] * 0.5,
                    size[1] * 0.5,
                    size[0] * 0.5,
                    0,
                    Math.PI * 2,
                );
            }
            ctx.clip();
        }

        // draw shape
        if (node.has_errors) bgcolor = "red";
        this.drawNodeShape(
            node,
            ctx,
            size,
            color,
            bgcolor,
            node.is_selected,
            node.mouseOver,
        );
        ctx.shadowColor = "transparent";

        // draw foreground
        if (node.onDrawForeground) {
            node.onDrawForeground(ctx, this, this.canvas);
        }

        // connection slots
        ctx.textAlign = horizontal ? "center" : "left";
        ctx.font = this.inner_text_font;

        const renderText = !lowQuality;

        const outSlot = this.connecting_output;
        ctx.lineWidth = 1;

        let maxY = 0;
        const slotPos = new Float32Array(2); // to reuse

        // render inputs and outputs
        if (!node.flags.collapsed) {
            // input connection slots
            if (node.inputs) {
                for (let i = 0; i < node.inputs.length; i++) {
                    const slot = node.inputs[i];

                    ctx.globalAlpha = this.editor_alpha;
                    // change opacity of incompatible slots when dragging a connection
                    if (this.connecting_node
                        && !isValidConnection(slot.type, outSlot.type)) {
                        ctx.globalAlpha = 0.4 * this.editor_alpha;
                    }

                    ctx.fillStyle = slot.link
                        ? slot.color_on
                        || this.default_connection_color.input_on
                        : slot.color_off
                        || this.default_connection_color.input_off;

                    const pos = node.getConnectionPos(true, i, slotPos);
                    pos[0] -= node.pos[0];
                    pos[1] -= node.pos[1];
                    if (maxY < pos[1] + defaultConfig.NODE_SLOT_HEIGHT * 0.5) {
                        maxY = pos[1] + defaultConfig.NODE_SLOT_HEIGHT * 0.5;
                    }

                    ctx.beginPath();

                    if (slot.type === defaultConfig.EVENT || slot.shape === defaultConfig.BOX_SHAPE) {
                        if (horizontal) ctx.rect(pos[0] - 5 + 0.5, pos[1] - 8 + 0.5, 10, 14);
                        else ctx.rect(pos[0] - 6 + 0.5, pos[1] - 5 + 0.5, 14, 10);
                    } else if (slot.shape === defaultConfig.ARROW_SHAPE) {
                        ctx.moveTo(pos[0] + 8, pos[1] + 0.5);
                        ctx.lineTo(pos[0] - 4, pos[1] + 6 + 0.5);
                        ctx.lineTo(pos[0] - 4, pos[1] - 6 + 0.5);
                        ctx.closePath();
                    } else if (lowQuality) {
                        ctx.rect(pos[0] - 4, pos[1] - 4, 8, 8);
                    } else {
                        ctx.arc(pos[0], pos[1], 4, 0, Math.PI * 2);
                    }
                    ctx.fill();

                    // render name
                    if (renderText) {
                        const text = slot.label ? slot.label : slot.name;
                        if (text) {
                            ctx.fillStyle = defaultConfig.NODE_TEXT_COLOR;
                            if (horizontal || slot.dir === defaultConfig.UP) {
                                ctx.fillText(text, pos[0], pos[1] - 10);
                            } else {
                                ctx.fillText(text, pos[0] + 10, pos[1] + 5);
                            }
                        }
                    }
                }
            }

            // output connection slots
            if (this.connecting_node) {
                ctx.globalAlpha = 0.4 * this.editor_alpha;
            }

            ctx.textAlign = horizontal ? "center" : "right";
            ctx.strokeStyle = "black";
            if (node.outputs) {
                for (let i = 0; i < node.outputs.length; i++) {
                    const slot = node.outputs[i];

                    const pos = node.getConnectionPos(false, i, slotPos);
                    pos[0] -= node.pos[0];
                    pos[1] -= node.pos[1];
                    if (maxY < pos[1] + defaultConfig.NODE_SLOT_HEIGHT * 0.5) {
                        maxY = pos[1] + defaultConfig.NODE_SLOT_HEIGHT * 0.5;
                    }

                    ctx.fillStyle = slot.links && slot.links.length
                        ? slot.color_on
                        || this.default_connection_color.output_on
                        : slot.color_off
                        || this.default_connection_color.output_off;
                    ctx.beginPath();
                    // ctx.rect( node.size[0] - 14,i*14,10,10);

                    if (
                        slot.type === defaultConfig.EVENT
                        || slot.shape === defaultConfig.BOX_SHAPE
                    ) {
                        if (horizontal) {
                            ctx.rect(
                                pos[0] - 5 + 0.5,
                                pos[1] - 8 + 0.5,
                                10,
                                14,
                            );
                        } else {
                            ctx.rect(
                                pos[0] - 6 + 0.5,
                                pos[1] - 5 + 0.5,
                                14,
                                10,
                            );
                        }
                    } else if (slot.shape === defaultConfig.ARROW_SHAPE) {
                        ctx.moveTo(pos[0] + 8, pos[1] + 0.5);
                        ctx.lineTo(pos[0] - 4, pos[1] + 6 + 0.5);
                        ctx.lineTo(pos[0] - 4, pos[1] - 6 + 0.5);
                        ctx.closePath();
                    } else if (lowQuality) {
                        ctx.rect(pos[0] - 4, pos[1] - 4, 8, 8);
                    } else {
                        ctx.arc(pos[0], pos[1], 4, 0, Math.PI * 2);
                    }

                    ctx.fill();
                    if (!lowQuality) ctx.stroke();

                    // render output name
                    if (renderText) {
                        const text = slot.label != null ? slot.label : slot.name;
                        if (text) {
                            ctx.fillStyle = defaultConfig.NODE_TEXT_COLOR;
                            if (horizontal || slot.dir === defaultConfig.DOWN) {
                                ctx.fillText(text, pos[0], pos[1] - 8);
                            } else {
                                ctx.fillText(text, pos[0] - 10, pos[1] + 5);
                            }
                        }
                    }
                }
            }

            ctx.textAlign = "left";
            ctx.globalAlpha = 1;

            if (node.widgets) {
                let widgetsY = maxY;
                if (horizontal || node.widgets_up) widgetsY = 2;
                if (node.widgets_start_y) widgetsY = node.widgets_start_y;
                this.drawNodeWidgets(
                    node,
                    widgetsY,
                    ctx,
                    this.node_widget && this.node_widget[0] === node ? this.node_widget[1] : null,
                );
            }
        } else if (this.render_collapsed_slots) {
            // if collapsed
            let inputSlot = null;
            let outputSlot = null;
            let storedSlot;

            // get first connected slot to render
            if (node.inputs) {
                for (const slot of node.inputs) {
                    if (slot.link == null) continue;
                    inputSlot = slot;
                    storedSlot = slot;
                    break;
                }
            }
            if (node.outputs) {
                for (const slot of node.outputs) {
                    if (!slot.links || !slot.links.length) continue;
                    outputSlot = slot;
                    storedSlot = slot;
                }
            }

            if (inputSlot) {
                let x = 0;
                let y = defaultConfig.NODE_TITLE_HEIGHT * -0.5; // center
                if (horizontal) {
                    x = node._collapsed_width * 0.5;
                    y = -defaultConfig.NODE_TITLE_HEIGHT;
                }
                ctx.fillStyle = "#686";
                ctx.beginPath();
                if (storedSlot.type === defaultConfig.EVENT
                    || storedSlot.shape === defaultConfig.BOX_SHAPE) {
                    ctx.rect(x - 7 + 0.5, y - 4, 14, 8);
                } else if (storedSlot.shape === defaultConfig.ARROW_SHAPE) {
                    ctx.moveTo(x + 8, y);
                    ctx.lineTo(x + -4, y - 4);
                    ctx.lineTo(x + -4, y + 4);
                    ctx.closePath();
                } else ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();
            }

            if (outputSlot) {
                let x = node._collapsed_width;
                let y = defaultConfig.NODE_TITLE_HEIGHT * -0.5; // center
                if (horizontal) {
                    x = node._collapsed_width * 0.5;
                    y = 0;
                }
                ctx.fillStyle = "#686";
                ctx.strokeStyle = "black";
                ctx.beginPath();
                if (
                    storedSlot.type === defaultConfig.EVENT
                    || storedSlot.shape === defaultConfig.BOX_SHAPE
                ) {
                    ctx.rect(x - 7 + 0.5, y - 4, 14, 8);
                } else if (slot.shape === defaultConfig.ARROW_SHAPE) {
                    ctx.moveTo(x + 6, y);
                    ctx.lineTo(x - 6, y - 4);
                    ctx.lineTo(x - 6, y + 4);
                    ctx.closePath();
                } else ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();
                // ctx.stroke();
            }
        }

        if (node.clip_area) ctx.restore();

        ctx.globalAlpha = 1.0;
    }

    // used by this.over_link_center
    drawLinkTooltip(ctx, link) {
        const pos = link._pos;
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(pos[0], pos[1], 3, 0, Math.PI * 2);
        ctx.fill();

        if (link.data == null) return;

        if (this.onDrawLinkTooltip && this.onDrawLinkTooltip(ctx, link, this)) return;

        const { data } = link;
        let text;

        if (data.constructor === Number) text = data.toFixed(2);
        else if (data.constructor === String) text = `"${data}"`;
        else if (data.constructor === Boolean) text = String(data);
        else if (data.toToolTip) text = data.toToolTip();
        else text = `[${data.constructor.name}]`;

        if (!text) return;
        text = text.substr(0, 30); // avoid weird

        ctx.font = "14px Courier New";
        const info = ctx.measureText(text);
        const w = info.width + 20;
        const h = 24;
        ctx.shadowColor = "black";
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 3;
        ctx.fillStyle = "#454";
        ctx.beginPath();
        ctx.roundRect(pos[0] - w * 0.5, pos[1] - 15 - h, w, h, 3, 3);
        ctx.moveTo(pos[0] - 10, pos[1] - 15);
        ctx.lineTo(pos[0] + 10, pos[1] - 15);
        ctx.lineTo(pos[0], pos[1] - 5);
        ctx.fill();
        ctx.shadowColor = "transparent";
        ctx.textAlign = "center";
        ctx.fillStyle = "#CEC";
        ctx.fillText(text, pos[0], pos[1] - 15 - h * 0.3);
    }

    /**
     * draws the shape of the given node in the canvas
     * @method drawNodeShape
     * @memberOf LGraphCanvas
     * */
    drawNodeShape(
        node,
        ctx,
        size,
        fgcolor,
        bgcolor,
        selected,
        mouseHover,
    ) {
        // bg rect
        ctx.strokeStyle = fgcolor;
        ctx.fillStyle = bgcolor;

        const titleHeight = defaultConfig.NODE_TITLE_HEIGHT;
        const lowQuality = this.ds.scale < 0.5;

        // render node area depending on shape
        const shape = node._shape || node.constructor.shape || defaultConfig.ROUND_SHAPE;

        const { title_mode } = node.constructor;

        let renderTitle = true;
        if (title_mode === defaultConfig.TRANSPARENT_TITLE) renderTitle = false;
        else if (title_mode === defaultConfig.AUTOHIDE_TITLE && mouseHover) renderTitle = true;

        const area = tempArea;
        area[0] = 0; // x
        area[1] = renderTitle ? -titleHeight : 0; // y
        area[2] = size[0] + 1; // w
        area[3] = renderTitle ? size[1] + titleHeight : size[1]; // h

        const oldAlpha = ctx.globalAlpha;

        ctx.beginPath();
        if (shape === defaultConfig.BOX_SHAPE || lowQuality) {
            ctx.fillRect(area[0], area[1], area[2], area[3]);
        } else if (shape === defaultConfig.ROUND_SHAPE || shape === defaultConfig.CARD_SHAPE) {
            ctx.roundRect(
                area[0],
                area[1],
                area[2],
                area[3],
                this.round_radius,
                shape === defaultConfig.CARD_SHAPE ? 0 : this.round_radius,
            );
        } else if (shape === defaultConfig.CIRCLE_SHAPE) {
            ctx.arc(
                size[0] * 0.5,
                size[1] * 0.5,
                size[0] * 0.5,
                0,
                Math.PI * 2,
            );
        }
        ctx.fill();

        // separator
        if (!node.flags.collapsed) {
            ctx.shadowColor = "transparent";
            ctx.fillStyle = "rgba(0,0,0,0.2)";
            ctx.fillRect(0, -1, area[2], 2);
        }
        ctx.shadowColor = "transparent";

        if (node.onDrawBackground) node.onDrawBackground(ctx, this, this.canvas, this.graph_mouse);

        // title bg (remember, it is rendered ABOVE the node)
        if (renderTitle || title_mode === defaultConfig.TRANSPARENT_TITLE) {
            // title bar
            if (node.onDrawTitleBar) {
                node.onDrawTitleBar(ctx, titleHeight, size, this.ds.scale, fgcolor);
            } else if (
                title_mode !== defaultConfig.TRANSPARENT_TITLE
                && (node.constructor.title_color || this.render_title_colored)
            ) {
                const titleColor = node.constructor.title_color || fgcolor;

                if (node.flags.collapsed) {
                    ctx.shadowColor = defaultConfig.DEFAULT_SHADOW_COLOR;
                }

                //* gradient test
                if (this.use_gradients) {
                    let grad = LGraphCanvas.gradients[titleColor];
                    if (!grad) {
                        grad = ctx.createLinearGradient(0, 0, 400, 0);
                        LGraphCanvas.gradients[titleColor] = grad;
                        grad.addColorStop(0, titleColor);
                        grad.addColorStop(1, "#000");
                    }
                    ctx.fillStyle = grad;
                } else {
                    ctx.fillStyle = titleColor;
                }

                // ctx.globalAlpha = 0.5 * old_alpha;
                ctx.beginPath();
                if (shape === defaultConfig.BOX_SHAPE || lowQuality) {
                    ctx.rect(0, -titleHeight, size[0] + 1, titleHeight);
                } else if (shape === defaultConfig.ROUND_SHAPE || shape === defaultConfig.CARD_SHAPE) {
                    ctx.roundRect(
                        0,
                        -titleHeight,
                        size[0] + 1,
                        titleHeight,
                        this.round_radius,
                        node.flags.collapsed ? this.round_radius : 0,
                    );
                }
                ctx.fill();
                ctx.shadowColor = "transparent";
            }

            // title box
            const boxSize = 10;
            if (node.onDrawTitleBox) {
                node.onDrawTitleBox(ctx, titleHeight, size, this.ds.scale);
            } else if ([defaultConfig.ROUND_SHAPE, defaultConfig.CIRCLE_SHAPE, defaultConfig.CARD_SHAPE].includes(shape)) {
                if (lowQuality) {
                    ctx.fillStyle = "black";
                    ctx.beginPath();
                    ctx.arc(
                        titleHeight * 0.5,
                        titleHeight * -0.5,
                        boxSize * 0.5 + 1,
                        0,
                        Math.PI * 2,
                    );
                    ctx.fill();
                }

                ctx.fillStyle = node.boxcolor || defaultConfig.NODE_DEFAULT_BOXCOLOR;
                if (lowQuality) ctx.fillRect(titleHeight * 0.5 - boxSize * 0.5, titleHeight * -0.5 - boxSize * 0.5, boxSize, boxSize);
                else {
                    ctx.beginPath();
                    ctx.arc(
                        titleHeight * 0.5,
                        titleHeight * -0.5,
                        boxSize * 0.5,
                        0,
                        Math.PI * 2,
                    );
                    ctx.fill();
                }
            } else {
                if (lowQuality) {
                    ctx.fillStyle = "black";
                    ctx.fillRect(
                        (titleHeight - boxSize) * 0.5 - 1,
                        (titleHeight + boxSize) * -0.5 - 1,
                        boxSize + 2,
                        boxSize + 2,
                    );
                }
                ctx.fillStyle = node.boxcolor || defaultConfig.NODE_DEFAULT_BOXCOLOR;
                ctx.fillRect(
                    (titleHeight - boxSize) * 0.5,
                    (titleHeight + boxSize) * -0.5,
                    boxSize,
                    boxSize,
                );
            }
            ctx.globalAlpha = oldAlpha;

            // title text
            if (node.onDrawTitleText) {
                node.onDrawTitleText(
                    ctx,
                    titleHeight,
                    size,
                    this.ds.scale,
                    this.title_text_font,
                    selected,
                );
            }
            if (!lowQuality) {
                ctx.font = this.title_text_font;
                const title = String(node.getTitle());
                if (title) {
                    if (selected) ctx.fillStyle = defaultConfig.NODE_SELECTED_TITLE_COLOR;
                    else ctx.fillStyle = node.constructor.title_text_color || this.node_title_color;
                    if (node.flags.collapsed) {
                        ctx.textAlign = "left";
                        const measure = ctx.measureText(title);
                        ctx.fillText(
                            title.substr(0, 20), // avoid urls too long
                            titleHeight, // + measure.width * 0.5,
                            defaultConfig.NODE_TITLE_TEXT_Y - titleHeight,
                        );
                        ctx.textAlign = "left";
                    } else {
                        ctx.textAlign = "left";
                        ctx.fillText(
                            title,
                            titleHeight,
                            defaultConfig.NODE_TITLE_TEXT_Y - titleHeight,
                        );
                    }
                }
            }

            // subgraph box
            if (!node.flags.collapsed && node.subgraph && !node.skip_subgraph_button) {
                const w = defaultConfig.NODE_TITLE_HEIGHT;
                const x = node.size[0] - w;
                const over = isInsideRectangle(
                    this.graph_mouse[0] - node.pos[0],
                    this.graph_mouse[1] - node.pos[1],
                    x + 2,
                    -w + 2,
                    w - 4,
                    w - 4,
                );
                ctx.fillStyle = over ? "#888" : "#555";
                if (shape === defaultConfig.BOX_SHAPE || lowQuality) {
                    ctx.fillRect(x + 2, -w + 2, w - 4, w - 4);
                } else {
                    ctx.beginPath();
                    ctx.roundRect(x + 2, -w + 2, w - 4, w - 4, 4);
                    ctx.fill();
                }
                ctx.fillStyle = "#333";
                ctx.beginPath();
                ctx.moveTo(x + w * 0.2, -w * 0.6);
                ctx.lineTo(x + w * 0.8, -w * 0.6);
                ctx.lineTo(x + w * 0.5, -w * 0.3);
                ctx.fill();
            }

            // custom title render
            if (node.onDrawTitle) node.onDrawTitle(ctx);
        }

        // render selection marker
        if (selected) {
            if (node.onBounding) node.onBounding(area);

            if (title_mode === defaultConfig.TRANSPARENT_TITLE) {
                area[1] -= titleHeight;
                area[3] += titleHeight;
            }
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            if (shape === defaultConfig.BOX_SHAPE) {
                ctx.rect(
                    -6 + area[0],
                    -6 + area[1],
                    12 + area[2],
                    12 + area[3],
                );
            } else if (
                shape === defaultConfig.ROUND_SHAPE
                || (shape === defaultConfig.CARD_SHAPE && node.flags.collapsed)
            ) {
                ctx.roundRect(
                    -6 + area[0],
                    -6 + area[1],
                    12 + area[2],
                    12 + area[3],
                    this.round_radius * 2,
                );
            } else if (shape === defaultConfig.CARD_SHAPE) {
                ctx.roundRect(
                    -6 + area[0],
                    -6 + area[1],
                    12 + area[2],
                    12 + area[3],
                    this.round_radius * 2,
                    2,
                );
            } else if (shape === defaultConfig.CIRCLE_SHAPE) {
                ctx.arc(
                    size[0] * 0.5,
                    size[1] * 0.5,
                    size[0] * 0.5 + 6,
                    0,
                    Math.PI * 2,
                );
            }
            ctx.strokeStyle = defaultConfig.NODE_BOX_OUTLINE_COLOR;
            ctx.stroke();
            ctx.strokeStyle = fgcolor;
            ctx.globalAlpha = 1;
        }
    }

    /**
     * draws every connection visible in the canvas
     * OPTIMIZE THIS: pre-catch connections position instead of recomputing them every time
     * @method drawConnections
     * @memberOf LGraphCanvas
     * */
    drawConnections(ctx) {
        const now = getTime();
        const { visible_area } = this;
        marginArea[0] = visible_area[0] - 20;
        marginArea[1] = visible_area[1] - 20;
        marginArea[2] = visible_area[2] + 40;
        marginArea[3] = visible_area[3] + 40;

        // draw connections
        ctx.lineWidth = this.connections_width;

        ctx.fillStyle = "#AAA";
        ctx.strokeStyle = "#AAA";
        ctx.globalAlpha = this.editor_alpha;
        // for every node
        const nodes = this.graph._nodes;
        for (const node of nodes) {
            // for every input (we render just inputs because it is easier as every slot can only
            // have one input)
            if (!node.inputs || !node.inputs.length) {
                continue;
            }

            for (let i = 0; i < node.inputs.length; ++i) {
                const input = node.inputs[i];
                if (!input || input.link == null) continue;

                const linkId = input.link;
                const link = this.graph.links[linkId];
                if (!link) continue;

                // find link info
                const startNode = this.graph.getNodeById(link.origin_id);
                if (!startNode) continue;

                const startNodeSlot = link.origin_slot;
                let startNodeSlotPos = null;
                if (startNodeSlot === -1) {
                    startNodeSlotPos = [
                        startNode.pos[0] + 10,
                        startNode.pos[1] + 10,
                    ];
                } else {
                    startNodeSlotPos = startNode.getConnectionPos(
                        false,
                        startNodeSlot,
                        tempA,
                    );
                }

                const endNodeSlotPos = node.getConnectionPos(true, i, tempB);

                // compute link bounding
                linkBounding[0] = startNodeSlotPos[0];
                linkBounding[1] = startNodeSlotPos[1];
                linkBounding[2] = endNodeSlotPos[0] - startNodeSlotPos[0];
                linkBounding[3] = endNodeSlotPos[1] - startNodeSlotPos[1];

                if (linkBounding[2] < 0) {
                    linkBounding[0] += linkBounding[2];
                    linkBounding[2] = Math.abs(linkBounding[2]);
                }
                if (linkBounding[3] < 0) {
                    linkBounding[1] += linkBounding[3];
                    linkBounding[3] = Math.abs(linkBounding[3]);
                }

                // skip links outside of the visible area of the canvas
                if (!overlapBounding(linkBounding, marginArea)) {
                    continue;
                }

                const startSlot = startNode.outputs[startNodeSlot];
                const endSlot = node.inputs[i];
                if (!startSlot || !endSlot) continue;
                const startDir = startSlot.dir
                    || (startNode.horizontal ? defaultConfig.DOWN : defaultConfig.RIGHT);
                const endDir = endSlot.dir
                    || (node.horizontal ? defaultConfig.UP : defaultConfig.LEFT);

                this.renderLink(
                    ctx,
                    startNodeSlotPos,
                    endNodeSlotPos,
                    link,
                    false,
                    0,
                    null,
                    startDir,
                    endDir,
                );

                // event triggered rendered on top
                if (link && link._last_time && now - link._last_time < 1000) {
                    const f = 2.0 - (now - link._last_time) * 0.002;
                    const tmp = ctx.globalAlpha;
                    ctx.globalAlpha = tmp * f;
                    this.renderLink(
                        ctx,
                        startNodeSlotPos,
                        endNodeSlotPos,
                        link,
                        true,
                        f,
                        "white",
                        startDir,
                        endDir,
                    );
                    ctx.globalAlpha = tmp;
                }
            }
        }
        ctx.globalAlpha = 1;
    }

    /**
     * draws a link between two points
     * @method renderLink
     * @param {vec2} a start pos
     * @param {vec2} b end pos
     * @param {Object} link the link object with all the link info
     * @param {boolean} skipBorder ignore the shadow of the link
     * @param {boolean} flow show flow animation (for events)
     * @param {string} color the color for the link
     * @param {number} startDir the direction enum
     * @param {number} endDir the direction enum
     * @param {number} numSubline number of sublines (useful to represent vec3 or rgb)
     * @memberOf LGraphCanvas
     * */
    renderLink(
        ctx,
        a,
        b,
        link,
        skipBorder,
        flow,
        color,
        startDir,
        endDir,
        numSubline,
    ) {
        if (link) this.visible_links.push(link);

        // choose color
        if (!color && link) color = link.color || LGraphCanvas.link_type_colors[link.type];
        if (!color) color = this.default_link_color;
        if (link != null && this.highlighted_links[link.id]) color = "#FFF";

        startDir = startDir || defaultConfig.RIGHT;
        endDir = endDir || defaultConfig.LEFT;

        const dist = distance(a, b);

        if (this.render_connections_border && this.ds.scale > 0.6) {
            ctx.lineWidth = this.connections_width + 4;
        }
        ctx.lineJoin = "round";
        numSubline = numSubline || 1;
        if (numSubline > 1) ctx.lineWidth = 0.5;

        // begin line shape
        ctx.beginPath();
        for (let i = 0; i < numSubline; i += 1) {
            const offsety = (i - (numSubline - 1) * 0.5) * 5;

            if (this.links_render_mode === defaultConfig.SPLINE_LINK) {
                ctx.moveTo(a[0], a[1] + offsety);
                let startOffsetX = 0;
                let startOffsetY = 0;
                let endOffsetX = 0;
                let endOffsetY = 0;
                switch (startDir) {
                    case defaultConfig.LEFT:
                        startOffsetX = dist * -0.25;
                        break;
                    case defaultConfig.RIGHT:
                        startOffsetX = dist * 0.25;
                        break;
                    case defaultConfig.UP:
                        startOffsetY = dist * -0.25;
                        break;
                    case defaultConfig.DOWN:
                        startOffsetY = dist * 0.25;
                        break;
                    default:
                        break;
                }
                switch (endDir) {
                    case defaultConfig.LEFT:
                        endOffsetX = dist * -0.25;
                        break;
                    case defaultConfig.RIGHT:
                        endOffsetX = dist * 0.25;
                        break;
                    case defaultConfig.UP:
                        endOffsetY = dist * -0.25;
                        break;
                    case defaultConfig.DOWN:
                        endOffsetY = dist * 0.25;
                        break;
                    default:
                        break;
                }
                ctx.bezierCurveTo(
                    a[0] + startOffsetX,
                    a[1] + startOffsetY + offsety,
                    b[0] + endOffsetX,
                    b[1] + endOffsetY + offsety,
                    b[0],
                    b[1] + offsety,
                );
            } else if (this.links_render_mode === defaultConfig.LINEAR_LINK) {
                ctx.moveTo(a[0], a[1] + offsety);
                let startOffsetX = 0;
                let startOffsetY = 0;
                let endOffsetX = 0;
                let endOffsetY = 0;
                switch (startDir) {
                    case defaultConfig.LEFT:
                        startOffsetX = -1;
                        break;
                    case defaultConfig.RIGHT:
                        startOffsetX = 1;
                        break;
                    case defaultConfig.UP:
                        startOffsetY = -1;
                        break;
                    case defaultConfig.DOWN:
                        startOffsetY = 1;
                        break;
                    default:
                        break;
                }
                switch (endDir) {
                    case defaultConfig.LEFT:
                        endOffsetX = -1;
                        break;
                    case defaultConfig.RIGHT:
                        endOffsetX = 1;
                        break;
                    case defaultConfig.UP:
                        endOffsetY = -1;
                        break;
                    case defaultConfig.DOWN:
                        endOffsetY = 1;
                        break;
                    default:
                        break;
                }
                const l = 15;
                ctx.lineTo(
                    a[0] + startOffsetX * l,
                    a[1] + startOffsetY * l + offsety,
                );
                ctx.lineTo(
                    b[0] + endOffsetX * l,
                    b[1] + endOffsetY * l + offsety,
                );
                ctx.lineTo(b[0], b[1] + offsety);
            } else if (this.links_render_mode === defaultConfig.STRAIGHT_LINK) {
                ctx.moveTo(a[0], a[1]);
                let startX = a[0];
                let startY = a[1];
                let endX = b[0];
                let endY = b[1];

                if (startDir === defaultConfig.RIGHT) startX += 10;
                else startY += 10;
                if (endDir === defaultConfig.LEFT) endX -= 10;
                else endY -= 10;

                ctx.lineTo(startX, startY);
                ctx.lineTo((startX + endX) * 0.5, startY);
                ctx.lineTo((startX + endX) * 0.5, endY);
                ctx.lineTo(endX, endY);
                ctx.lineTo(b[0], b[1]);
            } else return;
        }

        // rendering the outline of the connection can be a little bit slow
        if (this.render_connections_border && this.ds.scale > 0.6 && !skipBorder) {
            ctx.strokeStyle = "rgba(0,0,0,0.5)";
            ctx.stroke();
        }

        ctx.lineWidth = this.connections_width;
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.stroke();
        // end line shape

        const posConnectionPoint = this.computeConnectionPoint(a, b, 0.5, startDir, endDir);
        if (link && link._pos) {
            link._pos[0] = posConnectionPoint[0];
            link._pos[1] = posConnectionPoint[1];
        }

        // render arrow in the middle
        if (this.ds.scale >= 0.6 && this.highquality_render && endDir !== defaultConfig.CENTER) {
            // render arrow
            if (this.render_connection_arrows) {
                // compute two points in the connection
                const posA = this.computeConnectionPoint(a, b, 0.25, startDir, endDir);
                const posB = this.computeConnectionPoint(a, b, 0.26, startDir, endDir);
                const posC = this.computeConnectionPoint(a, b, 0.75, startDir, endDir);
                const posD = this.computeConnectionPoint(a, b, 0.76, startDir, endDir);

                // compute the angle between them so the arrow points in the right direction
                let angleA = 0;
                let angleB = 0;
                if (this.render_curved_connections) {
                    angleA = -Math.atan2(posB[0] - posA[0], posB[1] - posA[1]);
                    angleB = -Math.atan2(posD[0] - posC[0], posD[1] - posC[1]);
                } else angleB = angleA = b[1] > a[1] ? 0 : Math.PI;

                // render arrow
                ctx.save();
                ctx.translate(posA[0], posA[1]);
                ctx.rotate(angleA);
                ctx.beginPath();
                ctx.moveTo(-5, -3);
                ctx.lineTo(0, 7);
                ctx.lineTo(5, -3);
                ctx.fill();
                ctx.restore();
                ctx.save();
                ctx.translate(posC[0], posC[1]);
                ctx.rotate(angleB);
                ctx.beginPath();
                ctx.moveTo(-5, -3);
                ctx.lineTo(0, 7);
                ctx.lineTo(5, -3);
                ctx.fill();
                ctx.restore();
            }

            // circle
            ctx.beginPath();
            ctx.arc(posConnectionPoint[0], posConnectionPoint[1], 5, 0, Math.PI * 2);
            ctx.fill();
        }

        // render flowing points
        if (flow) {
            ctx.fillStyle = color;
            for (let i = 0; i < 5; ++i) {
                const f = (getTime() * 0.001 + i * 0.2) % 1;
                const pos = this.computeConnectionPoint(a, b, f, startDir, endDir);
                ctx.beginPath();
                ctx.arc(pos[0], pos[1], 5, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    }

    /**
     * returns the link center point based on curvature
     * @method computeConnectionPoint
     * @param a
     * @param b
     * @param t
     * @param [startDir]
     * @param [endDir]
     * @returns {number[]}
     * @memberOf LGraphCanvas
     */
    computeConnectionPoint(a, b, t, startDir = defaultConfig.RIGHT, endDir = defaultConfig.LEFT) {
        const dist = distance(a, b);
        const p0 = a;
        const p1 = [a[0], a[1]];
        const p2 = [b[0], b[1]];
        const p3 = b;

        switch (startDir) {
            case defaultConfig.LEFT:
                p1[0] += dist * -0.25;
                break;
            case defaultConfig.RIGHT:
                p1[0] += dist * 0.25;
                break;
            case defaultConfig.UP:
                p1[1] += dist * -0.25;
                break;
            case defaultConfig.DOWN:
                p1[1] += dist * 0.25;
                break;
            default:
                break;
        }
        switch (endDir) {
            case defaultConfig.LEFT:
                p2[0] += dist * -0.25;
                break;
            case defaultConfig.RIGHT:
                p2[0] += dist * 0.25;
                break;
            case defaultConfig.UP:
                p2[1] += dist * -0.25;
                break;
            case defaultConfig.DOWN:
                p2[1] += dist * 0.25;
                break;
            default:
                break;
        }

        const c1 = (1 - t) * (1 - t) * (1 - t);
        const c2 = 3 * ((1 - t) * (1 - t)) * t;
        const c3 = 3 * (1 - t) * (t * t);
        const c4 = t * t * t;

        const x = c1 * p0[0] + c2 * p1[0] + c3 * p2[0] + c4 * p3[0];
        const y = c1 * p0[1] + c2 * p1[1] + c3 * p2[1] + c4 * p3[1];
        return [x, y];
    }

    drawExecutionOrder(ctx) {
        ctx.shadowColor = "transparent";
        ctx.globalAlpha = 0.25;

        ctx.textAlign = "center";
        ctx.strokeStyle = "white";
        ctx.globalAlpha = 0.75;

        const { visible_nodes } = this;
        for (const node of visible_nodes) {
            ctx.fillStyle = "black";
            ctx.fillRect(
                node.pos[0] - defaultConfig.NODE_TITLE_HEIGHT,
                node.pos[1] - defaultConfig.NODE_TITLE_HEIGHT,
                defaultConfig.NODE_TITLE_HEIGHT,
                defaultConfig.NODE_TITLE_HEIGHT,
            );
            if (node.order === 0) {
                ctx.strokeRect(
                    node.pos[0] - defaultConfig.NODE_TITLE_HEIGHT + 0.5,
                    node.pos[1] - defaultConfig.NODE_TITLE_HEIGHT + 0.5,
                    defaultConfig.NODE_TITLE_HEIGHT,
                    defaultConfig.NODE_TITLE_HEIGHT,
                );
            }
            ctx.fillStyle = "#FFF";
            ctx.fillText(
                node.order,
                node.pos[0] + defaultConfig.NODE_TITLE_HEIGHT * -0.5,
                node.pos[1] - 6,
            );
        }
        ctx.globalAlpha = 1;
    }

    /**
     * draws the widgets stored inside a node
     * @method drawNodeWidgets
     * @memberOf LGraphCanvas
     * */
    drawNodeWidgets(node, posY, ctx, active_widget) {
        if (!node.widgets || !node.widgets.length) return 0;
        const width = node.size[0];
        const { widgets } = node;
        posY += 2;
        const H = defaultConfig.NODE_WIDGET_HEIGHT;
        const showText = this.ds.scale > 0.5;
        ctx.save();
        ctx.globalAlpha = this.editor_alpha;
        const outlineColor = defaultConfig.WIDGET_OUTLINE_COLOR;
        const backgroundColor = defaultConfig.WIDGET_BGCOLOR;
        const textColor = defaultConfig.WIDGET_TEXT_COLOR;
        const secondaryTextColor = defaultConfig.WIDGET_SECONDARY_TEXT_COLOR;
        const margin = 15;

        for (const w of widgets) {
            let y = posY;
            if (w.y) y = w.y;
            w.last_y = y;
            ctx.strokeStyle = outlineColor;
            ctx.fillStyle = "#222";
            ctx.textAlign = "left";
            // ctx.lineWidth = 2;
            if (w.disabled) ctx.globalAlpha *= 0.5;
            const widgetWidth = w.width || width;

            switch (w.type) {
                case "button":
                    if (w.clicked) {
                        ctx.fillStyle = "#AAA";
                        w.clicked = false;
                        this.dirty_canvas = true;
                    }
                    ctx.fillRect(margin, y, widgetWidth - margin * 2, H);
                    if (showText && !w.disabled) ctx.strokeRect(margin, y, widgetWidth - margin * 2, H);
                    if (showText) {
                        ctx.textAlign = "center";
                        ctx.fillStyle = textColor;
                        ctx.fillText(w.name, widgetWidth * 0.5, y + H * 0.7);
                    }
                    break;
                case "toggle":
                    ctx.textAlign = "left";
                    ctx.strokeStyle = outlineColor;
                    ctx.fillStyle = backgroundColor;
                    ctx.beginPath();

                    if (showText) ctx.roundRect(margin, posY, widgetWidth - margin * 2, H, H * 0.5);
                    else ctx.rect(margin, posY, widgetWidth - margin * 2, H);

                    ctx.fill();
                    if (showText && !w.disabled) ctx.stroke();
                    ctx.fillStyle = w.value ? "#89A" : "#333";
                    ctx.beginPath();
                    ctx.arc(widgetWidth - margin * 2, y + H * 0.5, H * 0.36, 0, Math.PI * 2);
                    ctx.fill();
                    if (showText) {
                        ctx.fillStyle = secondaryTextColor;
                        if (w.name) ctx.fillText(w.name, margin * 2, y + H * 0.7);
                        ctx.fillStyle = w.value ? textColor : secondaryTextColor;
                        ctx.textAlign = "right";
                        ctx.fillText(
                            w.value
                                ? w.options.on || "true"
                                : w.options.off || "false",
                            widgetWidth - 40,
                            y + H * 0.7,
                        );
                    }
                    break;
                case "slider":
                    ctx.fillStyle = backgroundColor;
                    ctx.fillRect(margin, y, widgetWidth - margin * 2, H);
                    var range = w.options.max - w.options.min;
                    var nvalue = (w.value - w.options.min) / range;
                    ctx.fillStyle = active_widget === w ? "#89A" : "#678";
                    ctx.fillRect(margin, y, nvalue * (widgetWidth - margin * 2), H);
                    if (showText && !w.disabled) ctx.strokeRect(margin, y, widgetWidth - margin * 2, H);
                    if (w.marker) {
                        const marker_nvalue = (w.marker - w.options.min) / range;
                        ctx.fillStyle = "#AA9";
                        ctx.fillRect(margin + marker_nvalue * (widgetWidth - margin * 2), y, 2, H);
                    }
                    if (showText) {
                        ctx.textAlign = "center";
                        ctx.fillStyle = textColor;
                        ctx.fillText(
                            `${w.name}  ${Number(w.value)
                                .toFixed(3)}`,
                            widgetWidth * 0.5,
                            y + H * 0.7,
                        );
                    }
                    break;
                case "number":
                case "combo":
                    ctx.textAlign = "left";
                    ctx.strokeStyle = outlineColor;
                    ctx.fillStyle = backgroundColor;
                    ctx.beginPath();
                    if (showText) ctx.roundRect(margin, posY, widgetWidth - margin * 2, H, H * 0.5);
                    else ctx.rect(margin, posY, widgetWidth - margin * 2, H);
                    ctx.fill();
                    if (showText) {
                        if (!w.disabled) ctx.stroke();
                        ctx.fillStyle = textColor;
                        if (!w.disabled) {
                            ctx.beginPath();
                            ctx.moveTo(margin + 16, posY + 5);
                            ctx.lineTo(margin + 6, posY + H * 0.5);
                            ctx.lineTo(margin + 16, posY + H - 5);
                            ctx.fill();
                            ctx.beginPath();
                            ctx.moveTo(widgetWidth - margin - 16, posY + 5);
                            ctx.lineTo(widgetWidth - margin - 6, posY + H * 0.5);
                            ctx.lineTo(widgetWidth - margin - 16, posY + H - 5);
                            ctx.fill();
                        }
                        ctx.fillStyle = secondaryTextColor;
                        ctx.fillText(w.name, margin * 2 + 5, y + H * 0.7);
                        ctx.fillStyle = textColor;
                        ctx.textAlign = "right";
                        if (w.type === "number") {
                            ctx.fillText(
                                Number(w.value)
                                    .toFixed(
                                        w.options.precision
                                            ? w.options.precision
                                            : 3,
                                    ),
                                widgetWidth - margin * 2 - 20,
                                y + H * 0.7,
                            );
                        } else {
                            let v = w.value;
                            if (w.options.values) {
                                let { values } = w.options;
                                if (values.constructor === Function) values = values();
                                if (values && values.constructor !== Array) v = values[w.value];
                            }
                            ctx.fillText(
                                v,
                                widgetWidth - margin * 2 - 20,
                                y + H * 0.7,
                            );
                        }
                    }
                    break;
                case "string":
                case "text":
                    ctx.textAlign = "left";
                    ctx.strokeStyle = outlineColor;
                    ctx.fillStyle = backgroundColor;
                    ctx.beginPath();

                    if (showText) ctx.roundRect(margin, posY, widgetWidth - margin * 2, H, H * 0.5);
                    else ctx.rect(margin, posY, widgetWidth - margin * 2, H);

                    ctx.fill();
                    if (showText) {
                        if (!w.disabled) ctx.stroke();
                        ctx.save();
                        ctx.beginPath();
                        ctx.rect(margin, posY, widgetWidth - margin * 2, H);
                        ctx.clip();

                        // ctx.stroke();
                        ctx.fillStyle = secondaryTextColor;
                        if (w.name) ctx.fillText(w.name, margin * 2, y + H * 0.7);
                        ctx.fillStyle = textColor;
                        ctx.textAlign = "right";
                        ctx.fillText(String(w.value)
                            .substr(0, 30), widgetWidth - margin * 2, y + H * 0.7); // 30 chars max
                        ctx.restore();
                    }
                    break;
                default:
                    if (w.draw) w.draw(ctx, node, widgetWidth, y, H);
                    break;
            }
            posY += (w.computeSize ? w.computeSize(widgetWidth)[1] : H) + 4;
            ctx.globalAlpha = this.editor_alpha;
        }
        ctx.restore();
        ctx.textAlign = "left";
    }

    /**
     * process an event on widgets
     * @method processNodeWidgets
     * @memberOf LGraphCanvas
     * */
    processNodeWidgets(node, pos, event, activeWidget) {
        if (!node.widgets || !node.widgets.length) return null;

        const x = pos[0] - node.pos[0];
        const y = pos[1] - node.pos[1];
        const width = node.size[0];
        const refWindow = this.getCanvasWindow();

        for (const w of node.widgets) {
            if (!w || w.disabled) continue;
            const widgetHeight = w.computeSize ? w.computeSize(width)[1] : defaultConfig.NODE_WIDGET_HEIGHT;
            const widgetWidth = w.width || width;
            // outside
            if (w !== activeWidget
                && (x < 6 || x > widgetWidth - 12 || y < w.last_y || y > w.last_y + widgetHeight)) {
                continue;
            }

            const oldValue = w.value;

            // if ( w == active_widget || (x > 6 && x < widget_width - 12 && y > w.last_y && y <
            // w.last_y + widget_height) ) { inside widget
            switch (w.type) {
                case "button":
                    if (event.type === "mousemove") {
                        break;
                    }
                    if (w.callback) {
                        setTimeout(() => w.callback(w, this, node, pos, event), 20);
                    }
                    w.clicked = true;
                    this.dirty_canvas = true;
                    break;
                case "slider":
                    const range = w.options.max - w.options.min;
                    const nvalue = clamp((x - 15) / (widgetWidth - 30), 0, 1);
                    w.value = w.options.min + (w.options.max - w.options.min) * nvalue;
                    if (w.callback) {
                        setTimeout(() => innerValueChange(w, w.value), 20);
                    }
                    this.dirty_canvas = true;
                    break;
                case "number":
                case "combo":
                    const oldValue = w.value;
                    if (event.type === "mousemove" && w.type === "number") {
                        w.value += event.deltaX * 0.1 * (w.options.step || 1);
                        if (w.options.min && w.value < w.options.min) w.value = w.options.min;
                        if (w.options.max && w.value > w.options.max) w.value = w.options.max;
                    } else if (event.type === "mousedown") {
                        let { values } = w.options;
                        if (values && values.constructor === Function) {
                            values = w.options.values(w, node);
                        }
                        let valuesList = [];

                        if (w.type !== "number") valuesList = values.constructor === Array ? values : Object.keys(values);

                        const delta = x < 40 ? -1 : x > widgetWidth - 40 ? 1 : 0;
                        if (w.type === "number") {
                            w.value += delta * 0.1 * (w.options.step || 1);
                            if (w.options.min != null && w.value < w.options.min) {
                                w.value = w.options.min;
                            }
                            if (w.options.max != null && w.value > w.options.max) {
                                w.value = w.options.max;
                            }
                        } else if (delta) { // clicked in arrow, used for combos
                            let index = -1;
                            this.last_mouseclick = 0; // avoids dobl click event
                            if (values.constructor === Object) {
                                const indexInValues = valuesList.indexOf(String(w.value));
                                index = (indexInValues === -1) ? 0 : indexInValues + delta;
                            } else {
                                index = valuesList.indexOf(w.value) + delta;
                            }
                            if (index >= valuesList.length) {
                                index = valuesList.length - 1;
                            }
                            if (index < 0) {
                                index = 0;
                            }
                            if (values.constructor === Array) {
                                w.value = values[index];
                            } else {
                                w.value = valuesList[index];
                                console.log(w.value);
                            }
                        } else { // combo clicked
                            const textValues = values !== valuesList
                                ? Object.keys(values)
                                : values;
                            const menu = new ContextMenu(textValues, {
                                scale: Math.max(1, this.ds.scale),
                                event,
                                className: "dark",
                                callback: (v) => {
                                    w.value = values != valuesList ? textValues.indexOf(v) : v;
                                    innerValueChange(w, v);
                                    this.dirty_canvas = true;
                                    return false;
                                },
                            },
                            refWindow);
                        }
                    } else if (event.type === "mouseup" && w.type === "number") {
                        const delta = x < 40 ? -1 : x > widgetWidth - 40 ? 1 : 0;
                        if (event.click_time < 200 && delta == 0) {
                            this.prompt("Value", w.value, (v) => {
                                w.value = Number(v);
                                innerValueChange(w, w.value);
                            }, event);
                        }
                    }

                    if (oldValue !== w.value) {
                        setTimeout(
                            () => {
                                innerValueChange(this, this.value);
                            },
                            20,
                        );
                    }
                    this.dirty_canvas = true;
                    break;
                case "toggle":
                    if (event.type === "mousedown") {
                        w.value = !w.value;
                        setTimeout(() => {
                            innerValueChange(w, w.value);
                        }, 20);
                    }
                    break;
                case "string":
                case "text":
                    if (event.type === "mousedown") {
                        this.prompt("Value", w.value, (v) => {
                            w.value = v;
                            innerValueChange(w, v);
                        }, event, w.options ? w.options.multiline : false);
                    }
                    break;
                default:
                    if (w.mouse) {
                        this.dirty_canvas = w.mouse(event, [x, y], node);
                    }
                    break;
            } // end switch

            // value changed
            if (oldValue !== w.value) {
                if (node.onWidgetChanged) node.onWidgetChanged(w.name, w.value, oldValue, w);
                if (node.graph.on_change) node.graph.on_change(node.graph);
                node.graph._version++;
            }

            return w;
        }

        const that = this;
        function innerValueChange(widget, value) {
            widget.value = value;
            if (widget.options && widget.options.property && node.properties[widget.options.property]) {
                node.setProperty(widget.options.property, value);
            }
            if (widget.callback) {
                widget.callback(widget.value, that, node, pos, event);
            }
            if (node.onWidgetChanged) node.onWidgetChanged(widget.name, widget.value, oldValue, widget);
            if (node.graph.on_change) node.graph.on_change(node.graph);
            node.graph._version++;
        }

        return null;
    }

    /**
     * draws every group area in the background
     * @method drawGroups
     * @memberOf LGraphCanvas
     * */
    drawGroups(canvas, ctx) {
        if (!this.graph) return;

        const groups = this.graph._groups;

        ctx.save();
        ctx.globalAlpha = 0.5 * this.editor_alpha;

        for (const group of groups) {
            if (!overlapBounding(this.visible_area, group._bounding)) {
                continue;
            } // out of the visible area

            ctx.fillStyle = group.color || "#335";
            ctx.strokeStyle = group.color || "#335";
            const pos = group._pos;
            const size = group._size;
            ctx.globalAlpha = 0.25 * this.editor_alpha;
            ctx.beginPath();
            ctx.rect(pos[0] + 0.5, pos[1] + 0.5, size[0], size[1]);
            ctx.fill();
            ctx.globalAlpha = this.editor_alpha;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(pos[0] + size[0], pos[1] + size[1]);
            ctx.lineTo(pos[0] + size[0] - 10, pos[1] + size[1]);
            ctx.lineTo(pos[0] + size[0], pos[1] + size[1] - 10);
            ctx.fill();

            const fontSize = group.font_size || defaultConfig.DEFAULT_GROUP_FONT_SIZE;
            ctx.font = `${fontSize}px Arial`;
            ctx.fillText(group.title, pos[0] + 4, pos[1] + fontSize);
        }

        ctx.restore();
    }

    adjustNodesSize() {
        const nodes = this.graph._nodes;
        for (const node of nodes) node.size = node.computeSize();
        this.setDirty(true, true);
    }

    /**
     * resizes the canvas to a given size, if no size is passed, then it tries to fill the
     * parentNode
     * @method resize
     * @memberOf LGraphCanvas
     * */
    resize(width, height) {
        if (!width && !height) {
            const parent = this.canvas.parentNode;
            width = parent.offsetWidth;
            height = parent.offsetHeight;
        }

        if (this.canvas.width === width && this.canvas.height === height) {
            return;
        }

        this.canvas.width = width;
        this.canvas.height = height;
        this.bgcanvas.width = this.canvas.width;
        this.bgcanvas.height = this.canvas.height;
        this.setDirty(true, true);
    }

    /**
     * switches to live mode (node shapes are not rendered, only the content)
     * this feature was designed when graphs where meant to create user interfaces
     * @method switchLiveMode
     * @memberOf LGraphCanvas
     * */
    switchLiveMode(transition) {
        if (!transition) {
            this.live_mode = !this.live_mode;
            this.dirty_canvas = true;
            this.dirty_bgcanvas = true;
            return;
        }

        const delta = this.live_mode ? 1.1 : 0.9;
        if (this.live_mode) {
            this.live_mode = false;
            this.editor_alpha = 0.1;
        }

        const t = setInterval(() => {
            this.editor_alpha *= delta;
            this.dirty_canvas = true;
            this.dirty_bgcanvas = true;

            if (delta < 1 && this.editor_alpha < 0.01) {
                clearInterval(t);
                if (delta < 1) {
                    this.live_mode = true;
                }
            }
            if (delta > 1 && this.editor_alpha > 0.99) {
                clearInterval(t);
                this.editor_alpha = 1;
            }
        }, 1);
    }

    /**
     * @method onNodeSelectionChange
     * @param node
     * @todo Need create event
     * @memberOf LGraphCanvas
     */
    onNodeSelectionChange(node) {
        // disabled
    }

    /**
     * @method touchHandler
     * @param {TouchEvent} event
     * @memberOf LGraphCanvas
     */
    touchHandler(event) {
        // alert("foo");
        const touches = event.changedTouches;
        const first = touches[0];
        let type = "";

        switch (event.type) {
            case "touchstart":
                type = "mousedown";
                break;
            case "touchmove":
                type = "mousemove";
                break;
            case "touchend":
                type = "mouseup";
                break;
            default:
                return;
        }

        // initMouseEvent(type, canBubble, cancelable, view, clickCount,
        //           screenX, screenY, clientX, clientY, ctrlKey,
        //           altKey, shiftKey, metaKey, button, relatedTarget);

        const window = this.getCanvasWindow();
        const { document } = window;

        const simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent(
            type,
            true,
            true,
            window,
            1,
            first.screenX,
            first.screenY,
            first.clientX,
            first.clientY,
            false,
            false,
            false,
            false,
            0 /* left */,
            null,
        );
        first.target.dispatchEvent(simulatedEvent);
        event.preventDefault();
    }

    /**
     * @method onGroupAdd
     * @param info
     * @param entry
     * @param {MouseEvent} mouseEvent
     * @memberOf LGraphCanvas
     */
    static onGroupAdd(info, entry, mouseEvent) {
        const canvas = LGraphCanvas.active_canvas;

        const group = new LGraphGroup();
        group.pos = canvas.convertEventToCanvasOffset(mouseEvent);
        canvas.graph.add(group);
    }

    static onMenuAdd(node, options, e, previousMenu, callback) {
        const canvas = LGraphCanvas.active_canvas;
        const refWindow = canvas.getCanvasWindow();
        const { graph } = canvas;
        if (!graph) return;

        function inner_onMenuAdded(base_category, prev_menu) {
            const categories = registry.getNodeTypesCategories(canvas.filter || graph.filter)
                .filter((category) => category.startsWith(base_category));
            const entries = [];

            categories.forEach((category) => {
                if (!category) {
                    return;
                }

                const base_category_regex = new RegExp(`^(${base_category})`);
                const category_name = category.replace(base_category_regex, "").split("/")[0];
                const category_path = base_category === "" ? `${category_name}/` : `${base_category + category_name}/`;

                let name = category_name;
                if (name.indexOf("::") != -1) {
                    name = name.split("::")[1];
                }

                const index = entries.findIndex((entry) => entry.value === category_path);
                if (index === -1) {
                    entries.push({
                        value: category_path,
                        content: name,
                        has_submenu: true,
                        callback(value, event, mouseEvent, contextMenu) {
                            inner_onMenuAdded(value.value, contextMenu);
                        },
                    });
                }
            });

            const nodes = registry.getNodeTypesInCategory(base_category.slice(0, -1), canvas.filter || graph.filter);
            nodes.forEach((node) => {
                if (node.skip_list) return;

                const entry = {
                    value: node.type,
                    content: node.title,
                    has_submenu: false,
                    callback(value, event, mouseEvent, contextMenu) {
                        const first_event = contextMenu.getFirstEvent();
                        canvas.graph.beforeChange();
                        const node = LGraphNode.createNode(value.value);
                        if (node) {
                            node.pos = canvas.convertEventToCanvasOffset(first_event);
                            canvas.graph.add(node);
                        }
                        if (callback) callback(node);
                        canvas.graph.afterChange();
                    },
                };

                entries.push(entry);
            });

            new ContextMenu(entries, {
                event: e,
                parentMenu: prev_menu,
            }, refWindow);
        }

        inner_onMenuAdded("", previousMenu);
        return false;
    }

    /**
     * @method onMenuCollapseAll
     * @todo Need create event
     * @memberOf LGraphCanvas
     */
    static onMenuCollapseAll() {
    }

    /**
     * @method onMenuNodeEdit
     * @todo Need create event
     * @memberOf LGraphCanvas
     */
    static onMenuNodeEdit() {
    }

    static showMenuNodeOptionalInputs(v, optionsParam, e, previousMenu, node) {
        if (!node) return;

        const that = this;
        const canvas = LGraphCanvas.active_canvas;
        const refWindow = canvas.getCanvasWindow();

        let options = node.optional_inputs;
        if (node.onGetInputs) options = node.onGetInputs();

        let entries = [];
        if (options) {
            for (const entry of options) {
                if (!entry) {
                    entries.push(null);
                    continue;
                }
                let label = entry[0];
                if (entry[2] && entry[2].label) {
                    label = entry[2].label;
                }
                const data = {
                    content: label,
                    value: entry,
                };
                if (entry[1] === defaultConfig.ACTION) {
                    data.className = "event";
                }
                entries.push(data);
            }
        }

        if (this.onMenuNodeInputs) entries = this.onMenuNodeInputs(entries);

        if (!entries.length) {
            console.log("no input entries");
            return;
        }

        const menu = new ContextMenu(
            entries,
            {
                event: e,
                callback: innerClicked,
                parentMenu: previousMenu,
                node,
            },
            refWindow,
        );

        function innerClicked(v, e, prev) {
            if (!node) {
                return;
            }

            if (v.callback) {
                v.callback.call(that, node, v, e, prev);
            }

            if (v.value) {
                node.graph.beforeChange();
                node.addInput(v.value[0], v.value[1], v.value[2]);
                node.setDirtyCanvas(true, true);
                node.graph.afterChange();
            }
        }

        return false;
    }

    static showMenuNodeOptionalOutputs(v, optionsParam, e, previousMenu, node) {
        if (!node) return;

        const that = this;
        const canvas = LGraphCanvas.active_canvas;
        const refWindow = canvas.getCanvasWindow();

        let options = node.optional_outputs;
        if (node.onGetOutputs) {
            options = node.onGetOutputs();
        }

        let entries = [];
        if (options) {
            for (const entry of options) {
                if (!entry) {
                    // separator?
                    entries.push(null);
                    continue;
                }

                if (node.flags
                    && node.flags.skip_repeated_outputs
                    && node.findOutputSlot(entry[0]) !== -1) {
                    continue;
                } // skip the ones already on
                let label = entry[0];
                if (entry[2] && entry[2].label) label = entry[2].label;
                const data = {
                    content: label,
                    value: entry,
                };
                if (entry[1] === defaultConfig.EVENT) data.className = "event";
                entries.push(data);
            }
        }

        if (this.onMenuNodeOutputs) entries = this.onMenuNodeOutputs(entries);

        if (!entries.length) return;

        const menu = new ContextMenu(
            entries,
            {
                event: e,
                callback: innerClicked,
                parentMenu: previousMenu,
                node,
            },
            refWindow,
        );

        function innerClicked(v, e, prev) {
            if (!node) return;

            if (v.callback) v.callback.call(that, node, v, e, prev);

            if (!v.value) {
                return;
            }

            const value = v.value[1];

            if (
                value
                && (value.constructor === Object || value.constructor === Array)
            ) {
                // submenu why?
                const entries = [];
                for (const i in value) {
                    entries.push({
                        content: i,
                        value: value[i],
                    });
                }
                new ContextMenu(entries, {
                    event: e,
                    callback: innerClicked,
                    parentMenu: previousMenu,
                    node,
                });
                return false;
            }
            node.graph.beforeChange();
            node.addOutput(v.value[0], v.value[1], v.value[2]);
            node.setDirtyCanvas(true, true);
            node.graph.afterChange();
        }

        return false;
    }

    static onShowMenuNodeProperties(value, options, e, previousMenu, node) {
        if (!node || !node.properties) {
            return;
        }

        const canvas = LGraphCanvas.active_canvas;
        const refWindow = canvas.getCanvasWindow();

        const entries = [];
        // eslint-disable-next-line
        for (const i in node.properties) {
            let value = node.properties[i] ? node.properties[i] : " ";
            if (typeof value === "object") value = JSON.stringify(value);
            const info = node.getPropertyInfo(i);
            if (info.type == "enum" || info.type == "combo") value = LGraphCanvas.getPropertyPrintableValue(value, info.values);

            // value could contain invalid html characters, clean that
            value = LGraphCanvas.decodeHTML(value);
            entries.push({
                content:
                    `<span class="property_name">${
                        info.label ? info.label : i
                    }</span>`
                    + `<span class="property_value">${
                        value
                    }</span>`,
                value: i,
            });
        }
        if (!entries.length) {
            return;
        }

        const menu = new ContextMenu(
            entries,
            {
                event: e,
                callback: innerClicked,
                parentMenu: previousMenu,
                allow_html: true,
                node,
            },
            refWindow,
        );

        function innerClicked(v) {
            if (!node) {
                return;
            }
            const rect = this.getBoundingClientRect();
            canvas.showEditPropertyValue(node, v.value, {
                position: [rect.left, rect.top],
            });
        }

        return false;
    }

    static decodeHTML(str) {
        const e = document.createElement("div");
        e.innerText = str;
        return e.innerHTML;
    }

    static onResizeNode(value, options, e, menu, node) {
        if (!node) return;
        node.size = node.computeSize();
        if (node.onResize) node.onResize(node.size);
        node.setDirtyCanvas(true, true);
    }

    showLinkMenu(link, e) {
        const that = this;
        const options = ["Add Node", null, "Delete"];
        const menu = new ContextMenu(options, {
            event: e,
            title: link.data != null ? link.data.constructor.name : null,
            callback: innerClicked,
        });

        function innerClicked(v, options, e) {
            switch (v) {
                case "Add Node":
                    LGraphCanvas.onMenuAdd(null, null, e, menu, (node) => {
                        console.log("node autoconnect");
                        const nodeLeft = that.graph.getNodeById(link.origin_id);
                        const nodeRight = that.graph.getNodeById(link.target_id);
                        if (!node.inputs
                            || !node.inputs.length
                            || !node.outputs
                            || !node.outputs.length) return;
                        if (nodeLeft.outputs[link.origin_slot].type === node.inputs[0].type && node.outputs[0].type === nodeRight.inputs[0].type) {
                            nodeLeft.connect(link.origin_slot, node, 0);
                            node.connect(0, nodeRight, link.target_slot);
                            node.pos[0] -= node.size[0] * 0.5;
                        }
                    });
                    break;
                case "Delete":
                    that.graph.removeLink(link.id);
                    break;
                default:
            }
        }

        return false;
    }

    static onShowPropertyEditor(item, options, e, menu, node) {
        const property = item.property || "title";
        const value = node[property];

        const dialog = document.createElement("div");
        dialog.className = "graphdialog";
        dialog.innerHTML = "<span class='name'></span><input autofocus type='text' class='value'/><button>OK</button>";

        const title = dialog.querySelector(".name");
        title.innerText = property;

        const input = dialog.querySelector(".value");
        if (input) {
            input.value = value;
            input.addEventListener("blur", (e) => {
                input.focus();
            });
            input.addEventListener("keydown", (e) => {
                if (e.keyCode !== 13 && e.target.localName !== "textarea") return;
                setValue(input.value);
                e.preventDefault();
                e.stopPropagation();
            });
        }

        const graphcanvas = LGraphCanvas.active_canvas;
        const { canvas } = graphcanvas;

        const rect = canvas.getBoundingClientRect();
        let offsetx = -20;
        let offsety = -20;
        if (rect) {
            offsetx -= rect.left;
            offsety -= rect.top;
        }

        if (e) {
            dialog.style.left = `${e.clientX + offsetx}px`;
            dialog.style.top = `${e.clientY + offsety}px`;
        } else {
            dialog.style.left = `${canvas.width * 0.5 + offsetx}px`;
            dialog.style.top = `${canvas.height * 0.5 + offsety}px`;
        }

        const button = dialog.querySelector("button");
        button.addEventListener("click", () => setValue(input.value));
        canvas.parentNode.appendChild(dialog);

        function setValue(value) {
            if (item.type === "Number") {
                value = Number(value);
            } else if (item.type === "Boolean") {
                value = Boolean(value);
            }
            node[property] = value;
            if (dialog.parentNode) {
                dialog.remove();
            }
            node.setDirtyCanvas(true, true);
        }
    }

    prompt(title = "", value, callback, event, multiline) {
        const that = this;

        let modified = false;

        const dialog = document.createElement("div");
        dialog.className = "graphdialog rounded";
        if (multiline) {
            dialog.innerHTML = "<span class='name'></span> <textarea autofocus class='value'></textarea><button class='rounded'>OK</button>";
        } else {
            dialog.innerHTML = "<span class='name'></span> <input autofocus type='text' class='value'/><button class='rounded'>OK</button>";
        }
        dialog.close = () => {
            this.prompt_box = null;
            if (dialog.parentNode) dialog.remove();
        };

        if (this.ds.scale > 1) {
            dialog.style.transform = `scale(${this.ds.scale})`;
        }

        dialog.addEventListener("mouseleave", (e) => {
            if (!modified) dialog.close();
        });

        if (this.prompt_box) {
            this.prompt_box.close();
        }
        this.prompt_box = dialog;

        const first = null;
        const timeout = null;
        const selected = null;

        const nameElement = dialog.querySelector(".name");
        nameElement.innerText = title;
        const valueElement = dialog.querySelector(".value");
        valueElement.value = value;

        const input = valueElement;
        input.addEventListener("keydown", (e) => {
            modified = true;
            if (e.keyCode === 27) dialog.close();
            else if (e.keyCode === 13 && e.target.localName !== "textarea") {
                if (callback) {
                    callback(input.value);
                }
                dialog.close();
            } else {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
        });

        const button = dialog.querySelector("button");
        button.addEventListener("click", () => {
            if (callback) callback(input.value);
            this.setDirty(true);
            dialog.close();
        });

        const graphcanvas = LGraphCanvas.active_canvas;
        const { canvas } = graphcanvas;

        const rect = canvas.getBoundingClientRect();
        let offsetx = -20;
        let offsety = -20;
        if (rect) {
            offsetx -= rect.left;
            offsety -= rect.top;
        }

        if (event) {
            dialog.style.left = `${event.clientX + offsetx}px`;
            dialog.style.top = `${event.clientY + offsety}px`;
        } else {
            dialog.style.left = `${canvas.width * 0.5 + offsetx}px`;
            dialog.style.top = `${canvas.height * 0.5 + offsety}px`;
        }

        canvas.parentNode.appendChild(dialog);
        setTimeout(() => input.focus(), 10);

        return dialog;
    }

    static search_limit = -1

    showSearchBox = function (event) {
        const that = this;
        const graphcanvas = LGraphCanvas.active_canvas;
        const { canvas } = graphcanvas;
        const rootDocument = canvas.ownerDocument || document;

        const dialog = document.createElement("div");
        dialog.className = "litegraph litesearchbox graphdialog rounded";
        dialog.innerHTML = "<span class='name'>Search</span> <input autofocus type='text' class='value rounded'/><div class='helper'></div>";
        dialog.close = () => {
            this.search_box = null;
            rootDocument.body.focus();
            rootDocument.body.style.overflow = "";

            setTimeout(() => {
                this.canvas.focus();
            }, 20); // important, if canvas loses focus keys wont be captured
            if (dialog.parentNode) {
                dialog.remove();
            }
        };

        let timeoutClose = null;

        if (this.ds.scale > 1) dialog.style.transform = `scale(${this.ds.scale})`;

        dialog.addEventListener("mouseenter", () => {
            if (timeoutClose) {
                clearTimeout(timeoutClose);
                timeoutClose = null;
            }
        });

        dialog.addEventListener("mouseleave", () => {
            // dialog.close();
            timeoutClose = setTimeout(() => dialog.close(), 500);
        });

        if (this.search_box) this.search_box.close();
        this.search_box = dialog;

        const helper = dialog.querySelector(".helper");

        let first = null;
        let timeout = null;
        let selected = null;

        const input = dialog.querySelector("input");
        if (input) {
            input.addEventListener("blur", () => input.focus());
            input.addEventListener("keydown", (e) => {
                if (e.keyCode === 38) {
                    // UP
                    changeSelection(false);
                } else if (e.keyCode === 40) {
                    // DOWN
                    changeSelection(true);
                } else if (e.keyCode === 27) {
                    // ESC
                    dialog.close();
                } else if (e.keyCode === 13) {
                    if (selected) {
                        select(selected.innerHTML);
                    } else if (first) {
                        select(first);
                    } else {
                        dialog.close();
                    }
                } else {
                    if (timeout) {
                        clearInterval(timeout);
                    }
                    timeout = setTimeout(refreshHelper, 10);
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return true;
            });
        }

        if (rootDocument.fullscreenElement) rootDocument.fullscreenElement.appendChild(dialog);
        else {
            rootDocument.body.appendChild(dialog);
            rootDocument.body.style.overflow = "hidden";
        }

        // compute best position
        const rect = canvas.getBoundingClientRect();

        const left = (event ? event.clientX : (rect.left + rect.width * 0.5)) - 80;
        const top = (event ? event.clientY : (rect.top + rect.height * 0.5)) - 20;
        dialog.style.left = `${left}px`;
        dialog.style.top = `${top}px`;

        // To avoid out of screen problems
        if (event.layerY > (rect.height - 200)) {
            helper.style.maxHeight = `${rect.height - event.layerY - 20}px`;
        }

        input.focus();

        function select(name) {
            if (name) {
                if (that.onSearchBoxSelection) {
                    that.onSearchBoxSelection(name, event, graphcanvas);
                } else {
                    const extra = defaultConfig.searchbox_extras[name.toLowerCase()];
                    if (extra) {
                        name = extra.type;
                    }

                    graphcanvas.graph.beforeChange();
                    const node = LGraphNode.createNode(name);
                    if (node) {
                        node.pos = graphcanvas.convertEventToCanvasOffset(
                            event,
                        );
                        graphcanvas.graph.add(node);
                    }

                    if (extra && extra.data) {
                        if (extra.data.properties) {
                            // eslint-disable-next-line
                            for (const i in extra.data.properties) {
                                node.addProperty(i, extra.data.properties[i]);
                            }
                        }
                        if (extra.data.inputs) {
                            node.inputs = [];
                            // eslint-disable-next-line
                            for (const i in extra.data.inputs) {
                                node.addOutput(
                                    extra.data.inputs[i][0],
                                    extra.data.inputs[i][1],
                                );
                            }
                        }
                        if (extra.data.outputs) {
                            node.outputs = [];
                            // eslint-disable-next-line
                            for (const i in extra.data.outputs) {
                                node.addOutput(
                                    extra.data.outputs[i][0],
                                    extra.data.outputs[i][1],
                                );
                            }
                        }
                        if (extra.data.title) node.title = extra.data.title;
                        if (extra.data.json) node.configure(extra.data.json);

                        graphcanvas.graph.afterChange();
                    }
                }
            }

            dialog.close();
        }

        function changeSelection(forward) {
            const prev = selected;
            if (selected) selected.classList.remove("selected");
            if (!selected) {
                selected = forward
                    ? helper.childNodes[0]
                    : helper.childNodes[helper.childNodes.length];
            } else {
                selected = forward
                    ? selected.nextSibling
                    : selected.previousSibling;
                if (!selected) selected = prev;
            }
            if (!selected) return;
            selected.classList.add("selected");
            selected.scrollIntoView({
                block: "end",
                behavior: "smooth",
            });
        }

        function refreshHelper() {
            timeout = null;
            let str = input.value;
            first = null;
            helper.innerHTML = "";
            if (!str) return;

            if (that.onSearchBox) {
                const list = that.onSearchBox(helper, str, graphcanvas);
                if (list) {
                    for (const l of list) addResult(l);
                }
            } else {
                let c = 0;
                str = str.toLowerCase();
                const filter = graphcanvas.filter || graphcanvas.graph.filter;

                // extras
                // eslint-disable-next-line
                for (const i in defaultConfig.searchbox_extras) {
                    const extra = defaultConfig.searchbox_extras[i];
                    if (extra.desc.toLowerCase().indexOf(str) === -1) {
                        continue;
                    }
                    const ctor = defaultConfig.registered_node_types[extra.type];
                    if (ctor && ctor.filter !== filter) continue;
                    addResult(extra.desc, "searchbox_extra");
                    if (LGraphCanvas.search_limit !== -1 && c++ > LGraphCanvas.search_limit) {
                        break;
                    }
                }

                const keys = Object.keys(defaultConfig.registered_node_types); // types
                const filtered = keys.filter((type) => {
                    const ctor = defaultConfig.registered_node_types[type];
                    if (filter && ctor.filter !== filter) return false;
                    return type.toLowerCase().indexOf(str) !== -1;
                });

                for (const filteredItem of filtered) {
                    addResult(filteredItem);
                    if (LGraphCanvas.search_limit !== -1 && c++ > LGraphCanvas.search_limit) {
                        break;
                    }
                }
            }

            function addResult(type, className) {
                const help = document.createElement("div");
                if (!first) first = type;
                help.innerText = type;
                help.dataset.type = escape(type);
                help.className = "litegraph lite-search-item";
                if (className) help.className += ` ${className}`;
                help.addEventListener("click", () => {
                    select(unescape(help.dataset.type));
                });
                helper.appendChild(help);
            }
        }

        return dialog;
    }

    showEditPropertyValue(node, property, options = {}) {
        if (!node || node.properties[property] === undefined) return;

        const info = node.getPropertyInfo(property);
        const { type } = info;

        let inputHTML = "";

        if (["sring", "number", "array", "object"].includes(type)) {
            inputHTML = "<input autofocus type='text' class='value'/>";
        } else if (["enum", "combo"].includes(type) && info.values) {
            inputHTML = "<select autofocus type='text' class='value'>";
            // eslint-disable-next-line
            for (const i in info.values) {
                let value = i;
                if (info.values.constructor === Array) value = info.values[i];

                inputHTML += `<option value="${value}" ${value == node.properties[property] ? "selected" : ""}>${info.values[i]}</option>`;
            }
            inputHTML += "</select>";
        } else if (type === "boolean") {
            inputHTML = `<input autofocus type="checkbox" class="value" ${
                node.properties[property] ? "checked" : ""
            }/>`;
        } else {
            console.warn(`unknown type: ${type}`);
            return;
        }

        const dialog = this.createDialog(
            `<span class="name">${
                info.label ? info.label : property
            }</span>${
                inputHTML
            }<button>OK</button>`,
            options,
        );

        if (["enum", "combo"].includes(type) && info.values) {
            const input = dialog.querySelector("select");
            input.addEventListener("change", (e) => {
                setValue(e.target.value);
            });
        } else if (type === "boolean") {
            const input = dialog.querySelector("input");
            if (input) {
                input.addEventListener("click", () => setValue(!!input.checked));
            }
        } else {
            const input = dialog.querySelector("input");
            if (input) {
                input.addEventListener("blur", () => { input.focus(); });

                let v = node.properties[property] ? node.properties[property] : "";
                if (type !== "string") {
                    v = JSON.stringify(v);
                }

                input.value = v;
                input.addEventListener("keydown", (e) => {
                    if (e.keyCode != 13) return;
                    setValue(input.value);
                    e.preventDefault();
                    e.stopPropagation();
                });
            }
        }

        const button = dialog.querySelector("button");
        button.addEventListener("click", () => setValue(input.value));
        function setValue(value) {
            if (info
                && info.values
                && info.values.constructor === Object
                && info.values[value]) value = info.values[value];

            if (typeof node.properties[property] === "number") {
                value = Number(value);
            }
            if (["array", "object"].includes(type)) {
                value = JSON.parse(value);
            }
            node.properties[property] = value;
            if (node.graph) {
                node.graph._version++;
            }
            if (node.onPropertyChanged) {
                node.onPropertyChanged(property, value);
            }
            if (options.onclose) options.onclose();
            dialog.close();
            node.setDirtyCanvas(true, true);
        }

        return dialog;
    }

    createDialog(html, options = {}) {
        const dialog = document.createElement("div");
        dialog.className = "graphdialog";
        dialog.innerHTML = html;

        const rect = this.canvas.getBoundingClientRect();
        let offsetx = -20;
        let offsety = -20;
        if (rect) {
            offsetx -= rect.left;
            offsety -= rect.top;
        }

        if (options.position) {
            offsetx += options.position[0];
            offsety += options.position[1];
        } else if (options.event) {
            offsetx += options.event.clientX;
            offsety += options.event.clientY;
        } // centered
        else {
            offsetx += this.canvas.width * 0.5;
            offsety += this.canvas.height * 0.5;
        }

        dialog.style.left = `${offsetx}px`;
        dialog.style.top = `${offsety}px`;

        this.canvas.parentNode.appendChild(dialog);

        dialog.close = () => {
            if (dialog.parentNode) dialog.remove();
        };

        return dialog;
    }

    createPanel(title, options = {}) {
        const refWindow = options.window || window;

        const root = document.createElement("div");
        root.className = "litegraph dialog";
        root.innerHTML = "<div class='dialog-header'><span class='dialog-title'></span></div><div class='dialog-content'></div><div class='dialog-footer'></div>";
        root.header = root.querySelector(".dialog-header");

        if (options.width) root.style.width = options.width + (options.width.constructor === Number ? "px" : "");
        if (options.height) root.style.height = options.height + (options.height.constructor === Number ? "px" : "");
        if (options.closable) {
            const close = document.createElement("span");
            close.innerHTML = "&#10005;";
            close.classList.add("close");
            close.addEventListener("click", () => root.close());
            root.header.appendChild(close);
        }
        root.title_element = root.querySelector(".dialog-title");
        root.title_element.innerText = title;
        root.content = root.querySelector(".dialog-content");
        root.footer = root.querySelector(".dialog-footer");

        root.close = () => root.remove();

        root.clear = () => root.content.innerHTML = "";

        root.addHTML = (code, classname, onFooter) => {
            const elem = document.createElement("div");
            if (classname) elem.className = classname;
            elem.innerHTML = code;
            if (onFooter) root.footer.appendChild(elem);
            else root.content.appendChild(elem);
            return elem;
        };

        root.addButton = (name, callback, options) => {
            const elem = document.createElement("button");
            elem.innerText = name;
            elem.options = options;
            elem.classList.add("btn");
            elem.addEventListener("click", callback);
            root.footer.appendChild(elem);
            return elem;
        };

        root.addSeparator = () => {
            const elem = document.createElement("div");
            elem.className = "separator";
            root.content.appendChild(elem);
        };

        root.addWidget = (type, name, value, options = {}, callback) => {
            type = type.toLowerCase();
            value = String(value);
            let strValue = type === "number" ? new Number(value).toFixed(3) : value.toString();
            const elem = document.createElement("div");
            elem.className = "property";
            elem.innerHTML = "<span class='property_name'></span><span class='property_value'></span>";
            elem.querySelector(".property_name").innerText = name;
            const valueElement = elem.querySelector(".property_value");
            valueElement.innerText = strValue;
            elem.dataset.property = name;
            elem.dataset.type = options.type || type;
            elem.options = options;
            elem.value = strValue;

            if (type === "boolean") {
                elem.classList.add("boolean");
                if (value) elem.classList.add("bool-on");
                elem.addEventListener("click", () => {
                    // var v = node.properties[this.dataset["property"]];
                    // node.setProperty(this.dataset["property"],!v); this.innerText = v ? "true" :
                    // "false";
                    const propname = elem.dataset.property;
                    this.value = !elem.value;
                    this.classList.toggle("bool-on");
                    this.querySelector(".property_value").innerText = elem.value ? "true" : "false";
                    innerChange(propname, elem.value);
                });
            } else if (["string", "number"].includes(type)) {
                valueElement.setAttribute("contenteditable", true);
                valueElement.addEventListener("keydown", (e) => {
                    if (e.code === "Enter") {
                        e.preventDefault();
                        valueElement.blur();
                    }
                });
                valueElement.addEventListener("blur", () => {
                    let v = valueElement.innerText;
                    const propname = valueElement.parentNode.dataset.property;
                    const proptype = valueElement.parentNode.dataset.type;
                    if (proptype === "number") v = Number(v);
                    innerChange(propname, v);
                });
            } else if (["enum", "combo"].includes(type)) strValue = LGraphCanvas.getPropertyPrintableValue(value, options.values);
            valueElement.innerText = strValue;

            valueElement.addEventListener("click", (event) => {
                const values = options.values || [];
                const propname = valueElement.parentNode.dataset.property;
                const menu = new ContextMenu(values, {
                    event,
                    className: "dark",
                    callback: (v, option, event) => {
                        this.innerText = v;
                        innerChange(propname, v);
                        return false;
                    },
                },
                refWindow);
            });

            root.content.appendChild(elem);

            function innerChange(name, value) {
                console.log("change", name, value);
                // that.dirty_canvas = true;
                if (options.callback) options.callback(name, value);
                if (callback) callback(name, value);
            }

            return elem;
        };

        return root;
    }

    static getPropertyPrintableValue(value, values) {
        if (!values) return String(value);
        if (values.constructor === Array) return String(value);

        if (values.constructor === Object) {
            let desc_value = "";
            for (const k in values) {
                if (values[k] !== value) continue;
                desc_value = k;
                break;
            }
            return `${String(value)} (${desc_value})`;
        }
    }

    showShowNodePanel = function (node) {
        window.SELECTED_NODE = node;
        let panel = document.querySelector("#node-panel");
        if (panel) panel.close();
        const refWindow = this.getCanvasWindow();
        panel = this.createPanel(node.title || "", {
            closable: true,
            window: refWindow,
        });
        panel.id = "node-panel";
        panel.node = node;
        panel.classList.add("settings");
        const that = this;
        const graphcanvas = this;

        const inner_refresh = () => {
            panel.content.innerHTML = ""; // clear
            panel.addHTML(`<span class="node_type">${node.type}</span><span class="node_desc">${node.constructor.desc || ""}</span><span class="separator"></span>`);

            panel.addHTML("<h3>Properties</h3>");

            for (const i in node.properties) {
                const value = node.properties[i];
                const info = node.getPropertyInfo(i);

                if (node.onAddPropertyToPanel && node.onAddPropertyToPanel(i, panel)) continue;

                panel.addWidget(info.widget || info.type, i, value, info, (name, value) => {
                    graphcanvas.graph.beforeChange(node);
                    node.setProperty(name, value);
                    graphcanvas.graph.afterChange();
                    graphcanvas.dirty_canvas = true;
                });
            }

            panel.addSeparator();

            if (node.onShowCustomPanelInfo) node.onShowCustomPanelInfo(panel);
            panel.addButton("Delete", () => {
                if (node.block_delete) return;
                node.graph.remove(node);
                panel.close();
            })
                .classList
                .add("delete");
        };

        function inner_showCodePad(node, propname) {
            panel.style.top = "calc( 50% - 250px)";
            panel.style.left = "calc( 50% - 400px)";
            panel.style.width = "800px";
            panel.style.height = "500px";

            panel.content.innerHTML = "<textarea class='code'></textarea>";
            const textarea = panel.content.querySelector("textarea");
            textarea.value = node.properties[propname];
            textarea.addEventListener("keydown", (e) => {
                if (e.code === "Enter" && e.ctrlKey) {
                    console.log("Assigned");
                    node.setProperty(propname, textarea.value);
                }
            });
            textarea.style.height = "calc(100% - 40px)";

            const assign = that.createButton("Assign", null, () => {
                node.setProperty(propname, textarea.value);
            });
            panel.content.appendChild(assign);
            const button = that.createButton("Close", null, () => {
                panel.style.height = "";
                inner_refresh();
            });
            button.style.float = "right";
            panel.content.appendChild(button);
        }

        inner_refresh();

        this.canvas.parentNode.appendChild(panel);
    }

    showSubgraphPropertiesDialog(node) {
        console.log("showing subgraph properties dialog");

        const old_panel = this.canvas.parentNode.querySelector(".subgraph_dialog");
        if (old_panel) old_panel.close();

        const panel = this.createPanel("Subgraph Inputs", {
            closable: true,
            width: 500,
        });
        panel.node = node;
        panel.classList.add("subgraph_dialog");

        function inner_refresh() {
            panel.clear();

            // show currents
            if (node.inputs) {
                for (const input of node.inputs) {
                    if (input.not_subgraph_input) continue;
                    const html = "<button>&#10005;</button> <span class='bullet_icon'></span><span class='name'></span><span class='type'></span>";
                    const elem = panel.addHTML(html, "subgraph_property");
                    elem.dataset.name = input.name;
                    elem.dataset.slot = i;
                    elem.querySelector(".name").innerText = input.name;
                    elem.querySelector(".type").innerText = input.type;
                    elem.querySelector("button")
                        .addEventListener("click", () => {
                            node.removeInput(Number(elem.parentNode.dataset.slot));
                            inner_refresh();
                        });
                }
            }
        }

        // add extra
        const html = " + <span class='label'>Name</span><input class='name'/><span class='label'>Type</span><input class='type'/><button>+</button>";
        const elem = panel.addHTML(html, "subgraph_property extra", true);
        elem.querySelector("button")
            .addEventListener("click", function (e) {
                const elem = this.parentNode;
                const name = elem.querySelector(".name").value;
                const type = elem.querySelector(".type").value;
                if (!name || node.findInputSlot(name) !== -1) return;
                node.addInput(name, type);
                elem.querySelector(".name").value = "";
                elem.querySelector(".type").value = "";
                inner_refresh();
            });

        inner_refresh();
        this.canvas.parentNode.appendChild(panel);
        return panel;
    }

    checkPanels() {
        if (!this.canvas) return;
        const panels = this.canvas.parentNode.querySelectorAll(".litegraph.dialog");
        for (const panel of panels) {
            if (!panel.node) continue;
            if (!panel.node.graph || panel.graph !== this.graph) panel.close();
        }
    }

    static onMenuNodeCollapse(value, options, e, menu, node) {
        node.graph.beforeChange(node);
        node.collapse();
        node.graph.afterChange(node);
    }

    static onMenuNodePin(value, options, e, menu, node) {
        node.pin();
    }

    static onMenuNodeMode = function (value, options, e, menu, node) {
        new ContextMenu(
            ["Always", "On Event", "On Trigger", "Never"],
            {
                event: e,
                callback: (v) => {
                    if (!node) {
                        return;
                    }
                    switch (v) {
                        case "On Event":
                            node.mode = defaultConfig.ON_EVENT;
                            break;
                        case "On Trigger":
                            node.mode = defaultConfig.ON_TRIGGER;
                            break;
                        case "Never":
                            node.mode = defaultConfig.NEVER;
                            break;
                        case "Always":
                        default:
                            node.mode = defaultConfig.ALWAYS;
                            break;
                    }
                },
                parentMenu: menu,
                node,
            },
        );
        return false;
    }

    static onMenuNodeColors(value, options, e, menu, node) {
        if (!node) throw new Error("no node for color");
        const values = [];
        values.push({
            value: null,
            content:
                "<span style='display: block; padding-left: 4px;'>No color</span>",
        });

        // eslint-disable-next-line
        for (const i in LGraphCanvas.node_colors) {
            const color = LGraphCanvas.node_colors[i];
            values.push({
                value: i,
                content: `<span style="display: block; color: #999; padding-left: 4px; border-left: 8px solid ${color.color}; background-color:${color.bgcolor}">${i}</span>`,
            });
        }
        new ContextMenu(values, {
            event: e,
            callback: (v) => {
                if (!node) {
                    return;
                }

                const color = v.value ? LGraphCanvas.node_colors[v.value] : null;
                if (color) {
                    if (node.constructor.name === "LGraphGroup") {
                        node.color = color.groupcolor;
                    } else {
                        node.color = color.color;
                        node.bgcolor = color.bgcolor;
                    }
                } else {
                    delete node.color;
                    delete node.bgcolor;
                }
                node.setDirtyCanvas(true, true);
            },
            parentMenu: menu,
            node,
        });

        return false;
    }

    static onMenuNodeShapes(value, options, e, menu, node) {
        if (!node) {
            throw new Error("no node passed");
        }

        new ContextMenu(defaultConfig.VALID_SHAPES, {
            event: e,
            callback: (v) => {
                if (!node) return;
                node.graph.beforeChange(node);
                node.shape = v;
                node.graph.afterChange(node);
                node.setDirtyCanvas(true);
            },
        }, {
            parentMenu: menu,
            node,
        });

        return false;
    }

    static onMenuNodeRemove(value, options, e, menu, node) {
        if (!node) throw new Error("no node passed");
        if (node.removable === false) return;

        const { graph } = node;
        graph.beforeChange();
        graph.remove(node);
        graph.afterChange();
        node.setDirtyCanvas(true, true);
    }

    static onMenuNodeToSubgraph(value, options, e, menu, node) {
        const { graph } = node;
        const graphcanvas = LGraphCanvas.active_canvas;
        if (!graphcanvas) return;

        let nodesList = Object.values(graphcanvas.selected_nodes || {});
        if (!nodesList.length) nodesList = [node];

        const subgraphNode = LGraphNode.createNode("graph/subgraph");
        subgraphNode.pos = node.pos.concat();
        graph.add(subgraphNode);

        subgraphNode.buildFromNodes(nodesList);

        graphcanvas.deselectAllNodes();
        node.setDirtyCanvas(true, true);
    }

    static onMenuNodeClone(value, options, e, menu, node) {
        if (node.clonable === false) return;
        const newnode = node.clone();
        if (!newnode) return;
        newnode.pos = [node.pos[0] + 5, node.pos[1] + 5];

        node.graph.beforeChange();
        node.graph.add(newnode);
        node.graph.afterChange();

        node.setDirtyCanvas(true, true);
    }

    static node_colors = {
        red: {
            color: "#322",
            bgcolor: "#533",
            groupcolor: "#A88",
        },
        brown: {
            color: "#332922",
            bgcolor: "#593930",
            groupcolor: "#b06634",
        },
        green: {
            color: "#232",
            bgcolor: "#353",
            groupcolor: "#8A8",
        },
        blue: {
            color: "#223",
            bgcolor: "#335",
            groupcolor: "#88A",
        },
        pale_blue: {
            color: "#2a363b",
            bgcolor: "#3f5159",
            groupcolor: "#3f789e",
        },
        cyan: {
            color: "#233",
            bgcolor: "#355",
            groupcolor: "#8AA",
        },
        purple: {
            color: "#323",
            bgcolor: "#535",
            groupcolor: "#a1309b",
        },
        yellow: {
            color: "#432",
            bgcolor: "#653",
            groupcolor: "#b58b2a",
        },
        black: {
            color: "#222",
            bgcolor: "#000",
            groupcolor: "#444",
        },
    }

    getCanvasMenuOptions() {
        let options = null;
        if (this.getMenuOptions) {
            options = this.getMenuOptions();
        } else {
            options = [
                {
                    content: "Add Node",
                    has_submenu: true,
                    callback: LGraphCanvas.onMenuAdd,
                },
                {
                    content: "Add Group",
                    callback: LGraphCanvas.onGroupAdd,
                },
                // {content:"Collapse All", callback: LGraphCanvas.onMenuCollapseAll }
            ];

            if (this._graph_stack && this._graph_stack.length > 0) {
                options.push(null, {
                    content: "Close subgraph",
                    callback: this.closeSubgraph.bind(this),
                });
            }
        }

        if (this.getExtraMenuOptions) {
            const extra = this.getExtraMenuOptions(this, options);
            if (extra) options = options.concat(extra);
        }

        return options;
    }

    getNodeMenuOptions(node) {
        let options = null;

        if (node.getMenuOptions) options = node.getMenuOptions(this);
        else {
            options = [
                {
                    content: "Inputs",
                    has_submenu: true,
                    disabled: true,
                    callback: LGraphCanvas.showMenuNodeOptionalInputs,
                },
                {
                    content: "Outputs",
                    has_submenu: true,
                    disabled: true,
                    callback: LGraphCanvas.showMenuNodeOptionalOutputs,
                },
                null,
                {
                    content: "Properties",
                    has_submenu: true,
                    callback: LGraphCanvas.onShowMenuNodeProperties,
                },
                null,
                {
                    content: "Title",
                    callback: LGraphCanvas.onShowPropertyEditor,
                },
                {
                    content: "Mode",
                    has_submenu: true,
                    callback: LGraphCanvas.onMenuNodeMode,
                },
                {
                    content: "Resize",
                    callback() {
                        if (node.resizable) {
                            return LGraphCanvas.onResizeNode;
                        }
                    },
                },
                {
                    content: "Collapse",
                    callback: LGraphCanvas.onMenuNodeCollapse,
                },
                {
                    content: "Pin",
                    callback: LGraphCanvas.onMenuNodePin,
                },
                {
                    content: "Colors",
                    has_submenu: true,
                    callback: LGraphCanvas.onMenuNodeColors,
                },
                {
                    content: "Shapes",
                    has_submenu: true,
                    callback: LGraphCanvas.onMenuNodeShapes,
                },
                null,
            ];
        }

        if (node.onGetInputs) {
            const inputs = node.onGetInputs();
            if (inputs && inputs.length) options[0].disabled = false;
        }

        if (node.onGetOutputs) {
            const outputs = node.onGetOutputs();
            if (outputs && outputs.length) options[1].disabled = false;
        }

        if (node.getExtraMenuOptions) {
            const extra = node.getExtraMenuOptions(this, options);
            if (extra) {
                extra.push(null);
                options = extra.concat(options);
            }
        }

        if (node.clonable) {
            options.push({
                content: "Clone",
                callback: LGraphCanvas.onMenuNodeClone,
            });
        }

        options.push(null, {
            content: "Remove",
            disabled: !(node.removable !== false && !node.block_delete),
            callback: LGraphCanvas.onMenuNodeRemove,
        });

        if (node.graph && node.graph.onGetNodeMenuOptions) {
            node.graph.onGetNodeMenuOptions(options, node);
        }

        return options;
    }

    getGroupMenuOptions() {
        return [
            {
                content: "Title",
                callback: LGraphCanvas.onShowPropertyEditor,
            },
            {
                content: "Color",
                has_submenu: true,
                callback: LGraphCanvas.onMenuNodeColors,
            },
            {
                content: "Font size",
                property: "font_size",
                type: "Number",
                callback: LGraphCanvas.onShowPropertyEditor,
            },
            null,
            {
                content: "Remove",
                callback: LGraphCanvas.onMenuNodeRemove,
            },
        ];
    }

    processContextMenu(node, event) {
        const that = this;
        const canvas = LGraphCanvas.active_canvas;
        const refWindow = canvas.getCanvasWindow();

        let menuInfo = null;
        const options = {
            event,
            callback: inner_option_clicked,
            extra: node,
        };

        if (node) options.title = node.type;

        // check if mouse is in input
        let slot = null;
        if (node) {
            slot = node.getSlotInPosition(event.canvasX, event.canvasY);
            LGraphCanvas.active_node = node;
        }

        if (slot) {
            // on slot
            menuInfo = [];
            if (node.getSlotMenuOptions) menuInfo = node.getSlotMenuOptions(slot);
            else {
                if (slot && slot.output && slot.output.links && slot.output.links.length) {
                    menuInfo.push({
                        content: "Disconnect Links",
                        slot,
                    });
                }
                const _slot = slot.input || slot.output;
                menuInfo.push(_slot.locked ? "Cannot remove" : { content: "Remove Slot", slot });
                menuInfo.push(_slot.nameLocked ? "Cannot rename" : { content: "Rename Slot", slot });
            }
            options.title = (slot.input ? slot.input.type : slot.output.type) || "*";
            if (slot.input && slot.input.type === defaultConfig.ACTION) options.title = "Action";
            if (slot.output && slot.output.type === defaultConfig.EVENT) options.title = "Event";
        } else if (node) {
            menuInfo = this.getNodeMenuOptions(node);
        } else {
            menuInfo = this.getCanvasMenuOptions();
            const group = this.graph.getGroupOnPos(event.canvasX, event.canvasY);
            if (group) {
                // on group
                menuInfo.push(null, {
                    content: "Edit Group",
                    has_submenu: true,
                    submenu: {
                        title: "Group",
                        extra: group,
                        options: this.getGroupMenuOptions(group),
                    },
                });
            }
        }

        // show menu
        if (!menuInfo) return;

        const menu = new ContextMenu(menuInfo, options, refWindow);

        function inner_option_clicked(v, options, e) {
            if (!v) {
                return;
            }

            if (v.content === "Remove Slot") {
                const info = v.slot;
                if (info.input) node.removeInput(info.slot);
                else if (info.output) node.removeOutput(info.slot);
            } else if (v.content === "Disconnect Links") {
                const info = v.slot;
                if (info.output) node.disconnectOutput(info.slot);
                else if (info.input) node.disconnectInput(info.slot);
            } else if (v.content === "Rename Slot") {
                const info = v.slot;
                const slotInfo = info.input
                    ? node.getInputInfo(info.slot) : node.getOutputInfo(info.slot);
                const dialog = that.createDialog(
                    "<span class='name'>Name</span><input autofocus type='text'/><button>OK</button>",
                    options,
                );
                const input = dialog.querySelector("input");
                if (input && slotInfo) input.value = slotInfo.label || "";
                dialog.querySelector("button")
                    .addEventListener("click", () => {
                        if (input.value) {
                            if (slotInfo) slotInfo.label = input.value;
                            that.setDirty(true);
                        }
                        dialog.close();
                    });
            }
        }
    }
}
