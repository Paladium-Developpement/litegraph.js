import defaultConfig from "./utils/defaultConfig";
import getTime from "./utils/time";
import LGraphNode from "./LGraphNode";
import LGraphGroup from "./LGraphGroup";
import LGraphCanvas from "./LGraphCanvas";

/**
 * LGraph is the class that contain a full graph.
 * We instantiate one and add nodes to it, and then we can run the execution loop.
 * supported callbacks:
 + onNodeAdded: when a new node is added to the graph
 + onNodeRemoved: when a node inside this graph is removed
 + onNodeConnectionChange: some connection has changed in the graph (connected or disconnected)
 *
 * @class LGraph
 * @constructor
 * @param {Object} o data from previous serialization [optional]
 */
export default class LGraph {
    constructor(o) {
        if (defaultConfig.debug) {
            console.log("Graph created");
        }
        this.list_of_graphcanvas = null;
        this.clear();

        if (o) {
            this.configure(o);
        }
    }

    getSupportedTypes() {
        return this.supportedTypes || LGraph.supportedTypes;
    }

    STATUS_STOPPED = 1;

    STATUS_RUNNING = 2;

    supportedTypes = ["number", "string", "boolean"];

    static supportedTypes = ["number", "string", "boolean"];
    // used to know which types of connections support this graph (some graphs do not allow certain
    // types)

    /**
     * Removes all nodes from this graph
     * @method clear
     * @memberOf LGraph
     */
    clear() {
        this.stop();
        this.status = this.STATUS_STOPPED;

        this.last_node_id = 0;
        this.last_link_id = 0;

        this._version = -1; // used to detect changes

        // safe clear
        if (this._nodes) {
            for (const node of this._nodes) {
                if (node.onRemoved) node.onRemoved();
            }
        }

        // nodes
        this._nodes = [];
        this._nodes_by_id = {};
        this._nodes_in_order = []; // nodes sorted in execution order
        this._nodes_executable = null; // nodes that contain onExecute sorted in execution order

        // other scene stuff
        this._groups = [];

        // links
        this.links = {}; // container with all the links

        // iterations
        this.iteration = 0;

        // custom data
        this.config = {};
        this.vars = {};
        this.extra = {}; // to store custom data

        // timing
        this.globaltime = 0;
        this.runningtime = 0;
        this.fixedtime = 0;
        this.fixedtime_lapse = 0.01;
        this.elapsed_time = 0.01;
        this.last_update_time = 0;
        this.starttime = 0;

        this.catch_errors = true;

        // subgraph_data
        this.inputs = {};
        this.outputs = {};

        // notify canvas to redraw
        this.change();

        this.sendActionToCanvas("clear");
    }

    /**
     * Attach Canvas to this graph
     * @method attachCanvas
     * @param {GraphCanvas} graphcanvas
     * @memberOf LGraph
     */
    attachCanvas(graphcanvas) {
        if (graphcanvas.constructor !== LGraphCanvas) {
            throw new Error("attachCanvas expects a LGraphCanvas instance");
        }
        if (graphcanvas.graph && graphcanvas.graph !== this) {
            graphcanvas.graph.detachCanvas(graphcanvas);
        }

        graphcanvas.graph = this;

        if (!this.list_of_graphcanvas) this.list_of_graphcanvas = [];
        this.list_of_graphcanvas.push(graphcanvas);
    }

    /**
     * Detach Canvas from this graph
     * @method detachCanvas
     * @param {GraphCanvas} graphcanvas
     * @memberOf LGraph
     */
    detachCanvas(graphcanvas) {
        if (!this.list_of_graphcanvas) {
            return;
        }

        const pos = this.list_of_graphcanvas.indexOf(graphcanvas);
        if (pos === -1) {
            return;
        }
        graphcanvas.graph = null;
        this.list_of_graphcanvas.splice(pos, 1);
    }

