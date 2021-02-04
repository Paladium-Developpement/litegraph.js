// *************************************************************
//   LiteGraph CLASS                                     *******
// *************************************************************

/**
 * The Global Scope. It contains all the registered node classes.
 *
 * @class LiteGraph
 * @constructor
 */

let LiteGraph = {
    VERSION: 0.4,

    CANVAS_GRID_SIZE: 10,

    NODE_TITLE_HEIGHT: 30,
    NODE_TITLE_TEXT_Y: 20,
    NODE_SLOT_HEIGHT: 20,
    NODE_WIDGET_HEIGHT: 20,
    NODE_WIDTH: 140,
    NODE_MIN_WIDTH: 50,
    NODE_COLLAPSED_RADIUS: 10,
    NODE_COLLAPSED_WIDTH: 80,
    NODE_TITLE_COLOR: "#999",
    NODE_SELECTED_TITLE_COLOR: "#FFF",
    NODE_TEXT_SIZE: 14,
    NODE_TEXT_COLOR: "#AAA",
    NODE_SUBTEXT_SIZE: 12,
    NODE_DEFAULT_COLOR: "#333",
    NODE_DEFAULT_BGCOLOR: "#353535",
    NODE_DEFAULT_BOXCOLOR: "#666",
    NODE_DEFAULT_SHAPE: "box",
    NODE_BOX_OUTLINE_COLOR: "#FFF",
    DEFAULT_SHADOW_COLOR: "rgba(0,0,0,0.5)",
    DEFAULT_GROUP_FONT: 24,

    WIDGET_BGCOLOR: "#222",
    WIDGET_OUTLINE_COLOR: "#666",
    WIDGET_TEXT_COLOR: "#DDD",
    WIDGET_SECONDARY_TEXT_COLOR: "#999",

    LINK_COLOR: "#9A9",
    EVENT_LINK_COLOR: "#A86",
    CONNECTING_LINK_COLOR: "#AFA",

    MAX_NUMBER_OF_NODES: 1000, // avoid infinite loops
    DEFAULT_POSITION: [100, 100], // default node position
    VALID_SHAPES: ["default", "box", "round", "card"], // ,"circle"

    // shapes are used for nodes but also for slots
    BOX_SHAPE: 1,
    ROUND_SHAPE: 2,
    CIRCLE_SHAPE: 3,
    CARD_SHAPE: 4,
    ARROW_SHAPE: 5,

    // enums
    INPUT: 1,
    OUTPUT: 2,

    EVENT: -1, // for outputs
    ACTION: -1, // for inputs

    ALWAYS: 0,
    ON_EVENT: 1,
    NEVER: 2,
    ON_TRIGGER: 3,

    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4,
    CENTER: 5,

    STRAIGHT_LINK: 0,
    LINEAR_LINK: 1,
    SPLINE_LINK: 2,

    NORMAL_TITLE: 0,
    NO_TITLE: 1,
    TRANSPARENT_TITLE: 2,
    AUTOHIDE_TITLE: 3,

    proxy: null, // used to redirect calls
    node_images_path: "",

    debug: false,
    catch_exceptions: true,
    throw_errors: true,
    allow_scripts: false,
    // if set to true some nodes like Formula would be allowed
    // to evaluate code that comes from unsafe sources
    // (like node configuration), which could lead to exploits
    registered_node_types: {}, // nodetypes by string
    node_types_by_file_extension: {}, // used for dropping files in the canvas
    Nodes: {}, // node types by classname
    Globals: {}, // used to store vars between graphs

    searchbox_extras: {}, // used to add extra features to the search box
    auto_sort_node_types: false,
    // If set to true, will automatically sort node types / categories in the context menus

    /**
     * Register a node class so it can be listed when the user wants to create a new one
     * @method registerNodeType
     * @param {String} type name of the node and path
     * @param {Class} base_class class containing the structure of a node
     */

    registerNodeType(type, base_class) {
        if (!base_class.prototype) {
            throw "Cannot register a simple object, it must be a class with a prototype";
        }
        base_class.type = type;

        if (LiteGraph.debug) {
            console.log(`Node registered: ${type}`);
        }

        const categories = type.split("/");
        const classname = base_class.name;

        const pos = type.lastIndexOf("/");
        base_class.category = type.substr(0, pos);

        if (!base_class.title) {
            base_class.title = classname;
        }
        // info.name = name.substr(pos+1,name.length - pos);

        // extend class
        if (base_class.prototype) {
            // is a class
            for (var i in LGraphNode.prototype) {
                if (!base_class.prototype[i]) {
                    base_class.prototype[i] = LGraphNode.prototype[i];
                }
            }
        }

        const prev = this.registered_node_types[type];
        if (prev) {
            console.log(`replacing node type: ${type}`);
        } else {
            if (!Object.hasOwnProperty(base_class.prototype, "shape")) {
                Object.defineProperty(base_class.prototype, "shape", {
                    set(v) {
                        switch (v) {
                            case "default":
                                delete this._shape;
                                break;
                            case "box":
                                this._shape = LiteGraph.BOX_SHAPE;
                                break;
                            case "round":
                                this._shape = LiteGraph.ROUND_SHAPE;
                                break;
                            case "circle":
                                this._shape = LiteGraph.CIRCLE_SHAPE;
                                break;
                            case "card":
                                this._shape = LiteGraph.CARD_SHAPE;
                                break;
                            default:
                                this._shape = v;
                        }
                    },
                    get(v) {
                        return this._shape;
                    },
                    enumerable: true,
                    configurable: true,
                });
            }

            // warnings
            if (base_class.prototype.onPropertyChange) {
                console.warn(
                    `LiteGraph node class ${
                        type
                    } has onPropertyChange method, it must be called onPropertyChanged with d at the end`,
                );
            }

            // used to know which nodes create when dragging files to the canvas
            if (base_class.supported_extensions) {
                for (var i in base_class.supported_extensions) {
                    var ext = base_class.supported_extensions[i];
                    if (ext && ext.constructor === String) this.node_types_by_file_extension[ext.toLowerCase()] = base_class;
                }
            }
        }

        this.registered_node_types[type] = base_class;
        if (base_class.constructor.name) {
            this.Nodes[classname] = base_class;
        }
        if (LiteGraph.onNodeTypeRegistered) {
            LiteGraph.onNodeTypeRegistered(type, base_class);
        }
        if (prev && LiteGraph.onNodeTypeReplaced) {
            LiteGraph.onNodeTypeReplaced(type, base_class, prev);
        }

        // warnings
        if (base_class.prototype.onPropertyChange) {
            console.warn(
                `LiteGraph node class ${
                    type
                } has onPropertyChange method, it must be called onPropertyChanged with d at the end`,
            );
        }

        // used to know which nodes create when dragging files to the canvas
        if (base_class.supported_extensions) {
            for (var i = 0; i < base_class.supported_extensions.length; i++) {
                var ext = base_class.supported_extensions[i];
                if (ext && ext.constructor === String) this.node_types_by_file_extension[ext.toLowerCase()] = base_class;
            }
        }
    },

    /**
     * removes a node type from the system
     * @method unregisterNodeType
     * @param {String|Object} type name of the node or the node constructor itself
     */
    unregisterNodeType(type) {
        const base_class = type.constructor === String ? this.registered_node_types[type] : type;
        if (!base_class) throw (`node type not found: ${type}`);
        delete this.registered_node_types[base_class.type];
        if (base_class.constructor.name) delete this.Nodes[base_class.constructor.name];
    },

    /**
     * Create a new nodetype by passing a function, it wraps it with a proper class and
     * generates inputs according to the parameters of the function. Useful to wrap simple
     * methods that do not require properties, and that only process some input to generate an
     * output.
     * @method wrapFunctionAsNode
     * @param {String} name node name with namespace (p.e.: 'math/sum')
     * @param {Function} func
     * @param {Array} param_types [optional] an array containing the type of every parameter,
     *     otherwise parameters will accept any type
     * @param {String} return_type [optional] string with the return type, otherwise it will be
     *     generic
     * @param {Object} properties [optional] properties to be configurable
     */
    wrapFunctionAsNode(
        name,
        func,
        param_types,
        return_type,
        properties,
    ) {
        const params = Array(func.length);
        let code = "";
        const names = LiteGraph.getParameterNames(func);
        for (let i = 0; i < names.length; ++i) {
            code
                += `this.addInput('${
                    names[i]
                }',${
                    param_types && param_types[i]
                        ? `'${param_types[i]}'`
                        : "0"
                });\n`;
        }
        code
            += `this.addOutput('out',${
                return_type ? `'${return_type}'` : 0
            });\n`;
        if (properties) {
            code
                += `this.properties = ${JSON.stringify(properties)};\n`;
        }
        const classobj = Function(code);
        classobj.title = name.split("/")
            .pop();
        classobj.desc = `Generated from ${func.name}`;
        classobj.prototype.onExecute = function onExecute() {
            for (let i = 0; i < params.length; ++i) {
                params[i] = this.getInputData(i);
            }
            const r = func.apply(this, params);
            this.setOutputData(0, r);
        };
        this.registerNodeType(name, classobj);
    },

    /**
     * Removes all previously registered node's types
     */
    clearRegisteredTypes() {
        this.registered_node_types = {};
        this.node_types_by_file_extension = {};
        this.Nodes = {};
        this.searchbox_extras = {};
    },

    /**
     * Adds this method to all nodetypes, existing and to be created
     * (You can add it to LGraphNode.prototype but then existing node types wont have it)
     * @method addNodeMethod
     * @param {Function} func
     */
    addNodeMethod(name, func) {
        LGraphNode.prototype[name] = func;
        for (const i in this.registered_node_types) {
            const type = this.registered_node_types[i];
            if (type.prototype[name]) {
                type.prototype[`_${name}`] = type.prototype[name];
            } // keep old in case of replacing
            type.prototype[name] = func;
        }
    },

    /**
     * Create a node of a given type with a name. The node is not attached to any graph yet.
     * @method createNode
     * @param {String} type full name of the node class. p.e. "math/sin"
     * @param {String} name a name to distinguish from other nodes
     * @param {Object} options to set options
     */

    createNode(type, title, options) {
        const base_class = this.registered_node_types[type];
        if (!base_class) {
            if (LiteGraph.debug) {
                console.log(
                    `GraphNode type "${type}" not registered.`,
                );
            }
            return null;
        }

        const prototype = base_class.prototype || base_class;

        title = title || base_class.title || type;

        let node = null;

        if (LiteGraph.catch_exceptions) {
            try {
                node = new base_class(title);
            } catch (err) {
                console.error(err);
                return null;
            }
        } else {
            node = new base_class(title);
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
            node.pos = LiteGraph.DEFAULT_POSITION.concat();
        }
        if (!node.mode) {
            node.mode = LiteGraph.ALWAYS;
        }

        // extra options
        if (options) {
            for (const i in options) {
                node[i] = options[i];
            }
        }

        return node;
    },

    /**
     * Returns a registered node type with a given name
     * @method getNodeType
     * @param {String} type full name of the node class. p.e. "math/sin"
     * @return {Class} the node class
     */
    getNodeType(type) {
        return this.registered_node_types[type];
    },

    /**
     * Returns a list of node types matching one category
     * @method getNodeType
     * @param {String} category category name
     * @return {Array} array with all the node classes
     */

    getNodeTypesInCategory(category, filter) {
        const r = [];
        for (const i in this.registered_node_types) {
            const type = this.registered_node_types[i];
            if (type.filter != filter) {
                continue;
            }

            if (category == "") {
                if (type.category == null) {
                    r.push(type);
                }
            } else if (type.category == category) {
                r.push(type);
            }
        }

        return this.auto_sort_node_types ? r.sort() : r;
    },

    /**
     * Returns a list with all the node type categories
     * @method getNodeTypesCategories
     * @param {String} filter only nodes with ctor.filter equal can be shown
     * @return {Array} array with all the names of the categories
     */
    getNodeTypesCategories(filter) {
        const categories = { "": 1 };
        for (var i in this.registered_node_types) {
            const type = this.registered_node_types[i];
            if (type.category && !type.skip_list) {
                if (type.filter != filter) continue;
                categories[type.category] = 1;
            }
        }
        const result = [];
        for (var i in categories) {
            result.push(i);
        }
        return this.auto_sort_node_types ? result.sort() : result;
    },

    // debug purposes: reloads all the js scripts that matches a wildcard
    reloadNodes(folder_wildcard) {
        const tmp = document.getElementsByTagName("script");
        // weird, this array changes by its own, so we use a copy
        const script_files = [];
        for (var i = 0; i < tmp.length; i++) {
            script_files.push(tmp[i]);
        }

        const docHeadObj = document.getElementsByTagName("head")[0];
        folder_wildcard = document.location.href + folder_wildcard;

        for (var i = 0; i < script_files.length; i++) {
            const { src } = script_files[i];
            if (
                !src
                || src.substr(0, folder_wildcard.length) != folder_wildcard
            ) {
                continue;
            }

            try {
                if (LiteGraph.debug) {
                    console.log(`Reloading: ${src}`);
                }
                const dynamicScript = document.createElement("script");
                dynamicScript.type = "text/javascript";
                dynamicScript.src = src;
                docHeadObj.appendChild(dynamicScript);
                docHeadObj.removeChild(script_files[i]);
            } catch (err) {
                if (LiteGraph.throw_errors) {
                    throw err;
                }
                if (LiteGraph.debug) {
                    console.log(`Error while reloading ${src}`);
                }
            }
        }

        if (LiteGraph.debug) {
            console.log("Nodes reloaded");
        }
    },

    // separated just to improve if it doesn't work
    cloneObject(obj, target) {
        if (obj == null) {
            return null;
        }
        const r = JSON.parse(JSON.stringify(obj));
        if (!target) {
            return r;
        }

        for (const i in r) {
            target[i] = r[i];
        }
        return target;
    },

    /**
     * Returns if the types of two slots are compatible (taking into account wildcards, etc)
     * @method isValidConnection
     * @param {String} type_a
     * @param {String} type_b
     * @return {Boolean} true if they can be connected
     */
    isValidConnection(type_a, type_b) {
        if (
            !type_a // generic output
            || !type_b // generic input
            || type_a == type_b // same type (is valid for triggers)
            || (type_a == LiteGraph.EVENT && type_b == LiteGraph.ACTION)
        ) {
            return true;
        }

        // Enforce string type to handle toLowerCase call (-1 number not ok)
        type_a = String(type_a);
        type_b = String(type_b);
        type_a = type_a.toLowerCase();
        type_b = type_b.toLowerCase();

        // For nodes supporting multiple connection types
        if (type_a.indexOf(",") == -1 && type_b.indexOf(",") == -1) {
            return type_a == type_b;
        }

        // Check all permutations to see if one is valid
        const supported_types_a = type_a.split(",");
        const supported_types_b = type_b.split(",");
        for (let i = 0; i < supported_types_a.length; ++i) {
            for (let j = 0; j < supported_types_b.length; ++j) {
                if (supported_types_a[i] == supported_types_b[j]) {
                    return true;
                }
            }
        }

        return false;
    },

    /**
     * Register a string in the search box so when the user types it it will recommend this node
     * @method registerSearchboxExtra
     * @param {String} node_type the node recommended
     * @param {String} description text to show next to it
     * @param {Object} data it could contain info of how the node should be configured
     * @return {Boolean} true if they can be connected
     */
    registerSearchboxExtra(node_type, description, data) {
        this.searchbox_extras[description.toLowerCase()] = {
            type: node_type,
            desc: description,
            data,
        };
    },

    /**
     * Wrapper to load files (from url using fetch or from file using FileReader)
     * @method fetchFile
     * @param {String|File|Blob} url the url of the file (or the file itself)
     * @param {String} type an string to know how to fetch it:
     *     "text","arraybuffer","json","blob"
     * @param {Function} on_complete callback(data)
     * @param {Function} on_error in case of an error
     * @return {FileReader|Promise} returns the object used to
     */
    fetchFile(url, type, on_complete, on_error) {
        const that = this;
        if (!url) return null;

        type = type || "text";
        if (url.constructor === String) {
            if (url.substr(0, 4) == "http" && LiteGraph.proxy) {
                url = LiteGraph.proxy + url.substr(url.indexOf(":") + 3);
            }
            return fetch(url)
                .then((response) => {
                    if (!response.ok) throw new Error("File not found"); // it will be catch
                    // below
                    if (type == "arraybuffer") return response.arrayBuffer();
                    if (type == "text" || type == "string") return response.text();
                    if (type == "json") return response.json();
                    if (type == "blob") return response.blob();
                })
                .then((data) => {
                    if (on_complete) on_complete(data);
                })
                .catch((error) => {
                    console.error("error fetching file:", url);
                    if (on_error) on_error(error);
                });
        }
        if (url.constructor === File || url.constructor === Blob) {
            const reader = new FileReader();
            reader.onload = function (e) {
                let v = e.target.result;
                if (type == "json") v = JSON.parse(v);
                if (on_complete) on_complete(v);
            };
            if (type == "arraybuffer") return reader.readAsArrayBuffer(url);
            if (type == "text" || type == "json") return reader.readAsText(url);
            if (type == "blob") return reader.readAsBinaryString(url);
        }
        return null;
    },
};

