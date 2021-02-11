// basic nodes
(function (global) {
    const { LiteGraph } = global;

    // Constant
    function Time() {
        this.addOutput("in ms", "number");
        this.addOutput("in sec", "number");
    }
    Time.title = "Time";
    Time.desc = "Time";

    Time.prototype.onExecute = function () {
        this.setOutputData(0, this.graph.globaltime * 1000);
        this.setOutputData(1, this.graph.globaltime);
    };

    LiteGraph.LGraphNode.extendNode(Time);
    LiteGraph.registerNodeType("basic/time", Time);
    // Input for a subgraph

    class GraphInput extends LiteGraph.LGraphNode {
        constructor() {
            super("Input");
            this.addOutput("", "number");

            this.name_in_graph = "";
            this.properties = {
                name: "",
                type: "number",
                value: 0
            };

            var that = this;

            this.name_widget = this.addWidget(
                "text",
                "Name",
                this.properties.name,
                function(v) {
                    if (!v) {
                        return;
                    }
                    that.setProperty("name",v);
                }
            );
            this.type_widget = this.addWidget(
                "text",
                "Type",
                this.properties.type,
                function(v) {
                    that.setProperty("type",v);
                }
            );

            this.value_widget = this.addWidget(
                "number",
                "Value",
                this.properties.value,
                function(v) {
                    that.setProperty("value",v);
                }
            );

            this.widgets_up = true;
            this.size = [180, 90];
        }

        static title = "Input";

        static desc = "Input of the graph"

        onConfigure() {
            this.updateType();
        }

        updateType() {
            const { type } = this.properties;
            // update output
            if (this.outputs[0].type !== type) {
                if (!LiteGraph.isValidConnection(this.outputs[0].type, type)) this.disconnectOutput(0);
                this.outputs[0].type = type;
            }

            // update widget
            if (type === "number") {
                this.value_widget.type = "number";
                this.value_widget.value = 0;
            } else if (type === "boolean") {
                this.value_widget.type = "toggle";
                this.value_widget.value = true;
            } else if (type === "string") {
                this.value_widget.type = "text";
                this.value_widget.value = "";
            } else {
                this.value_widget.type = null;
                this.value_widget.value = null;
            }
            this.properties.value = this.value_widget.value;

            // update graph
            console.log(this.graph, this.name_in_graph);
            if (this.graph && this.name_in_graph) {
                this.graph.changeInputType(this.name_in_graph, type);
            }
        }

        onPropertyChanged(name, v) {
            if (name == "name") {
                if (v == "" || v == this.name_in_graph || v == "enabled") {
                    return false;
                }
                if (this.graph) {
                    if (this.name_in_graph) {
                        // already added
                        this.graph.renameInput(this.name_in_graph, v);
                    } else {
                        this.graph.addInput(v, this.properties.type);
                    }
                } // what if not?!
                this.name_widget.value = v;
                this.name_in_graph = v;
            } else if (name == "type") {
                this.updateType();
            } else if (name == "value") {
            }
        }

        getTitle() {
            if (this.flags.collapsed) {
                return this.properties.name;
            }
            return this.title;
        }

        onAction(action, param) {
            if (this.properties.type === LiteGraph.EVENT) this.triggerSlot(0, param);
        }

        onExecute() {
            const { name } = this.properties;
            // read from global input
            const data = this.graph.inputs[name];
            if (!data) {
                this.setOutputData(0, this.properties.value);
                return;
            }

            this.setOutputData(0, data.value ? data.value : this.properties.value);
        }

        onRemoved() {
            if (this.name_in_graph) {
                this.graph.removeInput(this.name_in_graph);
            }
        }
    }

    // this is executed AFTER the property has changed
    LiteGraph.GraphInput = GraphInput;
    LiteGraph.registerNodeType("graph/input", GraphInput);

    // Output for a subgraph
    function GraphOutput() {
        this.addInput("", "");

        this.name_in_graph = "";
        this.properties = {};
        const that = this;

        Object.defineProperty(this.properties, "name", {
            get() {
                return that.name_in_graph;
            },
            set(v) {
                if (v == "" || v == that.name_in_graph) {
                    return;
                }
                if (that.name_in_graph) {
                    // already added
                    that.graph.renameOutput(that.name_in_graph, v);
                } else {
                    that.graph.addOutput(v, that.properties.type);
                }
                that.name_widget.value = v;
                console.log("cc");
                that.name_in_graph = v;
            },
            enumerable: true,
        });

        Object.defineProperty(this.properties, "type", {
            get() {
                return that.inputs[0].type;
            },
            set(v) {
                if (v == "action" || v == "event") {
                    v = LiteGraph.ACTION;
                }
		        if (!LiteGraph.isValidConnection(that.inputs[0].type, v)) that.disconnectInput(0);
                that.inputs[0].type = v;
                if (that.name_in_graph) {
                    // already added
                    that.graph.changeOutputType(
                        that.name_in_graph,
                        that.inputs[0].type,
                    );
                }
                that.type_widget.value = v || "";
            },
            enumerable: true,
        });

        this.name_widget = this.addWidget("text", "Name", this.properties.name, "name");
        this.type_widget = this.addWidget("text", "Type", this.properties.type, "type");
        this.widgets_up = true;
        this.size = [180, 60];
    }

    GraphOutput.title = "Output";
    GraphOutput.desc = "Output of the graph";

    GraphOutput.prototype.onExecute = function () {
        this._value = this.getInputData(0);
        this.graph.setOutputData(this.properties.name, this._value);
    };

    GraphOutput.prototype.onAction = function (action, param) {
        if (this.properties.type == LiteGraph.ACTION) {
            this.graph.trigger(this.properties.name, param);
        }
    };

    GraphOutput.prototype.onRemoved = function () {
        if (this.name_in_graph) {
            this.graph.removeOutput(this.name_in_graph);
        }
    };

    GraphOutput.prototype.getTitle = function () {
        if (this.flags.collapsed) {
            return this.properties.name;
        }
        return this.title;
    };

    LiteGraph.GraphOutput = GraphOutput;
    LiteGraph.LGraphNode.extendNode(GraphOutput);
    LiteGraph.registerNodeType("graph/output", GraphOutput);

    // Constant
    function ConstantNumber() {
        this.addOutput("value", "number");
        this.addProperty("value", 1.0);
        this.widget = this.addWidget("number", "value", 1, "value");
        this.widgets_up = true;
        this.size = [180, 30];
    }

    ConstantNumber.title = "Const Number";
    ConstantNumber.desc = "Constant number";

    ConstantNumber.prototype.onExecute = function () {
        this.setOutputData(0, parseFloat(this.properties.value));
    };

    ConstantNumber.prototype.getTitle = function () {
        if (this.flags.collapsed) {
            return this.properties.value;
        }
        return this.title;
    };

    ConstantNumber.prototype.setValue = function (v) {
        this.setProperty("value", v);
    };

    ConstantNumber.prototype.onDrawBackground = function (ctx) {
        // show the current value
        this.outputs[0].label = this.properties.value.toFixed(3);
    };

    LiteGraph.LGraphNode.extendNode(ConstantNumber);
    LiteGraph.registerNodeType("basic/const", ConstantNumber);

    function ConstantBoolean() {
        this.addOutput("", "boolean");
        this.addProperty("value", true);
        this.widget = this.addWidget("toggle", "value", true, "value");
        this.widgets_up = true;
        this.size = [140, 30];
    }

    ConstantBoolean.title = "Const Boolean";
    ConstantBoolean.desc = "Constant boolean";
    ConstantBoolean.prototype.getTitle = ConstantNumber.prototype.getTitle;

    ConstantBoolean.prototype.onExecute = function () {
        this.setOutputData(0, this.properties.value);
    };

    ConstantBoolean.prototype.setValue = ConstantNumber.prototype.setValue;

    ConstantBoolean.prototype.onGetInputs = function () {
        return [["toggle", LiteGraph.ACTION]];
    };

    ConstantBoolean.prototype.onAction = function (action) {
        this.setValue(!this.properties.value);
    };

    LiteGraph.registerNodeType("basic/boolean", ConstantBoolean);

    function ConstantString() {
        this.addOutput("", "string");
        this.addProperty("value", "");
        this.widget = this.addWidget("text", "value", "", "value"); // link to property value
        this.widgets_up = true;
        this.size = [180, 30];
    }

    ConstantString.title = "Const String";
    ConstantString.desc = "Constant string";

    ConstantString.prototype.getTitle = ConstantNumber.prototype.getTitle;

    ConstantString.prototype.onExecute = function () {
        this.setOutputData(0, this.properties.value);
    };

    ConstantString.prototype.setValue = ConstantNumber.prototype.setValue;

    ConstantString.prototype.onDropFile = function (file) {
        const that = this;
        const reader = new FileReader();
        reader.onload = function (e) {
            that.setProperty("value", e.target.result);
        };
        reader.readAsText(file);
    };

    LiteGraph.LGraphNode.extendNode(ConstantString);
    LiteGraph.registerNodeType("basic/string", ConstantString);

    function ConstantObject() {
        this.addOutput("obj", "object");
        this.size = [120, 30];
        this._object = {};
    }

    ConstantObject.title = "Const Object";
    ConstantObject.desc = "Constant Object";

    ConstantObject.prototype.onExecute = function () {
        this.setOutputData(0, this._object);
    };

    LiteGraph.LGraphNode.extendNode(ConstantObject);
    LiteGraph.registerNodeType("basic/object", ConstantObject);

    function ConstantFile() {
        this.addInput("url", "");
        this.addOutput("", "");
        this.addProperty("url", "");
        this.addProperty("type", "text");
        this.widget = this.addWidget("text", "url", "", "url");
        this._data = null;
    }

    ConstantFile.title = "Const File";
    ConstantFile.desc = "Fetches a file from an url";
    ConstantFile["@type"] = { type: "enum", values: ["text", "arraybuffer", "blob", "json"] };

    ConstantFile.prototype.onPropertyChanged = function (name, value) {
        if (name == "url") {
            if (value == null || value == "") this._data = null;
            else {
                this.fetchFile(value);
            }
        }
    };

    ConstantFile.prototype.onExecute = function () {
        const url = this.getInputData(0) || this.properties.url;
        if (url && (url != this._url || this._type != this.properties.type)) this.fetchFile(url);
        this.setOutputData(0, this._data);
    };

    ConstantFile.prototype.setValue = ConstantNumber.prototype.setValue;

    ConstantFile.prototype.fetchFile = function (url) {
        const that = this;
        if (!url || url.constructor !== String) {
            that._data = null;
            that.boxcolor = null;
            return;
        }

        this._url = url;
        this._type = this.properties.type;
        if (url.substr(0, 4) == "http" && LiteGraph.proxy) {
            url = LiteGraph.proxy + url.substr(url.indexOf(":") + 3);
        }
        fetch(url)
            .then((response) => {
                if (!response.ok) throw new Error("File not found");

                if (that.properties.type == "arraybuffer") return response.arrayBuffer();
                if (that.properties.type == "text") return response.text();
                if (that.properties.type == "json") return response.json();
                if (that.properties.type == "blob") return response.blob();
            })
            .then((data) => {
                that._data = data;
                that.boxcolor = "#AEA";
            })
            .catch((error) => {
                that._data = null;
                that.boxcolor = "red";
                console.error("error fetching file:", url);
            });
    };

    ConstantFile.prototype.onDropFile = function (file) {
        const that = this;
        this._url = file.name;
        this._type = this.properties.type;
        this.properties.url = file.name;
        const reader = new FileReader();
        reader.onload = function (e) {
            that.boxcolor = "#AEA";
            let v = e.target.result;
            if (that.properties.type == "json") v = JSON.parse(v);
            that._data = v;
        };
        if (that.properties.type == "arraybuffer") reader.readAsArrayBuffer(file);
        else if (that.properties.type == "text" || that.properties.type == "json") reader.readAsText(file);
        else if (that.properties.type == "blob") return reader.readAsBinaryString(file);
    };

    LiteGraph.LGraphNode.extendNode(ConstantFile);
    LiteGraph.registerNodeType("basic/file", ConstantFile);

    // to store json objects
    function ConstantData() {
        this.addOutput("", "");
        this.addProperty("value", "");
        this.widget = this.addWidget("text", "json", "", "value");
        this.widgets_up = true;
        this.size = [140, 30];
        this._value = null;
    }

    ConstantData.title = "Const Data";
    ConstantData.desc = "Constant Data";

    ConstantData.prototype.onPropertyChanged = function (name, value) {
        this.widget.value = value;
        if (value == null || value == "") {
            return;
        }

        try {
            this._value = JSON.parse(value);
            this.boxcolor = "#AEA";
        } catch (err) {
            this.boxcolor = "red";
        }
    };

    ConstantData.prototype.onExecute = function () {
        this.setOutputData(0, this._value);
    };

    ConstantData.prototype.setValue = ConstantNumber.prototype.setValue;

    LiteGraph.LGraphNode.extendNode(ConstantData);
    LiteGraph.registerNodeType("basic/data", ConstantData);

    // to store json objects
    function ConstantArray() {
        this._value = [];
        this.addInput("", "");
        this.addOutput("", "array");
        this.addOutput("length", "number");
        this.addProperty("value", "[]");
        this.widget = this.addWidget("text", "array", this.properties.value, "value");
        this.widgets_up = true;
        this.size = [140, 50];
    }

    ConstantArray.title = "Const Array";
    ConstantArray.desc = "Constant Array";

    ConstantArray.prototype.onPropertyChanged = function (name, value) {
        this.widget.value = value;
        if (value == null || value == "") {
            return;
        }

        try {
            if (value[0] != "[") this._value = JSON.parse(`[${value}]`);
            else this._value = JSON.parse(value);
            this.boxcolor = "#AEA";
        } catch (err) {
            this.boxcolor = "red";
        }
    };

    ConstantArray.prototype.onExecute = function () {
        const v = this.getInputData(0);
        if (v && v.length) // clone
        {
            if (!this._value) this._value = new Array();
            this._value.length = v.length;
            for (let i = 0; i < v.length; ++i) this._value[i] = v[i];
        }
        this.setOutputData(0, this._value);
        this.setOutputData(1, this._value ? (this._value.length || 0) : 0);
    };

    ConstantArray.prototype.setValue = ConstantNumber.prototype.setValue;

    LiteGraph.LGraphNode.extendNode(ConstantArray);
    LiteGraph.registerNodeType("basic/array", ConstantArray);

    function SetArray() {
        this.addInput("arr", "array");
        this.addInput("value", "");
        this.addOutput("arr", "array");
        this.properties = { index: 0 };
        this.widget = this.addWidget("number", "i", this.properties.index, "index");
    }

    SetArray.title = "Set Array";
    SetArray.desc = "Sets index of array";

    SetArray.prototype.onExecute = function () {
        const arr = this.getInputData(0);
        if (!arr) return;
        const v = this.getInputData(1);
        if (v === undefined) return;
        if (this.properties.index) arr[Math.floor(this.properties.index)] = v;
        this.setOutputData(0, arr);
    };

    LiteGraph.LGraphNode.extendNode(SetArray);
    LiteGraph.registerNodeType("basic/set_array", SetArray);

    function ArrayElement() {
        this.addInput("array", "array,table,string");
        this.addInput("index", "number");
        this.addOutput("value", "");
        this.addProperty("index", 0);
    }

    ArrayElement.title = "Array[i]";
    ArrayElement.desc = "Returns an element from an array";

    ArrayElement.prototype.onExecute = function () {
        const array = this.getInputData(0);
        let index = this.getInputData(1);
        if (index == null) index = this.properties.index;
        if (array == null || index == null) return;
        this.setOutputData(0, array[Math.floor(Number(index))]);
    };

    LiteGraph.LGraphNode.extendNode(ArrayElement);
    LiteGraph.registerNodeType("basic/array[]", ArrayElement);

    function TableElement() {
        this.addInput("table", "table");
        this.addInput("row", "number");
        this.addInput("col", "number");
        this.addOutput("value", "");
        this.addProperty("row", 0);
        this.addProperty("column", 0);
    }

    TableElement.title = "Table[row][col]";
    TableElement.desc = "Returns an element from a table";

    TableElement.prototype.onExecute = function () {
        const table = this.getInputData(0);
        var row = this.getInputData(1);
        let col = this.getInputData(2);
        if (row == null) row = this.properties.row;
        if (col == null) col = this.properties.column;
        if (table == null || row == null || col == null) return;
        var row = table[Math.floor(Number(row))];
        if (row) this.setOutputData(0, row[Math.floor(Number(col))]);
        else this.setOutputData(0, null);
    };

    LiteGraph.LGraphNode.extendNode(TableElement);
    LiteGraph.registerNodeType("basic/table[][]", TableElement);

    function ObjectProperty() {
        this.addInput("obj", "");
        this.addOutput("", "");
        this.addProperty("value", "");
        this.widget = this.addWidget("text", "prop.", "", this.setValue.bind(this));
        this.widgets_up = true;
        this.size = [140, 30];
        this._value = null;
    }

    ObjectProperty.title = "Object property";
    ObjectProperty.desc = "Outputs the property of an object";

    ObjectProperty.prototype.setValue = function (v) {
        this.properties.value = v;
        this.widget.value = v;
    };

    ObjectProperty.prototype.getTitle = function () {
        if (this.flags.collapsed) {
            return `in.${this.properties.value}`;
        }
        return this.title;
    };

    ObjectProperty.prototype.onPropertyChanged = function (name, value) {
        this.widget.value = value;
    };

    ObjectProperty.prototype.onExecute = function () {
        const data = this.getInputData(0);
        if (data != null) {
            this.setOutputData(0, data[this.properties.value]);
        }
    };

    LiteGraph.LGraphNode.extendNode(ObjectProperty);
    LiteGraph.registerNodeType("basic/object_property", ObjectProperty);

    function ObjectKeys() {
        this.addInput("obj", "");
        this.addOutput("keys", "array");
        this.size = [140, 30];
    }

    ObjectKeys.title = "Object keys";
    ObjectKeys.desc = "Outputs an array with the keys of an object";

    ObjectKeys.prototype.onExecute = function () {
        const data = this.getInputData(0);
        if (data != null) {
            this.setOutputData(0, Object.keys(data));
        }
    };

    LiteGraph.LGraphNode.extendNode(ObjectKeys);
    LiteGraph.registerNodeType("basic/object_keys", ObjectKeys);

    function SetObject() {
        this.addInput("obj", "");
        this.addInput("value", "");
        this.addOutput("obj", "");
        this.properties = { property: "" };
        this.name_widget = this.addWidget("text", "prop.", this.properties.property, "property");
    }

    SetObject.title = "Set Object";
    SetObject.desc = "Adds propertiesrty to object";

    SetObject.prototype.onExecute = function () {
        const obj = this.getInputData(0);
        if (!obj) return;
        const v = this.getInputData(1);
        if (v === undefined) return;
        if (this.properties.property) obj[this.properties.property] = v;
        this.setOutputData(0, obj);
    };

    LiteGraph.LGraphNode.extendNode(SetObject);
    LiteGraph.registerNodeType("basic/set_object", SetObject);

    function MergeObjects() {
        this.addInput("A", "");
        this.addInput("B", "");
        this.addOutput("", "");
        this._result = {};
        const that = this;
        this.addWidget("button", "clear", "", () => {
            that._result = {};
        });
        this.size = this.computeSize();
    }

    MergeObjects.title = "Merge Objects";
    MergeObjects.desc = "Creates an object copying properties from others";

    MergeObjects.prototype.onExecute = function () {
        const A = this.getInputData(0);
        const B = this.getInputData(1);
        const C = this._result;
        if (A) for (var i in A) C[i] = A[i];
        if (B) for (var i in B) C[i] = B[i];
        this.setOutputData(0, C);
    };

    LiteGraph.LGraphNode.extendNode(MergeObjects);
    LiteGraph.registerNodeType("basic/merge_objects", MergeObjects);

    // Store as variable
    function Variable() {
        this.size = [60, 30];
        this.addInput("in");
        this.addOutput("out");
        this.properties = { varname: "myname", container: Variable.LITEGRAPH };
        this.value = null;
    }

    Variable.title = "Variable";
    Variable.desc = "store/read variable value";

    Variable.LITEGRAPH = 0; // between all graphs
    Variable.GRAPH = 1;	// only inside this graph
    Variable.GLOBALSCOPE = 2;	// attached to Window

    Variable["@container"] = { type: "enum", values: { litegraph: Variable.LITEGRAPH, graph: Variable.GRAPH, global: Variable.GLOBALSCOPE } };

    Variable.prototype.onExecute = function () {
        const container = this.getContainer();

        if (this.isInputConnected(0)) {
            this.value = this.getInputData(0);
            container[this.properties.varname] = this.value;
            this.setOutputData(0, this.value);
            return;
        }

        this.setOutputData(0, container[this.properties.varname]);
    };

    Variable.prototype.getContainer = function () {
        switch (this.properties.container) {
            case Variable.GRAPH:
                if (this.graph) return this.graph.vars;
                return {};
                break;
            case Variable.GLOBALSCOPE:
                return global;
                break;
            case Variable.LITEGRAPH:
            default:
                return LiteGraph.Globals;
                break;
        }
    };

    Variable.prototype.getTitle = function () {
        return this.properties.varname;
    };

    LiteGraph.LGraphNode.extendNode(Variable);
    LiteGraph.registerNodeType("basic/variable", Variable);

    function length(v) {
        if (v && v.length != null) return Number(v.length);
        return 0;
    }

    LiteGraph.wrapFunctionAsNode(
        "basic/length",
        length,
        [""],
        "number",
    );

    // Show value inside the debug console
    function Console() {
        this.mode = LiteGraph.ON_EVENT;
        this.size = [80, 30];
        this.addProperty("msg", "");
        this.addInput("log", LiteGraph.EVENT);
        this.addInput("msg", 0);
    }

    Console.title = "Console";
    Console.desc = "Show value inside the console";

    Console.prototype.onAction = function (action, param) {
        if (action == "log") {
            console.log(param);
        } else if (action == "warn") {
            console.warn(param);
        } else if (action == "error") {
            console.error(param);
        }
    };

    Console.prototype.onExecute = function () {
        const msg = this.getInputData(1);
        if (msg) {
            this.properties.msg = msg;
        }
        console.log(msg);
    };

    Console.prototype.onGetInputs = function () {
        return [
            ["log", LiteGraph.ACTION],
            ["warn", LiteGraph.ACTION],
            ["error", LiteGraph.ACTION],
        ];
    };

    LiteGraph.LGraphNode.extendNode(Console);
    LiteGraph.registerNodeType("basic/console", Console);

    // Show value inside the debug console
    function Alert() {
        this.mode = LiteGraph.ON_EVENT;
        this.addProperty("msg", "");
        this.addInput("", LiteGraph.EVENT);
        const that = this;
        this.widget = this.addWidget("text", "Text", "", "msg");
        this.widgets_up = true;
        this.size = [200, 30];
    }

    Alert.title = "Alert";
    Alert.desc = "Show an alert window";
    Alert.color = "#510";

    Alert.prototype.onConfigure = function (o) {
        this.widget.value = o.properties.msg;
    };

    Alert.prototype.onAction = function (action, param) {
        const { msg } = this.properties;
        setTimeout(() => {
            alert(msg);
        }, 10);
    };

    LiteGraph.LGraphNode.extendNode(Alert);
    LiteGraph.registerNodeType("basic/alert", Alert);

    // Execites simple code
    function NodeScript() {
        this.size = [60, 30];
        this.addProperty("onExecute", "return A;");
        this.addInput("A", "");
        this.addInput("B", "");
        this.addOutput("out", "");

        this._func = null;
        this.data = {};
    }

    NodeScript.prototype.onConfigure = function (o) {
        if (o.properties.onExecute && LiteGraph.allow_scripts) this.compileCode(o.properties.onExecute);
        else console.warn("Script not compiled, LiteGraph.allow_scripts is false");
    };

    NodeScript.title = "Script";
    NodeScript.desc = "executes a code (max 100 characters)";

    NodeScript.widgets_info = {
        onExecute: { type: "code" },
    };

    NodeScript.prototype.onPropertyChanged = function (name, value) {
        if (name == "onExecute" && LiteGraph.allow_scripts) this.compileCode(value);
        else console.warn("Script not compiled, LiteGraph.allow_scripts is false");
    };

    NodeScript.prototype.compileCode = function (code) {
        this._func = null;
        if (code.length > 256) {
            console.warn("Script too long, max 256 chars");
        } else {
            const code_low = code.toLowerCase();
            const forbidden_words = [
                "script",
                "body",
                "document",
                "eval",
                "nodescript",
                "function",
            ]; // bad security solution
            for (let i = 0; i < forbidden_words.length; ++i) {
                if (code_low.indexOf(forbidden_words[i]) != -1) {
                    console.warn("invalid script");
                    return;
                }
            }
            try {
                this._func = new Function("A", "B", "C", "DATA", "node", code);
            } catch (err) {
                console.error("Error parsing script");
                console.error(err);
            }
        }
    };

    NodeScript.prototype.onExecute = function () {
        if (!this._func) {
            return;
        }

        try {
            const A = this.getInputData(0);
            const B = this.getInputData(1);
            const C = this.getInputData(2);
            this.setOutputData(0, this._func(A, B, C, this.data, this));
        } catch (err) {
            console.error("Error in script");
            console.error(err);
        }
    };

    NodeScript.prototype.onGetOutputs = function () {
        return [["C", ""]];
    };

    LiteGraph.LGraphNode.extendNode(NodeScript);
    LiteGraph.registerNodeType("basic/script", NodeScript);
}(this));
