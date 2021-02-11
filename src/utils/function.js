/**
 * @module Function Utils
 */
import defaultConfig from "./defaultConfig";
import { registerNodeType } from "./registry";

// used to create nodes from wrapping function
export function getParameterNames(func) {
    return (`${func}`)
        .replace(/[/][/].*$/gm, "") // strip single-line comments
        .replace(/\s+/g, "") // strip white space
        .replace(/[/][*][^/*]*[*][/]/g, "") // strip multi-line comments  /**/
        .split("){", 1)[0]
        .replace(/^[^(]*[(]/, "") // extract the parameters
        .replace(/=[^,]+/g, "") // strip any ES6 defaults
        .split(",")
        .filter(Boolean); // split & filter [""]
}

/**
 * Create a new nodetype by passing a function, it wraps it with a proper class and
 * generates inputs according to the parameters of the function. Useful to wrap simple
 * methods that do not require properties, and that only process some input to generate an
 * output.
 * @method wrapFunctionAsNode
 * @param {String} name node name with namespace (p.e.: 'math/sum')
 * @param {Function} func
 * @param {Array} paramType [optional] an array containing the type of every parameter,
 *     otherwise parameters will accept any type
 * @param {String} returnType [optional] string with the return type, otherwise it will be
 *     generic
 * @param {Object} properties [optional] properties to be configurable
 */
export function wrapFunctionAsNode(
    name,
    func,
    paramType,
    returnType,
    properties,
) {
    const params = Array(func.length);
    let code = "";
    const names = getParameterNames(func);
    for (let i = 0; i < names.length; ++i) {
        code += `this.addInput('${names[i]}',${paramType && paramType[i] ? `'${paramType[i]}'` : "0"});\n`;
    }
    code += `this.addOutput('out',${returnType ? `'${returnType}'` : 0});\n`;
    if (properties) code += `this.properties = ${JSON.stringify(properties)};\n`;
    const classobj = Function("code");
    classobj.title = name.split("/").pop();
    classobj.desc = `Generated from ${func.name}`;
    classobj.prototype.onExecute = function onExecute() {
        for (let i = 0; i < params.length; ++i) {
            params[i] = this.getInputData(i);
        }
        const r = func.apply(this, params);
        this.setOutputData(0, r);
    };
    registerNodeType(name, classobj);
}
/**
 * Returns if the types of two slots are compatible (taking into account wildcards, etc)
 * @method isValidConnection
 * @param {String} typeA
 * @param {String} typeB
 * @return {Boolean} true if they can be connected
 */
export function isValidConnection(typeA, typeB) {
    if (
        !typeA
        || !typeB
        || typeA === typeB
        || (typeA === defaultConfig.EVENT && typeB === defaultConfig.ACTION)
    ) {
        return true;
    }

    // Enforce string type to handle toLowerCase call (-1 number not ok)
    typeA = String(typeA);
    typeB = String(typeB);
    typeA = typeA.toLowerCase();
    typeB = typeB.toLowerCase();

    // For nodes supporting multiple connection types
    if (typeA.indexOf(",") === -1 && typeB.indexOf(",") === -1) return typeA === typeB;

    // Check all permutations to see if one is valid
    const supportedTypesA = typeA.split(",");
    const supportedTypesB = typeB.split(",");
    for (let i = 0; i < supportedTypesA.length; ++i) {
        for (let j = 0; j < supportedTypesB.length; ++j) {
            if (supportedTypesA[i] === supportedTypesB[j]) {
                return true;
            }
        }
    }

    return false;
}
