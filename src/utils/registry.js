/**
 * @module Registry Manager
 */

/**
 * removes a node type from the system
 * @method unregisterNodeType
 * @param {String|Object} type name of the node or the node constructor itself
 */
import defaultConfig from "./defaultConfig";

export function unregisterNodeType(type) {
    const baseClass = type.constructor === String ? defaultConfig.registered_node_types[type] : type;
    if (!baseClass) throw new Error(`node type not found: ${type}`);
    delete defaultConfig.registered_node_types[baseClass.type];
    if (baseClass.constructor.name) delete defaultConfig.Nodes[baseClass.constructor.name];
}

/**
 * Register a node class so it can be listed when the user wants to create a new one
 * @method registerNodeType
 * @param {LGraphNode} type name of the node and path
 * @param {Class} baseClass class containing the structure of a node
 */
export function registerNodeType(type, baseClass) {
    if (!baseClass.prototype) {
        throw new TypeError("Cannot register a simple object, it must be a class with a prototype");
    }
    baseClass.type = type;

    if (defaultConfig.debug) {
        console.log(`Node registered: ${type}`);
    }

    const classname = baseClass.name;

    const pos = type.lastIndexOf("/");
    baseClass.category = type.substr(0, pos);

    if (!baseClass.title) {
        baseClass.title = classname;
    }

    // info.name = name.substr(pos+1,name.length - pos);

    const prev = defaultConfig.registered_node_types[type];
    if (prev) {
        console.log(`replacing node type: ${type}`);
    } else {
        if (!Object.hasOwnProperty.call(baseClass.prototype, "shape")) {
            Object.defineProperty(baseClass.prototype, "shape", {
                set(v) {
                    switch (v) {
                        case "default":
                            delete this._shape;
                            break;
                        case "box":
                            this._shape = defaultConfig.BOX_SHAPE;
                            break;
                        case "round":
                            this._shape = defaultConfig.ROUND_SHAPE;
                            break;
                        case "circle":
                            this._shape = defaultConfig.CIRCLE_SHAPE;
                            break;
                        case "card":
                            this._shape = defaultConfig.CARD_SHAPE;
                            break;
                        default:
                            this._shape = v;
                    }
                },
                get() {
                    return this._shape;
                },
                enumerable: true,
                configurable: true,
            });
        }

        // warnings
        if (baseClass.prototype.onPropertyChange) {
            console.warn(
                `LiteGraph node class ${
                    type
                } has onPropertyChange method, it must be called onPropertyChanged with d at the end`,
            );
        }

        // used to know which nodes create when dragging files to the canvas
        if (baseClass.supported_extensions) {
            for (const ext of baseClass.supported_extensions) {
                if (ext && ext.constructor === String) {
                    defaultConfig.node_types_by_file_extension[ext.toLowerCase()] = baseClass;
                }
            }
        }
    }

    defaultConfig.registered_node_types[type] = baseClass;
    if (baseClass.constructor.name) defaultConfig.Nodes[classname] = baseClass;

    if (defaultConfig.onNodeTypeRegistered) defaultConfig.onNodeTypeRegistered(type, baseClass);
    if (prev && defaultConfig.onNodeTypeReplaced) {
        defaultConfig.onNodeTypeReplaced(type, baseClass, prev);
    }

    // warnings
    if (baseClass.prototype.onPropertyChange) {
        console.warn(
            `LiteGraph node class ${
                type
            } has onPropertyChange method, it must be called onPropertyChanged with d at the end`,
        );
    }

    // used to know which nodes create when dragging files to the canvas
    if (baseClass.supported_extensions) {
        for (const ext of baseClass.supported_extensions) {
            if (ext && ext.constructor === String) {
                defaultConfig.node_types_by_file_extension[ext.toLowerCase()] = baseClass;
            }
        }
    }
}

/**
 * Removes all previously registered node's types
 */
export function clearRegisteredTypes() {
    defaultConfig.registered_node_types = {};
    defaultConfig.node_types_by_file_extension = {};
    defaultConfig.Nodes = {};
    defaultConfig.searchbox_extras = {};
}

/**
 * Returns a registered node type with a given name
 * @method getNodeType
 * @param {String} type full name of the node class. p.e. "math/sin"
 * @return {Class} the node class
 */
export function getNodeType(type) {
    return defaultConfig.registered_node_types[type];
}

/**
 * Returns a list of node types matching one category
 * @method getNodeType
 * @param {String} category category name
 * @return {Array} array with all the node classes
 */
export function getNodeTypesInCategory(category, filter) {
    const r = [];
    // eslint-disable-next-line
    for (const i in defaultConfig.registered_node_types) {
        const type = defaultConfig.registered_node_types[i];
        if (type.filter !== filter) continue;

        if (category === "") {
            if (!type.category) r.push(type);
        } else if (type.category === category) {
            r.push(type);
        }
    }

    return defaultConfig.auto_sort_node_types ? r.sort() : r;
}

/**
 * Register a string in the search box so when the user types it it will recommend this node
 * @method registerSearchboxExtra
 * @param {String} nodeType the node recommended
 * @param {String} description text to show next to it
 * @param {Object} data it could contain info of how the node should be configured
 * @return {Boolean} true if they can be connected
 */
export function registerSearchboxExtra(nodeType, description, data) {
    defaultConfig.searchbox_extras[description.toLowerCase()] = {
        type: nodeType,
        desc: description,
        data,
    };
}
/**
 * Returns a list with all the node type categories
 * @method getNodeTypesCategories
 * @param {String} filter only nodes with ctor.filter equal can be shown
 * @return {Array} array with all the names of the categories
 */
export function getNodeTypesCategories(filter) {
    const categories = { "": 1 };
    // eslint-disable-next-line
    for (const id in defaultConfig.registered_node_types) {
        const type = defaultConfig.registered_node_types[id];
        if (type.category && !type.skip_list) {
            if (type.filter !== filter) continue;
            categories[type.category] = 1;
        }
    }
    const result = [];
    // eslint-disable-next-line
    for (const i in categories) result.push(i);
    return defaultConfig.auto_sort_node_types ? result.sort() : result;
}