    /**
     * Starts running this graph every interval milliseconds.
     * @method start
     * @param {number} interval amount of milliseconds between executions, if 0 then it renders to
     *     the monitor refresh rate
     * @memberOf LGraph
     */
    start(interval) {
        if (this.status === LGraph.STATUS_RUNNING) {
            return;
        }
        this.status = LGraph.STATUS_RUNNING;

        if (this.onPlayEvent) {
            this.onPlayEvent();
        }

        this.sendEventToAllNodes("onStart");

        // launch
        this.starttime = getTime();
        this.last_update_time = this.starttime;
        interval = interval || 0;
        const that = this;

        // execute once per frame
        if (interval === 0 && typeof window !== "undefined" && window.requestAnimationFrame) {
            // eslint-disable-next-line no-inner-declarations
            function onFrame() {
                if (that.execution_timer_id !== -1) {
                    return;
                }
                window.requestAnimationFrame(onFrame);
                if (that.onBeforeStep) that.onBeforeStep();
                that.runStep(1, !that.catch_errors);
                if (that.onAfterStep) that.onAfterStep();
            }

            this.execution_timer_id = -1;
            onFrame();
        } else { // execute every 'interval' ms
            this.execution_timer_id = setInterval(() => {
                // execute
                if (that.onBeforeStep) that.onBeforeStep();
                that.runStep(1, !that.catch_errors);
                if (that.onAfterStep) that.onAfterStep();
            }, interval);
        }
    }

    /**
     * Stops the execution loop of the graph
     * @method stop execution
     * @memberOf LGraph
     */
    stop() {
        if (this.status === LGraph.STATUS_STOPPED) {
            return;
        }

        this.status = LGraph.STATUS_STOPPED;

        if (this.onStopEvent) {
            this.onStopEvent();
        }

        if (this.execution_timer_id) {
            if (this.execution_timer_id !== -1) {
                clearInterval(this.execution_timer_id);
            }
            this.execution_timer_id = null;
        }

        this.sendEventToAllNodes("onStop");
    }

    /**
     * Run N steps (cycles) of the graph
     * @method runStep
     * @param {number} num number of steps to run, default is 1
     * @param {Boolean} doNotCatchError [optional] if you want to try/catch errors
     * @param {number} limit max number of nodes to execute (used to execute from start to a node)
     * @memberOf LGraph
     */
    runStep(num, doNotCatchError, limit) {
        num = num || 1;

        const start = getTime();
        this.globaltime = 0.001 * (start - this.starttime);

        const nodes = this._nodes_executable
            ? this._nodes_executable
            : this._nodes;
        if (!nodes) {
            return;
        }

        limit = limit || nodes.length;

        if (doNotCatchError) {
            // iterations
            for (let i = 0; i < num; i++) {
                for (let j = 0; j < limit; j++) {
                    const node = nodes[j];
                    if (node.mode === defaultConfig.ALWAYS && node.onExecute) {
                        node.onExecute(); // hard to send elapsed time
                    }
                }

                this.fixedtime += this.fixedtime_lapse;
                if (this.onExecuteStep) {
                    this.onExecuteStep();
                }
            }

            if (this.onAfterExecute) {
                this.onAfterExecute();
            }
        } else {
            try {
                // iterations
                for (let i = 0; i < num; i++) {
                    for (let j = 0; j < limit; ++j) {
                        const node = nodes[j];
                        if (node.mode === defaultConfig.ALWAYS && node.onExecute) {
                            node.onExecute();
                        }
                    }

                    this.fixedtime += this.fixedtime_lapse;
                    if (this.onExecuteStep) {
                        this.onExecuteStep();
                    }
                }

                if (this.onAfterExecute) {
                    this.onAfterExecute();
                }
                this.errors_in_execution = false;
            } catch (err) {
                this.errors_in_execution = true;
                if (defaultConfig.throw_errors) {
                    throw err;
                }
                if (defaultConfig.debug) {
                    console.log(`Error during execution: ${err}`);
                }
                this.stop();
            }
        }

        const now = getTime();
        let elapsed = now - start;
        if (elapsed === 0) {
            elapsed = 1;
        }
        this.execution_time = 0.001 * elapsed;
        this.globaltime += 0.001 * elapsed;
        this.iteration += 1;
        this.elapsed_time = (now - this.last_update_time) * 0.001;
        this.last_update_time = now;
    }

    /**
     * Updates the graph execution order according to relevance of the nodes (nodes with only
     * outputs have more relevance than nodes with only inputs.
     * @method updateExecutionOrder
     * @memberOf LGraph
     */
    updateExecutionOrder() {
        this._nodes_in_order = this.computeExecutionOrder(false);
        this._nodes_executable = [];
        for (const node of this._nodes_in_order) {
            if (node.onExecute) {
                this._nodes_executable.push(node);
            }
        }
    }

