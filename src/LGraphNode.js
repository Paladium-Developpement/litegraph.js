import defaultConfig from "./utils/defaultConfig";
import cloneObject from "./utils/object";
import getTime from "./utils/time";
import { isValidConnection } from "./utils/function";
import LLink from "./LLink";
import { isInsideRectangle } from "./utils/math";

/*
title: string
pos: [x,y]
size: [x,y]

input|output: every connection
+  { name:string, type:string, pos: [x,y]=Optional, direction: "input"|"output", links: Array });

general properties:
+ clip_area: if you render outside the node, it will be clipped
+ unsafe_execution: not allowed for safe execution
+ skip_repeated_outputs: when adding new outputs, it wont show if there is one already connected
+ resizable: if set to false it wont be resizable with the mouse
+ horizontal: slots are distributed horizontally
+ widgets_start_y: widgets start at y distance from the top of the node

flags object:
+ collapsed: if it is collapsed

supported callbacks:
+ onAdded: when added to graph (warning: this is called BEFORE the node is configured when loading)
+ onRemoved: when removed from graph
+ onStart:	when the graph starts playing
+ onStop:	when the graph stops playing
+ onDrawForeground: render the inside widgets inside the node
+ onDrawBackground: render the background area inside the node (only in edit mode)
+ onMouseDown
+ onMouseMove
+ onMouseUp
+ onMouseEnter
+ onMouseLeave
+ onExecute: execute the node
+ onPropertyChanged: when a property is changed in the panel (return true to skip default behaviour)
+ onGetInputs: returns an array of possible inputs
+ onGetOutputs: returns an array of possible outputs
+ onBounding: in case this node has a bigger bounding than the node itself (the callback receives the bounding as [x,y,w,h])
+ onDblClick: double clicked in the node
+ onInputDblClick: input slot double clicked (can be used to automatically create a node connected)
+ onOutputDblClick: output slot double clicked (can be used to automatically create a node connected)
+ onConfigure: called after the node has been configured
+ onSerialize: to add extra info when serializing (the callback receives the object that should be filled with the data)
+ onSelected
+ onDeselected
+ onDropItem : DOM item dropped over the node
+ onDropFile : file dropped over the node
+ onConnectInput : if returns false the incoming connection will be canceled
+ onConnectionsChange : a connection changed (new one or removed) (LiteGraph.INPUT or LiteGraph.OUTPUT, slot, true if connected, link_info, input_info )
+ onAction: action slot triggered
+ getExtraMenuOptions: to add option to context menu
*/

export default class LGraphNode {
    /**
     * Base Class for all the node type classes
     * @class LGraphNode
     * @param {String} title a name for the node
     */
    constructor(title) {
        this.title = title || "Unnamed";
        this.size = [defaultConfig.NODE_WIDTH, 60];
        this.graph = null;
        this.id = -1; // not know till not added
        this.type = null;
        // inputs available: array of inputs
        this.inputs = [];
        this.outputs = [];
        this.connections = [];

        // local data
        this.properties = {}; // for the values
        this.properties_info = []; // for the info

        this.flags = {};
    }

    /**
     * Internal position array
     * @internal
     * @type {Float32Array}
     * @private
     */
    _pos = new Float32Array(10, 10)

    set pos(v) {
        if (!v || v.length < 2) {
            return;
        }
        this._pos[0] = v[0];
        this._pos[1] = v[1];
    }

    get pos() {
        return this._pos;
    }

    /**
     * configure a node from an object containing the serialized info
     * @method configure
     */
    configure(info) {
        if (this.graph) {
            this.graph._version++;
        }
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const j in info) {
            if (j === "properties") {
                // i don't want to clone properties, I want to reuse the old container
                // eslint-disable-next-line guard-for-in,no-restricted-syntax
                for (const k in info.properties) {
                    this.properties[k] = info.properties[k];
                    if (this.onPropertyChanged) {
                        this.onPropertyChanged(k, info.properties[k]);
                    }
                }
                continue;
            }

            if (info[j] == null) {
                continue;
            } else if (typeof info[j] === "object") {
                // object
                if (this[j] && this[j].configure) {
                    this[j].configure(info[j]);
                } else {
                    this[j] = cloneObject(info[j], this[j]);
                }
            } else {
                this[j] = info[j];
            }
        }

        if (!info.title) {
            this.title = this.constructor.title;
        }

        if (this.onConnectionsChange) {
            if (this.inputs) {
                for (let i = 0; i < this.inputs.length; ++i) {
                    const input = this.inputs[i];
                    const linkInfo = this.graph
                        ? this.graph.links[input.link]
                        : null;
                    this.onConnectionsChange(
                        defaultConfig.INPUT,
                        i,
                        true,
                        linkInfo,
                        input,
                    ); // linkInfo has been created now, so its updated
                }
            }

            if (this.outputs) {
                for (let i = 0; i < this.outputs.length; ++i) {
                    const output = this.outputs[i];
                    if (!output.links) {
                        continue;
                    }
                    for (let j = 0; j < output.links.length; ++j) {
                        const linkInfo = this.graph
                            ? this.graph.links[output.links[j]]
                            : null;
                        this.onConnectionsChange(
                            defaultConfig.OUTPUT,
                            i,
                            true,
                            linkInfo,
                            output,
                        ); // link_info has been created now, so its updated
                    }
                }
            }
        }

        if (this.widgets) {
            for (const widget of this.widgets) {
                if (!widget) continue;
                if (widget.options
                    && widget.options.property
                    // eslint-disable-next-line max-len
                    && this.properties[widget.options.property]) widget.value = JSON.parse(JSON.stringify(this.properties[widget.options.property]));
            }
            if (info.widgets_values) {
                for (let i = 0; i < info.widgets_values.length; ++i) {
                    if (this.widgets[i]) {
                        this.widgets[i].value = info.widgets_values[i];
                    }
                }
            }
        }