// timer that works everywhere
if (performance) {
    LiteGraph.getTime = performance.now.bind(performance);
} else if (Date && Date.now) {
    LiteGraph.getTime = Date.now.bind(Date);
} else if (process) {
    LiteGraph.getTime = () => {
        const t = process.hrtime();
        return t[0] * 0.001 + t[1] * 1e-6;
    };
} else {
    LiteGraph.getTime = function getTime() {
        return new Date().getTime();
    };
}
//* ***************************************



//* ********************************************************************************
// LGraphCanvas: LGraph renderer CLASS
//* ********************************************************************************


// API *************************************************
// like rect but rounded corners
if (typeof (window) !== "undefined" && window.CanvasRenderingContext2D) {
    window.CanvasRenderingContext2D.prototype.roundRect = function (
        x,
        y,
        width,
        height,
        radius,
        radius_low,
    ) {
        if (radius === undefined) {
            radius = 5;
        }

        if (radius_low === undefined) {
            radius_low = radius;
        }

        this.moveTo(x + radius, y);
        this.lineTo(x + width - radius, y);
        this.quadraticCurveTo(x + width, y, x + width, y + radius);

        this.lineTo(x + width, y + height - radius_low);
        this.quadraticCurveTo(
            x + width,
            y + height,
            x + width - radius_low,
            y + height,
        );
        this.lineTo(x + radius_low, y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - radius_low);
        this.lineTo(x, y + radius);
        this.quadraticCurveTo(x, y, x + radius, y);
    };
}