    /**
     * It computes the executable nodes in order and returns it
     * @param onlyOnExecute
     * @param setLevel
     * @returns {this}
     * @internal
     * @memberOf LGraph
     */
    computeExecutionOrder(onlyOnExecute, setLevel) {
        let L = [];
        const S = [];
        const M = {};
        const visitedLinks = {}; // to avoid repeating links
        const remainingLinks = {}; // to a

        // search for the nodes without inputs (starting nodes)
        for (const node of this._nodes) {
            if (onlyOnExecute && !node.onExecute) {
                continue;
            }

            M[node.id] = node; // add to pending nodes

            let num = 0; // num of input connections
            if (node.inputs) {
                for (let j = 0, l2 = node.inputs.length; j < l2; j++) {
                    if (node.inputs[j] && node.inputs[j].link != null) {
                        num += 1;
                    }
                }
            }

            if (num === 0) {
                // is a starting node
                S.push(node);
                if (setLevel) {
                    node._level = 1;
                }
            } else {
                if (setLevel) {
                    node._level = 0;
                }
                remainingLinks[node.id] = num;
            }
        }

        while (true) {
            if (S.length === 0) {
                break;
            }

            // get an starting node
            const node = S.shift();
            L.push(node); // add to ordered list
            delete M[node.id]; // remove from the pending nodes

            if (!node.outputs) {
                continue;
            }

            // for every output
            for (const output of node.outputs) {
                if (
                    output == null
                    || output.links == null
                    || output.links.length === 0
                ) {
                    continue;
                }

                // for every connection
                for (const linkId of output.links) {
                    const link = this.links[linkId];
                    if (!link) {
                        continue;
                    }

                    // already visited link (ignore it)
                    if (visitedLinks[link.id]) {
                        continue;
                    }

                    const targetNode = this.getNodeById(link.target_id);
                    if (targetNode == null) {
                        visitedLinks[link.id] = true;
                        continue;
                    }

                    if (
                        setLevel
                        && (!targetNode._level
                        || targetNode._level <= node._level)
                    ) {
                        targetNode._level = node._level + 1;
                    }

                    visitedLinks[link.id] = true; // mark as visited
                    remainingLinks[targetNode.id] -= 1; // reduce the number of links remaining
                    if (remainingLinks[targetNode.id] === 0) {
                        S.push(targetNode);
                    } // if no more links, then add to starters array
                }
            }
        }

        // the remaining ones (loops)
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const i in M) L.push(M[i]);

        if (L.length !== this._nodes.length && defaultConfig.debug) {
            console.warn("something went wrong, nodes missing");
        }

        const l = L.length;

        // save order number in the node
        for (let i = 0; i < l; i++) L[i].order = i;

        // sort now by priority
        L = L.sort((A, B) => {
            const Ap = A.constructor.priority || A.priority || 0;
            const Bp = B.constructor.priority || B.priority || 0;
            if (Ap === Bp) {
                // if same priority, sort by order
                return A.order - B.order;
            }
            return Ap - Bp; // sort by priority
        });

        // save order number in the node, again...
        for (let i = 0; i < l; ++i) L[i].order = i;