        if (this.onConfigure) {
            this.onConfigure(info);
        }
    }

    /**
     * serialize the content
     * @method serialize
     */

    serialize() {
        // create serialization object
        const o = {
            id: this.id,
            type: this.type,
            pos: this.pos,
            size: this.size,
            flags: cloneObject(this.flags),
            order: this.order,
            mode: this.mode,
        };

        // special case for when there were errors
        if (this.constructor === LGraphNode && this.last_serialization) {
            return this.last_serialization;
        }

        if (this.inputs) {
            o.inputs = this.inputs;
        }

        if (this.outputs) {
            // clear outputs last data (because data in connections is never serialized but stored
            // inside the outputs info)
            for (let i = 0; i < this.outputs.length; i++) {
                delete this.outputs[i]._data;
            }
            o.outputs = this.outputs;
        }

        if (this.title && this.title != this.constructor.title) {
            o.title = this.title;
        }

        if (this.properties) {
            o.properties = cloneObject(this.properties);
        }

        if (this.widgets && this.serialize_widgets) {
            o.widgets_values = [];
            for (let i = 0; i < this.widgets.length; ++i) {
                if (this.widgets[i]) {
                    o.widgets_values[i] = this.widgets[i].value;
                } else {
                    o.widgets_values[i] = null;
                }
            }
        }

        if (!o.type) o.type = this.constructor.type;

        if (this.color) o.color = this.color;
        if (this.bgcolor) o.bgcolor = this.bgcolor;
        if (this.boxcolor) o.boxcolor = this.boxcolor;
        if (this.shape) o.shape = this.shape;

        if (this.onSerialize) {
            if (this.onSerialize(o)) {
                console.warn(
                    "node onSerialize shouldnt return anything, data should be stored in the object pass in the first parameter",
                );
            }
        }

        return o;
    }

    /* Creates a clone of this node */
    clone() {
        const node = LGraphNode.createNode(this.type);
        if (!node) {
            return null;
        }

        // we clone it because serialize returns shared containers
        const data = LGraphNode.cloneObject(this.serialize());

        // remove links
        if (data.inputs) {
            for (let i = 0; i < data.inputs.length; ++i) {
                data.inputs[i].link = null;
            }
        }

        if (data.outputs) {
            for (let i = 0; i < data.outputs.length; ++i) {
                if (data.outputs[i].links) {
                    data.outputs[i].links.length = 0;
                }
            }
        }

        delete data.id;
        // remove links
        node.configure(data);

        return node;
    }

    /**
     * serialize and stringify
     * @method toString
     */

    toString() {
        return JSON.stringify(this.serialize());
    }

    // deserialize = function(info) {} //this cannot be done from within, must
    // be done in LiteGraph

    /**
     * get the title string
     * @method getTitle
     */

    getTitle() {
        return this.title || this.constructor.title;
    }

    /**
     * sets the value of a property
     * @method setProperty
     * @param {String} name
     * @param {*} value
     */
    setProperty(name, value) {
        if (!this.properties) {
            this.properties = {};
        }
        if (value === this.properties[name]) return;
        const prevValue = this.properties[name];
        this.properties[name] = value;
        if (this.onPropertyChanged && this.onPropertyChanged(name, value, prevValue) === false) {
            this.properties[name] = prevValue;
        }
        if (this.widgets) {
            for (let i = 0; i < this.widgets.length; ++i) {
                const w = this.widgets[i];
                if (!w) continue;
                if (w.options.property == name) {
                    w.value = value;
                    break;
                }
            }
        }
    }

    // Execution *************************
    /**
     * sets the output data
     * @method setOutputData
     * @param {number} slot
     * @param {*} data
     */
    setOutputData(slot, data) {
        if (!this.outputs) {
            return;
        }

        // this maybe slow and a niche case
        // if(slot && slot.constructor === String)
        //	slot = this.findOutputSlot(slot);

        if (slot == -1 || slot >= this.outputs.length) {
            return;
        }

        const output_info = this.outputs[slot];
        if (!output_info) {
            return;
        }

        // store data in the output itself in case we want to debug
        output_info._data = data;

        // if there are connections, pass the data to the connections
        if (this.outputs[slot].links) {
            for (let i = 0; i < this.outputs[slot].links.length; i++) {
                const link_id = this.outputs[slot].links[i];
                const link = this.graph.links[link_id];
                if (link) link.data = data;
            }
        }
    }

    /**
     * sets the output data type, useful when you want to be able to overwrite the data type
     * @method setOutputDataType
     * @param {number} slot
     * @param {String} datatype
     */
    setOutputDataType(slot, type) {
        if (!this.outputs) {
            return;
        }
        if (slot == -1 || slot >= this.outputs.length) {
            return;
        }
        const output_info = this.outputs[slot];
        if (!output_info) {
            return;
        }
        // store data in the output itself in case we want to debug
        output_info.type = type;

        // if there are connections, pass the data to the connections
        if (this.outputs[slot].links) {
            for (let i = 0; i < this.outputs[slot].links.length; i++) {
                const link_id = this.outputs[slot].links[i];
                this.graph.links[link_id].type = type;
            }
        }
    }

    /**
     * Retrieves the input data (data traveling through the connection) from one slot
     * @method getInputData
     * @param {number} slot
     * @param {boolean} force_update if set to true it will force the connected node of this slot
     *     to output data into this link
     * @return {*} data or if it is not connected returns undefined
     */
    getInputData(slot, force_update) {
        if (!this.inputs) {
            return;
        } // undefined;

        if (slot >= this.inputs.length || this.inputs[slot].link == null) {
            return;
        }

        const link_id = this.inputs[slot].link;
        const link = this.graph.links[link_id];
        if (!link) {
            // bug: weird case but it happens sometimes
            return null;
        }

        if (!force_update) {
            return link.data;
        }

        // special case: used to extract data from the incoming connection before the graph has
        // been executed
        const node = this.graph.getNodeById(link.origin_id);
        if (!node) {
            return link.data;
        }

        if (node.updateOutputData) {
            node.updateOutputData(link.origin_slot);
        } else if (node.onExecute) {
            node.onExecute();
        }

        return link.data;
    }

    /**
     * Retrieves the input data type (in case this supports multiple input types)
     * @method getInputDataType
     * @param {number} slot
     * @return {String} datatype in string format
     */
    getInputDataType(slot) {
        if (!this.inputs) {
            return null;
        } // undefined;

        if (slot >= this.inputs.length || this.inputs[slot].link == null) {
            return null;
        }
        const link_id = this.inputs[slot].link;
        const link = this.graph.links[link_id];
        if (!link) {
            // bug: weird case but it happens sometimes
            return null;
        }
        const node = this.graph.getNodeById(link.origin_id);
        if (!node) {
            return link.type;
        }
        const output_info = node.outputs[link.origin_slot];
        if (output_info) {
            return output_info.type;
        }
        return null;
    }

    /**
     * Retrieves the input data from one slot using its name instead of slot number
     * @method getInputDataByName
     * @param {String} slot_name
     * @param {boolean} force_update if set to true it will force the connected node of this slot
     *     to output data into this link
     * @return {*} data or if it is not connected returns null
     */
    getInputDataByName(
        slot_name,
        force_update,
    ) {
        const slot = this.findInputSlot(slot_name);
        if (slot == -1) {
            return null;
        }
        return this.getInputData(slot, force_update);
    }

    /**
     * tells you if there is a connection in one input slot
     * @method isInputConnected
     * @param {number} slot
     * @return {boolean}
     */
    isInputConnected(slot) {
        if (!this.inputs) {
            return false;
        }
        return slot < this.inputs.length && this.inputs[slot].link != null;
    }

    /**
     * tells you info about an input connection (which node, type, etc)
     * @method getInputInfo
     * @param {number} slot
     * @return {Object} object or null { link: id, name: string, type: string or 0 }
     */
    getInputInfo(slot) {
        if (!this.inputs) {
            return null;
        }
        if (slot < this.inputs.length) {
            return this.inputs[slot];
        }
        return null;
    }

    /**
     * Returns the link info in the connection of an input slot
     * @method getInputLink
     * @param {number} slot
     * @return {LLink} object or null
     */
    getInputLink(slot) {
        if (!this.inputs) {
            return null;
        }
        if (slot < this.inputs.length) {
            const slot_info = this.inputs[slot];
            return this.graph.links[slot_info.link];
        }
        return null;
    }

    /**
     * returns the node connected in the input slot
     * @method getInputNode
     * @param {number} slot
     * @return {LGraphNode} node or null
     */
    getInputNode(slot) {
        if (!this.inputs) {
            return null;
        }
        if (slot >= this.inputs.length) {
            return null;
        }
        const input = this.inputs[slot];
        if (!input || input.link === null) {
            return null;
        }
        const link_info = this.graph.links[input.link];
        if (!link_info) {
            return null;
        }
        return this.graph.getNodeById(link_info.origin_id);
    }

    /**
     * returns the value of an input with this name, otherwise checks if there is a property with
     * that name
     * @method getInputOrProperty
     * @param {string} name
     * @return {*} value
     */
    getInputOrProperty(name) {
        if (!this.inputs || !this.inputs.length) {
            return this.properties ? this.properties[name] : null;
        }

        for (let i = 0, l = this.inputs.length; i < l; ++i) {
            const input_info = this.inputs[i];
            if (name == input_info.name && input_info.link != null) {
                const link = this.graph.links[input_info.link];
                if (link) {
                    return link.data;
                }
            }
        }
        return this.properties[name];
    }

    /**
     * tells you the last output data that went in that slot
     * @method getOutputData
     * @param {number} slot
     * @return {Object}  object or null
     */
    getOutputData(slot) {
        if (!this.outputs) {
            return null;
        }
        if (slot >= this.outputs.length) {
            return null;
        }

        const info = this.outputs[slot];
        return info._data;
    }

    /**
     * tells you info about an output connection (which node, type, etc)
     * @method getOutputInfo
     * @param {number} slot
     * @return {Object}  object or null { name: string, type: string, links: [ ids of links in
     *     number ] }
     */
    getOutputInfo(slot) {
        if (!this.outputs) {
            return null;
        }
        if (slot < this.outputs.length) {
            return this.outputs[slot];
        }
        return null;
    }

    /**
     * tells you if there is a connection in one output slot
     * @method isOutputConnected
     * @param {number} slot
     * @return {boolean}
     */
    isOutputConnected(slot) {
        if (!this.outputs) {
            return false;
        }
        return (
            slot < this.outputs.length
            && this.outputs[slot].links
            && this.outputs[slot].links.length
        );
    }

    /**
     * tells you if there is any connection in the output slots
     * @method isAnyOutputConnected
     * @return {boolean}
     */
    isAnyOutputConnected() {
        if (!this.outputs) {
            return false;
        }
        for (let i = 0; i < this.outputs.length; ++i) {
            if (this.outputs[i].links && this.outputs[i].links.length) {
                return true;
            }
        }
        return false;
    }

    /**
     * retrieves all the nodes connected to this output slot
     * @method getOutputNodes
     * @param {number} slot
     * @return {array}
     */
    getOutputNodes(slot) {
        if (!this.outputs || this.outputs.length == 0) {
            return null;
        }

        if (slot >= this.outputs.length) {
            return null;
        }

        const output = this.outputs[slot];
        if (!output.links || output.links.length == 0) {
            return null;
        }

        const r = [];
        for (let i = 0; i < output.links.length; i++) {
            const link_id = output.links[i];
            const link = this.graph.links[link_id];
            if (link) {
                const target_node = this.graph.getNodeById(link.target_id);
                if (target_node) {
                    r.push(target_node);
                }
            }
        }
        return r;
    }

    /**
     * Triggers an event in this node, this will trigger any output with the same name
     * @method trigger
     * @param {String} event name ( "on_play", ... ) if action is equivalent to false then the
     *     event is send to all
     * @param {*} param
     */
    trigger(action, param) {
        if (!this.outputs || !this.outputs.length) {
            return;
        }

        if (this.graph) this.graph._last_trigger_time = getTime();

        for (let i = 0; i < this.outputs.length; ++i) {
            const output = this.outputs[i];
            if (!output || output.type !== defaultConfig.EVENT || (action && output.name != action)) continue;
            this.triggerSlot(i, param);
        }
    }

    /**
     * Triggers an slot event in this node
     * @method triggerSlot
     * @param {Number} slot the index of the output slot
     * @param {*} param
     * @param {Number} link_id [optional] in case you want to trigger and specific output link in a
     *     slot
     */
    triggerSlot(slot, param, link_id) {
        if (!this.outputs) {
            return;
        }

        const output = this.outputs[slot];
        if (!output) {
            return;
        }

        const { links } = output;
        if (!links || !links.length) {
            return;
        }

        if (this.graph) {
            this.graph._last_trigger_time = getTime();
        }

        // for every link attached here
        for (let k = 0; k < links.length; ++k) {
            const id = links[k];
            if (link_id != null && link_id != id) {
                // to skip links
                continue;
            }
            const link_info = this.graph.links[links[k]];
            if (!link_info) {
                // not connected
                continue;
            }
            link_info._last_time = getTime();
            const node = this.graph.getNodeById(link_info.target_id);
            if (!node) {
                // node not found?
                continue;
            }

            // used to mark events in graph
            const target_connection = node.inputs[link_info.target_slot];

            if (node.mode === defaultConfig.ON_TRIGGER) {
                if (node.onExecute) {
                    node.onExecute(param);
                }
            } else if (node.onAction) {
                node.onAction(target_connection.name, param);
            }
        }
    }

    /**
     * clears the trigger slot animation
     * @method clearTriggeredSlot
     * @param {Number} slot the index of the output slot
     * @param {Number} link_id [optional] in case you want to trigger and specific output link in a
     *     slot
     */
    clearTriggeredSlot(slot, link_id) {
        if (!this.outputs) {
            return;
        }

        const output = this.outputs[slot];
        if (!output) {
            return;
        }

        const { links } = output;
        if (!links || !links.length) {
            return;
        }

        // for every link attached here
        for (let k = 0; k < links.length; ++k) {
            const id = links[k];
            if (link_id != null && link_id != id) {
                // to skip links
                continue;
            }
            const link_info = this.graph.links[links[k]];
            if (!link_info) {
                // not connected
                continue;
            }
            link_info._last_time = 0;
        }
    }

    /**
     * changes node size and triggers callback
     * @method setSize
     * @param {vec2} size
     */
    setSize(size) {
        this.size = size;
        if (this.onResize) this.onResize(this.size);
    }

    /**
     * add a new property to this node
     * @method addProperty
     * @param {string} name
     * @param {*} default_value
     * @param {string} type string defining the output type ("vec3","number",...)
     * @param {Object} extra_info this can be used to have special properties of the property (like
     *     values, etc)
     */
    addProperty(
        name,
        default_value,
        type,
        extra_info,
    ) {
        const o = {
            name,
            type,
            default_value,
        };
        if (extra_info) {
            for (const i in extra_info) {
                o[i] = extra_info[i];
            }
        }
        if (!this.properties_info) {
            this.properties_info = [];
        }
        this.properties_info.push(o);
        if (!this.properties) {
            this.properties = {};
        }
        this.properties[name] = default_value;
        return o;
    }

    // connections

    /**
     * add a new output slot to use in this node
     * @method addOutput
     * @param {string} name
     * @param {string} type string defining the output type ("vec3","number",...)
     * @param {Object} extra_info this can be used to have special properties of an output (label,
     *     special color, position, etc)
     */
    addOutput(name, type, extra_info) {
        const o = {
            name,
            type,
            links: null,
        };
        if (extra_info) {
            for (const i in extra_info) {
                o[i] = extra_info[i];
            }
        }

        if (!this.outputs) {
            this.outputs = [];
        }
        this.outputs.push(o);
        if (this.onOutputAdded) {
            this.onOutputAdded(o);
        }
        this.setSize(this.computeSize());
        this.setDirtyCanvas(true, true);
        return o;
    }

    /**
     * add a new output slot to use in this node
     * @method addOutputs
     * @param {Array} array of triplets like [[name,type,extra_info],[...]]
     */
    addOutputs(array) {
        for (let i = 0; i < array.length; ++i) {
            const info = array[i];
            const o = {
                name: info[0],
                type: info[1],
                link: null,
            };
            if (array[2]) {
                for (const j in info[2]) {
                    o[j] = info[2][j];
                }
            }

            if (!this.outputs) {
                this.outputs = [];
            }
            this.outputs.push(o);
            if (this.onOutputAdded) {
                this.onOutputAdded(o);
            }
        }

        this.setSize(this.computeSize());
        this.setDirtyCanvas(true, true);
    }

    /**
     * remove an existing output slot
     * @method removeOutput
     * @param {number} slot
     */
    removeOutput(slot) {
        this.disconnectOutput(slot);
        this.outputs.splice(slot, 1);
        for (let i = slot; i < this.outputs.length; ++i) {
            if (!this.outputs[i] || !this.outputs[i].links) {
                continue;
            }
            const { links } = this.outputs[i];
            for (let j = 0; j < links.length; ++j) {
                const link = this.graph.links[links[j]];
                if (!link) {
                    continue;
                }
                link.origin_slot -= 1;
            }
        }

        this.setSize(this.computeSize());
        if (this.onOutputRemoved) {
            this.onOutputRemoved(slot);
        }
        this.setDirtyCanvas(true, true);
    }

    /**
     * add a new input slot to use in this node
     * @method addInput
     * @param {string} name
     * @param {string} type string defining the input type ("vec3","number",...), it its a generic
     *     one use 0
     * @param {Object} extra_info this can be used to have special properties of an input (label,
     *     color, position, etc)
     */
    addInput(name, type, extra_info) {
        type = type || 0;
        const o = {
            name,
            type,
            link: null,
        };
        if (extra_info) {
            for (const i in extra_info) {
                o[i] = extra_info[i];
            }
        }

        if (!this.inputs) {
            this.inputs = [];
        }

        this.inputs.push(o);
        this.setSize(this.computeSize());

        if (this.onInputAdded) {
            this.onInputAdded(o);
        }

        this.setDirtyCanvas(true, true);
        return o;
    }

    /**
     * add several new input slots in this node
     * @method addInputs
     * @param {Array} array of triplets like [[name,type,extra_info],[...]]
     */
    addInputs(array) {
        for (let i = 0; i < array.length; ++i) {
            const info = array[i];
            const o = {
                name: info[0],
                type: info[1],
                link: null,
            };
            if (array[2]) {
                for (const j in info[2]) {
                    o[j] = info[2][j];
                }
            }

            if (!this.inputs) {
                this.inputs = [];
            }
            this.inputs.push(o);
            if (this.onInputAdded) {
                this.onInputAdded(o);
            }
        }

        this.setSize(this.computeSize());
        this.setDirtyCanvas(true, true);
    }

    /**
     * remove an existing input slot
     * @method removeInput
     * @param {number} slot
     */
    removeInput(slot) {
        this.disconnectInput(slot);
        const slot_info = this.inputs.splice(slot, 1);
        for (let i = slot; i < this.inputs.length; ++i) {
            if (!this.inputs[i]) {
                continue;
            }
            const link = this.graph.links[this.inputs[i].link];
            if (!link) {
                continue;
            }
            link.target_slot -= 1;
        }
        this.setSize(this.computeSize());
        if (this.onInputRemoved) {
            this.onInputRemoved(slot, slot_info[0]);
        }
        this.setDirtyCanvas(true, true);
    }

    /**
     * add an special connection to this node (used for special kinds of graphs)
     * @method addConnection
     * @param {string} name
     * @param {string} type string defining the input type ("vec3","number",...)
     * @param {[x,y]} pos position of the connection inside the node
     * @param {string} direction if is input or output
     */
    addConnection(name, type, pos, direction) {
        const o = {
            name,
            type,
            pos,
            direction,
            links: null,
        };
        this.connections.push(o);
        return o;
    }

    /**
     * computes the minimum size of a node according to its inputs and output slots
     * @method computeSize
     * @param {number} minHeight
     * @return {number} the total size
     */
    computeSize(out) {
        if (this.constructor.size) {
            return this.constructor.size.concat();
        }

        let rows = Math.max(
            this.inputs ? this.inputs.length : 1,
            this.outputs ? this.outputs.length : 1,
        );
        const size = out || new Float32Array([0, 0]);
        rows = Math.max(rows, 1);
        var font_size = defaultConfig.NODE_TEXT_SIZE; // although it should be
        // graphcanvas.inner_text_font size

        var font_size = font_size;
        const title_width = compute_text_size(this.title);
        let input_width = 0;
        let output_width = 0;

        if (this.inputs) {
            for (var i = 0, l = this.inputs.length; i < l; ++i) {
                const input = this.inputs[i];
                var text = input.label || input.name || "";
                var text_width = compute_text_size(text);
                if (input_width < text_width) {
                    input_width = text_width;
                }
            }
        }

        if (this.outputs) {
            for (var i = 0, l = this.outputs.length; i < l; ++i) {
                const output = this.outputs[i];
                var text = output.label || output.name || "";
                var text_width = compute_text_size(text);
                if (output_width < text_width) {
                    output_width = text_width;
                }
            }
        }

        size[0] = Math.max(input_width + output_width + 10, title_width);
        size[0] = Math.max(size[0], defaultConfig.NODE_WIDTH);
        if (this.widgets && this.widgets.length) {
            size[0] = Math.max(size[0], defaultConfig.NODE_WIDTH * 1.5);
        }

        size[1] = (this.constructor.slot_start_y || 0) + rows * defaultConfig.NODE_SLOT_HEIGHT;

        let widgets_height = 0;
        if (this.widgets && this.widgets.length) {
            for (var i = 0, l = this.widgets.length; i < l; ++i) {
                if (this.widgets[i].computeSize) {
                    widgets_height += this.widgets[i].computeSize(size[0])[1] + 4;
                } else {
                    widgets_height += defaultConfig.NODE_WIDGET_HEIGHT + 4;
                }
            }
            widgets_height += 8;
        }

        // compute height using widgets height
        if (this.widgets_up) {
            size[1] = Math.max(size[1], widgets_height);
        } else if (this.widgets_start_y != null) {
            size[1] = Math.max(size[1], widgets_height + this.widgets_start_y);
        } else {
            size[1] += widgets_height;
        }

        function compute_text_size(text) {
            if (!text) {
                return 0;
            }
            return font_size * text.length * 0.6;
        }

        if (
            this.constructor.min_height
            && size[1] < this.constructor.min_height
        ) {
            size[1] = this.constructor.min_height;
        }

        size[1] += 6; // margin

        return size;
    }

    /**
     * returns all the info available about a property of this node.
     *
     * @method getPropertyInfo
     * @param {String} property name of the property
     * @return {Object} the object with all the available info
     */
    getPropertyInfo(property) {
        let info = null;

        // there are several ways to define info about a property
        // legacy mode
        if (this.properties_info) {
            for (let i = 0; i < this.properties_info.length; ++i) {
                if (this.properties_info[i].name == property) {
                    info = this.properties_info[i];
                    break;
                }
            }
        }
        // litescene mode using the constructor
        if (this.constructor[`@${property}`]) info = this.constructor[`@${property}`];

        if (this.constructor.widgets_info && this.constructor.widgets_info[property]) info = this.constructor.widgets_info[property];

        // litescene mode using the constructor
        if (!info && this.onGetPropertyInfo) {
            info = this.onGetPropertyInfo(property);
        }

        if (!info) info = {};
        if (!info.type) info.type = typeof this.properties[property];
        if (info.widget == "combo") info.type = "enum";

        return info;
    }

    /**
     * Defines a widget inside the node, it will be rendered on top of the node, you can control
     * lots of properties
     *
     * @method addWidget
     * @param {String} type the widget type (could be "number","string","combo"
     * @param {String} name the text to show on the widget
     * @param {String} value the default value
     * @param {Function|String} callback function to call when it changes (optionally, it can be
     *     the name of the property to modify)
     * @param {Object} options the object that contains special properties of this widget
     * @return {Object} the created widget object
     */
    addWidget(type, name, value, callback, options) {
        if (!this.widgets) {
            this.widgets = [];
        }

        if (!options && callback && callback.constructor === Object) {
            options = callback;
            callback = null;
        }

        if (options && options.constructor === String) // options can be the property name
        {
            options = { property: options };
        }

        if (callback && callback.constructor === String) // callback can be the property name
        {
            if (!options) options = {};
            options.property = callback;
            callback = null;
        }

        if (callback && callback.constructor !== Function) {
            console.warn("addWidget: callback must be a function");
            callback = null;
        }

        const w = {
            type: type.toLowerCase(),
            name,
            value,
            callback,
            options: options || {},
        };

        if (w.options.y) {
            w.y = w.options.y;
        }

        if (!callback && !w.options.callback && !w.options.property) {
            console.warn("LiteGraph addWidget(...) without a callback or property assigned");
        }
        if (type == "combo" && !w.options.values) {
            throw "LiteGraph addWidget('combo',...) requires to pass values in options: { values:['red','blue'] }";
        }
        this.widgets.push(w);
        this.setSize(this.computeSize());
        return w;
    }

    addCustomWidget(custom_widget) {
        if (!this.widgets) {
            this.widgets = [];
        }
        this.widgets.push(custom_widget);
        return custom_widget;
    }

    /**
     * returns the bounding of the object, used for rendering purposes
     * bounding is: [topleft_cornerx, topleft_cornery, width, height]
     * @method getBounding
     * @return {Float32Array[4]} the total size
     */
    getBounding(out) {
        out = out || new Float32Array(4);
        out[0] = this.pos[0] - 4;
        out[1] = this.pos[1] - defaultConfig.NODE_TITLE_HEIGHT;
        out[2] = this.size[0] + 4;
        out[3] = this.size[1] + defaultConfig.NODE_TITLE_HEIGHT;

        if (this.onBounding) {
            this.onBounding(out);
        }
        return out;
    }

    /**
     * checks if a point is inside the shape of a node
     * @method isPointInside
     * @param {number} x
     * @param {number} y
     * @return {boolean}
     */
    isPointInside(x, y, margin, skip_title) {
        margin = margin || 0;

        let margin_top = this.graph && this.graph.isLive() ? 0 : defaultConfig.NODE_TITLE_HEIGHT;
        if (skip_title) {
            margin_top = 0;
        }
        if (this.flags && this.flags.collapsed) {
            // if ( distance([x,y], [this.pos[0] + this.size[0]*0.5, this.pos[1] +
            // this.size[1]*0.5]) < LiteGraph.NODE_COLLAPSED_RADIUS)
            if (
                isInsideRectangle(
                    x,
                    y,
                    this.pos[0] - margin,
                    this.pos[1] - defaultConfig.NODE_TITLE_HEIGHT - margin,
                    (this._collapsed_width || defaultConfig.NODE_COLLAPSED_WIDTH)
                    + 2 * margin,
                    defaultConfig.NODE_TITLE_HEIGHT + 2 * margin,
                )
            ) {
                return true;
            }
        } else if (
            this.pos[0] - 4 - margin < x
            && this.pos[0] + this.size[0] + 4 + margin > x
            && this.pos[1] - margin_top - margin < y
            && this.pos[1] + this.size[1] + margin > y
        ) {
            return true;
        }
        return false;
    }

    /**
     * checks if a point is inside a node slot, and returns info about which slot
     * @method getSlotInPosition
     * @param {number} x
     * @param {number} y
     * @return {Object} if found the object contains { input|output: slot object, slot: number,
     *     link_pos: [x,y] }
     */
    getSlotInPosition(x, y) {
        // search for inputs
        const link_pos = new Float32Array(2);
        if (this.inputs) {
            for (var i = 0, l = this.inputs.length; i < l; ++i) {
                const input = this.inputs[i];
                this.getConnectionPos(true, i, link_pos);
                if (
                    isInsideRectangle(
                        x,
                        y,
                        link_pos[0] - 10,
                        link_pos[1] - 5,
                        20,
                        10,
                    )
                ) {
                    return {
                        input,
                        slot: i,
                        link_pos,
                    };
                }
            }
        }

        if (this.outputs) {
            for (var i = 0, l = this.outputs.length; i < l; ++i) {
                const output = this.outputs[i];
                this.getConnectionPos(false, i, link_pos);
                if (
                    isInsideRectangle(
                        x,
                        y,
                        link_pos[0] - 10,
                        link_pos[1] - 5,
                        20,
                        10,
                    )
                ) {
                    return {
                        output,
                        slot: i,
                        link_pos,
                    };
                }
            }
        }

        return null;
    }

    /**
     * returns the input slot with a given name (used for dynamic slots), -1 if not found
     * @method findInputSlot
     * @param {string} name the name of the slot
     * @return {number} the slot (-1 if not found)
     */
    findInputSlot(name) {
        if (!this.inputs) {
            return -1;
        }
        for (let i = 0, l = this.inputs.length; i < l; ++i) {
            if (name == this.inputs[i].name) {
                return i;
            }
        }
        return -1;
    }

    /**
     * returns the output slot with a given name (used for dynamic slots), -1 if not found
     * @method findOutputSlot
     * @param {string} name the name of the slot
     * @return {number} the slot (-1 if not found)
     */
    findOutputSlot(name) {
        if (!this.outputs) {
            return -1;
        }
        for (let i = 0, l = this.outputs.length; i < l; ++i) {
            if (name == this.outputs[i].name) {
                return i;
            }
        }
        return -1;
    }

    /**
     * connect this node output to the input of another node
     * @method connect
     * @param {number_or_string} slot (could be the number of the slot or the string with the name
     *     of the slot)
     * @param {LGraphNode} node the target node
     * @param {number_or_string} target_slot the input slot of the target node (could be the number
     *     of the slot or the string with the name of the slot, or -1 to connect a trigger)
     * @return {Object} the link_info is created, otherwise null
     */
    connect(slot, target_node, target_slot) {
        target_slot = target_slot || 0;

        if (!this.graph) {
            // could be connected before adding it to a graph
            console.log(
                "Connect: Error, node doesn't belong to any graph. Nodes must be added first to a graph before connecting them.",
            ); // due to link ids being associated with graphs
            return null;
        }

        // seek for the output slot
        if (slot.constructor === String) {
            slot = this.findOutputSlot(slot);
            if (slot == -1) {
                if (defaultConfig.debug) {
                    console.log(`Connect: Error, no slot of name ${slot}`);
                }
                return null;
            }
        } else if (!this.outputs || slot >= this.outputs.length) {
            if (defaultConfig.debug) {
                console.log("Connect: Error, slot number not found");
            }
            return null;
        }

        if (target_node && target_node.constructor === Number) {
            target_node = this.graph.getNodeById(target_node);
        }
        if (!target_node) {
            throw "target node is null";
        }

        // avoid loopback
        if (target_node == this) {
            return null;
        }

        // you can specify the slot by name
        if (target_slot.constructor === String) {
            target_slot = target_node.findInputSlot(target_slot);
            if (target_slot == -1) {
                if (defaultConfig.debug) {
                    console.log(
                        `Connect: Error, no slot of name ${target_slot}`,
                    );
                }
                return null;
            }
        } else if (target_slot === defaultConfig.EVENT) {
            // search for first slot with event?
            /*
    //create input for trigger
    var input = target_node.addInput("onTrigger", LiteGraph.EVENT );
    target_slot = target_node.inputs.length - 1; //last one is the one created
    target_node.mode = LiteGraph.ON_TRIGGER;
    */
            return null;
        } else if (
            !target_node.inputs
            || target_slot >= target_node.inputs.length
        ) {
            if (defaultConfig.debug) {
                console.log("Connect: Error, slot number not found");
            }
            return null;
        }

        let changed = false;

        // if there is something already plugged there, disconnect
        if (target_node.inputs[target_slot].link != null) {
            this.graph.beforeChange();
            target_node.disconnectInput(target_slot);
            changed = true;
        }

        // why here??
        // this.setDirtyCanvas(false,true);
        // this.graph.connectionChange( this );

        const output = this.outputs[slot];

        // allows nodes to block connection
        if (target_node.onConnectInput) {
            if (target_node.onConnectInput(target_slot, output.type, output, this, slot) === false) {
                return null;
            }
        }

        const input = target_node.inputs[target_slot];
        let link_info = null;

        // this slots cannot be connected (different types)
        if (!isValidConnection(output.type, input.type)) {
            this.setDirtyCanvas(false, true);
            if (changed) this.graph.connectionChange(this, link_info);
            return null;
        }

        if (!changed) this.graph.beforeChange();

        // create link class
        link_info = new LLink(
            ++this.graph.last_link_id,
            input.type,
            this.id,
            slot,
            target_node.id,
            target_slot,
        );

        // add to graph links list
        this.graph.links[link_info.id] = link_info;

        // connect in output
        if (output.links == null) {
            output.links = [];
        }
        output.links.push(link_info.id);
        // connect in input
        target_node.inputs[target_slot].link = link_info.id;
        if (this.graph) {
            this.graph._version++;
        }
        if (this.onConnectionsChange) {
            this.onConnectionsChange(
                defaultConfig.OUTPUT,
                slot,
                true,
                link_info,
                output,
            );
        } // link_info has been created now, so its updated
        if (target_node.onConnectionsChange) {
            target_node.onConnectionsChange(
                defaultConfig.INPUT,
                target_slot,
                true,
                link_info,
                input,
            );
        }
        if (this.graph && this.graph.onNodeConnectionChange) {
            this.graph.onNodeConnectionChange(
                defaultConfig.INPUT,
                target_node,
                target_slot,
                this,
                slot,
            );
            this.graph.onNodeConnectionChange(
                defaultConfig.OUTPUT,
                this,
                slot,
                target_node,
                target_slot,
            );
        }

        this.setDirtyCanvas(false, true);
        this.graph.afterChange();
        this.graph.connectionChange(this, link_info);

        return link_info;
    }

    /**
     * disconnect one output to an specific node
     * @method disconnectOutput
     * @param {number_or_string} slot (could be the number of the slot or the string with the name
     *     of the slot)
     * @param {LGraphNode} target_node the target node to which this slot is connected [Optional,
     *     if not target_node is specified all nodes will be disconnected]
     * @return {boolean} if it was disconnected successfully
     */
    disconnectOutput(slot, target_node) {
        if (slot.constructor === String) {
            slot = this.findOutputSlot(slot);
            if (slot == -1) {
                if (defaultConfig.debug) {
                    console.log(`Connect: Error, no slot of name ${slot}`);
                }
                return false;
            }
        } else if (!this.outputs || slot >= this.outputs.length) {
            if (defaultConfig.debug) {
                console.log("Connect: Error, slot number not found");
            }
            return false;
        }

        // get output slot
        const output = this.outputs[slot];
        if (!output || !output.links || output.links.length == 0) {
            return false;
        }

        // one of the output links in this slot
        if (target_node) {
            if (target_node.constructor === Number) {
                target_node = this.graph.getNodeById(target_node);
            }
            if (!target_node) {
                throw "Target Node not found";
            }

            for (var i = 0, l = output.links.length; i < l; i++) {
                var link_id = output.links[i];
                var link_info = this.graph.links[link_id];

                // is the link we are searching for...
                if (link_info.target_id == target_node.id) {
                    output.links.splice(i, 1); // remove here
                    var input = target_node.inputs[link_info.target_slot];
                    input.link = null; // remove there
                    delete this.graph.links[link_id]; // remove the link from the links pool
                    if (this.graph) {
                        this.graph._version++;
                    }
                    if (target_node.onConnectionsChange) {
                        target_node.onConnectionsChange(
                            defaultConfig.INPUT,
                            link_info.target_slot,
                            false,
                            link_info,
                            input,
                        );
                    } // link_info hasn't been modified so its ok
                    if (this.onConnectionsChange) {
                        this.onConnectionsChange(
                            defaultConfig.OUTPUT,
                            slot,
                            false,
                            link_info,
                            output,
                        );
                    }
                    if (this.graph && this.graph.onNodeConnectionChange) {
                        this.graph.onNodeConnectionChange(
                            defaultConfig.OUTPUT,
                            this,
                            slot,
                        );
                    }
                    if (this.graph && this.graph.onNodeConnectionChange) {
                        this.graph.onNodeConnectionChange(
                            defaultConfig.OUTPUT,
                            this,
                            slot,
                        );
                        this.graph.onNodeConnectionChange(
                            defaultConfig.INPUT,
                            target_node,
                            link_info.target_slot,
                        );
                    }
                    break;
                }
            }
        } // all the links in this output slot
        else {
            for (var i = 0, l = output.links.length; i < l; i++) {
                var link_id = output.links[i];
                var link_info = this.graph.links[link_id];
                if (!link_info) {
                    // bug: it happens sometimes
                    continue;
                }

                var target_node = this.graph.getNodeById(link_info.target_id);
                var input = null;
                if (this.graph) {
                    this.graph._version++;
                }
                if (target_node) {
                    input = target_node.inputs[link_info.target_slot];
                    input.link = null; // remove other side link
                    if (target_node.onConnectionsChange) {
                        target_node.onConnectionsChange(
                            defaultConfig.INPUT,
                            link_info.target_slot,
                            false,
                            link_info,
                            input,
                        );
                    } // link_info hasn't been modified so its ok
                    if (this.graph && this.graph.onNodeConnectionChange) {
                        this.graph.onNodeConnectionChange(
                            defaultConfig.INPUT,
                            target_node,
                            link_info.target_slot,
                        );
                    }
                }
                delete this.graph.links[link_id]; // remove the link from the links pool
                if (this.onConnectionsChange) {
                    this.onConnectionsChange(
                        defaultConfig.OUTPUT,
                        slot,
                        false,
                        link_info,
                        output,
                    );
                }
                if (this.graph && this.graph.onNodeConnectionChange) {
                    this.graph.onNodeConnectionChange(
                        defaultConfig.OUTPUT,
                        this,
                        slot,
                    );
                    this.graph.onNodeConnectionChange(
                        defaultConfig.INPUT,
                        target_node,
                        link_info.target_slot,
                    );
                }
            }
            output.links = null;
        }

        this.setDirtyCanvas(false, true);
        this.graph.connectionChange(this);
        return true;
    }

    /**
     * disconnect one input
     * @method disconnectInput
     * @param {number_or_string} slot (could be the number of the slot or the string with the name
     *     of the slot)
     * @return {boolean} if it was disconnected successfully
     */
    disconnectInput(slot) {
        // seek for the output slot
        if (slot.constructor === String) {
            slot = this.findInputSlot(slot);
            if (slot == -1) {
                if (defaultConfig.debug) {
                    console.log(`Connect: Error, no slot of name ${slot}`);
                }
                return false;
            }
        } else if (!this.inputs || slot >= this.inputs.length) {
            if (defaultConfig.debug) {
                console.log("Connect: Error, slot number not found");
            }
            return false;
        }

        const input = this.inputs[slot];
        if (!input) {
            return false;
        }

        const link_id = this.inputs[slot].link;
        if (link_id != null) {
            this.inputs[slot].link = null;

            // remove other side
            const link_info = this.graph.links[link_id];
            if (link_info) {
                const target_node = this.graph.getNodeById(link_info.origin_id);
                if (!target_node) {
                    return false;
                }

                const output = target_node.outputs[link_info.origin_slot];
                if (!output || !output.links || output.links.length == 0) {
                    return false;
                }

                // search in the inputs list for this link
                for (var i = 0, l = output.links.length; i < l; i++) {
                    if (output.links[i] == link_id) {
                        output.links.splice(i, 1);
                        break;
                    }
                }

                delete this.graph.links[link_id]; // remove from the pool
                if (this.graph) {
                    this.graph._version++;
                }
                if (this.onConnectionsChange) {
                    this.onConnectionsChange(
                        defaultConfig.INPUT,
                        slot,
                        false,
                        link_info,
                        input,
                    );
                }
                if (target_node.onConnectionsChange) {
                    target_node.onConnectionsChange(
                        defaultConfig.OUTPUT,
                        i,
                        false,
                        link_info,
                        output,
                    );
                }
                if (this.graph && this.graph.onNodeConnectionChange) {
                    this.graph.onNodeConnectionChange(
                        defaultConfig.OUTPUT,
                        target_node,
                        i,
                    );
                    this.graph.onNodeConnectionChange(defaultConfig.INPUT, this, slot);
                }
            }
        } // link != null

        this.setDirtyCanvas(false, true);
        if (this.graph) this.graph.connectionChange(this);
        return true;
    }

    /**
     * returns the center of a connection point in canvas coords
     * @method getConnectionPos
     * @param {boolean} is_input true if if a input slot, false if it is an output
     * @param {number_or_string} slot (could be the number of the slot or the string with the name
     *     of the slot)
     * @param {vec2} out [optional] a place to store the output, to free garbage
     * @return {[x,y]} the position
     * */
    getConnectionPos(
        is_input,
        slot_number,
        out,
    ) {
        out = out || new Float32Array(2);
        let num_slots = 0;
        if (is_input && this.inputs) {
            num_slots = this.inputs.length;
        }
        if (!is_input && this.outputs) {
            num_slots = this.outputs.length;
        }

        const offset = defaultConfig.NODE_SLOT_HEIGHT * 0.5;

        if (this.flags.collapsed) {
            const w = this._collapsed_width || defaultConfig.NODE_COLLAPSED_WIDTH;
            if (this.horizontal) {
                out[0] = this.pos[0] + w * 0.5;
                if (is_input) {
                    out[1] = this.pos[1] - defaultConfig.NODE_TITLE_HEIGHT;
                } else {
                    out[1] = this.pos[1];
                }
            } else {
                if (is_input) {
                    out[0] = this.pos[0];
                } else {
                    out[0] = this.pos[0] + w;
                }
                out[1] = this.pos[1] - defaultConfig.NODE_TITLE_HEIGHT * 0.5;
            }
            return out;
        }

        // weird feature that never got finished
        if (is_input && slot_number == -1) {
            out[0] = this.pos[0] + defaultConfig.NODE_TITLE_HEIGHT * 0.5;
            out[1] = this.pos[1] + defaultConfig.NODE_TITLE_HEIGHT * 0.5;
            return out;
        }

        // hard-coded pos
        if (
            is_input
            && num_slots > slot_number
            && this.inputs[slot_number].pos
        ) {
            out[0] = this.pos[0] + this.inputs[slot_number].pos[0];
            out[1] = this.pos[1] + this.inputs[slot_number].pos[1];
            return out;
        }
        if (
            !is_input
            && num_slots > slot_number
            && this.outputs[slot_number].pos
        ) {
            out[0] = this.pos[0] + this.outputs[slot_number].pos[0];
            out[1] = this.pos[1] + this.outputs[slot_number].pos[1];
            return out;
        }

        // horizontal distributed slots
        if (this.horizontal) {
            out[0] = this.pos[0] + (slot_number + 0.5) * (this.size[0] / num_slots);
            if (is_input) {
                out[1] = this.pos[1] - defaultConfig.NODE_TITLE_HEIGHT;
            } else {
                out[1] = this.pos[1] + this.size[1];
            }
            return out;
        }

        // default vertical slots
        if (is_input) {
            out[0] = this.pos[0] + offset;
        } else {
            out[0] = this.pos[0] + this.size[0] + 1 - offset;
        }
        out[1] = this.pos[1]
            + (slot_number + 0.7) * defaultConfig.NODE_SLOT_HEIGHT
            + (this.constructor.slot_start_y || 0);
        return out;
    }

    /* Force align to grid */
    alignToGrid() {
        this.pos[0] = defaultConfig.CANVAS_GRID_SIZE
            * Math.round(this.pos[0] / defaultConfig.CANVAS_GRID_SIZE);
        this.pos[1] = defaultConfig.CANVAS_GRID_SIZE
            * Math.round(this.pos[1] / defaultConfig.CANVAS_GRID_SIZE);
    }

    /* Console output */
    trace(msg) {
        if (!this.console) {
            this.console = [];
        }

        this.console.push(msg);
        if (this.console.length > LGraphNode.MAX_CONSOLE) {
            this.console.shift();
        }

        if (this.graph.onNodeTrace) this.graph.onNodeTrace(this, msg);
    }

    /* Forces to redraw or the main canvas (LGraphNode) or the bg canvas (links) */
    setDirtyCanvas(
        dirty_foreground,
        dirty_background,
    ) {
        if (!this.graph) {
            return;
        }
        this.graph.sendActionToCanvas("setDirty", [
            dirty_foreground,
            dirty_background,
        ]);
    }

    loadImage(url) {
        const img = new Image();
        img.src = defaultConfig.node_images_path + url;
        img.ready = false;

        img.onload = () => {
            img.ready = true;
            this.setDirtyCanvas(true);
        };
        return img;
    }

    // safe LGraphNode action execution (not sure if safe)
    /*
    executeAction = function(action)
    {
    if(action == "") return false;

    if( action.indexOf(";") != -1 || action.indexOf("}") != -1)
    {
    this.trace("Error: Action contains unsafe characters");
    return false;
    }

    var tokens = action.split("(");
    var func_name = tokens[0];
    if( typeof(this[func_name]) != "function")
    {
    this.trace("Error: Action not found on node: " + func_name);
    return false;
    }

    var code = action;

    try
    {
    var _foo = eval;
    eval = null;
    (new Function("with(this) { " + code + "}")).call(this);
    eval = _foo;
    }
    catch (err)
    {
    this.trace("Error executing action {" + action + "} :" + err);
    return false;
    }

    return true;
    }
    */

    /* Allows to get onMouseMove and onMouseUp events even if the mouse is out of focus */
    captureInput(v) {
        if (!this.graph || !this.graph.list_of_graphcanvas) {
            return;
        }

        const list = this.graph.list_of_graphcanvas;

        for (let i = 0; i < list.length; ++i) {
            const c = list[i];
            // releasing somebody elses capture?!
            if (!v && c.node_capturing_input != this) {
                continue;
            }

            // change
            c.node_capturing_input = v ? this : null;
        }
    }

    /**
     * Collapse the node to make it smaller on the canvas
     * @method collapse
     * */
    collapse(force) {
        this.graph._version++;
        if (this.constructor.collapsable === false && !force) {
            return;
        }
        this.flags.collapsed = !this.flags.collapsed;
        this.setDirtyCanvas(true, true);
    }

    /**
     * Forces the node to do not move or realign on Z
     * @method pin
     * */

    pin(v) {
        this.graph._version++;
        if (v === undefined) {
            this.flags.pinned = !this.flags.pinned;
        } else {
            this.flags.pinned = v;
        }
    }

    localToScreen(x, y, graphcanvas) {
        return [
            (x + this.pos[0]) * graphcanvas.scale + graphcanvas.offset[0],
            (y + this.pos[1]) * graphcanvas.scale + graphcanvas.offset[1],
        ];
    }

    /**
     * Create a node of a given type with a name. The node is not attached to any graph yet.
     * @method createNode
     * @param {String} type full name of the node class. p.e. "math/sin"
     * @param {String} name a name to distinguish from other nodes
     * @param {Object} options to set options
     */
    static createNode(type, title, options) {
        const baseClass = defaultConfig.registered_node_types[type];
        if (!baseClass) {
            if (defaultConfig.debug) console.log(`GraphNode type "${type}" not registered.`);
            return null;
        }

        const prototype = baseClass.prototype || baseClass;

        title = title || baseClass.title || type;

        let node = null;

        if (defaultConfig.catch_exceptions) {
            try {
                node = new baseClass(title);
            } catch (err) {
                console.error(err);
                return null;
            }
        } else {
            node = new baseClass(title);
        }

        node.type = type;

        if (!node.title && title) {
            node.title = title;
        }
        if (!node.properties) {
            node.properties = {};
        }
        if (!node.properties_info) {
            node.properties_info = [];
        }
        if (!node.flags) {
            node.flags = {};
        }
        if (!node.size) {
            node.size = node.computeSize();
            // call onresize?
        }
        if (!node.pos) {
            node.pos = defaultConfig.DEFAULT_POSITION.concat();
        }
        if (!node.mode) {
            node.mode = defaultConfig.ALWAYS;
        }

        // extra options
        if (options) {
            // eslint-disable-next-line
            for (const i in options) node[i] = options[i];
        }

        return node;
    }

    // debug purposes: reloads all the js scripts that matches a wildcard
    static reloadNodes(folderWildcard) {
        const tmp = document.getElementsByTagName("script");
        // weird, this array changes by its own, so we use a copy
        const scriptFiles = [];
        for (const t of tmp) scriptFiles.push(t);

        const docHeadObj = document.getElementsByTagName("head")[0];
        folderWildcard = document.location.href + folderWildcard;

        for (const script of scriptFiles) {
            const { src } = script;
            if (
                !src
                || src.substr(0, folderWildcard.length) !== folderWildcard
            ) continue;

            try {
                if (defaultConfig.debug) {
                    console.log(`Reloading: ${src}`);
                }
                const dynamicScript = document.createElement("script");
                dynamicScript.type = "text/javascript";
                dynamicScript.src = src;
                docHeadObj.appendChild(dynamicScript);
                docHeadObj.removeChild(scriptFiles[i]);
            } catch (err) {
                if (defaultConfig.throw_errors) {
                    throw err;
                }
                if (defaultConfig.debug) console.log(`Error while reloading ${src}`);
            }
        }

        if (defaultConfig.debug) {
            console.log("Nodes reloaded");
        }
    }

    /**
     * Adds this method to all nodetypes, existing and to be created
     * (You can add it to LGraphNode.prototype but then existing node types wont have it)
     * @method addNodeMethod
     * @param {Function} func
     */
    static addNodeMethod(name, func) {
        LGraphNode.prototype[name] = func;
        for (const i in defaultConfig.registered_node_types) {
            const type = defaultConfig.registered_node_types[i];
            if (type.prototype[name]) type.prototype[`_${name}`] = type.prototype[name];
            type.prototype[name] = func;
        }
    }

    static extendNode(object) {
        for (const i of Object.getOwnPropertyNames(LGraphNode.prototype)) {
            if (!object.prototype[i]) {
                object.prototype[i] = LGraphNode.prototype[i];
            }
        }
    }

}