function compareObjects(a, b) {
    for (const i in a) {
        if (a[i] != b[i]) {
            return false;
        }
    }
    return true;
}

LiteGraph.compareObjects = compareObjects;

function distance(a, b) {
    return Math.sqrt(
        (b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]),
    );
}

LiteGraph.distance = distance;

function colorToString(c) {
    return (
        `rgba(${
            Math.round(c[0] * 255)
                .toFixed()
        },${
            Math.round(c[1] * 255)
                .toFixed()
        },${
            Math.round(c[2] * 255)
                .toFixed()
        },${
            c.length == 4 ? c[3].toFixed(2) : "1.0"
        })`
    );
}

LiteGraph.colorToString = colorToString;

function isInsideRectangle(x, y, left, top, width, height) {
    if (left < x && left + width > x && top < y && top + height > y) {
        return true;
    }
    return false;
}

LiteGraph.isInsideRectangle = isInsideRectangle;

// [minx,miny,maxx,maxy]
function growBounding(bounding, x, y) {
    if (x < bounding[0]) {
        bounding[0] = x;
    } else if (x > bounding[2]) {
        bounding[2] = x;
    }

    if (y < bounding[1]) {
        bounding[1] = y;
    } else if (y > bounding[3]) {
        bounding[3] = y;
    }
}