        return L;
    }

    /**
     * Returns all the nodes that could affect this one (ancestors) by crawling all the inputs
     * recursively. It doesn't include the node itself
     * @method getAncestors
     * @memberOf LGraph
     * @return {Array} an array with all the LGraphNodes that affect this node, in order of
     *     execution
     */
    // eslint-disable-next-line class-methods-use-this
    getAncestors(node) {
        const ancestors = [];
        const pending = [node];
        const visited = {};

        while (pending.length) {
            const current = pending.shift();
            if (!current.inputs) {
                continue;
            }
            if (!visited[current.id] && current !== node) {
                visited[current.id] = true;
                ancestors.push(current);
            }

            for (let i = 0; i < current.inputs.length; ++i) {
                const input = current.getInputNode(i);
                if (input && ancestors.indexOf(input) === -1) {
                    pending.push(input);
                }
            }
        }

        ancestors.sort((a, b) => a.order - b.order);
        return ancestors;
    }

    /**
     * Positions every node in a more readable manner
     * @method arrange
     * @memberOf LGraph
     */
    arrange(margin) {
        margin = margin || 100;

        const nodes = this.computeExecutionOrder(false, true);
        const columns = [];
        for (const node of nodes) {
            const col = node._level || 1;
            if (!columns[col]) {
                columns[col] = [];
            }
            columns[col].push(node);
        }

        let x = margin;

        for (const column of columns) {
            if (!column) {
                continue;
            }
            let maxSize = 100;
            let y = margin + defaultConfig.NODE_TITLE_HEIGHT;
            for (const node of column) {
                node.pos[0] = x;
                node.pos[1] = y;
                if (node.size[0] > maxSize) maxSize = node.size[0];
                y += node.size[1] + margin + defaultConfig.NODE_TITLE_HEIGHT;
            }
            x += maxSize + margin;
        }

        this.setDirtyCanvas(true, true);
    }

    /**
     * Returns the amount of time the graph has been running in milliseconds
     * @method getTime
     * @return {number} number of milliseconds the graph has been running
     * @memberOf LGraph
     */
    getTime() {
        return this.globaltime;
    }

    /**
     * Returns the amount of time accumulated using the fixedtime_lapse var. This is used in
     * context where the time increments should be constant
     * @method getFixedTime
     * @return {number} number of milliseconds the graph has been running
     * @memberOf LGraph
     */

    getFixedTime() {
        return this.fixedtime;
    }

    /**
     * Returns the amount of time it took to compute the latest iteration. Take into account that
     * this number could be not correct if the nodes are using graphical actions
     * @method getElapsedTime
     * @return {number} number of milliseconds it took the last cycle
     * @memberOf LGraph
     */

    getElapsedTime() {
        return this.elapsed_time;
    }

    /**
     * Sends an event to all the nodes, useful to trigger stuff
     * @method sendEventToAllNodes
     * @param {String} eventname the name of the event (function to be called)
     * @param {Array} params parameters in array format
     * @memberOf LGraph
     */
    sendEventToAllNodes(eventname, params, mode) {
        mode = mode || defaultConfig.ALWAYS;

        const nodes = this._nodes_in_order ? this._nodes_in_order : this._nodes;
        if (!nodes) {
            return;
        }

        for (let j = 0, l = nodes.length; j < l; ++j) {
            const node = nodes[j];

            if (
                node.constructor.name === "Subgraph"
                && eventname !== "onExecute"
            ) {
                if (node.mode === mode) {
                    node.sendEventToAllNodes(eventname, params, mode);
                }
                continue;
            }

            if (!node[eventname] || node.mode !== mode) {
                continue;
            }
            if (params === undefined) {
                node[eventname]();
            } else if (params && params.constructor === Array) {
                node[eventname](...params);
            } else {
                node[eventname](params);
            }
        }
    }

    sendActionToCanvas(action, params = []) {
        if (!this.list_of_graphcanvas) {
            return;
        }

        for (const c of this.list_of_graphcanvas) {
            if (c[action]) {
                c[action](...params);
            }
        }
    }

    /**
     * Adds a new node instance to this graph
     * @method add
     * @param {LGraphNode} node the instance of the node
     * @param {boolean} skipComputeOrder
     * @memberOf LGraph
     */

    add(node, skipComputeOrder) {
        if (!node) {
            return;
        }

        // groups
        if (node.constructor === LGraphGroup) {
            this._groups.push(node);
            this.setDirtyCanvas(true);
            this.change();
            node.graph = this;
            this._version++;
            return;
        }

        // nodes
        if (node.id !== -1 && this._nodes_by_id[node.id]) {
            console.warn(
                "LiteGraph: there is already a node with this ID, changing it",
            );
            node.id = ++this.last_node_id;
        }

        if (this._nodes.length >= defaultConfig.MAX_NUMBER_OF_NODES) {
            throw new Error("LiteGraph: max number of nodes in a graph reached");
        }

        // give him an id
        if (!node.id || node.id === -1) {
            node.id = ++this.last_node_id;
        } else if (this.last_node_id < node.id) {
            this.last_node_id = node.id;
        }

        node.graph = this;
        this._version++;

        this._nodes.push(node);
        this._nodes_by_id[node.id] = node;

        if (node.onAdded) node.onAdded(this);

        if (this.config.align_to_grid) node.alignToGrid();

        if (!skipComputeOrder) this.updateExecutionOrder();

        if (this.onNodeAdded) this.onNodeAdded(node);

        this.setDirtyCanvas(true);
        this.change();

        return node; // to chain actions
    }

    /**
     * Removes a node from the graph
     * @method remove
     * @param {LGraphNode} node the instance of the node
     * @memberOf LGraph
     */

    remove(node) {
        if (node.constructor.name === "LGraphGroup") {
            const index = this._groups.indexOf(node);
            if (index !== -1) {
                this._groups.splice(index, 1);
            }
            node.graph = null;
            this._version++;
            this.setDirtyCanvas(true, true);
            this.change();
            return;
        }

        if (this._nodes_by_id[node.id] == null) {
            return;
        } // not found

        if (node.ignore_remove) {
            return;
        } // cannot be removed

        this.beforeChange(); // sure?

        // disconnect inputs
        if (node.inputs) {
            for (let i = 0; i < node.inputs.length; i++) {
                const slot = node.inputs[i];
                if (slot.link != null) {
                    node.disconnectInput(i);
                }
            }
        }

        // disconnect outputs
        if (node.outputs) {
            for (let i = 0; i < node.outputs.length; i++) {
                const slot = node.outputs[i];
                if (slot.links != null && slot.links.length) {
                    node.disconnectOutput(i);
                }
            }
        }

        // node.id = -1; //why?

        // callback
        if (node.onRemoved) {
            node.onRemoved();
        }

        node.graph = null;
        this._version++;

        // remove from canvas render
        if (this.list_of_graphcanvas) {
            for (const canvas of this.list_of_graphcanvas) {
                if (canvas.selected_nodes[node.id]) {
                    delete canvas.selected_nodes[node.id];
                }
                if (canvas.node_dragged === node) {
                    canvas.node_dragged = null;
                }
            }
        }

        // remove from containers
        if (this._nodes.includes(node)) {
            this._nodes = this._nodes.filter(n => n !== node);
        }
        delete this._nodes_by_id[node.id];

        if (this.onNodeRemoved) {
            this.onNodeRemoved(node);
        }

        // close panels
        this.sendActionToCanvas("checkPanels");

        this.setDirtyCanvas(true, true);
        this.afterChange(); // sure?
        this.change();

        this.updateExecutionOrder();
    }

    /**
     * Returns a node by its id.
     * @method getNodeById
     * @param {Number} id
     * @memberOf LGraph
     */

    getNodeById(id) {
        if (id == null) {
            return null;
        }
        return this._nodes_by_id[id];
    }

    /**
     * Returns a list of nodes that matches a class
     * @method findNodesByClass
     * @param {Class} classObject the class itself (not an string)
     * @param {Array} result
     * @return {Array} a list with all the nodes of this type
     * @memberOf LGraph
     */
    findNodesByClass(classObject, result = []) {
        result.length = 0;
        for (const node of this._nodes) {
            if (node.constructor === classObject) result.push(node);
        }
        return result;
    }

    /**
     * Returns a list of nodes that matches a type
     * @method findNodesByType
     * @param {String} type the name of the node type
     * @param {Array} result
     * @return {Array} a list with all the nodes of this type
     * @memberOf LGraph
     */
    findNodesByType(type, result = []) {
        type = type.toLowerCase();
        result = result || [];
        result.length = 0;
        for (const node of this._nodes) {
            if (node.type.toLowerCase() === type) result.push(node);
        }
        return result;
    }

    /**
     * Returns the first node that matches a name in its title
     * @method findNodeByTitle
     * @param {String} title the name of the node to search
     * @return {Node} the node or null
     * @memberOf LGraph
     */
    findNodeByTitle(title) {
        for (const node of this._nodes) {
            if (node.title === title) return node;
        }
        return null;
    }

    /**
     * Returns a list of nodes that matches a name
     * @method findNodesByTitle
     * @param {String} title the name of the node to search
     * @return {Array} a list with all the nodes with this name
     * @memberOf LGraph
     */
    findNodesByTitle(title) {
        const result = [];
        for (const node of this._nodes) {
            if (node.title === title) result.push(node);
        }
        return result;
    }

    /**
     * Returns the top-most node in this position of the canvas
     * @method getNodeOnPos
     * @param {number} x the x coordinate in canvas space
     * @param {number} y the y coordinate in canvas space
     * @param {Array} nodesList a list with all the nodes to search from, by default is all the
     *     nodes in the graph
     * @param {number} margin
     * @return {LGraphNode} the node at this position or null
     * @memberOf LGraph
     */
    getNodeOnPos(x, y, nodesList = this._nodes, margin) {
        for (const n of nodesList) {
            if (n.isPointInside(x, y, margin)) return n;
        }
        return null;
    }

    /**
     * Returns the top-most group in that position
     * @method getGroupOnPos
     * @param {number} x the x coordinate in canvas space
     * @param {number} y the y coordinate in canvas space
     * @return {LGraphGroup} the group or null
     * @memberOf LGraph
     */
    getGroupOnPos(x, y) {
        for (const g of this._groups) {
            if (g.isPointInside(x, y, 2, true)) return g;
        }
        return null;
    }

    /**
     * Checks that the node type matches the node type registered, used when replacing a nodetype
     * by a newer version during execution this replaces the ones using the old version with the
     * new version
     * @method checkNodeTypes
     * @memberOf LGraph
     */
    checkNodeTypes() {
        for (let node of this._nodes) {
            const ctor = defaultConfig.registered_node_types[node.type];
            if (node.constructor === ctor) {
                continue;
            }
            console.log(`node being replaced by newer version: ${node.type}`);
            const newnode = LGraphNode.createNode(node.type);
            node = newnode;
            newnode.configure(node.serialize());
            newnode.graph = this;
            this._nodes_by_id[newnode.id] = newnode;
            if (node.inputs) {
                newnode.inputs = node.inputs.concat();
            }
            if (node.outputs) {
                newnode.outputs = node.outputs.concat();
            }
        }
        this.updateExecutionOrder();
    }

    onAction(action, param) {
        this._input_nodes = this.findNodesByClass(
            LiteGraph.GraphInput,
            this._input_nodes,
        );
        for (const node of this._input_nodes) {
            if (node.properties.name !== action) {
                continue;
            }
            node.onAction(action, param);
            break;
        }
    }

    trigger(action, param) {
        if (this.onTrigger) {
            this.onTrigger(action, param);
        }
    }

    /**
     * Tell this graph it has a global graph input of this type
     * @method addGlobalInput
     * @param {String} name
     * @param {String} type
     * @param {*} value [optional]
     * @memberOf LGraph
     */
    addInput(name, type, value) {
        const input = this.inputs[name];
        if (input) {
            // already exist
            return;
        }

        this.beforeChange();
        this.inputs[name] = {
            name,
            type,
            value,
        };
        this._version++;
        this.afterChange();

        if (this.onInputAdded) {
            this.onInputAdded(name, type);
        }

        if (this.onInputsOutputsChange) {
            this.onInputsOutputsChange();
        }
    }

    /**
     * Assign a data to the global graph input
     * @method setGlobalInputData
     * @param {String} name
     * @param {*} data
     * @memberOf LGraph
     */
    setInputData(name, data) {
        const input = this.inputs[name];
        if (!input) {
            return;
        }
        input.value = data;
    }

    /**
     * Returns the current value of a global graph input
     * @method getInputData
     * @param {String} name
     * @return {*} the data
     * @memberOf LGraph
     */
    getInputData(name) {
        const input = this.inputs[name];
        if (!input) {
            return null;
        }
        return input.value;
    }

    /**
     * Changes the newName of a global graph input
     * @method renameInput
     * @param {String} oldName
     * @param {String} new_name
     * @memberOf LGraph
     */
    renameInput(oldName, newName) {
        if (newName === oldName) {
            return;
        }

        if (!this.inputs[oldName]) {
            return false;
        }

        if (this.inputs[newName]) {
            console.error("there is already one input with that newName");
            return false;
        }

        this.inputs[newName] = this.inputs[oldName];
        delete this.inputs[oldName];
        this._version++;

        if (this.onInputRenamed) {
            this.onInputRenamed(oldName, newName);
        }

        if (this.onInputsOutputsChange) {
            this.onInputsOutputsChange();
        }
    }

    /**
     * Changes the type of a global graph input
     * @method changeInputType
     * @param {String} name
     * @param {String} type
     * @memberOf LGraph
     */
    changeInputType(name, type) {
        if (!this.inputs[name]) {
            return false;
        }

        if (
            this.inputs[name].type
            && String(this.inputs[name].type).toLowerCase()
            === String(type).toLowerCase()
        ) {
            return;
        }

        this.inputs[name].type = type;
        this._version++;
        if (this.onInputTypeChanged) {
            this.onInputTypeChanged(name, type);
        }
    }

    /**
     * Removes a global graph input
     * @method removeInput
     * @param {String} name
     * @memberOf LGraph
     */
    removeInput(name) {
        if (!this.inputs[name]) {
            return false;
        }

        delete this.inputs[name];
        this._version++;

        if (this.onInputRemoved) {
            this.onInputRemoved(name);
        }

        if (this.onInputsOutputsChange) {
            this.onInputsOutputsChange();
        }
        return true;
    }

    /**
     * Creates a global graph output
     * @method addOutput
     * @param {String} name
     * @param {String} type
     * @param {*} value
     * @memberOf LGraph
     */
    addOutput(name, type, value) {
        this.outputs[name] = {
            name,
            type,
            value,
        };
        this._version++;

        if (this.onOutputAdded) {
            this.onOutputAdded(name, type);
        }

        if (this.onInputsOutputsChange) {
            this.onInputsOutputsChange();
        }
    }

    /**
     * Assign a data to the global output
     * @method setOutputData
     * @param {String} name
     * @param {String} value
     * @memberOf LGraph
     */
    setOutputData(name, value) {
        const output = this.outputs[name];
        if (!output) {
            return;
        }
        output.value = value;
    }

    /**
     * Returns the current value of a global graph output
     * @method getOutputData
     * @param {String} name
     * @return {*} the data
     * @memberOf LGraph
     */
    getOutputData(name) {
        const output = this.outputs[name];
        if (!output) {
            return null;
        }
        return output.value;
    }

    /**
     * Renames a global graph output
     * @method renameOutput
     * @param {String} oldName
     * @param {String} newName
     * @memberOf LGraph
     */
    renameOutput(oldName, newName) {
        if (!this.outputs[oldName]) {
            return false;
        }

        if (this.outputs[newName]) {
            console.error("there is already one output with that newName");
            return false;
        }

        this.outputs[newName] = this.outputs[oldName];
        delete this.outputs[oldName];
        this._version++;

        if (this.onOutputRenamed) {
            this.onOutputRenamed(oldName, newName);
        }

        if (this.onInputsOutputsChange) {
            this.onInputsOutputsChange();
        }
    }

    /**
     * Changes the type of a global graph output
     * @method changeOutputType
     * @param {String} name
     * @param {String} type
     * @memberOf LGraph
     */
    changeOutputType(name, type) {
        if (!this.outputs[name]) {
            return false;
        }

        if (
            this.outputs[name].type
            && String(this.outputs[name].type).toLowerCase()
            === String(type).toLowerCase()
        ) {
            return;
        }

        this.outputs[name].type = type;
        this._version++;
        if (this.onOutputTypeChanged) {
            this.onOutputTypeChanged(name, type);
        }
    }

    /**
     * Removes a global graph output
     * @method removeOutput
     * @param {String} name
     * @memberOf LGraph
     */
    removeOutput(name) {
        if (!this.outputs[name]) {
            return false;
        }
        delete this.outputs[name];
        this._version++;

        if (this.onOutputRemoved) {
            this.onOutputRemoved(name);
        }

        if (this.onInputsOutputsChange) {
            this.onInputsOutputsChange();
        }
        return true;
    }

    triggerInput(name, value) {
        const nodes = this.findNodesByTitle(name);
        for (let i = 0; i < nodes.length; ++i) {
            nodes[i].onTrigger(value);
        }
    }

    setCallback(name, func) {
        const nodes = this.findNodesByTitle(name);
        for (let i = 0; i < nodes.length; ++i) {
            nodes[i].setTrigger(func);
        }
    }

    // used for undo, called before any change is made to the graph
    beforeChange(info) {
        if (this.onBeforeChange) {
            this.onBeforeChange(this, info);
        }
        this.sendActionToCanvas("onBeforeChange", this);
    }

    // used to resend actions, called after any change is made to the graph
    afterChange(info) {
        if (this.onAfterChange) {
            this.onAfterChange(this, info);
        }
        this.sendActionToCanvas("onAfterChange", this);
    }

    connectionChange(node) {
        this.updateExecutionOrder();
        if (this.onConnectionChange) {
            this.onConnectionChange(node);
        }
        this._version++;
        this.sendActionToCanvas("onConnectionChange");
    }

    /**
     * returns if the graph is in live mode
     * @method isLive
     * @memberOf LGraph
     */

    isLive() {
        if (!this.list_of_graphcanvas) {
            return false;
        }

        for (let i = 0; i < this.list_of_graphcanvas.length; ++i) {
            const c = this.list_of_graphcanvas[i];
            if (c.live_mode) {
                return true;
            }
        }
        return false;
    }

    /**
     * clears the triggered slot animation in all links (stop visual animation)
     * @method clearTriggeredSlots
     * @memberOf LGraph
     */
    clearTriggeredSlots() {
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const i in this.links) {
            const linkInfo = this.links[i];
            if (!linkInfo) {
                continue;
            }
            if (linkInfo._last_time) {
                linkInfo._last_time = 0;
            }
        }
    }

    /* Called when something visually changed (not the graph!) */
    change() {
        if (defaultConfig.debug) {
            console.log("Graph changed");
        }
        this.sendActionToCanvas("setDirty", [true, true]);
        if (this.on_change) this.on_change(this);
    }

    setDirtyCanvas(fg, bg) {
        this.sendActionToCanvas("setDirty", [fg, bg]);
    }

    /**
     * Destroys a link
     * @method removeLink
     * @param {Number} linkId
     * @memberOf LGraph
     */
    removeLink(linkId) {
        const link = this.links[linkId];
        if (!link) {
            return;
        }
        const node = this.getNodeById(link.target_id);
        if (node) {
            node.disconnectInput(link.target_slot);
        }
    }

    // save and recover app state ***************************************
    /**
     * Creates a Object containing all the info about this graph, it can be serialized
     * @method serialize
     * @return {Object} value of the node
     * @memberOf LGraph
     */
    serialize() {
        const nodesInfo = [];
        for (const node of this._nodes) {
            nodesInfo.push(node.serialize());
        }

        // pack link info into a non-verbose format
        const links = [];
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const i in this.links) {
            // links is an OBJECT
            let link = this.links[i];
            if (!link.serialize) {
                // weird bug I havent solved yet
                console.warn(
                    "weird LLink bug, link info is not a LLink but a regular object",
                );
                const link2 = new LLink();
                // eslint-disable-next-line guard-for-in,no-restricted-syntax
                for (const j in link) {
                    link2[j] = link[j];
                }
                this.links[i] = link2;
                link = link2;
            }

            links.push(link.serialize());
        }

        const groupsInfo = [];
        for (const group of this._groups) groupsInfo.push(group.serialize());

        const data = {
            last_node_id: this.last_node_id,
            last_link_id: this.last_link_id,
            nodes: nodesInfo,
            links,
            groups: groupsInfo,
            config: this.config,
            extra: this.extra,
            version: defaultConfig.VERSION,
        };

        if (this.onSerialize) this.onSerialize(data);

        return data;
    }

    /**
     * Configure a graph from a JSON string
     * @method configure
     * @param {String} str configure a graph from a JSON string
     * @param {Boolean} returns if there was any error parsing
     * @memberOf LGraph
     */
    configure(data, keepOld) {
        if (!data) {
            return;
        }

        if (!keepOld) this.clear();

        const { nodes } = data;

        // decode links info (they are very verbose)
        if (data.links && data.links.constructor === Array) {
            const links = [];
            for (const linkData of data.links) {
                if (!linkData) {
                    console.warn("serialized graph link data contains errors, skipping.");
                    continue;
                }
                const link = new LLink();
                link.configure(linkData);
                links[link.id] = link;
            }
            data.links = links;
        }

        // copy all stored fields
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const i in data) {
            if (i === "nodes" || i === "groups") {
                continue;
            }
            this[i] = data[i];
        }

        let error = false;

        // create nodes
        this._nodes = [];
        if (nodes) {
            for (const nInfo of nodes) {
                let node = LGraphNode.createNode(nInfo.type, nInfo.title);
                if (!node) {
                    if (defaultConfig.debug) {
                        console.log(
                            `Node not found or has errors: ${nInfo.type}`,
                        );
                    }

                    // in case of error we create a replacement node to avoid losing info
                    node = new LGraphNode();
                    node.last_serialization = nInfo;
                    node.has_errors = true;
                    error = true;
                    // continue;
                }

                node.id = nInfo.id; // id it or it will create a new id
                this.add(node, true); // add before configure, otherwise configure cannot create
                // links
            }

            // configure nodes afterwards so they can reach each other
            for (const nInfo of nodes) {
                const node = this.getNodeById(nInfo.id);
                if (node) {
                    node.configure(nInfo);
                }
            }
        }

        // groups
        this._groups.length = 0;
        if (data.groups) {
            for (const dataGroup of data.groups) {
                const group = new LGraphGroup();
                group.configure(dataGroup);
                this.add(group);
            }
        }

        this.updateExecutionOrder();

        this.extra = data.extra || {};

        if (this.onConfigure) this.onConfigure(data);

        this._version++;
        this.setDirtyCanvas(true, true);
        return error;
    }

    load(url, callback) {
        const that = this;

        // from file
        if (url.constructor === File || url.constructor === Blob) {
            const reader = new FileReader();
            reader.addEventListener("load", (event) => {
                const data = JSON.parse(event.target.result);
                that.configure(data);
                if (callback) callback();
            });

            reader.readAsText(url);
            return;
        }

        // is a string, then an URL
        const req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.send(null);
        req.onload(() => {
            if (req.status !== 200) {
                console.error("Error loading graph:", req.status, req.response);
                return;
            }
            const data = JSON.parse(req.response);
            that.configure(data);
            if (callback) callback();
        });
        req.onerror((err) => {
            console.error("Error loading graph:", err);
        });
    }

    /**
     * Node event manager
     * @todo Need create event
     * @param node
     * @param msg
     * @param color
     * @memberOf LGraph
     */
    onNodeTrace(node, msg, color) {
        // TODO
    }
}