LiteGraph.growBounding = growBounding;

// point inside bounding box
function isInsideBounding(p, bb) {
    if (
        p[0] < bb[0][0]
        || p[1] < bb[0][1]
        || p[0] > bb[1][0]
        || p[1] > bb[1][1]
    ) {
        return false;
    }
    return true;
}

LiteGraph.isInsideBounding = isInsideBounding;

// bounding overlap, format: [ startx, starty, width, height ]
function overlapBounding(a, b) {
    const A_end_x = a[0] + a[2];
    const A_end_y = a[1] + a[3];
    const B_end_x = b[0] + b[2];
    const B_end_y = b[1] + b[3];

    if (
        a[0] > B_end_x
        || a[1] > B_end_y
        || A_end_x < b[0]
        || A_end_y < b[1]
    ) {
        return false;
    }
    return true;
}

LiteGraph.overlapBounding = overlapBounding;

// Convert a hex value to its decimal value - the inputted hex must be in the
//	format of a hex triplet - the kind we use for HTML colours. The function
//	will return an array with three values.
function hex2num(hex) {
    if (hex.charAt(0) == "#") {
        hex = hex.slice(1);
    } // Remove the '#' char - if there is one.
    hex = hex.toUpperCase();
    const hex_alphabets = "0123456789ABCDEF";
    const value = new Array(3);
    let k = 0;
    let int1;
    let
        int2;
    for (let i = 0; i < 6; i += 2) {
        int1 = hex_alphabets.indexOf(hex.charAt(i));
        int2 = hex_alphabets.indexOf(hex.charAt(i + 1));
        value[k] = int1 * 16 + int2;
        k++;
    }
    return value;
}

LiteGraph.hex2num = hex2num;

// Give a array with three values as the argument and the function will return
//	the corresponding hex triplet.
function num2hex(triplet) {
    const hex_alphabets = "0123456789ABCDEF";
    let hex = "#";
    let int1;
    let
        int2;
    for (let i = 0; i < 3; i++) {
        int1 = triplet[i] / 16;
        int2 = triplet[i] % 16;

        hex += hex_alphabets.charAt(int1) + hex_alphabets.charAt(int2);
    }
    return hex;
}

LiteGraph.num2hex = num2hex;

/* LiteGraph GUI elements used for canvas editing ************************************ */

/**
 * ContextMenu from LiteGUI
 *
 * @class ContextMenu
 * @constructor
 * @param {Array} values (allows object { title: "Nice text", callback: function ... })
 * @param {Object} options [optional] Some options:\
 * - title: title to show on top of the menu
 * - callback: function to call when an option is clicked, it receives the item information
 * - ignore_item_callbacks: ignores the callback inside the item, it just calls the
 *     options.callback
 * - event: you can pass a MouseEvent, this way the ContextMenu appears in that position
 */
function ContextMenu(values, options) {
    options = options || {};
    this.options = options;
    const that = this;

    // to link a menu with its parent
    if (options.parentMenu) {
        if (options.parentMenu.constructor !== this.constructor) {
            console.error(
                "parentMenu must be of class ContextMenu, ignoring it",
            );
            options.parentMenu = null;
        } else {
            this.parentMenu = options.parentMenu;
            this.parentMenu.lock = true;
            this.parentMenu.current_submenu = this;
        }
    }

    let eventClass = null;
    if (options.event) // use strings because comparing classes between windows doesnt work
    {
        eventClass = options.event.constructor.name;
    }
    if (eventClass !== "MouseEvent"
        && eventClass !== "CustomEvent"
        && eventClass !== "PointerEvent"
    ) {
        console.error(
            "Event passed to ContextMenu is not of type MouseEvent or CustomEvent. Ignoring it.",
        );
        options.event = null;
    }

    const root = document.createElement("div");
    root.className = "litegraph litecontextmenu litemenubar-panel";
    if (options.className) {
        root.className += ` ${options.className}`;
    }
    root.style.minWidth = 100;
    root.style.minHeight = 100;
    root.style.pointerEvents = "none";
    setTimeout(() => {
        root.style.pointerEvents = "auto";
    }, 100); // delay so the mouse up event is not caught by this element

    // this prevents the default context browser menu to open in case this menu was created
    // when pressing right button
    root.addEventListener(
        "mouseup",
        (e) => {
            e.preventDefault();
            return true;
        },
        true,
    );
    root.addEventListener(
        "contextmenu",
        (e) => {
            if (e.button != 2) {
                // right button
                return false;
            }
            e.preventDefault();
            return false;
        },
        true,
    );

    root.addEventListener(
        "mousedown",
        (e) => {
            if (e.button == 2) {
                that.close();
                e.preventDefault();
                return true;
            }
        },
        true,
    );

    function on_mouse_wheel(e) {
        const pos = parseInt(root.style.top);
        root.style.top = `${(pos + e.deltaY * options.scroll_speed).toFixed()}px`;
        e.preventDefault();
        return true;
    }

    if (!options.scroll_speed) {
        options.scroll_speed = 0.1;
    }

    root.addEventListener("wheel", on_mouse_wheel, true);
    root.addEventListener("mousewheel", on_mouse_wheel, true);

    this.root = root;

    // title
    if (options.title) {
        const element = document.createElement("div");
        element.className = "litemenu-title";
        element.innerHTML = options.title;
        root.appendChild(element);
    }

    // entries
    let num = 0;
    for (let i = 0; i < values.length; i++) {
        let name = values.constructor == Array ? values[i] : i;
        if (name != null && name.constructor !== String) {
            name = name.content === undefined ? String(name) : name.content;
        }
        const value = values[i];
        this.addItem(name, value, options);
        num++;
    }

    // close on leave
    root.addEventListener("mouseleave", (e) => {
        if (that.lock) {
            return;
        }
        if (root.closing_timer) {
            clearTimeout(root.closing_timer);
        }
        root.closing_timer = setTimeout(that.close.bind(that, e), 500);
        // that.close(e);
    });

    root.addEventListener("mouseenter", (e) => {
        if (root.closing_timer) {
            clearTimeout(root.closing_timer);
        }
    });

    // insert before checking position
    let root_document = document;
    if (options.event) {
        root_document = options.event.target.ownerDocument;
    }

    if (!root_document) {
        root_document = document;
    }

    if (root_document.fullscreenElement) {
        root_document.fullscreenElement.appendChild(root);
    } else {
        root_document.body.appendChild(root);
    }

    // compute best position
    let left = options.left || 0;
    let top = options.top || 0;
    if (options.event) {
        left = options.event.clientX - 10;
        top = options.event.clientY - 10;
        if (options.title) {
            top -= 20;
        }

        if (options.parentMenu) {
            const rect = options.parentMenu.root.getBoundingClientRect();
            left = rect.left + rect.width;
        }

        const body_rect = document.body.getBoundingClientRect();
        const root_rect = root.getBoundingClientRect();
        if (body_rect.height == 0) console.error("document.body height is 0. That is dangerous, set html,body { height: 100%; }");

        if (body_rect.width && left > body_rect.width - root_rect.width - 10) {
            left = body_rect.width - root_rect.width - 10;
        }
        if (body_rect.height && top > body_rect.height - root_rect.height - 10) {
            top = body_rect.height - root_rect.height - 10;
        }
    }

    root.style.left = `${left}px`;
    root.style.top = `${top}px`;

    if (options.scale) {
        root.style.transform = `scale(${options.scale})`;
    }
}

ContextMenu.prototype.addItem = function (name, value, options) {
    const that = this;
    options = options || {};

    const element = document.createElement("div");
    element.className = "litemenu-entry submenu";

    let disabled = false;

    if (value === null) {
        element.classList.add("separator");
        // element.innerHTML = "<hr/>"
        // continue;
    } else {
        element.innerHTML = value && value.title ? value.title : name;
        element.value = value;

        if (value) {
            if (value.disabled) {
                disabled = true;
                element.classList.add("disabled");
            }
            if (value.submenu || value.has_submenu) {
                element.classList.add("has_submenu");
            }
        }

        if (typeof value === "function") {
            element.dataset.value = name;
            element.onclick_callback = value;
        } else {
            element.dataset.value = value;
        }

        if (value.className) {
            element.className += ` ${value.className}`;
        }
    }

    this.root.appendChild(element);
    if (!disabled) {
        element.addEventListener("click", inner_onclick);
    }
    if (options.autoopen) {
        element.addEventListener("mouseenter", inner_over);
    }

    function inner_over(e) {
        const { value } = this;
        if (!value || !value.has_submenu) {
            return;
        }
        // if it is a submenu, autoopen like the item was clicked
        inner_onclick.call(this, e);
    }

    // menu option clicked
    function inner_onclick(e) {
        const { value } = this;
        let close_parent = true;

        if (that.current_submenu) {
            that.current_submenu.close(e);
        }

        // global callback
        if (options.callback) {
            var r = options.callback.call(
                this,
                value,
                options,
                e,
                that,
                options.node,
            );
            if (r === true) {
                close_parent = false;
            }
        }

        // special cases
        if (value) {
            if (
                value.callback
                && !options.ignore_item_callbacks
                && value.disabled !== true
            ) {
                // item callback
                var r = value.callback.call(
                    this,
                    value,
                    options,
                    e,
                    that,
                    options.extra,
                );
                if (r === true) {
                    close_parent = false;
                }
            }
            if (value.submenu) {
                if (!value.submenu.options) {
                    throw "ContextMenu submenu needs options";
                }
                const submenu = new that.constructor(value.submenu.options, {
                    callback: value.submenu.callback,
                    event: e,
                    parentMenu: that,
                    ignore_item_callbacks:
                    value.submenu.ignore_item_callbacks,
                    title: value.submenu.title,
                    extra: value.submenu.extra,
                    autoopen: options.autoopen,
                });
                close_parent = false;
            }
        }

        if (close_parent && !that.lock) {
            that.close();
        }
    }

    return element;
};

ContextMenu.prototype.close = function (e, ignore_parent_menu) {
    if (this.root.parentNode) {
        this.root.parentNode.removeChild(this.root);
    }
    if (this.parentMenu && !ignore_parent_menu) {
        this.parentMenu.lock = false;
        this.parentMenu.current_submenu = null;
        if (e === undefined) {
            this.parentMenu.close();
        } else if (
            e
            && !ContextMenu.isCursorOverElement(e, this.parentMenu.root)
        ) {
            ContextMenu.trigger(this.parentMenu.root, "mouseleave", e);
        }
    }
    if (this.current_submenu) {
        this.current_submenu.close(e, true);
    }

    if (this.root.closing_timer) {
        clearTimeout(this.root.closing_timer);
    }
};

// this code is used to trigger events easily (used in the context menu mouseleave
ContextMenu.trigger = function (element, event_name, params, origin) {
    const evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(event_name, true, true, params); // canBubble, cancelable, detail
    evt.srcElement = origin;
    if (element.dispatchEvent) {
        element.dispatchEvent(evt);
    } else if (element.__events) {
        element.__events.dispatchEvent(evt);
    }
    // else nothing seems binded here so nothing to do
    return evt;
};

// returns the top most menu
ContextMenu.prototype.getTopMenu = function () {
    if (this.options.parentMenu) {
        return this.options.parentMenu.getTopMenu();
    }
    return this;
};

ContextMenu.prototype.getFirstEvent = function () {
    if (this.options.parentMenu) {
        return this.options.parentMenu.getFirstEvent();
    }
    return this.options.event;
};

ContextMenu.isCursorOverElement = function (event, element) {
    const left = event.clientX;
    const top = event.clientY;
    const rect = element.getBoundingClientRect();
    if (!rect) {
        return false;
    }
    if (
        top > rect.top
        && top < rect.top + rect.height
        && left > rect.left
        && left < rect.left + rect.width
    ) {
        return true;
    }
    return false;
};

LiteGraph.ContextMenu = ContextMenu;

LiteGraph.closeAllContextMenus = function (ref_window) {
    ref_window = ref_window || window;

    const elements = ref_window.document.querySelectorAll(".litecontextmenu");
    if (!elements.length) {
        return;
    }

    const result = [];
    for (var i = 0; i < elements.length; i++) {
        result.push(elements[i]);
    }

    for (var i = 0; i < result.length; i++) {
        if (result[i].close) {
            result[i].close();
        } else if (result[i].parentNode) {
            result[i].parentNode.removeChild(result[i]);
        }
    }
};

LiteGraph.extendClass = function (target, origin) {
    for (var i in origin) {
        // copy class properties
        if (target.hasOwnProperty(i)) {
            continue;
        }
        target[i] = origin[i];
    }

    if (origin.prototype) {
        // copy prototype properties
        for (var i in origin.prototype) {
            // only enumerable
            if (!origin.prototype.hasOwnProperty(i)) {
                continue;
            }

            if (target.prototype.hasOwnProperty(i)) {
                // avoid overwriting existing ones
                continue;
            }

            // copy getters
            if (origin.prototype.__lookupGetter__(i)) {
                target.prototype.__defineGetter__(
                    i,
                    origin.prototype.__lookupGetter__(i),
                );
            } else {
                target.prototype[i] = origin.prototype[i];
            }

            // and setters
            if (origin.prototype.__lookupSetter__(i)) {
                target.prototype.__defineSetter__(
                    i,
                    origin.prototype.__lookupSetter__(i),
                );
            }
        }
    }
};

// used by some widgets to render a curve editor


LiteGraph.CurveEditor = CurveEditor;

// used to create nodes from wrapping functions
LiteGraph.getParameterNames = function (func) {
    return (`${func}`)
        .replace(/[/][/].*$/gm, "") // strip single-line comments
        .replace(/\s+/g, "") // strip white space
        .replace(/[/][*][^/*]*[*][/]/g, "") // strip multi-line comments  /**/
        .split("){", 1)[0]
        .replace(/^[^(]*[(]/, "") // extract the parameters
        .replace(/=[^,]+/g, "") // strip any ES6 defaults
        .split(",")
        .filter(Boolean); // split & filter [""]
};

Math.clamp = function (v, a, b) {
    return a > v ? a : b < v ? b : v;
};

if (typeof window !== "undefined" && !window.requestAnimationFrame) {
    window.requestAnimationFrame = window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
}

export default LiteGraph
