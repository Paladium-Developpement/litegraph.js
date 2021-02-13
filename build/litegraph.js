(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.LiteGraph = {}));
}(this, (function (exports) { 'use strict';

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z = "/* this CSS contains only the basic CSS needed to run the app and use it */\n\n.lgraphcanvas {\n    /*cursor: crosshair;*/\n    user-select: none;\n    -moz-user-select: none;\n    -webkit-user-select: none;\n\toutline: none;\n}\n\n.litegraph.litecontextmenu {\n    font-family: Tahoma, sans-serif;\n    position: fixed;\n    top: 100px;\n    left: 100px;\n    min-width: 100px;\n    color: #aaf;\n    padding: 0;\n    box-shadow: 0 0 10px black !important;\n    background-color: #2e2e2e !important;\n\tz-index: 10;\n}\n\n.litegraph.litecontextmenu.dark {\n    background-color: #000 !important;\n}\n\n.litegraph.litecontextmenu .litemenu-title img {\n    margin-top: 2px;\n    margin-left: 2px;\n    margin-right: 4px;\n}\n\n.litegraph.litecontextmenu .litemenu-entry {\n    margin: 2px;\n    padding: 2px;\n}\n\n.litegraph.litecontextmenu .litemenu-entry.submenu {\n    background-color: #2e2e2e !important;\n}\n\n.litegraph.litecontextmenu.dark .litemenu-entry.submenu {\n    background-color: #000 !important;\n}\n\n.litegraph .litemenubar ul {\n    font-family: Tahoma, sans-serif;\n    margin: 0;\n    padding: 0;\n}\n\n.litegraph .litemenubar li {\n    font-size: 14px;\n    color: #999;\n    display: inline-block;\n    min-width: 50px;\n    padding-left: 10px;\n    padding-right: 10px;\n    user-select: none;\n    -moz-user-select: none;\n    -webkit-user-select: none;\n    cursor: pointer;\n}\n\n.litegraph .litemenubar li:hover {\n    background-color: #777;\n    color: #eee;\n}\n\n.litegraph .litegraph .litemenubar-panel {\n    position: absolute;\n    top: 5px;\n    left: 5px;\n    min-width: 100px;\n    background-color: #444;\n    box-shadow: 0 0 3px black;\n    padding: 4px;\n    border-bottom: 2px solid #aaf;\n    z-index: 10;\n}\n\n.litegraph .litemenu-entry,\n.litemenu-title {\n    font-size: 12px;\n    color: #aaa;\n    padding: 0 0 0 4px;\n    margin: 2px;\n    padding-left: 2px;\n    -moz-user-select: none;\n    -webkit-user-select: none;\n    user-select: none;\n    cursor: pointer;\n}\n\n.litegraph .litemenu-entry .icon {\n    display: inline-block;\n    width: 12px;\n    height: 12px;\n    margin: 2px;\n    vertical-align: top;\n}\n\n.litegraph .litemenu-entry.checked .icon {\n    background-color: #aaf;\n}\n\n.litegraph .litemenu-entry .more {\n    float: right;\n    padding-right: 5px;\n}\n\n.litegraph .litemenu-entry.disabled {\n    opacity: 0.5;\n    cursor: default;\n}\n\n.litegraph .litemenu-entry.separator {\n    display: block;\n    border-top: 1px solid #333;\n    border-bottom: 1px solid #666;\n    width: 100%;\n    height: 0px;\n    margin: 3px 0 2px 0;\n    background-color: transparent;\n    padding: 0 !important;\n    cursor: default !important;\n}\n\n.litegraph .litemenu-entry.has_submenu {\n    border-right: 2px solid cyan;\n}\n\n.litegraph .litemenu-title {\n    color: #dde;\n    background-color: #111;\n    margin: 0;\n    padding: 2px;\n    cursor: default;\n}\n\n.litegraph .litemenu-entry:hover:not(.disabled):not(.separator) {\n    background-color: #444 !important;\n    color: #eee;\n    transition: all 0.2s;\n}\n\n.litegraph .litemenu-entry .property_name {\n    display: inline-block;\n    text-align: left;\n    min-width: 80px;\n    min-height: 1.2em;\n}\n\n.litegraph .litemenu-entry .property_value {\n    display: inline-block;\n    background-color: rgba(0, 0, 0, 0.5);\n    text-align: right;\n    min-width: 80px;\n    min-height: 1.2em;\n    vertical-align: middle;\n    padding-right: 10px;\n}\n\n.litegraph.litesearchbox {\n    font-family: Tahoma, sans-serif;\n    position: absolute;\n    background-color: rgba(0, 0, 0, 0.5);\n    padding-top: 4px;\n}\n\n.litegraph.litesearchbox input,\n.litegraph.litesearchbox select {\n    margin-top: 3px;\n    min-width: 60px;\n    min-height: 1.5em;\n    background-color: black;\n    border: 0;\n    color: white;\n    padding-left: 10px;\n    margin-right: 5px;\n}\n\n.litegraph.litesearchbox .name {\n    display: inline-block;\n    min-width: 60px;\n    min-height: 1.5em;\n    padding-left: 10px;\n}\n\n.litegraph.litesearchbox .helper {\n    overflow: auto;\n    max-height: 200px;\n    margin-top: 2px;\n}\n\n.litegraph.lite-search-item {\n    font-family: Tahoma, sans-serif;\n    background-color: rgba(0, 0, 0, 0.5);\n    color: white;\n    padding-top: 2px;\n}\n\n.litegraph.lite-search-item:hover,\n.litegraph.lite-search-item.selected {\n    cursor: pointer;\n    background-color: white;\n    color: black;\n}\n\n/* DIALOGs ******/\n\n.litegraph .dialog {\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    margin-top: -150px;\n    margin-left: -200px;\n\n    background-color: #2A2A2A;\n\n    min-width: 400px;\n    min-height: 200px;\n\tbox-shadow: 0 0 4px #111;\n    border-radius: 6px;\n}\n\n.litegraph .dialog.settings {\n\tleft: 10px;\n\ttop: 10px;\n\theight: calc( 100% - 20px );\n\tmargin: auto;\n}\n\n.litegraph .dialog .close {\n    float: right;\n\tmargin: 4px;\n\tmargin-right: 10px;\n\tcursor: pointer;\n\tfont-size: 1.4em;\n}\n\n.litegraph .dialog .close:hover {\n\tcolor: white;\n}\n\n.litegraph .dialog .dialog-header {\n\tcolor: #AAA;\n\tborder-bottom: 1px solid #161616;\n}\n\n.litegraph .dialog .dialog-header { height: 40px; }\n.litegraph .dialog .dialog-footer { height: 50px; padding: 10px; border-top: 1px solid #1a1a1a;}\n\n.litegraph .dialog .dialog-header .dialog-title {\n    font: 20px \"Arial\";\n    margin: 4px;\n    padding: 4px 10px;\n    display: inline-block;\n}\n\n.litegraph .dialog .dialog-content {\n    height: calc(100% - 90px);\n    width: 100%;\n\tmin-height: 100px;\n    display: inline-block;\n\tcolor: #AAA;\n    /*background-color: black;*/\n}\n\n.litegraph .dialog .dialog-content h3 {\n\tmargin: 10px;\n}\n\n.litegraph .dialog .dialog-content .connections {\n\tflex-direction: row;\n}\n\n.litegraph .dialog .dialog-content .connections .connections_side {\n\twidth: calc(50% - 5px);\n\tmin-height: 100px;\n\tbackground-color: black;\n\tdisplay: flex;\n}\n\n.litegraph .dialog .node_type {\n\tfont-size: 1.2em;\n\tdisplay: block;\n\tmargin: 10px;\n}\n\n.litegraph .dialog .node_desc {\n\topacity: 0.5;\n\tdisplay: block;\n\tmargin: 10px;\n}\n\n.litegraph .dialog .separator {\n\tdisplay: block;\n\twidth: calc( 100% - 4px );\n\theight: 1px;\n\tborder-top: 1px solid #000;\n\tborder-bottom: 1px solid #333;\n\tmargin: 10px 2px;\n\tpadding: 0;\n}\n\n.litegraph .dialog .property {\n\tmargin-bottom: 2px;\n\tpadding: 4px;\n}\n\n.litegraph .dialog .property_name {\n\tcolor: #737373;\n    display: inline-block;\n    text-align: left;\n    vertical-align: top;\n    width: 120px;\n\tpadding-left: 4px;\n\toverflow: hidden;\n}\n\n.litegraph .dialog .property_value {\n    display: inline-block;\n    text-align: right;\n\tcolor: #AAA;\n\tbackground-color: #1A1A1A;\n    width: calc( 100% - 122px );\n\tmax-height: 300px;\n    padding: 4px;\n\tpadding-right: 12px;\n\toverflow: hidden;\n\tcursor: pointer;\n\tborder-radius: 3px;\n}\n\n.litegraph .dialog .property_value:hover {\n\tcolor: white;\n}\n\n.litegraph .dialog .property.boolean .property_value {\n\tpadding-right: 30px;\n}\n\n.litegraph .dialog .btn {\n\tborder-radius: 4px;\n    padding: 4px 20px;\n    margin-left: 0px;\n    background-color: #060606;\n    color: #8e8e8e;\n}\n\n.litegraph .dialog .btn:hover {\n    background-color: #111;\n    color: #FFF;\n}\n\n.litegraph .dialog .btn.delete:hover {\n    background-color: #F33;\n    color: black;\n}\n\n.litegraph .subgraph_property {\n\tpadding: 4px;\n}\n\n.litegraph .subgraph_property:hover {\n\tbackground-color: #333;\n}\n\n.litegraph .subgraph_property.extra {\n    margin-top: 8px;\n}\n\n.litegraph .subgraph_property span.name {\n\tfont-size: 1.3em;\n\tpadding-left: 4px;\n}\n\n.litegraph .subgraph_property span.type {\n\topacity: 0.5;\n\tmargin-right: 20px;\n\tpadding-left: 4px;\n}\n\n.litegraph .subgraph_property span.label {\n\tdisplay: inline-block;\n\twidth: 60px;\n\tpadding:  0px 10px;\n}\n\n.litegraph .subgraph_property input {\n\twidth: 140px;\n\tcolor: #999;\n\tbackground-color: #1A1A1A;\n\tborder-radius: 4px;\n\tborder: 0;\n\tmargin-right: 10px;\n\tpadding: 4px;\n\tpadding-left: 10px;\n}\n\n.litegraph .subgraph_property button {\n\tbackground-color: #1c1c1c;\n\tcolor: #aaa;\n\tborder: 0;\n\tborder-radius: 2px;\n\tpadding: 4px 10px;\n\tcursor: pointer;\n}\n\n.litegraph .subgraph_property.extra {\n\tcolor: #ccc;\n}\n\n.litegraph .subgraph_property.extra input {\n\tbackground-color: #111;\n}\n\n.litegraph .bullet_icon {\n\tmargin-left: 10px;\n\tborder-radius: 10px;\n\twidth: 12px;\n\theight: 12px;\n\tbackground-color: #666;\n\tdisplay: inline-block;\n\tmargin-top: 2px;\n\tmargin-right: 4px;\n    transition: background-color 0.1s ease 0s;\n    -moz-transition: background-color 0.1s ease 0s;\n}\n\n.litegraph .bullet_icon:hover {\n\tbackground-color: #698;\n\tcursor: pointer;\n} \n\n/* OLD */\n\n.graphcontextmenu {\n    padding: 4px;\n    min-width: 100px;\n}\n\n.graphcontextmenu-title {\n    color: #dde;\n    background-color: #222;\n    margin: 0;\n    padding: 2px;\n    cursor: default;\n}\n\n.graphmenu-entry {\n    box-sizing: border-box;\n    margin: 2px;\n    padding-left: 20px;\n    user-select: none;\n    -moz-user-select: none;\n    -webkit-user-select: none;\n    transition: all linear 0.3s;\n}\n\n.graphmenu-entry.event,\n.litemenu-entry.event {\n    border-left: 8px solid orange;\n    padding-left: 12px;\n}\n\n.graphmenu-entry.disabled {\n    opacity: 0.3;\n}\n\n.graphmenu-entry.submenu {\n    border-right: 2px solid #eee;\n}\n\n.graphmenu-entry:hover {\n    background-color: #555;\n}\n\n.graphmenu-entry.separator {\n    background-color: #111;\n    border-bottom: 1px solid #666;\n    height: 1px;\n    width: calc(100% - 20px);\n    -moz-width: calc(100% - 20px);\n    -webkit-width: calc(100% - 20px);\n}\n\n.graphmenu-entry .property_name {\n    display: inline-block;\n    text-align: left;\n    min-width: 80px;\n    min-height: 1.2em;\n}\n\n.graphmenu-entry .property_value,\n.litemenu-entry .property_value {\n    display: inline-block;\n    background-color: rgba(0, 0, 0, 0.5);\n    text-align: right;\n    min-width: 80px;\n    min-height: 1.2em;\n    vertical-align: middle;\n    padding-right: 10px;\n}\n\n.graphdialog {\n    position: absolute;\n    top: 10px;\n    left: 10px;\n    /*min-height: 2em;*/\n    background-color: #333;\n    font-size: 1.2em;\n    box-shadow: 0 0 10px black !important;\n\tz-index: 10;\n}\n\n.graphdialog.rounded {\n    border-radius: 12px;\n    padding-right: 2px;\n}\n\n.graphdialog .name {\n    display: inline-block;\n    min-width: 60px;\n    min-height: 1.5em;\n    padding-left: 10px;\n}\n\n.graphdialog input,\n.graphdialog textarea,\n.graphdialog select {\n    margin: 3px;\n    min-width: 60px;\n    min-height: 1.5em;\n    background-color: black;\n    border: 0;\n    color: white;\n    padding-left: 10px;\n    outline: none;\n}\n\n.graphdialog textarea {\n\tmin-height: 150px;\n}\n\n.graphdialog button {\n    margin-top: 3px;\n    vertical-align: top;\n    background-color: #999;\n\tborder: 0;\n}\n\n.graphdialog button.rounded,\n.graphdialog input.rounded {\n    border-radius: 0 12px 12px 0;\n}\n\n.graphdialog .helper {\n    overflow: auto;\n    max-height: 200px;\n}\n\n.graphdialog .help-item {\n    padding-left: 10px;\n}\n\n.graphdialog .help-item:hover,\n.graphdialog .help-item.selected {\n    cursor: pointer;\n    background-color: white;\n    color: black;\n}\n";
  styleInject(css_248z);

  var css_248z$1 = ".litegraph-editor {\r\n    width: 100%;\r\n    height: 100%;\r\n    margin: 0;\r\n    padding: 0;\r\n\r\n    background-color: #333;\r\n    color: #eee;\r\n    font: 14px Tahoma;\r\n\r\n    position: relative;\r\n\r\n    overflow: hidden;\r\n}\r\n\r\n.litegraph-editor h1 {\r\n    font-family: \"Metro Light\", Tahoma;\r\n    color: #ddd;\r\n    font-size: 28px;\r\n    padding-left: 10px;\r\n    /*text-shadow: 0 1px 1px #333, 0 -1px 1px #777;*/\r\n    margin: 0;\r\n    font-weight: normal;\r\n}\r\n\r\n.litegraph-editor h1 span {\r\n    font-family: \"Arial\";\r\n    font-size: 14px;\r\n    font-weight: normal;\r\n    color: #aaa;\r\n}\r\n\r\n.litegraph-editor h2 {\r\n    font-family: \"Metro Light\";\r\n    padding: 5px;\r\n    margin-left: 10px;\r\n}\r\n\r\n.litegraph-editor * {\r\n    box-sizing: border-box;\r\n    -moz-box-sizing: border-box;\r\n}\r\n\r\n.litegraph-editor .content {\r\n    position: relative;\r\n    width: 100%;\r\n    height: 100%;\r\n    background-color: #1a1a1a;\r\n}\r\n\r\n.litegraph-editor .header,\r\n.litegraph-editor .footer {\r\n    position: relative;\r\n    height: 40px;\r\n    background-color: #333;\r\n    /*border-radius: 10px 10px 0 0;*/\r\n}\r\n\r\n.litegraph-editor .tools,\r\n.litegraph-editor .tools-left,\r\n.litegraph-editor .tools-right {\r\n    position: absolute;\r\n    top: 2px;\r\n    right: 0px;\r\n    vertical-align: top;\r\n\r\n    margin: 2px 5px 0 0px;\r\n}\r\n\r\n.litegraph-editor .tools-left {\r\n    right: auto;\r\n    left: 4px;\r\n}\r\n\r\n.litegraph-editor .footer {\r\n    height: 40px;\r\n    position: relative;\r\n    /*border-radius: 0 0 10px 10px;*/\r\n}\r\n\r\n.litegraph-editor .miniwindow {\r\n    background-color: #333;\r\n    border: 1px solid #111;\r\n}\r\n\r\n.litegraph-editor .miniwindow .corner-button {\r\n    position: absolute;\r\n    top: 2px;\r\n    right: 2px;\r\n    font-family: \"Tahoma\";\r\n    font-size: 14px;\r\n    color: #aaa;\r\n    cursor: pointer;\r\n}\r\n\r\n/* BUTTONS **********************/\r\n\r\n.litegraph-editor .btn {\r\n    /*font-family: \"Metro Light\";*/\r\n    color: #ccc;\r\n    font-size: 20px;\r\n    min-width: 30px;\r\n    /*border-radius: 0.3em;*/\r\n    border: 0 solid #666;\r\n    background-color: #3f3f3f;\r\n    /*box-shadow: 0 0 3px black;*/\r\n    padding: 4px 10px;\r\n    cursor: pointer;\r\n    transition: all 1s;\r\n    -moz-transition: all 1s;\r\n    -webkit-transition: all 0.4s;\r\n}\r\n\r\n.litegraph-editor button:hover {\r\n    background-color: #999;\r\n    color: #fff;\r\n    transition: all 1s;\r\n    -moz-transition: all 1s;\r\n    -webkit-transition: all 0.4s;\r\n}\r\n\r\n.litegraph-editor button:active {\r\n    background-color: white;\r\n}\r\n\r\n.litegraph-editor button.fixed {\r\n    position: absolute;\r\n    top: 5px;\r\n    right: 5px;\r\n    font-size: 1.2em;\r\n}\r\n\r\n.litegraph-editor button img {\r\n    margin: -4px;\r\n    vertical-align: top;\r\n    opacity: 0.8;\r\n    transition: all 1s;\r\n}\r\n\r\n.litegraph-editor button:hover img {\r\n    opacity: 1;\r\n}\r\n\r\n.litegraph-editor .header button {\r\n    height: 32px;\r\n    vertical-align: top;\r\n}\r\n\r\n.litegraph-editor .footer button {\r\n    /*font-size: 16px;*/\r\n}\r\n\r\n.litegraph-editor .toolbar-widget {\r\n    display: inline-block;\r\n}\r\n\r\n.litegraph-editor .editor-area {\r\n    width: 100%;\r\n    height: 100%;\r\n}\r\n\r\n/* METER *********************/\r\n\r\n.litegraph-editor .loadmeter {\r\n    font-family: \"Tahoma\";\r\n    color: #aaa;\r\n    font-size: 12px;\r\n    border-radius: 2px;\r\n    width: 130px;\r\n    vertical-align: top;\r\n}\r\n\r\n.litegraph-editor .strong {\r\n    vertical-align: top;\r\n    padding: 3px;\r\n    width: 30px;\r\n    display: inline-block;\r\n    line-height: 8px;\r\n}\r\n\r\n.litegraph-editor .cpuload .bgload,\r\n.litegraph-editor .gpuload .bgload {\r\n    display: inline-block;\r\n    width: 90px;\r\n    height: 15px;\r\n    background-image: url(\"../editor/imgs/load-progress-empty.png\");\r\n}\r\n\r\n.litegraph-editor .cpuload .fgload,\r\n.litegraph-editor .gpuload .fgload {\r\n    display: inline-block;\r\n    width: 4px;\r\n    height: 15px;\r\n    max-width: 90px;\r\n    background-image: url(\"../editor/imgs/load-progress-full.png\");\r\n}\r\n\r\n.litegraph-editor textarea.code, .litegraph-editor div.code {\r\n\theight: 100%;\r\n\twidth: 100%;\r\n\tbackground-color: black;\r\n\tpadding: 4px;\r\n\tfont: 16px monospace;\r\n\toverflow: auto;\r\n\tresize: none;\r\n\toutline: none;\r\n}\r\n\r\n.litegraph-editor .codeflask {\r\n\tbackground-color: #2a2a2a;\r\n}\r\n\r\n.litegraph-editor .codeflask textarea {\r\n\topacity: 0;\r\n}\r\n";
  styleInject(css_248z$1);

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = o[Symbol.iterator]();
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  var defaultConfig = {
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
    MAX_NUMBER_OF_NODES: 1000,
    // avoid infinite loops
    DEFAULT_POSITION: [100, 100],
    // default node position
    VALID_SHAPES: ["default", "box", "round", "card"],
    // ,"circle"
    // shapes are used for nodes but also for slots
    BOX_SHAPE: 1,
    ROUND_SHAPE: 2,
    CIRCLE_SHAPE: 3,
    CARD_SHAPE: 4,
    ARROW_SHAPE: 5,
    // enums
    INPUT: 1,
    OUTPUT: 2,
    EVENT: -1,
    // for outputs
    ACTION: -1,
    // for inputs
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
    proxy: null,
    // used to redirect calls
    node_images_path: "",
    debug: true,
    catch_exceptions: true,
    throw_errors: true,
    allow_scripts: false,
    // if set to true some nodes like Formula would be allowed
    // to evaluate code that comes from unsafe sources
    // (like node configuration), which could lead to exploits
    registered_node_types: {},
    // nodetypes by string
    node_types_by_file_extension: {},
    // used for dropping files in the canvas
    Nodes: {},
    // node types by classname
    Globals: {},
    // used to store vars between graphs
    searchbox_extras: {},
    // used to add extra features to the search box
    auto_sort_node_types: false // If set to true, will automatically sort node types / categories in the context menus

  };

  /**
   * @module Time Utils
   */
  function getTime() {
    if (performance) return performance.now();
    if (Date && Date.now) return Date.now;

    if (process) {
      var t = process.hrtime();
      return t[0] * 0.001 + t[1] * 1e-6;
    }

    return new Date().getTime();
  }

  /**
   * @module Object Utils
   */
  // separated just to improve if it doesn't work
  function cloneObject(obj, target) {
    if (obj == null) return null;
    var r = JSON.parse(JSON.stringify(obj));
    if (!target) return r; // eslint-disable-next-line guard-for-in,no-restricted-syntax

    for (var i in r) {
      target[i] = r[i];
    }

    return target;
  }

  function unregisterNodeType(type) {
    var baseClass = type.constructor === String ? defaultConfig.registered_node_types[type] : type;
    if (!baseClass) throw new Error("node type not found: ".concat(type));
    delete defaultConfig.registered_node_types[baseClass.type];
    if (baseClass.constructor.name) delete defaultConfig.Nodes[baseClass.constructor.name];
  }
  /**
   * Register a node class so it can be listed when the user wants to create a new one
   * @method registerNodeType
   * @param {LGraphNode} type name of the node and path
   * @param {Class} baseClass class containing the structure of a node
   */

  function registerNodeType(type, baseClass) {
    if (!baseClass.prototype) {
      throw new TypeError("Cannot register a simple object, it must be a class with a prototype");
    }

    baseClass.type = type;

    if (defaultConfig.debug) {
      console.log("Node registered: ".concat(type));
    }

    var classname = baseClass.name;
    var pos = type.lastIndexOf("/");
    baseClass.category = type.substr(0, pos);

    if (!baseClass.title) {
      baseClass.title = classname;
    } // info.name = name.substr(pos+1,name.length - pos);


    var prev = defaultConfig.registered_node_types[type];

    if (prev) {
      console.log("replacing node type: ".concat(type));
    } else {
      if (!Object.hasOwnProperty.call(baseClass.prototype, "shape")) {
        Object.defineProperty(baseClass.prototype, "shape", {
          set: function set(v) {
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
          get: function get() {
            return this._shape;
          },
          enumerable: true,
          configurable: true
        });
      } // warnings


      if (baseClass.prototype.onPropertyChange) {
        console.warn("LiteGraph node class ".concat(type, " has onPropertyChange method, it must be called onPropertyChanged with d at the end"));
      } // used to know which nodes create when dragging files to the canvas


      if (baseClass.supported_extensions) {
        var _iterator = _createForOfIteratorHelper(baseClass.supported_extensions),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var ext = _step.value;

            if (ext && ext.constructor === String) {
              defaultConfig.node_types_by_file_extension[ext.toLowerCase()] = baseClass;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }

    defaultConfig.registered_node_types[type] = baseClass;
    if (baseClass.constructor.name) defaultConfig.Nodes[classname] = baseClass;
    if (defaultConfig.onNodeTypeRegistered) defaultConfig.onNodeTypeRegistered(type, baseClass);

    if (prev && defaultConfig.onNodeTypeReplaced) {
      defaultConfig.onNodeTypeReplaced(type, baseClass, prev);
    } // warnings


    if (baseClass.prototype.onPropertyChange) {
      console.warn("LiteGraph node class ".concat(type, " has onPropertyChange method, it must be called onPropertyChanged with d at the end"));
    } // used to know which nodes create when dragging files to the canvas


    if (baseClass.supported_extensions) {
      var _iterator2 = _createForOfIteratorHelper(baseClass.supported_extensions),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _ext = _step2.value;

          if (_ext && _ext.constructor === String) {
            defaultConfig.node_types_by_file_extension[_ext.toLowerCase()] = baseClass;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }
  /**
   * Removes all previously registered node's types
   */

  function clearRegisteredTypes() {
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

  function getNodeType(type) {
    return defaultConfig.registered_node_types[type];
  }
  /**
   * Returns a list of node types matching one category
   * @method getNodeType
   * @param {String} category category name
   * @return {Array} array with all the node classes
   */

  function getNodeTypesInCategory(category, filter) {
    var r = []; // eslint-disable-next-line

    for (var i in defaultConfig.registered_node_types) {
      var type = defaultConfig.registered_node_types[i];
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

  function registerSearchboxExtra(nodeType, description, data) {
    defaultConfig.searchbox_extras[description.toLowerCase()] = {
      type: nodeType,
      desc: description,
      data: data
    };
  }
  /**
   * Returns a list with all the node type categories
   * @method getNodeTypesCategories
   * @param {String} filter only nodes with ctor.filter equal can be shown
   * @return {Array} array with all the names of the categories
   */

  function getNodeTypesCategories(filter) {
    var categories = {
      "": 1
    }; // eslint-disable-next-line

    for (var id in defaultConfig.registered_node_types) {
      var type = defaultConfig.registered_node_types[id];

      if (type.category && !type.skip_list) {
        if (type.filter !== filter) continue;
        categories[type.category] = 1;
      }
    }

    var result = []; // eslint-disable-next-line

    for (var i in categories) {
      result.push(i);
    }

    return defaultConfig.auto_sort_node_types ? result.sort() : result;
  }

  /**
   * @module Function Utils
   */

  function getParameterNames(func) {
    return "".concat(func).replace(/[/][/].*$/gm, "") // strip single-line comments
    .replace(/\s+/g, "") // strip white space
    .replace(/[/][*][^/*]*[*][/]/g, "") // strip multi-line comments  /**/
    .split("){", 1)[0].replace(/^[^(]*[(]/, "") // extract the parameters
    .replace(/=[^,]+/g, "") // strip any ES6 defaults
    .split(",").filter(Boolean); // split & filter [""]
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

  function wrapFunctionAsNode(name, func, paramType, returnType, properties) {
    var params = Array(func.length);
    var code = "";
    var names = getParameterNames(func);

    for (var i = 0; i < names.length; ++i) {
      code += "this.addInput('".concat(names[i], "',").concat(paramType && paramType[i] ? "'".concat(paramType[i], "'") : "0", ");\n");
    }

    code += "this.addOutput('out',".concat(returnType ? "'".concat(returnType, "'") : 0, ");\n");
    if (properties) code += "this.properties = ".concat(JSON.stringify(properties), ";\n");
    var classobj = Function("code");
    classobj.title = name.split("/").pop();
    classobj.desc = "Generated from ".concat(func.name);

    classobj.prototype.onExecute = function onExecute() {
      for (var _i = 0; _i < params.length; ++_i) {
        params[_i] = this.getInputData(_i);
      }

      var r = func.apply(this, params);
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

  function isValidConnection(typeA, typeB) {
    if (!typeA || !typeB || typeA === typeB || typeA === defaultConfig.EVENT && typeB === defaultConfig.ACTION) {
      return true;
    } // Enforce string type to handle toLowerCase call (-1 number not ok)


    typeA = String(typeA);
    typeB = String(typeB);
    typeA = typeA.toLowerCase();
    typeB = typeB.toLowerCase(); // For nodes supporting multiple connection types

    if (typeA.indexOf(",") === -1 && typeB.indexOf(",") === -1) return typeA === typeB; // Check all permutations to see if one is valid

    var supportedTypesA = typeA.split(",");
    var supportedTypesB = typeB.split(",");

    for (var i = 0; i < supportedTypesA.length; ++i) {
      for (var j = 0; j < supportedTypesB.length; ++j) {
        if (supportedTypesA[i] === supportedTypesB[j]) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * @class LLink
   * @param id
   * @param type
   * @param origin_id
   * @param origin_slot
   * @param target_id
   * @param target_slot
   */
  var LLink$1 = /*#__PURE__*/function () {
    function LLink(id, type, origin_id, origin_slot, target_id, target_slot) {
      _classCallCheck(this, LLink);

      this.id = id;
      this.type = type;
      this.origin_id = origin_id;
      this.origin_slot = origin_slot;
      this.target_id = target_id;
      this.target_slot = target_slot;
      this._data = null;
      this._pos = new Float32Array(2); // center
    }

    _createClass(LLink, [{
      key: "configure",
      value: function configure(o) {
        if (o.constructor === Array) {
          this.id = o[0];
          this.origin_id = o[1];
          this.origin_slot = o[2];
          this.target_id = o[3];
          this.target_slot = o[4];
          this.type = o[5];
        } else {
          this.id = o.id;
          this.type = o.type;
          this.origin_id = o.origin_id;
          this.origin_slot = o.origin_slot;
          this.target_id = o.target_id;
          this.target_slot = o.target_slot;
        }
      }
    }, {
      key: "serialize",
      value: function serialize() {
        return [this.id, this.origin_id, this.origin_slot, this.target_id, this.target_slot, this.type];
      }
    }]);

    return LLink;
  }();

  /**
   * @module Math Utils
   */
  function distance(a, b) {
    return Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]));
  }
  function isInsideRectangle(x, y, left, top, width, height) {
    return left < x && left + width > x && top < y && top + height > y;
  } // bounding overlap, format: [ startx, starty, width, height ]

  function overlapBounding$1(a, b) {
    var AEndX = a[0] + a[2];
    var AEndY = a[1] + a[3];
    var BEndX = b[0] + b[2];
    var BEndY = b[1] + b[3];
    return !(a[0] > BEndX || a[1] > BEndY || AEndX < b[0] || AEndY < b[1]);
  }
  function clamp(v, a, b) {
    // eslint-disable-next-line no-nested-ternary
    return a > v ? a : b < v ? b : v;
  }

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

  /**
   * Base Class for all the node type classes
   * @class LGraphNode
   * @param {String} title a name for the node
   */

  var LGraphNode = /*#__PURE__*/function () {
    function LGraphNode(title) {
      _classCallCheck(this, LGraphNode);

      _defineProperty(this, "_pos", new Float32Array(10, 10));

      this.title = title || "Unnamed";
      this.size = [defaultConfig.NODE_WIDTH, 60];
      this.graph = null;
      this.id = -1; // not know till not added

      this.type = null; // inputs available: array of inputs

      this.inputs = [];
      this.outputs = [];
      this.connections = []; // local data

      this.properties = {}; // for the values

      this.properties_info = []; // for the info

      this.flags = {};
    }
    /**
     * Internal position array
     * @internal
     * @type {Float32Array}
     * @private
     * @memberOf LGraphNode
     */


    _createClass(LGraphNode, [{
      key: "pos",
      get: function get() {
        return this._pos;
      }
      /**
       * configure a node from an object containing the serialized info
       * @method configure
       * @memberOf LGraphNode
       */
      ,
      set: function set(v) {
        if (!v || v.length < 2) {
          return;
        }

        this._pos[0] = v[0];
        this._pos[1] = v[1];
      }
    }, {
      key: "configure",
      value: function configure(info) {
        if (this.graph) {
          this.graph._version++;
        } // eslint-disable-next-line guard-for-in,no-restricted-syntax


        for (var j in info) {
          if (j === "properties") {
            // i don't want to clone properties, I want to reuse the old container
            // eslint-disable-next-line guard-for-in,no-restricted-syntax
            for (var k in info.properties) {
              this.properties[k] = info.properties[k];

              if (this.onPropertyChanged) {
                this.onPropertyChanged(k, info.properties[k]);
              }
            }

            continue;
          }

          if (info[j] == null) {
            continue;
          } else if (_typeof(info[j]) === "object") {
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
            for (var _i = 0; _i < this.inputs.length; ++_i) {
              var input = this.inputs[_i];
              var linkInfo = this.graph ? this.graph.links[input.link] : null;
              this.onConnectionsChange(defaultConfig.INPUT, _i, true, linkInfo, input); // linkInfo has been created now, so its updated
            }
          }

          if (this.outputs) {
            for (var _i2 = 0; _i2 < this.outputs.length; ++_i2) {
              var output = this.outputs[_i2];

              if (!output.links) {
                continue;
              }

              for (var _j = 0; _j < output.links.length; ++_j) {
                var _linkInfo = this.graph ? this.graph.links[output.links[_j]] : null;

                this.onConnectionsChange(defaultConfig.OUTPUT, _i2, true, _linkInfo, output); // link_info has been created now, so its updated
              }
            }
          }
        }

        if (this.widgets) {
          var _iterator = _createForOfIteratorHelper(this.widgets),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var widget = _step.value;
              if (!widget) continue;
              if (widget.options && widget.options.property // eslint-disable-next-line max-len
              && this.properties[widget.options.property]) widget.value = JSON.parse(JSON.stringify(this.properties[widget.options.property]));
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          if (info.widgets_values) {
            for (var _i3 = 0; _i3 < info.widgets_values.length; ++_i3) {
              if (this.widgets[_i3]) {
                this.widgets[_i3].value = info.widgets_values[_i3];
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
       * @memberOf LGraphNode
       */

    }, {
      key: "serialize",
      value: function serialize() {
        // create serialization object
        var o = {
          id: this.id,
          type: this.type,
          pos: this.pos,
          size: this.size,
          flags: cloneObject(this.flags),
          order: this.order,
          mode: this.mode
        }; // special case for when there were errors

        if (this.constructor === LGraphNode && this.last_serialization) {
          return this.last_serialization;
        }

        if (this.inputs) {
          o.inputs = this.inputs;
        }

        if (this.outputs) {
          // clear outputs last data (because data in connections is never serialized but stored
          // inside the outputs info)
          for (var _i4 = 0; _i4 < this.outputs.length; _i4++) {
            delete this.outputs[_i4]._data;
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

          for (var _i5 = 0; _i5 < this.widgets.length; ++_i5) {
            if (this.widgets[_i5]) {
              o.widgets_values[_i5] = this.widgets[_i5].value;
            } else {
              o.widgets_values[_i5] = null;
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
            console.warn("node onSerialize shouldnt return anything, data should be stored in the object pass in the first parameter");
          }
        }

        return o;
      }
      /* Creates a clone of this node */

    }, {
      key: "clone",
      value: function clone() {
        var node = LGraphNode.createNode(this.type);

        if (!node) {
          return null;
        } // we clone it because serialize returns shared containers


        var data = LGraphNode.cloneObject(this.serialize()); // remove links

        if (data.inputs) {
          for (var _i6 = 0; _i6 < data.inputs.length; ++_i6) {
            data.inputs[_i6].link = null;
          }
        }

        if (data.outputs) {
          for (var _i7 = 0; _i7 < data.outputs.length; ++_i7) {
            if (data.outputs[_i7].links) {
              data.outputs[_i7].links.length = 0;
            }
          }
        }

        delete data.id; // remove links

        node.configure(data);
        return node;
      }
      /**
       * serialize and stringify
       * @method toString
       * @memberOf LGraphNode
       */

    }, {
      key: "toString",
      value: function toString() {
        return JSON.stringify(this.serialize());
      } // deserialize = function(info) {} //this cannot be done from within, must
      // be done in LiteGraph

      /**
       * get the title string
       * @method getTitle
       * @memberOf LGraphNode
       */

    }, {
      key: "getTitle",
      value: function getTitle() {
        return this.title || this.constructor.title;
      }
      /**
       * sets the value of a property
       * @method setProperty
       * @param {String} name
       * @param {*} value
       * @memberOf LGraphNode
       */

    }, {
      key: "setProperty",
      value: function setProperty(name, value) {
        if (!this.properties) {
          this.properties = {};
        }

        if (value === this.properties[name]) return;
        var prevValue = this.properties[name];
        this.properties[name] = value;

        if (this.onPropertyChanged && this.onPropertyChanged(name, value, prevValue) === false) {
          this.properties[name] = prevValue;
        }

        if (this.widgets) {
          for (var _i8 = 0; _i8 < this.widgets.length; ++_i8) {
            var w = this.widgets[_i8];
            if (!w) continue;

            if (w.options.property == name) {
              w.value = value;
              break;
            }
          }
        }
      } // Execution *************************

      /**
       * sets the output data
       * @method setOutputData
       * @param {number} slot
       * @param {*} data
       * @memberOf LGraphNode
       */

    }, {
      key: "setOutputData",
      value: function setOutputData(slot, data) {
        if (!this.outputs) {
          return;
        } // this maybe slow and a niche case
        // if(slot && slot.constructor === String)
        //	slot = this.findOutputSlot(slot);


        if (slot == -1 || slot >= this.outputs.length) {
          return;
        }

        var output_info = this.outputs[slot];

        if (!output_info) {
          return;
        } // store data in the output itself in case we want to debug


        output_info._data = data; // if there are connections, pass the data to the connections

        if (this.outputs[slot].links) {
          for (var _i9 = 0; _i9 < this.outputs[slot].links.length; _i9++) {
            var link_id = this.outputs[slot].links[_i9];
            var link = this.graph.links[link_id];
            if (link) link.data = data;
          }
        }
      }
      /**
       * sets the output data type, useful when you want to be able to overwrite the data type
       * @method setOutputDataType
       * @param {number} slot
       * @param {String} datatype
       * @memberOf LGraphNode
       */

    }, {
      key: "setOutputDataType",
      value: function setOutputDataType(slot, type) {
        if (!this.outputs) {
          return;
        }

        if (slot == -1 || slot >= this.outputs.length) {
          return;
        }

        var output_info = this.outputs[slot];

        if (!output_info) {
          return;
        } // store data in the output itself in case we want to debug


        output_info.type = type; // if there are connections, pass the data to the connections

        if (this.outputs[slot].links) {
          for (var _i10 = 0; _i10 < this.outputs[slot].links.length; _i10++) {
            var link_id = this.outputs[slot].links[_i10];
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
       * @memberOf LGraphNode
       */

    }, {
      key: "getInputData",
      value: function getInputData(slot, force_update) {
        if (!this.inputs) {
          return;
        } // undefined;


        if (slot >= this.inputs.length || this.inputs[slot].link == null) {
          return;
        }

        var link_id = this.inputs[slot].link;
        var link = this.graph.links[link_id];

        if (!link) {
          // bug: weird case but it happens sometimes
          return null;
        }

        if (!force_update) {
          return link.data;
        } // special case: used to extract data from the incoming connection before the graph has
        // been executed


        var node = this.graph.getNodeById(link.origin_id);

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
       * @memberOf LGraphNode
       */

    }, {
      key: "getInputDataType",
      value: function getInputDataType(slot) {
        if (!this.inputs) {
          return null;
        } // undefined;


        if (slot >= this.inputs.length || this.inputs[slot].link == null) {
          return null;
        }

        var link_id = this.inputs[slot].link;
        var link = this.graph.links[link_id];

        if (!link) {
          // bug: weird case but it happens sometimes
          return null;
        }

        var node = this.graph.getNodeById(link.origin_id);

        if (!node) {
          return link.type;
        }

        var output_info = node.outputs[link.origin_slot];

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
       * @memberOf LGraphNode
       */

    }, {
      key: "getInputDataByName",
      value: function getInputDataByName(slot_name, force_update) {
        var slot = this.findInputSlot(slot_name);

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
       * @memberOf LGraphNode
       */

    }, {
      key: "isInputConnected",
      value: function isInputConnected(slot) {
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
       * @memberOf LGraphNode
       */

    }, {
      key: "getInputInfo",
      value: function getInputInfo(slot) {
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
       * @memberOf LGraphNode
       */

    }, {
      key: "getInputLink",
      value: function getInputLink(slot) {
        if (!this.inputs) {
          return null;
        }

        if (slot < this.inputs.length) {
          var slot_info = this.inputs[slot];
          return this.graph.links[slot_info.link];
        }

        return null;
      }
      /**
       * returns the node connected in the input slot
       * @method getInputNode
       * @param {number} slot
       * @return {LGraphNode} node or null
       * @memberOf LGraphNode
       */

    }, {
      key: "getInputNode",
      value: function getInputNode(slot) {
        if (!this.inputs) {
          return null;
        }

        if (slot >= this.inputs.length) {
          return null;
        }

        var input = this.inputs[slot];

        if (!input || input.link === null) {
          return null;
        }

        var link_info = this.graph.links[input.link];

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
       * @memberOf LGraphNode
       */

    }, {
      key: "getInputOrProperty",
      value: function getInputOrProperty(name) {
        if (!this.inputs || !this.inputs.length) {
          return this.properties ? this.properties[name] : null;
        }

        for (var _i11 = 0, l = this.inputs.length; _i11 < l; ++_i11) {
          var input_info = this.inputs[_i11];

          if (name == input_info.name && input_info.link != null) {
            var link = this.graph.links[input_info.link];

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
       * @memberOf LGraphNode
       */

    }, {
      key: "getOutputData",
      value: function getOutputData(slot) {
        if (!this.outputs) {
          return null;
        }

        if (slot >= this.outputs.length) {
          return null;
        }

        var info = this.outputs[slot];
        return info._data;
      }
      /**
       * tells you info about an output connection (which node, type, etc)
       * @method getOutputInfo
       * @param {number} slot
       * @return {Object}  object or null { name: string, type: string, links: [ ids of links in
       *     number ] }
       * @memberOf LGraphNode
       */

    }, {
      key: "getOutputInfo",
      value: function getOutputInfo(slot) {
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
       * @memberOf LGraphNode
       */

    }, {
      key: "isOutputConnected",
      value: function isOutputConnected(slot) {
        if (!this.outputs) {
          return false;
        }

        return slot < this.outputs.length && this.outputs[slot].links && this.outputs[slot].links.length;
      }
      /**
       * tells you if there is any connection in the output slots
       * @method isAnyOutputConnected
       * @return {boolean}
       * @memberOf LGraphNode
       */

    }, {
      key: "isAnyOutputConnected",
      value: function isAnyOutputConnected() {
        if (!this.outputs) {
          return false;
        }

        for (var _i12 = 0; _i12 < this.outputs.length; ++_i12) {
          if (this.outputs[_i12].links && this.outputs[_i12].links.length) {
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
       * @memberOf LGraphNode
       */

    }, {
      key: "getOutputNodes",
      value: function getOutputNodes(slot) {
        if (!this.outputs || this.outputs.length == 0) {
          return null;
        }

        if (slot >= this.outputs.length) {
          return null;
        }

        var output = this.outputs[slot];

        if (!output.links || output.links.length == 0) {
          return null;
        }

        var r = [];

        for (var _i13 = 0; _i13 < output.links.length; _i13++) {
          var link_id = output.links[_i13];
          var link = this.graph.links[link_id];

          if (link) {
            var target_node = this.graph.getNodeById(link.target_id);

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
       * @memberOf LGraphNode
       */

    }, {
      key: "trigger",
      value: function trigger(action, param) {
        if (!this.outputs || !this.outputs.length) {
          return;
        }

        if (this.graph) this.graph._last_trigger_time = getTime();

        for (var _i14 = 0; _i14 < this.outputs.length; ++_i14) {
          var output = this.outputs[_i14];
          if (!output || output.type !== defaultConfig.EVENT || action && output.name != action) continue;
          this.triggerSlot(_i14, param);
        }
      }
      /**
       * Triggers an slot event in this node
       * @method triggerSlot
       * @param {Number} slot the index of the output slot
       * @param {*} param
       * @param {Number} link_id [optional] in case you want to trigger and specific output link in a
       *     slot
       * @memberOf LGraphNode
       */

    }, {
      key: "triggerSlot",
      value: function triggerSlot(slot, param, link_id) {
        if (!this.outputs) {
          return;
        }

        var output = this.outputs[slot];

        if (!output) {
          return;
        }

        var links = output.links;

        if (!links || !links.length) {
          return;
        }

        if (this.graph) {
          this.graph._last_trigger_time = getTime();
        } // for every link attached here


        for (var k = 0; k < links.length; ++k) {
          var id = links[k];

          if (link_id != null && link_id != id) {
            // to skip links
            continue;
          }

          var link_info = this.graph.links[links[k]];

          if (!link_info) {
            // not connected
            continue;
          }

          link_info._last_time = getTime();
          var node = this.graph.getNodeById(link_info.target_id);

          if (!node) {
            // node not found?
            continue;
          } // used to mark events in graph


          var target_connection = node.inputs[link_info.target_slot];

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
       * @memberOf LGraphNode
       */

    }, {
      key: "clearTriggeredSlot",
      value: function clearTriggeredSlot(slot, link_id) {
        if (!this.outputs) {
          return;
        }

        var output = this.outputs[slot];

        if (!output) {
          return;
        }

        var links = output.links;

        if (!links || !links.length) {
          return;
        } // for every link attached here


        for (var k = 0; k < links.length; ++k) {
          var id = links[k];

          if (link_id != null && link_id != id) {
            // to skip links
            continue;
          }

          var link_info = this.graph.links[links[k]];

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
       * @memberOf LGraphNode
       */

    }, {
      key: "setSize",
      value: function setSize(size) {
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
       * @memberOf LGraphNode
       */

    }, {
      key: "addProperty",
      value: function addProperty(name, default_value, type, extra_info) {
        var o = {
          name: name,
          type: type,
          default_value: default_value
        };

        if (extra_info) {
          for (var _i15 in extra_info) {
            o[_i15] = extra_info[_i15];
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
      } // connections

      /**
       * add a new output slot to use in this node
       * @method addOutput
       * @param {string} name
       * @param {string} type string defining the output type ("vec3","number",...)
       * @param {Object} extra_info this can be used to have special properties of an output (label,
       *     special color, position, etc)
       * @memberOf LGraphNode
       */

    }, {
      key: "addOutput",
      value: function addOutput(name, type, extra_info) {
        var o = {
          name: name,
          type: type,
          links: null
        };

        if (extra_info) {
          for (var _i16 in extra_info) {
            o[_i16] = extra_info[_i16];
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
       * @memberOf LGraphNode
       */

    }, {
      key: "addOutputs",
      value: function addOutputs(array) {
        for (var _i17 = 0; _i17 < array.length; ++_i17) {
          var info = array[_i17];
          var o = {
            name: info[0],
            type: info[1],
            link: null
          };

          if (array[2]) {
            for (var j in info[2]) {
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
       * @memberOf LGraphNode
       */

    }, {
      key: "removeOutput",
      value: function removeOutput(slot) {
        this.disconnectOutput(slot);
        this.outputs.splice(slot, 1);

        for (var _i18 = slot; _i18 < this.outputs.length; ++_i18) {
          if (!this.outputs[_i18] || !this.outputs[_i18].links) {
            continue;
          }

          var links = this.outputs[_i18].links;

          for (var j = 0; j < links.length; ++j) {
            var link = this.graph.links[links[j]];

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
       * @memberOf LGraphNode
       */

    }, {
      key: "addInput",
      value: function addInput(name, type, extra_info) {
        type = type || 0;
        var o = {
          name: name,
          type: type,
          link: null
        };

        if (extra_info) {
          for (var _i19 in extra_info) {
            o[_i19] = extra_info[_i19];
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
       * @memberOf LGraphNode
       */

    }, {
      key: "addInputs",
      value: function addInputs(array) {
        for (var _i20 = 0; _i20 < array.length; ++_i20) {
          var info = array[_i20];
          var o = {
            name: info[0],
            type: info[1],
            link: null
          };

          if (array[2]) {
            for (var j in info[2]) {
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
       * @memberOf LGraphNode
       */

    }, {
      key: "removeInput",
      value: function removeInput(slot) {
        this.disconnectInput(slot);
        var slot_info = this.inputs.splice(slot, 1);

        for (var _i21 = slot; _i21 < this.inputs.length; ++_i21) {
          if (!this.inputs[_i21]) {
            continue;
          }

          var link = this.graph.links[this.inputs[_i21].link];

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
       * @param {number[]} pos position of the connection inside the node
       * @param {string} direction if is input or output
       * @memberOf LGraphNode
       */

    }, {
      key: "addConnection",
      value: function addConnection(name, type, pos, direction) {
        var o = {
          name: name,
          type: type,
          pos: pos,
          direction: direction,
          links: null
        };
        this.connections.push(o);
        return o;
      }
      /**
       * computes the minimum size of a node according to its inputs and output slots
       * @method computeSize
       * @param {number} minHeight
       * @return {number} the total size
       * @memberOf LGraphNode
       */

    }, {
      key: "computeSize",
      value: function computeSize(out) {
        if (this.constructor.size) {
          return this.constructor.size.concat();
        }

        var rows = Math.max(this.inputs ? this.inputs.length : 1, this.outputs ? this.outputs.length : 1);
        var size = out || new Float32Array([0, 0]);
        rows = Math.max(rows, 1);
        var font_size = defaultConfig.NODE_TEXT_SIZE; // although it should be
        // graphcanvas.inner_text_font size

        var font_size = font_size;
        var title_width = compute_text_size(this.title);
        var input_width = 0;
        var output_width = 0;

        if (this.inputs) {
          for (var i = 0, l = this.inputs.length; i < l; ++i) {
            var input = this.inputs[i];
            var text = input.label || input.name || "";
            var text_width = compute_text_size(text);

            if (input_width < text_width) {
              input_width = text_width;
            }
          }
        }

        if (this.outputs) {
          for (var i = 0, l = this.outputs.length; i < l; ++i) {
            var output = this.outputs[i];
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
        var widgets_height = 0;

        if (this.widgets && this.widgets.length) {
          for (var i = 0, l = this.widgets.length; i < l; ++i) {
            if (this.widgets[i].computeSize) {
              widgets_height += this.widgets[i].computeSize(size[0])[1] + 4;
            } else {
              widgets_height += defaultConfig.NODE_WIDGET_HEIGHT + 4;
            }
          }

          widgets_height += 8;
        } // compute height using widgets height


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

        if (this.constructor.min_height && size[1] < this.constructor.min_height) {
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
       * @memberOf LGraphNode
       */

    }, {
      key: "getPropertyInfo",
      value: function getPropertyInfo(property) {
        var info = null; // there are several ways to define info about a property
        // legacy mode

        if (this.properties_info) {
          for (var _i22 = 0; _i22 < this.properties_info.length; ++_i22) {
            if (this.properties_info[_i22].name == property) {
              info = this.properties_info[_i22];
              break;
            }
          }
        } // litescene mode using the constructor


        if (this.constructor["@".concat(property)]) info = this.constructor["@".concat(property)];
        if (this.constructor.widgets_info && this.constructor.widgets_info[property]) info = this.constructor.widgets_info[property]; // litescene mode using the constructor

        if (!info && this.onGetPropertyInfo) {
          info = this.onGetPropertyInfo(property);
        }

        if (!info) info = {};
        if (!info.type) info.type = _typeof(this.properties[property]);
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
       * @memberOf LGraphNode
       */

    }, {
      key: "addWidget",
      value: function addWidget(type, name, value, callback, options) {
        if (!this.widgets) {
          this.widgets = [];
        }

        if (!options && callback && callback.constructor === Object) {
          options = callback;
          callback = null;
        }

        if (options && options.constructor === String) // options can be the property name
          {
            options = {
              property: options
            };
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

        var w = {
          type: type.toLowerCase(),
          name: name,
          value: value,
          callback: callback,
          options: options || {}
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
    }, {
      key: "addCustomWidget",
      value: function addCustomWidget(custom_widget) {
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
       * @return {Float32Array} the total size
       * @memberOf LGraphNode
       */

    }, {
      key: "getBounding",
      value: function getBounding(out) {
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
       * @memberOf LGraphNode
       */

    }, {
      key: "isPointInside",
      value: function isPointInside(x, y, margin, skip_title) {
        margin = margin || 0;
        var margin_top = this.graph && this.graph.isLive() ? 0 : defaultConfig.NODE_TITLE_HEIGHT;

        if (skip_title) {
          margin_top = 0;
        }

        if (this.flags && this.flags.collapsed) {
          // if ( distance([x,y], [this.pos[0] + this.size[0]*0.5, this.pos[1] +
          // this.size[1]*0.5]) < LiteGraph.NODE_COLLAPSED_RADIUS)
          if (isInsideRectangle(x, y, this.pos[0] - margin, this.pos[1] - defaultConfig.NODE_TITLE_HEIGHT - margin, (this._collapsed_width || defaultConfig.NODE_COLLAPSED_WIDTH) + 2 * margin, defaultConfig.NODE_TITLE_HEIGHT + 2 * margin)) {
            return true;
          }
        } else if (this.pos[0] - 4 - margin < x && this.pos[0] + this.size[0] + 4 + margin > x && this.pos[1] - margin_top - margin < y && this.pos[1] + this.size[1] + margin > y) {
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
       * @memberOf LGraphNode
       */

    }, {
      key: "getSlotInPosition",
      value: function getSlotInPosition(x, y) {
        // search for inputs
        var link_pos = new Float32Array(2);

        if (this.inputs) {
          for (var i = 0, l = this.inputs.length; i < l; ++i) {
            var input = this.inputs[i];
            this.getConnectionPos(true, i, link_pos);

            if (isInsideRectangle(x, y, link_pos[0] - 10, link_pos[1] - 5, 20, 10)) {
              return {
                input: input,
                slot: i,
                link_pos: link_pos
              };
            }
          }
        }

        if (this.outputs) {
          for (var i = 0, l = this.outputs.length; i < l; ++i) {
            var output = this.outputs[i];
            this.getConnectionPos(false, i, link_pos);

            if (isInsideRectangle(x, y, link_pos[0] - 10, link_pos[1] - 5, 20, 10)) {
              return {
                output: output,
                slot: i,
                link_pos: link_pos
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
       * @memberOf LGraphNode
       */

    }, {
      key: "findInputSlot",
      value: function findInputSlot(name) {
        if (!this.inputs) {
          return -1;
        }

        for (var _i23 = 0, l = this.inputs.length; _i23 < l; ++_i23) {
          if (name == this.inputs[_i23].name) {
            return _i23;
          }
        }

        return -1;
      }
      /**
       * returns the output slot with a given name (used for dynamic slots), -1 if not found
       * @method findOutputSlot
       * @param {string} name the name of the slot
       * @return {number} the slot (-1 if not found)
       * @memberOf LGraphNode
       */

    }, {
      key: "findOutputSlot",
      value: function findOutputSlot(name) {
        if (!this.outputs) {
          return -1;
        }

        for (var _i24 = 0, l = this.outputs.length; _i24 < l; ++_i24) {
          if (name == this.outputs[_i24].name) {
            return _i24;
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
       * @memberOf LGraphNode
       */

    }, {
      key: "connect",
      value: function connect(slot, target_node, target_slot) {
        target_slot = target_slot || 0;

        if (!this.graph) {
          // could be connected before adding it to a graph
          console.log("Connect: Error, node doesn't belong to any graph. Nodes must be added first to a graph before connecting them."); // due to link ids being associated with graphs

          return null;
        } // seek for the output slot


        if (slot.constructor === String) {
          slot = this.findOutputSlot(slot);

          if (slot == -1) {
            if (defaultConfig.debug) {
              console.log("Connect: Error, no slot of name ".concat(slot));
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
        } // avoid loopback


        if (target_node == this) {
          return null;
        } // you can specify the slot by name


        if (target_slot.constructor === String) {
          target_slot = target_node.findInputSlot(target_slot);

          if (target_slot == -1) {
            if (defaultConfig.debug) {
              console.log("Connect: Error, no slot of name ".concat(target_slot));
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
        } else if (!target_node.inputs || target_slot >= target_node.inputs.length) {
          if (defaultConfig.debug) {
            console.log("Connect: Error, slot number not found");
          }

          return null;
        }

        var changed = false; // if there is something already plugged there, disconnect

        if (target_node.inputs[target_slot].link != null) {
          this.graph.beforeChange();
          target_node.disconnectInput(target_slot);
          changed = true;
        } // why here??
        // this.setDirtyCanvas(false,true);
        // this.graph.connectionChange( this );


        var output = this.outputs[slot]; // allows nodes to block connection

        if (target_node.onConnectInput) {
          if (target_node.onConnectInput(target_slot, output.type, output, this, slot) === false) {
            return null;
          }
        }

        var input = target_node.inputs[target_slot];
        var link_info = null; // this slots cannot be connected (different types)

        if (!isValidConnection(output.type, input.type)) {
          this.setDirtyCanvas(false, true);
          if (changed) this.graph.connectionChange(this, link_info);
          return null;
        }

        if (!changed) this.graph.beforeChange(); // create link class

        link_info = new LLink$1(++this.graph.last_link_id, input.type, this.id, slot, target_node.id, target_slot); // add to graph links list

        this.graph.links[link_info.id] = link_info; // connect in output

        if (output.links == null) {
          output.links = [];
        }

        output.links.push(link_info.id); // connect in input

        target_node.inputs[target_slot].link = link_info.id;

        if (this.graph) {
          this.graph._version++;
        }

        if (this.onConnectionsChange) {
          this.onConnectionsChange(defaultConfig.OUTPUT, slot, true, link_info, output);
        } // link_info has been created now, so its updated


        if (target_node.onConnectionsChange) {
          target_node.onConnectionsChange(defaultConfig.INPUT, target_slot, true, link_info, input);
        }

        if (this.graph && this.graph.onNodeConnectionChange) {
          this.graph.onNodeConnectionChange(defaultConfig.INPUT, target_node, target_slot, this, slot);
          this.graph.onNodeConnectionChange(defaultConfig.OUTPUT, this, slot, target_node, target_slot);
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
       * @memberOf LGraphNode
       */

    }, {
      key: "disconnectOutput",
      value: function disconnectOutput(slot, target_node) {
        if (slot.constructor === String) {
          slot = this.findOutputSlot(slot);

          if (slot == -1) {
            if (defaultConfig.debug) {
              console.log("Connect: Error, no slot of name ".concat(slot));
            }

            return false;
          }
        } else if (!this.outputs || slot >= this.outputs.length) {
          if (defaultConfig.debug) {
            console.log("Connect: Error, slot number not found");
          }

          return false;
        } // get output slot


        var output = this.outputs[slot];

        if (!output || !output.links || output.links.length == 0) {
          return false;
        } // one of the output links in this slot


        if (target_node) {
          if (target_node.constructor === Number) {
            target_node = this.graph.getNodeById(target_node);
          }

          if (!target_node) {
            throw "Target Node not found";
          }

          for (var i = 0, l = output.links.length; i < l; i++) {
            var link_id = output.links[i];
            var link_info = this.graph.links[link_id]; // is the link we are searching for...

            if (link_info.target_id == target_node.id) {
              output.links.splice(i, 1); // remove here

              var input = target_node.inputs[link_info.target_slot];
              input.link = null; // remove there

              delete this.graph.links[link_id]; // remove the link from the links pool

              if (this.graph) {
                this.graph._version++;
              }

              if (target_node.onConnectionsChange) {
                target_node.onConnectionsChange(defaultConfig.INPUT, link_info.target_slot, false, link_info, input);
              } // link_info hasn't been modified so its ok


              if (this.onConnectionsChange) {
                this.onConnectionsChange(defaultConfig.OUTPUT, slot, false, link_info, output);
              }

              if (this.graph && this.graph.onNodeConnectionChange) {
                this.graph.onNodeConnectionChange(defaultConfig.OUTPUT, this, slot);
              }

              if (this.graph && this.graph.onNodeConnectionChange) {
                this.graph.onNodeConnectionChange(defaultConfig.OUTPUT, this, slot);
                this.graph.onNodeConnectionChange(defaultConfig.INPUT, target_node, link_info.target_slot);
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
                  target_node.onConnectionsChange(defaultConfig.INPUT, link_info.target_slot, false, link_info, input);
                } // link_info hasn't been modified so its ok


                if (this.graph && this.graph.onNodeConnectionChange) {
                  this.graph.onNodeConnectionChange(defaultConfig.INPUT, target_node, link_info.target_slot);
                }
              }

              delete this.graph.links[link_id]; // remove the link from the links pool

              if (this.onConnectionsChange) {
                this.onConnectionsChange(defaultConfig.OUTPUT, slot, false, link_info, output);
              }

              if (this.graph && this.graph.onNodeConnectionChange) {
                this.graph.onNodeConnectionChange(defaultConfig.OUTPUT, this, slot);
                this.graph.onNodeConnectionChange(defaultConfig.INPUT, target_node, link_info.target_slot);
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
       * @memberOf LGraphNode
       */

    }, {
      key: "disconnectInput",
      value: function disconnectInput(slot) {
        // seek for the output slot
        if (slot.constructor === String) {
          slot = this.findInputSlot(slot);

          if (slot == -1) {
            if (defaultConfig.debug) {
              console.log("Connect: Error, no slot of name ".concat(slot));
            }

            return false;
          }
        } else if (!this.inputs || slot >= this.inputs.length) {
          if (defaultConfig.debug) {
            console.log("Connect: Error, slot number not found");
          }

          return false;
        }

        var input = this.inputs[slot];

        if (!input) {
          return false;
        }

        var link_id = this.inputs[slot].link;

        if (link_id != null) {
          this.inputs[slot].link = null; // remove other side

          var link_info = this.graph.links[link_id];

          if (link_info) {
            var target_node = this.graph.getNodeById(link_info.origin_id);

            if (!target_node) {
              return false;
            }

            var output = target_node.outputs[link_info.origin_slot];

            if (!output || !output.links || output.links.length == 0) {
              return false;
            } // search in the inputs list for this link


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
              this.onConnectionsChange(defaultConfig.INPUT, slot, false, link_info, input);
            }

            if (target_node.onConnectionsChange) {
              target_node.onConnectionsChange(defaultConfig.OUTPUT, i, false, link_info, output);
            }

            if (this.graph && this.graph.onNodeConnectionChange) {
              this.graph.onNodeConnectionChange(defaultConfig.OUTPUT, target_node, i);
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
       * @return {number[]} the position
       * @memberOf LGraphNode
       * */

    }, {
      key: "getConnectionPos",
      value: function getConnectionPos(is_input, slot_number, out) {
        out = out || new Float32Array(2);
        var num_slots = 0;

        if (is_input && this.inputs) {
          num_slots = this.inputs.length;
        }

        if (!is_input && this.outputs) {
          num_slots = this.outputs.length;
        }

        var offset = defaultConfig.NODE_SLOT_HEIGHT * 0.5;

        if (this.flags.collapsed) {
          var w = this._collapsed_width || defaultConfig.NODE_COLLAPSED_WIDTH;

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
        } // weird feature that never got finished


        if (is_input && slot_number == -1) {
          out[0] = this.pos[0] + defaultConfig.NODE_TITLE_HEIGHT * 0.5;
          out[1] = this.pos[1] + defaultConfig.NODE_TITLE_HEIGHT * 0.5;
          return out;
        } // hard-coded pos


        if (is_input && num_slots > slot_number && this.inputs[slot_number].pos) {
          out[0] = this.pos[0] + this.inputs[slot_number].pos[0];
          out[1] = this.pos[1] + this.inputs[slot_number].pos[1];
          return out;
        }

        if (!is_input && num_slots > slot_number && this.outputs[slot_number].pos) {
          out[0] = this.pos[0] + this.outputs[slot_number].pos[0];
          out[1] = this.pos[1] + this.outputs[slot_number].pos[1];
          return out;
        } // horizontal distributed slots


        if (this.horizontal) {
          out[0] = this.pos[0] + (slot_number + 0.5) * (this.size[0] / num_slots);

          if (is_input) {
            out[1] = this.pos[1] - defaultConfig.NODE_TITLE_HEIGHT;
          } else {
            out[1] = this.pos[1] + this.size[1];
          }

          return out;
        } // default vertical slots


        if (is_input) {
          out[0] = this.pos[0] + offset;
        } else {
          out[0] = this.pos[0] + this.size[0] + 1 - offset;
        }

        out[1] = this.pos[1] + (slot_number + 0.7) * defaultConfig.NODE_SLOT_HEIGHT + (this.constructor.slot_start_y || 0);
        return out;
      }
      /* Force align to grid */

    }, {
      key: "alignToGrid",
      value: function alignToGrid() {
        this.pos[0] = defaultConfig.CANVAS_GRID_SIZE * Math.round(this.pos[0] / defaultConfig.CANVAS_GRID_SIZE);
        this.pos[1] = defaultConfig.CANVAS_GRID_SIZE * Math.round(this.pos[1] / defaultConfig.CANVAS_GRID_SIZE);
      }
      /* Console output */

    }, {
      key: "trace",
      value: function trace(msg) {
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

    }, {
      key: "setDirtyCanvas",
      value: function setDirtyCanvas(dirty_foreground, dirty_background) {
        if (!this.graph) {
          return;
        }

        this.graph.sendActionToCanvas("setDirty", [dirty_foreground, dirty_background]);
      }
    }, {
      key: "loadImage",
      value: function loadImage(url) {
        var _this = this;

        var img = new Image();
        img.src = defaultConfig.node_images_path + url;
        img.ready = false;

        img.onload = function () {
          img.ready = true;

          _this.setDirtyCanvas(true);
        };

        return img;
      } // safe LGraphNode action execution (not sure if safe)

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

    }, {
      key: "captureInput",
      value: function captureInput(v) {
        if (!this.graph || !this.graph.list_of_graphcanvas) {
          return;
        }

        var list = this.graph.list_of_graphcanvas;

        for (var _i25 = 0; _i25 < list.length; ++_i25) {
          var c = list[_i25]; // releasing somebody elses capture?!

          if (!v && c.node_capturing_input != this) {
            continue;
          } // change


          c.node_capturing_input = v ? this : null;
        }
      }
      /**
       * Collapse the node to make it smaller on the canvas
       * @method collapse
       * @memberOf LGraphNode
       * */

    }, {
      key: "collapse",
      value: function collapse(force) {
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
       * @memberOf LGraphNode
       * */

    }, {
      key: "pin",
      value: function pin(v) {
        this.graph._version++;

        if (v === undefined) {
          this.flags.pinned = !this.flags.pinned;
        } else {
          this.flags.pinned = v;
        }
      }
    }, {
      key: "localToScreen",
      value: function localToScreen(x, y, graphcanvas) {
        return [(x + this.pos[0]) * graphcanvas.scale + graphcanvas.offset[0], (y + this.pos[1]) * graphcanvas.scale + graphcanvas.offset[1]];
      }
      /**
       * Create a node of a given type with a name. The node is not attached to any graph yet.
       * @method createNode
       * @param {String} type full name of the node class. p.e. "math/sin"
       * @param {String} name a name to distinguish from other nodes
       * @param {Object} options to set options
       * @memberOf LGraphNode
       */

    }], [{
      key: "createNode",
      value: function createNode(type, title, options) {
        var baseClass = defaultConfig.registered_node_types[type];

        if (!baseClass) {
          if (defaultConfig.debug) console.log("GraphNode type \"".concat(type, "\" not registered."));
          return null;
        }

        baseClass.prototype || baseClass;
        title = title || baseClass.title || type;
        var node = null;

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
          node.size = node.computeSize(); // call onresize?
        }

        if (!node.pos) {
          node.pos = defaultConfig.DEFAULT_POSITION.concat();
        }

        if (!node.mode) {
          node.mode = defaultConfig.ALWAYS;
        } // extra options


        if (options) {
          // eslint-disable-next-line
          for (var _i26 in options) {
            node[_i26] = options[_i26];
          }
        }

        return node;
      } // debug purposes: reloads all the js scripts that matches a wildcard

    }, {
      key: "reloadNodes",
      value: function reloadNodes(folderWildcard) {
        var tmp = document.getElementsByTagName("script"); // weird, this array changes by its own, so we use a copy

        var scriptFiles = [];

        var _iterator2 = _createForOfIteratorHelper(tmp),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var t = _step2.value;
            scriptFiles.push(t);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        var docHeadObj = document.getElementsByTagName("head")[0];
        folderWildcard = document.location.href + folderWildcard;

        for (var _i27 = 0, _scriptFiles = scriptFiles; _i27 < _scriptFiles.length; _i27++) {
          var script = _scriptFiles[_i27];
          var src = script.src;
          if (!src || src.substr(0, folderWildcard.length) !== folderWildcard) continue;

          try {
            if (defaultConfig.debug) {
              console.log("Reloading: ".concat(src));
            }

            var dynamicScript = document.createElement("script");
            dynamicScript.type = "text/javascript";
            dynamicScript.src = src;
            docHeadObj.appendChild(dynamicScript);
            docHeadObj.removeChild(scriptFiles[i]);
          } catch (err) {
            if (defaultConfig.throw_errors) {
              throw err;
            }

            if (defaultConfig.debug) console.log("Error while reloading ".concat(src));
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
       * @memberOf LGraphNode
       */

    }, {
      key: "addNodeMethod",
      value: function addNodeMethod(name, func) {
        LGraphNode.prototype[name] = func;

        for (var _i28 in defaultConfig.registered_node_types) {
          var type = defaultConfig.registered_node_types[_i28];
          if (type.prototype[name]) type.prototype["_".concat(name)] = type.prototype[name];
          type.prototype[name] = func;
        }
      }
    }, {
      key: "extendNode",
      value: function extendNode(object) {
        var _iterator3 = _createForOfIteratorHelper(Object.getOwnPropertyNames(LGraphNode.prototype)),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var _i29 = _step3.value;

            if (!object.prototype[_i29]) {
              object.prototype[_i29] = LGraphNode.prototype[_i29];
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }
    }]);

    return LGraphNode;
  }();

  /**
   * @class LGraphGroup
   * @param title
   */

  var LGraphGroup = /*#__PURE__*/function () {
    function LGraphGroup(title) {
      _classCallCheck(this, LGraphGroup);

      _defineProperty(this, "isPointInside", LGraphNode.prototype.isPointInside);

      _defineProperty(this, "setDirtyCanvas", LGraphNode.prototype.setDirtyCanvas);

      this._ctor(title);
    }

    _createClass(LGraphGroup, [{
      key: "_ctor",
      value: function _ctor(title) {
        this.title = title || "Group";
        this.font_size = 24;
        this.color = "#AAA";
        this._bounding = new Float32Array([10, 10, 140, 80]);
        this._pos = this._bounding.subarray(0, 2);
        this._size = this._bounding.subarray(2, 4);
        this._nodes = [];
        this.graph = null;
        Object.defineProperty(this, "pos", {
          set: function set(v) {
            if (!v || v.length < 2) {
              return;
            }

            this._pos[0] = v[0];
            this._pos[1] = v[1];
          },
          get: function get() {
            return this._pos;
          },
          enumerable: true
        });
        Object.defineProperty(this, "size", {
          set: function set(v) {
            if (!v || v.length < 2) {
              return;
            }

            this._size[0] = Math.max(140, v[0]);
            this._size[1] = Math.max(80, v[1]);
          },
          get: function get() {
            return this._size;
          },
          enumerable: true
        });
      }
    }, {
      key: "recomputeInsideNodes",
      value: function recomputeInsideNodes() {
        this._nodes.length = 0;
        var nodes = this.graph._nodes;
        var node_bounding = new Float32Array(4);

        for (var i = 0; i < nodes.length; ++i) {
          var node = nodes[i];
          node.getBounding(node_bounding);

          if (!overlapBounding(this._bounding, node_bounding)) {
            continue;
          } // out of the visible area


          this._nodes.push(node);
        }
      }
    }, {
      key: "move",
      value: function move(deltax, deltay, ignore_nodes) {
        this._pos[0] += deltax;
        this._pos[1] += deltay;

        if (ignore_nodes) {
          return;
        }

        for (var i = 0; i < this._nodes.length; ++i) {
          var node = this._nodes[i];
          node.pos[0] += deltax;
          node.pos[1] += deltay;
        }
      }
    }, {
      key: "serialize",
      value: function serialize() {
        var b = this._bounding;
        return {
          title: this.title,
          bounding: [Math.round(b[0]), Math.round(b[1]), Math.round(b[2]), Math.round(b[3])],
          color: this.color,
          font: this.font
        };
      }
    }, {
      key: "configure",
      value: function configure(o) {
        this.title = o.title;

        this._bounding.set(o.bounding);

        this.color = o.color;
        this.font = o.font;
      }
    }]);

    return LGraphGroup;
  }();

  /**
   * @class DragAndScale
   * @param element
   * @param skipEvents
   */
  var DragAndScale = /*#__PURE__*/function () {
    function DragAndScale(element, skipEvents) {
      _classCallCheck(this, DragAndScale);

      this.offset = new Float32Array([0, 0]);
      this.scale = 1;
      this.max_scale = 10;
      this.min_scale = 0.1;
      this.onredraw = null;
      this.enabled = true;
      this.last_mouse = [0, 0];
      this.element = null;
      this.visible_area = new Float32Array(4);

      if (element) {
        this.element = element;

        if (!skipEvents) {
          this.bindEvents(element);
        }
      }
    }

    _createClass(DragAndScale, [{
      key: "bindEvents",
      value: function bindEvents(element) {
        this.last_mouse = new Float32Array(2);
        this._binded_mouse_callback = this.onMouse.bind(this);
        element.addEventListener("mousedown", this._binded_mouse_callback);
        element.addEventListener("mousemove", this._binded_mouse_callback);
        element.addEventListener("mousewheel", this._binded_mouse_callback, false);
        element.addEventListener("wheel", this._binded_mouse_callback, false);
      }
    }, {
      key: "computeVisibleArea",
      value: function computeVisibleArea() {
        if (!this.element) {
          // eslint-disable-next-line
          this.visible_area[0] = this.visible_area[1] = this.visible_area[2] = this.visible_area[3] = 0;
          return;
        }

        var width = this.element.width;
        var height = this.element.height;
        var startx = -this.offset[0];
        var starty = -this.offset[1];
        var endx = startx + width / this.scale;
        var endy = starty + height / this.scale;
        this.visible_area[0] = startx;
        this.visible_area[1] = starty;
        this.visible_area[2] = endx - startx;
        this.visible_area[3] = endy - starty;
      }
    }, {
      key: "onMouse",
      value: function onMouse(e) {
        if (!this.enabled) {
          return;
        }

        var canvas = this.element;
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        e.canvasx = x;
        e.canvasy = y;
        e.dragging = this.dragging;
        var ignore = false;

        if (this.onmouse) {
          ignore = this.onmouse(e);
        }

        if (e.type === "mousedown") {
          this.dragging = true;
          canvas.removeEventListener("mousemove", this._binded_mouse_callback);
          document.body.addEventListener("mousemove", this._binded_mouse_callback);
          document.body.addEventListener("mouseup", this._binded_mouse_callback);
        } else if (e.type === "mousemove") {
          if (!ignore) {
            var deltax = x - this.last_mouse[0];
            var deltay = y - this.last_mouse[1];

            if (this.dragging) {
              this.mouseDrag(deltax, deltay);
            }
          }
        } else if (e.type === "mouseup") {
          this.dragging = false;
          document.body.removeEventListener("mousemove", this._binded_mouse_callback);
          document.body.removeEventListener("mouseup", this._binded_mouse_callback);
          canvas.addEventListener("mousemove", this._binded_mouse_callback);
        } else if (e.type === "mousewheel" || e.type === "wheel" || e.type === "DOMMouseScroll") {
          e.eventType = "mousewheel";

          if (e.type === "wheel") {
            e.wheel = -e.deltaY;
          } else {
            e.wheel = e.wheelDeltaY != null ? e.wheelDeltaY : e.detail * -60;
          } // from stack overflow


          if (e.wheelDelta) {
            e.delta = e.wheelDelta / 40;
          } else if (e.deltaY) {
            e.delta = -e.deltaY / 3;
          } else {
            e.delta = 0;
          }

          this.changeDeltaScale(1.0 + e.delta * 0.05);
        }

        this.last_mouse[0] = x;
        this.last_mouse[1] = y;
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }, {
      key: "toCanvasContext",
      value: function toCanvasContext(ctx) {
        ctx.scale(this.scale, this.scale);
        ctx.translate(this.offset[0], this.offset[1]);
      }
    }, {
      key: "convertOffsetToCanvas",
      value: function convertOffsetToCanvas(pos) {
        // return [pos[0] / this.scale - this.offset[0], pos[1] / this.scale - this.offset[1]];
        return [(pos[0] + this.offset[0]) * this.scale, (pos[1] + this.offset[1]) * this.scale];
      }
    }, {
      key: "convertCanvasToOffset",
      value: function convertCanvasToOffset(pos, out) {
        out = out || [0, 0];
        out[0] = pos[0] / this.scale - this.offset[0];
        out[1] = pos[1] / this.scale - this.offset[1];
        return out;
      }
    }, {
      key: "mouseDrag",
      value: function mouseDrag(x, y) {
        this.offset[0] += x / this.scale;
        this.offset[1] += y / this.scale;

        if (this.onredraw) {
          this.onredraw(this);
        }
      }
    }, {
      key: "changeScale",
      value: function changeScale(value, zoomingCenter) {
        if (value < this.min_scale) {
          value = this.min_scale;
        } else if (value > this.max_scale) {
          value = this.max_scale;
        }

        if (value === this.scale) {
          return;
        }

        if (!this.element) {
          return;
        }

        var rect = this.element.getBoundingClientRect();

        if (!rect) {
          return;
        }

        zoomingCenter = zoomingCenter || [rect.width * 0.5, rect.height * 0.5];
        var center = this.convertCanvasToOffset(zoomingCenter);
        this.scale = value;

        if (Math.abs(this.scale - 1) < 0.01) {
          this.scale = 1;
        }

        var newCenter = this.convertCanvasToOffset(zoomingCenter);
        var deltaOffset = [newCenter[0] - center[0], newCenter[1] - center[1]];
        this.offset[0] += deltaOffset[0];
        this.offset[1] += deltaOffset[1];

        if (this.onredraw) {
          this.onredraw(this);
        }
      }
    }, {
      key: "changeDeltaScale",
      value: function changeDeltaScale(value, zoomingCenter) {
        this.changeScale(this.scale * value, zoomingCenter);
      }
    }, {
      key: "reset",
      value: function reset() {
        this.scale = 1;
        this.offset[0] = 0;
        this.offset[1] = 0;
      }
    }]);

    return DragAndScale;
  }();

  /**
   * @module File Utils
   */
  function getFileExtension(url) {
    var question = url.indexOf("?");

    if (question !== -1) {
      url = url.substr(0, question);
    }

    var point = url.lastIndexOf(".");

    if (point === -1) {
      return "";
    }

    return url.substr(point + 1).toLowerCase();
  }

  /**
   * ContextMenu from LiteGUI
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
  var ContextMenu = /*#__PURE__*/function () {
    function ContextMenu(values) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, ContextMenu);

      this.options = options;
      var that = this; // to link a menu with its parent

      if (options.parentMenu) {
        if (options.parentMenu.constructor !== this.constructor) {
          console.error("parentMenu must be of class ContextMenu, ignoring it");
          options.parentMenu = null;
        } else {
          this.parentMenu = options.parentMenu;
          this.parentMenu.lock = true;
          this.parentMenu.current_submenu = this;
        }
      }

      var eventClass = null;
      if (options.event) eventClass = options.event.constructor.name;

      if (eventClass !== "MouseEvent" && eventClass !== "CustomEvent" && eventClass !== "PointerEvent") {
        console.error("Event passed to ContextMenu is not of type MouseEvent or CustomEvent. Ignoring it.");
        options.event = null;
      }

      var root = document.createElement("div");
      root.className = "litegraph litecontextmenu litemenubar-panel";
      if (options.className) root.className += " ".concat(options.className);
      root.style.minWidth = 100;
      root.style.minHeight = 100;
      root.style.pointerEvents = "none";
      setTimeout(function () {
        root.style.pointerEvents = "auto";
      }, 100); // delay so the mouse up event is not caught by this element
      // this prevents the default context browser menu to open in case this menu was created
      // when pressing right button

      root.addEventListener("mouseup", function (e) {
        e.preventDefault();
        return true;
      }, true);
      root.addEventListener("contextmenu", function (e) {
        if (e.button !== 2) {
          // right button
          return false;
        }

        e.preventDefault();
        return false;
      }, true);
      root.addEventListener("mousedown", function (e) {
        if (e.button === 2) {
          that.close();
          e.preventDefault();
          return true;
        }
      }, true);

      function on_mouse_wheel(e) {
        var pos = parseInt(root.style.top, 10);
        root.style.top = "".concat((pos + e.deltaY * options.scroll_speed).toFixed(), "px");
        e.preventDefault();
        return true;
      }

      if (!options.scroll_speed) options.scroll_speed = 0.1;
      root.addEventListener("wheel", on_mouse_wheel, true);
      root.addEventListener("mousewheel", on_mouse_wheel, true);
      this.root = root; // title

      if (options.title) {
        var element = document.createElement("div");
        element.className = "litemenu-title";
        element.innerHTML = options.title;
        root.appendChild(element);
      } // entries


      for (var i = 0; i < values.length; i++) {
        var name = values.constructor === Array ? values[i] : i;

        if (name && name.constructor !== String) {
          name = name.content === undefined ? String(name) : name.content;
        }

        var value = values[i];
        this.addItem(name, value, options);
      } // close on leave


      root.addEventListener("mouseleave", function (e) {
        if (that.lock) return;
        if (root.closing_timer) clearTimeout(root.closing_timer);
        root.closing_timer = setTimeout(that.close.bind(that, e), 500); // that.close(e);
      });
      root.addEventListener("mouseenter", function (e) {
        if (root.closing_timer) clearTimeout(root.closing_timer);
      }); // insert before checking position

      var rootDocument = document;

      if (options.event) {
        rootDocument = options.event.target.ownerDocument;
      }

      if (!rootDocument) {
        rootDocument = document;
      }

      if (rootDocument.fullscreenElement) {
        rootDocument.fullscreenElement.appendChild(root);
      } else {
        rootDocument.body.appendChild(root);
      } // compute best position


      var left = options.left || 0;
      var top = options.top || 0;

      if (options.event) {
        left = options.event.clientX - 10;
        top = options.event.clientY - 10;
        if (options.title) top -= 20;

        if (options.parentMenu) {
          var rect = options.parentMenu.root.getBoundingClientRect();
          left = rect.left + rect.width;
        }

        var bodyRect = document.body.getBoundingClientRect();
        var rootRect = root.getBoundingClientRect();
        if (bodyRect.height === 0) console.error("document.body height is 0. That is dangerous, set html,body { height: 100%; }");

        if (bodyRect.width && left > bodyRect.width - rootRect.width - 10) {
          left = bodyRect.width - rootRect.width - 10;
        }

        if (bodyRect.height && top > bodyRect.height - rootRect.height - 10) {
          top = bodyRect.height - rootRect.height - 10;
        }
      }

      root.style.left = "".concat(left, "px");
      root.style.top = "".concat(top, "px");
      if (options.scale) root.style.transform = "scale(".concat(options.scale, ")");
    }

    _createClass(ContextMenu, [{
      key: "addItem",
      value: function addItem(name, value) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var that = this;
        var element = document.createElement("div");
        element.className = "litemenu-entry submenu";
        var disabled = false;
        if (value === null) element.classList.add("separator");else {
          element.innerHTML = value && value.title ? value.title : name;
          element.value = value;

          if (value) {
            if (value.disabled) {
              disabled = true;
              element.classList.add("disabled");
            }

            if (value.submenu || value.has_submenu) element.classList.add("has_submenu");
          }

          if (typeof value === "function") {
            element.dataset.value = name;
            element.onclick_callback = value;
          } else element.dataset.value = value;

          if (value.className) element.className += " ".concat(value.className);
        }
        this.root.appendChild(element);
        if (!disabled) element.addEventListener("click", inner_onclick);
        if (options.autoopen) element.addEventListener("mouseenter", inner_over);

        function inner_over(e) {
          var value = this.value;
          if (!value || !value.has_submenu) return; // if it is a submenu, autoopen like the item was clicked

          inner_onclick.call(this, e);
        } // menu option clicked


        function inner_onclick(e) {
          var value = this.value;
          var closeParent = true;
          if (that.current_submenu) that.current_submenu.close(e); // global callback

          if (options.callback) {
            var r = options.callback.call(this, value, options, e, that, options.node);
            if (r === true) closeParent = false;
          } // special cases


          if (value) {
            if (value.callback && !options.ignore_item_callbacks && value.disabled !== true) {
              // item callback
              var _r = value.callback.call(this, value, options, e, that, options.extra);

              if (_r === true) closeParent = false;
            }

            if (value.submenu) {
              if (!value.submenu.options) {
                throw new Error("ContextMenu submenu needs options");
              }

              new that.constructor(value.submenu.options, {
                callback: value.submenu.callback,
                event: e,
                parentMenu: that,
                ignore_item_callbacks: value.submenu.ignore_item_callbacks,
                title: value.submenu.title,
                extra: value.submenu.extra,
                autoopen: options.autoopen
              });
              closeParent = false;
            }
          }

          if (closeParent && !that.lock) that.close();
        }

        return element;
      }
    }, {
      key: "close",
      value: function close(e, ignoreParentMenu) {
        if (this.root.parentNode) {
          this.root.remove();
        }

        if (this.parentMenu && !ignoreParentMenu) {
          this.parentMenu.lock = false;
          this.parentMenu.current_submenu = null;
          if (e === undefined) this.parentMenu.close();else if (e && !ContextMenu.isCursorOverElement(e, this.parentMenu.root)) {
            ContextMenu.trigger(this.parentMenu.root, "mouseleave", e);
          }
        }

        if (this.current_submenu) this.current_submenu.close(e, true);
        if (this.root.closing_timer) clearTimeout(this.root.closing_timer);
      } // this code is used to trigger events easily (used in the context menu mouseleave

    }, {
      key: "getTopMenu",
      value: // returns the top most menu
      function getTopMenu() {
        if (this.options.parentMenu) return this.options.parentMenu.getTopMenu();
        return this;
      }
    }, {
      key: "getFirstEvent",
      value: function getFirstEvent() {
        if (this.options.parentMenu) return this.options.parentMenu.getFirstEvent();
        return this.options.event;
      }
    }], [{
      key: "trigger",
      value: function trigger(element, eventName, params, origin) {
        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(eventName, true, true, params); // canBubble, cancelable, detail

        evt.target = origin;
        if (element.dispatchEvent) element.dispatchEvent(evt);else if (element.__events) element.__events.dispatchEvent(evt); // else nothing seems binded here so nothing to do

        return evt;
      }
    }, {
      key: "closeAllContextMenus",
      value: function closeAllContextMenus() {
        var ref_window = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
        var elements = ref_window.document.querySelectorAll(".litecontextmenu");

        if (!elements.length) {
          return;
        }

        var result = [];

        var _iterator = _createForOfIteratorHelper(elements),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var el = _step.value;
            result.push(el);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        for (var _i = 0, _result = result; _i < _result.length; _i++) {
          var re = _result[_i];
          if (re.close) re.close();else if (re.parentNode) re.remove();
        }
      }
    }, {
      key: "isCursorOverElement",
      value: function isCursorOverElement(event, element) {
        var left = event.clientX;
        var top = event.clientY;
        var rect = element.getBoundingClientRect();
        if (!rect) return false;
        return top > rect.top && top < rect.top + rect.height && left > rect.left && left < rect.left + rect.width;
      }
    }]);

    return ContextMenu;
  }();

  var temp = new Float32Array(4);
  var tempVC2 = new Float32Array(2);
  var tempArea = new Float32Array(4);
  var marginArea = new Float32Array(4);
  var linkBounding = new Float32Array(4);
  var tempA = new Float32Array(2);
  var tempB = new Float32Array(2);
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

  var LGraphCanvas = /*#__PURE__*/function () {
    function LGraphCanvas(_canvas, graph) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      _classCallCheck(this, LGraphCanvas);

      _defineProperty(this, "showSearchBox", function (event) {
        var _this = this;

        var that = this;
        var graphcanvas = LGraphCanvas.active_canvas;
        var canvas = graphcanvas.canvas;
        var rootDocument = canvas.ownerDocument || document;
        var dialog = document.createElement("div");
        dialog.className = "litegraph litesearchbox graphdialog rounded";
        dialog.innerHTML = "<span class='name'>Search</span> <input autofocus type='text' class='value rounded'/><div class='helper'></div>";

        dialog.close = function () {
          _this.search_box = null;
          rootDocument.body.focus();
          rootDocument.body.style.overflow = "";
          setTimeout(function () {
            _this.canvas.focus();
          }, 20); // important, if canvas loses focus keys wont be captured

          if (dialog.parentNode) {
            dialog.remove();
          }
        };

        var timeoutClose = null;
        if (this.ds.scale > 1) dialog.style.transform = "scale(".concat(this.ds.scale, ")");
        dialog.addEventListener("mouseenter", function () {
          if (timeoutClose) {
            clearTimeout(timeoutClose);
            timeoutClose = null;
          }
        });
        dialog.addEventListener("mouseleave", function () {
          // dialog.close();
          timeoutClose = setTimeout(function () {
            return dialog.close();
          }, 500);
        });
        if (this.search_box) this.search_box.close();
        this.search_box = dialog;
        var helper = dialog.querySelector(".helper");
        var first = null;
        var timeout = null;
        var selected = null;
        var input = dialog.querySelector("input");

        if (input) {
          input.addEventListener("blur", function () {
            return input.focus();
          });
          input.addEventListener("keydown", function (e) {
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

        if (rootDocument.fullscreenElement) rootDocument.fullscreenElement.appendChild(dialog);else {
          rootDocument.body.appendChild(dialog);
          rootDocument.body.style.overflow = "hidden";
        } // compute best position

        var rect = canvas.getBoundingClientRect();
        var left = (event ? event.clientX : rect.left + rect.width * 0.5) - 80;
        var top = (event ? event.clientY : rect.top + rect.height * 0.5) - 20;
        dialog.style.left = "".concat(left, "px");
        dialog.style.top = "".concat(top, "px"); // To avoid out of screen problems

        if (event.layerY > rect.height - 200) {
          helper.style.maxHeight = "".concat(rect.height - event.layerY - 20, "px");
        }

        input.focus();

        function select(name) {
          if (name) {
            if (that.onSearchBoxSelection) {
              that.onSearchBoxSelection(name, event, graphcanvas);
            } else {
              var extra = defaultConfig.searchbox_extras[name.toLowerCase()];

              if (extra) {
                name = extra.type;
              }

              graphcanvas.graph.beforeChange();

              var _node2 = LGraphNode.createNode(name);

              if (_node2) {
                _node2.pos = graphcanvas.convertEventToCanvasOffset(event);
                graphcanvas.graph.add(_node2);
              }

              if (extra && extra.data) {
                if (extra.data.properties) {
                  // eslint-disable-next-line
                  for (var _i in extra.data.properties) {
                    _node2.addProperty(_i, extra.data.properties[_i]);
                  }
                }

                if (extra.data.inputs) {
                  _node2.inputs = []; // eslint-disable-next-line

                  for (var _i2 in extra.data.inputs) {
                    _node2.addOutput(extra.data.inputs[_i2][0], extra.data.inputs[_i2][1]);
                  }
                }

                if (extra.data.outputs) {
                  _node2.outputs = []; // eslint-disable-next-line

                  for (var _i3 in extra.data.outputs) {
                    _node2.addOutput(extra.data.outputs[_i3][0], extra.data.outputs[_i3][1]);
                  }
                }

                if (extra.data.title) _node2.title = extra.data.title;
                if (extra.data.json) _node2.configure(extra.data.json);
                graphcanvas.graph.afterChange();
              }
            }
          }

          dialog.close();
        }

        function changeSelection(forward) {
          var prev = selected;
          if (selected) selected.classList.remove("selected");

          if (!selected) {
            selected = forward ? helper.childNodes[0] : helper.childNodes[helper.childNodes.length];
          } else {
            selected = forward ? selected.nextSibling : selected.previousSibling;
            if (!selected) selected = prev;
          }

          if (!selected) return;
          selected.classList.add("selected");
          selected.scrollIntoView({
            block: "end",
            behavior: "smooth"
          });
        }

        function refreshHelper() {
          timeout = null;
          var str = input.value;
          first = null;
          helper.innerHTML = "";
          if (!str) return;

          if (that.onSearchBox) {
            var list = that.onSearchBox(helper, str, graphcanvas);

            if (list) {
              var _iterator = _createForOfIteratorHelper(list),
                  _step;

              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  var l = _step.value;
                  addResult(l);
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
            }
          } else {
            var c = 0;
            str = str.toLowerCase();
            var filter = graphcanvas.filter || graphcanvas.graph.filter; // extras
            // eslint-disable-next-line

            for (var _i4 in defaultConfig.searchbox_extras) {
              var extra = defaultConfig.searchbox_extras[_i4];

              if (extra.desc.toLowerCase().indexOf(str) === -1) {
                continue;
              }

              var ctor = defaultConfig.registered_node_types[extra.type];
              if (ctor && ctor.filter !== filter) continue;
              addResult(extra.desc, "searchbox_extra");

              if (LGraphCanvas.search_limit !== -1 && c++ > LGraphCanvas.search_limit) {
                break;
              }
            }

            var keys = Object.keys(defaultConfig.registered_node_types); // types

            var filtered = keys.filter(function (type) {
              var ctor = defaultConfig.registered_node_types[type];
              if (filter && ctor.filter !== filter) return false;
              return type.toLowerCase().indexOf(str) !== -1;
            });

            var _iterator2 = _createForOfIteratorHelper(filtered),
                _step2;

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var filteredItem = _step2.value;
                addResult(filteredItem);

                if (LGraphCanvas.search_limit !== -1 && c++ > LGraphCanvas.search_limit) {
                  break;
                }
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          }

          function addResult(type, className) {
            var help = document.createElement("div");
            if (!first) first = type;
            help.innerText = type;
            help.dataset.type = escape(type);
            help.className = "litegraph lite-search-item";
            if (className) help.className += " ".concat(className);
            help.addEventListener("click", function () {
              select(unescape(help.dataset.type));
            });
            helper.appendChild(help);
          }
        }

        return dialog;
      });

      _defineProperty(this, "showShowNodePanel", function (node) {
        window.SELECTED_NODE = node;
        var panel = document.querySelector("#node-panel");
        if (panel) panel.close();
        var refWindow = this.getCanvasWindow();
        panel = this.createPanel(node.title || "", {
          closable: true,
          window: refWindow
        });
        panel.id = "node-panel";
        panel.node = node;
        panel.classList.add("settings");
        var graphcanvas = this;

        var inner_refresh = function inner_refresh() {
          panel.content.innerHTML = ""; // clear

          panel.addHTML("<span class=\"node_type\">".concat(node.type, "</span><span class=\"node_desc\">").concat(node.constructor.desc || "", "</span><span class=\"separator\"></span>"));
          panel.addHTML("<h3>Properties</h3>");

          for (var _i5 in node.properties) {
            var value = node.properties[_i5];
            var info = node.getPropertyInfo(_i5);
            if (node.onAddPropertyToPanel && node.onAddPropertyToPanel(_i5, panel)) continue;
            panel.addWidget(info.widget || info.type, _i5, value, info, function (name, value) {
              graphcanvas.graph.beforeChange(node);
              node.setProperty(name, value);
              graphcanvas.graph.afterChange();
              graphcanvas.dirty_canvas = true;
            });
          }

          panel.addSeparator();
          if (node.onShowCustomPanelInfo) node.onShowCustomPanelInfo(panel);
          panel.addButton("Delete", function () {
            if (node.block_delete) return;
            node.graph.remove(node);
            panel.close();
          }).classList.add("delete");
        };

        inner_refresh();
        this.canvas.parentNode.appendChild(panel);
      });

      // if(graph === undefined)
      // throw ("No graph assigned");
      this.background_image = LGraphCanvas.DEFAULT_BACKGROUND_IMAGE;

      if (_canvas && _canvas.constructor === String) {
        _canvas = document.querySelector(_canvas);
      }

      this.ds = new DragAndScale();
      this.zoom_modify_alpha = true; // otherwise it generates ugly patterns when scaling down
      // too much

      this.title_text_font = "".concat(defaultConfig.NODE_TEXT_SIZE, "px Arial");
      this.inner_text_font = "normal ".concat(defaultConfig.NODE_SUBTEXT_SIZE, "px Arial");
      this.node_title_color = defaultConfig.NODE_TITLE_COLOR;
      this.default_link_color = defaultConfig.LINK_COLOR;
      this.default_connection_color = {
        input_off: "#778",
        input_on: "#7F7",
        output_off: "#778",
        output_on: "#7F7"
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
      this.onSearchBoxSelection = null; // callbacks

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
      this.visible_links = []; // link canvas and graph

      if (graph) {
        graph.attachCanvas(this);
      }

      this.setCanvas(_canvas);
      this.clear();

      if (!options.skip_render) {
        this.startRendering();
      }

      this.autoresize = options.autoresize;
    }

    _createClass(LGraphCanvas, [{
      key: "clear",
      value:
      /**
       * clears all the data inside
       *
       * @method clear
       * @memberOf LGraphCanvas
       */
      function clear() {
        this.frame = 0;
        this.last_draw_time = 0;
        this.render_time = 0;
        this.fps = 0; // this.scale = 1;
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

    }, {
      key: "setGraph",
      value: function setGraph(graph, skipClear) {
        if (this.graph === graph) {
          return;
        }

        if (!skipClear) this.clear();

        if (!graph && this.graph) {
          this.graph.detachCanvas(this);
          return;
        }

        graph.attachCanvas(this); // remove the graph stack in case a subgraph was open

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

    }, {
      key: "getTopGraph",
      value: function getTopGraph() {
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

    }, {
      key: "openSubgraph",
      value: function openSubgraph(graph) {
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

    }, {
      key: "closeSubgraph",
      value: function closeSubgraph() {
        if (!this._graph_stack || this._graph_stack.length === 0) {
          return;
        }

        var subgraphNode = this.graph._subgraph_node;

        var graph = this._graph_stack.pop();

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

    }, {
      key: "getCurrentGraph",
      value: function getCurrentGraph() {
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

    }, {
      key: "setCanvas",
      value: function setCanvas(canvas, skipEvents) {
        var _canvas2;

        if (((_canvas2 = canvas) === null || _canvas2 === void 0 ? void 0 : _canvas2.constructor) === String) {
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
        if (!canvas) return; // this.canvas.tabindex = "1000";

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
            throw new Error("Element supplied for LGraphCanvas must be a <canvas> element, you passed a ".concat(canvas.localName));
          }

          throw new Error("This browser doesn't support Canvas");
        }

        this.ctx = canvas.getContext("2d");

        if (this.ctx == null) {
          if (!canvas.webgl_enabled) {
            console.warn("This canvas seems to be WebGL, enabling WebGL renderer");
          }

          this.enableWebGL();
        } // input:  (move and up could be unbinded)


        this._mousemove_callback = this.processMouseMove.bind(this);
        this._mouseup_callback = this.processMouseUp.bind(this);
        if (!skipEvents) this.bindEvents();
      }
    }, {
      key: "_doNothing",
      value: function _doNothing(e) {
        e.preventDefault();
        return false;
      }
    }, {
      key: "_doReturnTrue",
      value: function _doReturnTrue(e) {
        e.preventDefault();
        return true;
      }
      /**
       * binds mouse, keyboard, touch and drag events to the canvas
       * @method bindEvents
       * @memberOf LGraphCanvas
       * */

    }, {
      key: "bindEvents",
      value: function bindEvents() {
        if (this._events_binded) {
          console.warn("LGraphCanvas: events already binded");
          return;
        }

        var canvas = this.canvas;
        var refWindow = this.getCanvasWindow();
        var document = refWindow.document; // hack used when moving canvas between windows

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
        canvas.addEventListener("touchcancel", this.touchHandler, true); // Keyboard ******************

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

    }, {
      key: "unbindEvents",
      value: function unbindEvents() {
        if (!this._events_binded) {
          console.warn("LGraphCanvas: no events binded");
          return;
        }

        var refWindow = this.getCanvasWindow();
        var document = refWindow.document;
        this.canvas.removeEventListener("mousedown", this._mousedown_callback);
        this.canvas.removeEventListener("mousewheel", this._mousewheel_callback);
        this.canvas.removeEventListener("DOMMouseScroll", this._mousewheel_callback);
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

    }, {
      key: "enableWebGL",
      value: function enableWebGL() {
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

    }, {
      key: "setDirty",
      value: function setDirty(fgcanvas, bgcanvas) {
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

    }, {
      key: "getCanvasWindow",
      value: function getCanvasWindow() {
        if (!this.canvas) return window;
        var doc = this.canvas.ownerDocument;
        return doc.defaultView;
      }
      /**
       * starts rendering the content of the canvas when needed
       *
       * @method startRendering
       * @memberOf LGraphCanvas
       */

    }, {
      key: "startRendering",
      value: function startRendering() {
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

    }, {
      key: "renderFrame",
      value: function renderFrame() {
        var _this2 = this;

        if (!this.pause_rendering) this.draw();
        var window = this.getCanvasWindow();
        if (this.is_rendering) window.requestAnimationFrame(function () {
          return _this2.renderFrame();
        });
      }
      /**
       * stops rendering the content of the canvas (to save resources)
       *
       * @method stopRendering
       * @memberOf LGraphCanvas
       */

    }, {
      key: "stopRendering",
      value: function stopRendering() {
        this.is_rendering = false;
      }
      /* LiteGraphCanvas input */

      /**
       * used to block future mouse events (because of im gui)
       *
       * @method blockClick
       * @memberOf LGraphCanvas
       */

    }, {
      key: "blockClick",
      value: function blockClick() {
        this.block_click = true;
        this.last_mouseclick = 0;
      }
    }, {
      key: "processMouseDown",
      value: function processMouseDown(e) {
        var _this3 = this;

        if (this.set_canvas_dirty_on_mouse_event) this.dirty_canvas = true;
        if (!this.graph) return;
        this.adjustMouseEvent(e);
        var refWindow = this.getCanvasWindow();
        LGraphCanvas.active_canvas = this; // move mouse move event to the window in case it drags outside of the canvas

        this.canvas.removeEventListener("mousemove", this._mousemove_callback);
        refWindow.document.addEventListener("mousemove", this._mousemove_callback, true); // catch for the entire window

        refWindow.document.addEventListener("mouseup", this._mouseup_callback, true);
        var node = this.graph.getNodeOnPos(e.canvasX, e.canvasY, this.visible_nodes, 5);
        var skipAction = false;
        var now = getTime();
        var isDoubleClick = now - this.last_mouseclick < 300;
        this.mouse[0] = e.localX;
        this.mouse[1] = e.localY;
        this.graph_mouse[0] = e.canvasX;
        this.graph_mouse[1] = e.canvasY;
        this.last_click_position = [this.mouse[0], this.mouse[1]];
        this.canvas.focus();
        ContextMenu.closeAllContextMenus(refWindow);

        if (this.onMouse) {
          if (this.onMouse(e)) return;
        } // left button mouse


        if (e.which === 1) {
          if (e.ctrlKey) {
            this.dragging_rectangle = new Float32Array(4);
            this.dragging_rectangle[0] = e.canvasX;
            this.dragging_rectangle[1] = e.canvasY;
            this.dragging_rectangle[2] = 1;
            this.dragging_rectangle[3] = 1;
            skipAction = true;
          }

          var clickingCanvasBg = false; // when clicked on top of a node
          // and it is not interactive

          if (node && this.allow_interaction && !skipAction && !this.read_only) {
            if (!this.live_mode && !node.flags.pinned) {
              this.bringToFront(node);
            } // if it wasn't selected?
            // not dragging mouse to connect two slots


            if (!this.connecting_node && !node.flags.collapsed && !this.live_mode) {
              // Search for corner for resize
              if (!skipAction && node.resizable && isInsideRectangle(e.canvasX, e.canvasY, node.pos[0] + node.size[0] - 5, node.pos[1] + node.size[1] - 5, 1010)) {
                this.graph.beforeChange();
                this.resizing_node = node;
                this.canvas.style.cursor = "se-resize";
                skipAction = true;
              } else {
                // search for outputs
                if (node.outputs) {
                  for (var _i6 = 0, l = node.outputs.length; _i6 < l; _i6++) {
                    var output = node.outputs[_i6];
                    var linkPos = node.getConnectionPos(false, _i6);

                    if (isInsideRectangle(e.canvasX, e.canvasY, linkPos[0] - 15, linkPos[1] - 10, 30, 20)) {
                      this.connecting_node = node;
                      this.connecting_output = output;
                      this.connecting_pos = node.getConnectionPos(false, _i6);
                      this.connecting_slot = _i6;

                      if (e.shiftKey) {
                        node.disconnectOutput(_i6);
                      }

                      if (isDoubleClick) {
                        if (node.onOutputDblClick) {
                          node.onOutputDblClick(_i6, e);
                        }
                      } else if (node.onOutputClick) {
                        node.onOutputClick(_i6, e);
                      }

                      skipAction = true;
                      break;
                    }
                  }
                } // search for inputs


                if (node.inputs) {
                  for (var _i7 = 0, _l = node.inputs.length; _i7 < _l; _i7++) {
                    var _input = node.inputs[_i7];

                    var _linkPos = node.getConnectionPos(true, _i7);

                    if (isInsideRectangle(e.canvasX, e.canvasY, _linkPos[0] - 15, _linkPos[1] - 10, 30, 20)) {
                      if (isDoubleClick) {
                        if (node.onInputDblClick) {
                          node.onInputDblClick(_i7, e);
                        }
                      } else if (node.onInputClick) {
                        node.onInputClick(_i7, e);
                      }

                      if (_input.link) {
                        var linkInfo = this.graph.links[_input.link]; // before disconnecting

                        node.disconnectInput(_i7);

                        if (this.allow_reconnect_links || e.shiftKey) {
                          this.connecting_node = this.graph._nodes_by_id[linkInfo.origin_id];
                          this.connecting_slot = linkInfo.origin_slot;
                          this.connecting_output = this.connecting_node.outputs[this.connecting_slot];
                          this.connecting_pos = this.connecting_node.getConnectionPos(false, this.connecting_slot);
                        }

                        this.dirty_bgcanvas = true;
                        skipAction = true;
                      }
                    }
                  }
                }
              } // not resizing

            } // it wasn't clicked on the links boxes


            if (!skipAction) {
              var blockDragNote = false;
              var pos = [e.canvasX - node.pos[0], e.canvasY - node.pos[1]]; // widgets

              var widget = this.processNodeWidgets(node, this.graph_mouse, e);

              if (widget) {
                blockDragNote = true;
                this.node_widget = [node, widget];
              } // double clicking


              if (isDoubleClick && this.selected_nodes[node.id]) {
                // double click node
                if (node.onDblClick) {
                  node.onDblClick(e, pos, this);
                }

                this.processNodeDblClicked(node);
                blockDragNote = true;
              } // if do not capture mouse


              if (node.onMouseDown && node.onMouseDown(e, pos, this)) {
                blockDragNote = true;
              } else {
                // open subgraph button
                if (node.subgraph && !node.skip_subgraph_button) {
                  if (!node.flags.collapsed && pos[0] > node.size[0] - defaultConfig.NODE_TITLE_HEIGHT && pos[1] < 0) {
                    setTimeout(function () {
                      _this3.openSubgraph(node.subgraph);
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
              var _iterator3 = _createForOfIteratorHelper(this.visible_links),
                  _step3;

              try {
                for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                  var link = _step3.value;
                  var center = link._pos;

                  if (!center || e.canvasX < center[0] - 4 || e.canvasX > center[0] + 4 || e.canvasY < center[1] - 4 || e.canvasY > center[1] + 4) {
                    continue;
                  } // link clicked


                  this.showLinkMenu(link, e);
                  this.over_link_center = null; // clear tooltip

                  break;
                }
              } catch (err) {
                _iterator3.e(err);
              } finally {
                _iterator3.f();
              }
            }

            this.selected_group = this.graph.getGroupOnPos(e.canvasX, e.canvasY);
            this.selected_group_resizing = false;

            if (this.selected_group && !this.read_only) {
              if (e.ctrlKey) this.dragging_rectangle = null;
              var dist = distance([e.canvasX, e.canvasY], [this.selected_group.pos[0] + this.selected_group.size[0], this.selected_group.pos[1] + this.selected_group.size[1]]);

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
        } else if (e.which === 2) ; else if (e.which === 3) {
          // right button
          if (!this.read_only) this.processContextMenu(node, e);
        } // TODO
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

        this.graph.change(); // this is to ensure to defocus(blur) if a text input element is on focus

        if (!refWindow.document.activeElement || refWindow.document.activeElement.nodeName.toLowerCase() !== "input" && refWindow.document.activeElement.nodeName.toLowerCase() !== "textarea") {
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

    }, {
      key: "processMouseMove",
      value: function processMouseMove(e) {
        if (this.autoresize) this.resize();
        if (this.set_canvas_dirty_on_mouse_event) this.dirty_canvas = true;
        if (!this.graph) return;
        LGraphCanvas.active_canvas = this;
        this.adjustMouseEvent(e);
        var mouse = [e.localX, e.localY];
        this.mouse[0] = mouse[0];
        this.mouse[1] = mouse[1];
        var delta = [mouse[0] - this.last_mouse[0], mouse[1] - this.last_mouse[1]];
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
            this.selected_group.size = [e.canvasX - this.selected_group.pos[0], e.canvasY - this.selected_group.pos[1]];
          } else {
            var deltax = delta[0] / this.ds.scale;
            var deltay = delta[1] / this.ds.scale;
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
          if (this.connecting_node) this.dirty_canvas = true; // get node over

          var _node3 = this.graph.getNodeOnPos(e.canvasX, e.canvasY, this.visible_nodes); // remove mouseover flag


          var _iterator4 = _createForOfIteratorHelper(this.graph._nodes),
              _step4;

          try {
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              var _node = _step4.value;

              if (_node.mouseOver && _node3 !== _node) {
                // mouse leave
                _node.mouseOver = false;

                if (this.node_over && this.node_over.onMouseLeave) {
                  this.node_over.onMouseLeave(e);
                }

                this.node_over = null;
                this.dirty_canvas = true;
              }
            } // mouse over a node

          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }

          if (_node3) {
            if (_node3.redraw_on_mouse) this.dirty_canvas = true; // this.canvas.style.cursor = "move";

            if (!_node3.mouseOver) {
              // mouse enter
              _node3.mouseOver = true;
              this.node_over = _node3;
              this.dirty_canvas = true;
              if (_node3.onMouseEnter) _node3.onMouseEnter(e);
            } // in case the node wants to do something


            if (_node3.onMouseMove) {
              _node3.onMouseMove(e, [e.canvasX - _node3.pos[0], e.canvasY - _node3.pos[1]], this);
            } // if dragging a link


            if (this.connecting_node) {
              var pos = this._highlight_input || [0, 0]; // on top of input

              if (this.isOverNodeBox(_node3, e.canvasX, e.canvasY)) ; else {
                // check if I have a slot below de mouse
                var _slot2 = this.isOverNodeInput(_node3, e.canvasX, e.canvasY, pos);

                if (_slot2 !== -1 && _node3.inputs[_slot2]) {
                  var slotType = _node3.inputs[_slot2].type;

                  if (isValidConnection(this.connecting_output.type, slotType)) {
                    this._highlight_input = pos;
                  }
                } else this._highlight_input = null;
              }
            } // Search for corner


            if (this.canvas) {
              if (isInsideRectangle(e.canvasX, e.canvasY, _node3.pos[0] + _node3.size[0] - 5, _node3.pos[1] + _node3.size[1] - 5, 5, 5)) {
                this.canvas.style.cursor = "se-resize";
              } else this.canvas.style.cursor = "crosshair";
            }
          } else {
            // not over a node
            // search for link connector
            var overLink = null;

            var _iterator5 = _createForOfIteratorHelper(this.visible_links),
                _step5;

            try {
              for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                var link = _step5.value;
                var center = link._pos;

                if (!center || e.canvasX < center[0] - 4 || e.canvasX > center[0] + 4 || e.canvasY < center[1] - 4 || e.canvasY > center[1] + 4) {
                  continue;
                }

                overLink = link;
                break;
              }
            } catch (err) {
              _iterator5.e(err);
            } finally {
              _iterator5.f();
            }

            if (overLink !== this.over_link_center) {
              this.over_link_center = overLink;
              this.dirty_canvas = true;
            }

            if (this.canvas) this.canvas.style.cursor = "";
          } // end
          // send event to node if capturing input (used with widgets that allow drag outside of
          // the area of the node)


          if (this.node_capturing_input && this.node_capturing_input !== _node3 && this.node_capturing_input.onMouseMove) {
            this.node_capturing_input.onMouseMove(e, [e.canvasX - this.node_capturing_input.pos[0], e.canvasY - this.node_capturing_input.pos[1]], this);
          } // node being dragged


          if (this.node_dragged && !this.live_mode) {
            for (var _i8 = 0, _Object$keys = Object.keys(this.selected_nodes); _i8 < _Object$keys.length; _i8++) {
              var nKeys = _Object$keys[_i8];
              var n = this.selected_nodes[nKeys];
              n.pos[0] += delta[0] / this.ds.scale;
              n.pos[1] += delta[1] / this.ds.scale;
            }

            this.dirty_canvas = true;
            this.dirty_bgcanvas = true;
          }

          if (this.resizing_node && !this.live_mode) {
            // convert mouse to node space
            var desiredSize = [e.canvasX - this.resizing_node.pos[0], e.canvasY - this.resizing_node.pos[1]];
            var minSize = this.resizing_node.computeSize();
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

    }, {
      key: "processMouseUp",
      value: function processMouseUp(e) {
        if (this.set_canvas_dirty_on_mouse_event) this.dirty_canvas = true;
        if (!this.graph) return;
        var window = this.getCanvasWindow();
        var document = window.document;
        LGraphCanvas.active_canvas = this; // restore the mousemove event back to the canvas

        document.removeEventListener("mousemove", this._mousemove_callback, true);
        this.canvas.addEventListener("mousemove", this._mousemove_callback, true);
        document.removeEventListener("mouseup", this._mouseup_callback, true);
        this.adjustMouseEvent(e);
        var now = getTime();
        e.click_time = now - this.last_mouseclick;
        this.last_mouse_dragging = false;
        this.last_click_position = null;
        if (this.block_click) this.block_click = false; // used to avoid sending twice a click in a immediate button

        if (e.which === 1) {
          if (this.node_widget) this.processNodeWidgets(this.node_widget[0], this.graph_mouse, e); // left button

          this.node_widget = null;

          if (this.selected_group) {
            var diffx = this.selected_group.pos[0] - Math.round(this.selected_group.pos[0]);
            var diffy = this.selected_group.pos[1] - Math.round(this.selected_group.pos[1]);
            this.selected_group.move(diffx, diffy, e.ctrlKey);
            this.selected_group.pos[0] = Math.round(this.selected_group.pos[0]);
            this.selected_group.pos[1] = Math.round(this.selected_group.pos[1]);
            if (this.selected_group._nodes.length) this.dirty_canvas = true;
            this.selected_group = null;
          }

          this.selected_group_resizing = false;

          if (this.dragging_rectangle) {
            if (this.graph) {
              var nodes = this.graph._nodes;
              var nodeBounding = new Float32Array(4);
              this.deselectAllNodes(); // compute bounding and flip if left to right

              var w = Math.abs(this.dragging_rectangle[2]);
              var h = Math.abs(this.dragging_rectangle[3]);
              var startx = this.dragging_rectangle[2] < 0 ? this.dragging_rectangle[0] - w : this.dragging_rectangle[0];
              var starty = this.dragging_rectangle[3] < 0 ? this.dragging_rectangle[1] - h : this.dragging_rectangle[1];
              this.dragging_rectangle[0] = startx;
              this.dragging_rectangle[1] = starty;
              this.dragging_rectangle[2] = w;
              this.dragging_rectangle[3] = h; // test against all nodes (not visible because the rectangle maybe start outside

              var toSelect = [];

              var _iterator6 = _createForOfIteratorHelper(nodes),
                  _step6;

              try {
                for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                  var _node4 = _step6.value;

                  _node4.getBounding(nodeBounding);

                  if (!overlapBounding$1(this.dragging_rectangle, nodeBounding)) {
                    continue;
                  } // out of the visible area


                  toSelect.push(_node4);
                }
              } catch (err) {
                _iterator6.e(err);
              } finally {
                _iterator6.f();
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

            var _node5 = this.graph.getNodeOnPos(e.canvasX, e.canvasY, this.visible_nodes); // node below mouse


            if (_node5) {
              if (this.connecting_output.type === defaultConfig.EVENT && this.isOverNodeBox(_node5, e.canvasX, e.canvasY)) {
                this.connecting_node.connect(this.connecting_slot, _node5, defaultConfig.EVENT);
              } else {
                // slot below mouse? connect
                var _slot3 = this.isOverNodeInput(_node5, e.canvasX, e.canvasY);

                if (_slot3 !== -1) {
                  this.connecting_node.connect(this.connecting_slot, _node5, _slot3);
                } else {
                  // not on top of an input
                  var _input2 = _node5.getInputInfo(0); // auto connect


                  if (this.connecting_output.type === defaultConfig.EVENT) {
                    this.connecting_node.connect(this.connecting_slot, _node5, defaultConfig.EVENT);
                  } else if (_input2 && !_input2.link && isValidConnection(_input2.type && this.connecting_output.type)) {
                    this.connecting_node.connect(this.connecting_slot, _node5, 0);
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
            var _node6 = this.node_dragged;

            if (_node6 && e.click_time < 300 && isInsideRectangle(e.canvasX, e.canvasY, _node6.pos[0], _node6.pos[1] - defaultConfig.NODE_TITLE_HEIGHT, defaultConfig.NODE_TITLE_HEIGHT, defaultConfig.NODE_TITLE_HEIGHT)) {
              _node6.collapse();
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
            var _node7 = this.graph.getNodeOnPos(e.canvasX, e.canvasY, this.visible_nodes);

            if (!_node7 && e.click_time < 300) {
              this.deselectAllNodes();
            }

            this.dirty_canvas = true;
            this.dragging_canvas = false;

            if (this.node_over && this.node_over.onMouseUp) {
              this.node_over.onMouseUp(e, [e.canvasX - this.node_over.pos[0], e.canvasY - this.node_over.pos[1]], this);
            }

            if (this.node_capturing_input && this.node_capturing_input.onMouseUp) {
              this.node_capturing_input.onMouseUp(e, [e.canvasX - this.node_capturing_input.pos[0], e.canvasY - this.node_capturing_input.pos[1]]);
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

    }, {
      key: "processMouseWheel",
      value: function processMouseWheel(e) {
        var _e$wheelDeltaY;

        if (!this.graph || !this.allow_dragcanvas) {
          return;
        }

        var delta = (_e$wheelDeltaY = e.wheelDeltaY) !== null && _e$wheelDeltaY !== void 0 ? _e$wheelDeltaY : e.detail * -60;
        this.adjustMouseEvent(e);
        var scale = this.ds.scale;

        if (delta > 0) {
          scale *= 1.1;
        } else if (delta < 0) {
          scale *= 1 / 1.1;
        } // this.setZoom( scale, [ e.localX, e.localY ] );


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

    }, {
      key: "isOverNodeBox",
      value: function isOverNodeBox(node, canvasx, canvasy) {
        var titleHeight = defaultConfig.NODE_TITLE_HEIGHT;
        return !!isInsideRectangle(canvasx, canvasy, node.pos[0] + 2, node.pos[1] + 2 - titleHeight, titleHeight - 4, titleHeight - 4);
      }
      /**
       * returns true if a position (in graph space) is on top of a node input slot
       * @method isOverNodeInput
       * @memberOf LGraphCanvas
       * */

    }, {
      key: "isOverNodeInput",
      value: function isOverNodeInput(node, canvasx, canvasy, slotPos) {
        if (node.inputs) {
          for (var _i9 = 0, l = node.inputs.length; _i9 < l; ++_i9) {
            var linkPos = node.getConnectionPos(true, _i9);
            var isInside = false;

            if (node.horizontal) {
              isInside = isInsideRectangle(canvasx, canvasy, linkPos[0] - 5, linkPos[1] - 10, 10, 20);
            } else {
              isInside = isInsideRectangle(canvasx, canvasy, linkPos[0] - 10, linkPos[1] - 5, 40, 10);
            }

            if (isInside) {
              if (slotPos) {
                slotPos[0] = linkPos[0];
                slotPos[1] = linkPos[1];
              }

              return _i9;
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

    }, {
      key: "processKey",
      value: function processKey(e) {
        if (!this.graph) return;
        var blockDefault = false;

        if (e.target.localName === "input") {
          return;
        }

        if (e.type === "keydown") {
          if (e.keyCode === 32) {
            // esc
            this.dragging_canvas = true;
            blockDefault = true;
          } // select all Control A


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
          } // delete or backspace


          if ((e.keyCode === 46 || e.keyCode === 8) && e.target.localName !== "input" && e.target.localName !== "textarea") {
            this.deleteSelectedNodes();
            blockDefault = true;
          } // collapse
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
    }, {
      key: "pasteFromClipboard",
      value: function pasteFromClipboard() {
        var data = localStorage.getItem("litegrapheditor_clipboard");
        if (!data) return;
        this.graph.beforeChange(); // create nodes

        var clipboardInfo = JSON.parse(data);
        var nodes = [];

        var _iterator7 = _createForOfIteratorHelper(clipboardInfo.nodes),
            _step7;

        try {
          for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            var node_data = _step7.value;

            var _node8 = LGraphNode.createNode(node_data.type);

            if (_node8) {
              _node8.configure(node_data);

              _node8.pos[0] += 5;
              _node8.pos[1] += 5;
              this.graph.add(_node8);
              nodes.push(_node8);
            }
          }
        } catch (err) {
          _iterator7.e(err);
        } finally {
          _iterator7.f();
        }

        var _iterator8 = _createForOfIteratorHelper(clipboardInfo.links),
            _step8;

        try {
          for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
            var link_info = _step8.value;
            var origin_node = nodes[link_info[0]];
            var target_node = nodes[link_info[2]];
            if (origin_node && target_node) origin_node.connect(link_info[1], target_node, link_info[3]);else console.warn("Warning, nodes missing on pasting");
          }
        } catch (err) {
          _iterator8.e(err);
        } finally {
          _iterator8.f();
        }

        this.selectNodes(nodes);
        this.graph.afterChange();
      }
    }, {
      key: "copyToClipboard",
      value: function copyToClipboard() {
        var clipboardInfo = {
          nodes: [],
          links: []
        };
        var index = 0;
        var selectedNodesArray = [];

        var _iterator9 = _createForOfIteratorHelper(this.selected_nodes),
            _step9;

        try {
          for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
            var selectedNode = _step9.value;
            node._relative_id = index;
            selectedNodesArray.push(node);
            index += 1;
          }
        } catch (err) {
          _iterator9.e(err);
        } finally {
          _iterator9.f();
        }

        for (var _i10 = 0, _selectedNodesArray = selectedNodesArray; _i10 < _selectedNodesArray.length; _i10++) {
          var _node9 = _selectedNodesArray[_i10];

          var cloned = _node9.clone();

          if (!cloned) {
            console.warn("node type not found: ".concat(_node9.type));
            continue;
          }

          clipboardInfo.nodes.push(cloned.serialize());

          if (_node9.inputs && _node9.inputs.length) {
            for (var j = 0; j < _node9.inputs.length; ++j) {
              var _input3 = _node9.inputs[j];

              if (!_input3 || _input3.link == null) {
                continue;
              }

              var link_info = this.graph.links[_input3.link];

              if (!link_info) {
                continue;
              }

              var target_node = this.graph.getNodeById(link_info.origin_id);

              if (!target_node || !this.selected_nodes[target_node.id]) {
                // improve this by allowing connections to non-selected nodes
                continue;
              } // not selected


              clipboardInfo.links.push([target_node._relative_id, link_info.origin_slot, // j,
              _node9._relative_id, link_info.target_slot]);
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

    }, {
      key: "processDrop",
      value: function processDrop(e) {
        e.preventDefault();
        this.adjustMouseEvent(e);
        var pos = [e.canvasX, e.canvasY];
        var node = this.graph ? this.graph.getNodeOnPos(pos[0], pos[1]) : null;

        if (!node) {
          var r = null;
          if (this.onDropItem) r = this.onDropItem(e);

          if (!r) {
            this.checkDropItem(e);
          }

          return;
        }

        if (node.onDropFile || node.onDropData) {
          var files = e.dataTransfer.files;

          if (files && files.length) {
            var _iterator10 = _createForOfIteratorHelper(files),
                _step10;

            try {
              var _loop = function _loop() {
                var file = _step10.value;
                var filename = file.name; // console.log(file);

                if (node.onDropFile) {
                  node.onDropFile(file);
                }

                if (node.onDropData) {
                  // prepare reader
                  var reader = new FileReader();

                  reader.onload = function (event) {
                    // console.log(event.target);
                    var data = event.target.result;
                    node.onDropData(data, filename, file);
                  }; // read data


                  var type = file.type.split("/")[0];

                  if (type === "text" || type === "") {
                    reader.readAsText(file);
                  } else if (type === "image") {
                    reader.readAsDataURL(file);
                  } else {
                    reader.readAsArrayBuffer(file);
                  }
                }
              };

              for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
                _loop();
              }
            } catch (err) {
              _iterator10.e(err);
            } finally {
              _iterator10.f();
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
    }, {
      key: "checkDropItem",
      value: function checkDropItem(e) {
        if (e.dataTransfer.files.length) {
          var file = e.dataTransfer.files[0];
          var ext = getFileExtension(file.name).toLowerCase();
          var nodetype = defaultConfig.node_types_by_file_extension[ext];

          if (nodetype) {
            this.graph.beforeChange();

            var _node10 = LGraphNode.createNode(nodetype.type);

            _node10.pos = [e.canvasX, e.canvasY];
            this.graph.add(_node10);

            if (_node10.onDropFile) {
              _node10.onDropFile(file);
            }

            this.graph.afterChange();
          }
        }
      }
    }, {
      key: "processNodeDblClicked",
      value: function processNodeDblClicked(n) {
        if (this.onShowNodePanel) this.onShowNodePanel(n);else this.showShowNodePanel(n);
        if (this.onNodeDblClicked) this.onNodeDblClicked(n);
        this.setDirty(true);
      }
    }, {
      key: "processNodeSelected",
      value: function processNodeSelected(node, e) {
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

    }, {
      key: "selectNode",
      value: function selectNode(node, addToCurrentSelection) {
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

    }, {
      key: "selectNodes",
      value: function selectNodes() {
        var nodes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.graph._nodes;
        var addToCurrentSelection = arguments.length > 1 ? arguments[1] : undefined;
        if (!addToCurrentSelection) this.deselectAllNodes();

        var _iterator11 = _createForOfIteratorHelper(nodes),
            _step11;

        try {
          for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
            var _node11 = _step11.value;
            if (_node11.is_selected) continue;
            if (!_node11.is_selected && _node11.onSelected) _node11.onSelected();
            _node11.is_selected = true;
            this.selected_nodes[_node11.id] = _node11;

            if (_node11.inputs) {
              var _iterator12 = _createForOfIteratorHelper(_node11.inputs),
                  _step12;

              try {
                for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
                  var _input4 = _step12.value;
                  this.highlighted_links[_input4.link] = true;
                }
              } catch (err) {
                _iterator12.e(err);
              } finally {
                _iterator12.f();
              }
            }

            if (_node11.outputs) {
              var _iterator13 = _createForOfIteratorHelper(_node11.outputs),
                  _step13;

              try {
                for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
                  var out = _step13.value;

                  if (out.links) {
                    var _iterator14 = _createForOfIteratorHelper(out.links),
                        _step14;

                    try {
                      for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
                        var link = _step14.value;
                        this.highlighted_links[link] = true;
                      }
                    } catch (err) {
                      _iterator14.e(err);
                    } finally {
                      _iterator14.f();
                    }
                  }
                }
              } catch (err) {
                _iterator13.e(err);
              } finally {
                _iterator13.f();
              }
            }
          }
        } catch (err) {
          _iterator11.e(err);
        } finally {
          _iterator11.f();
        }

        if (this.onSelectionChange) this.onSelectionChange(this.selected_nodes);
        this.setDirty(true);
      }
      /**
       * removes a node from the current selection
       * @method deselectNode
       * @memberOf LGraphCanvas
       * */

    }, {
      key: "deselectNode",
      value: function deselectNode(node) {
        if (!node.is_selected) return;

        if (node.onDeselected) {
          node.onDeselected();
        }

        node.is_selected = false;

        if (this.onNodeDeselected) {
          this.onNodeDeselected(node);
        } // remove highlighted


        if (node.inputs) {
          var _iterator15 = _createForOfIteratorHelper(node.inputs),
              _step15;

          try {
            for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
              var _input5 = _step15.value;
              delete this.highlighted_links[_input5.link];
            }
          } catch (err) {
            _iterator15.e(err);
          } finally {
            _iterator15.f();
          }
        }

        if (node.outputs) {
          var _iterator16 = _createForOfIteratorHelper(node.outputs),
              _step16;

          try {
            for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
              var out = _step16.value;

              if (out.links) {
                var _iterator17 = _createForOfIteratorHelper(out.links),
                    _step17;

                try {
                  for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
                    var link = _step17.value;
                    delete this.highlighted_links[link];
                  }
                } catch (err) {
                  _iterator17.e(err);
                } finally {
                  _iterator17.f();
                }
              }
            }
          } catch (err) {
            _iterator16.e(err);
          } finally {
            _iterator16.f();
          }
        }
      }
      /**
       * removes all nodes from the current selection
       * @method deselectAllNodes
       * @memberOf LGraphCanvas
       * */

    }, {
      key: "deselectAllNodes",
      value: function deselectAllNodes() {
        if (!this.graph) return;

        var _iterator18 = _createForOfIteratorHelper(this.graph._nodes),
            _step18;

        try {
          for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
            var _node12 = _step18.value;

            if (!_node12.is_selected) {
              continue;
            }

            if (_node12.onDeselected) {
              _node12.onDeselected();
            }

            _node12.is_selected = false;

            if (this.onNodeDeselected) {
              this.onNodeDeselected(_node12);
            }
          }
        } catch (err) {
          _iterator18.e(err);
        } finally {
          _iterator18.f();
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

    }, {
      key: "deleteSelectedNodes",
      value: function deleteSelectedNodes() {
        this.graph.beforeChange(); // eslint-disable-next-line guard-for-in, no-restricted-syntax

        for (var _i11 in this.selected_nodes) {
          var _node13 = this.selected_nodes[_i11];
          if (_node13.block_delete) continue; // autoconnect when possible (very basic, only takes into account first input-output)

          if (_node13.inputs && _node13.inputs.length && _node13.outputs && _node13.outputs.length && isValidConnection(_node13.inputs[0].type, _node13.outputs[0].type) && _node13.inputs[0].link && _node13.outputs[0].links && _node13.outputs[0].links.length) {
            var inputLink = _node13.graph.links[_node13.inputs[0].link];
            var outputLink = _node13.graph.links[_node13.outputs[0].links[0]];

            var inputNode = _node13.getInputNode(0);

            var outputNode = _node13.getOutputNodes(0)[0];

            if (inputNode && outputNode) {
              inputNode.connect(inputLink.origin_slot, outputNode, outputLink.target_slot);
            }
          }

          this.graph.remove(_node13);
          if (this.onNodeDeselected) this.onNodeDeselected(_node13);
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

    }, {
      key: "centerOnNode",
      value: function centerOnNode(node) {
        this.ds.offset[0] = -node.pos[0] - node.size[0] * 0.5 + this.canvas.width * 0.5 / this.ds.scale;
        this.ds.offset[1] = -node.pos[1] - node.size[1] * 0.5 + this.canvas.height * 0.5 / this.ds.scale;
        this.setDirty(true, true);
      }
      /**
       * adds some useful properties to a mouse event, like the position in graph coordinates
       * @method adjustMouseEvent
       * @memberOf LGraphCanvas
       * */

    }, {
      key: "adjustMouseEvent",
      value: function adjustMouseEvent(e) {
        if (this.canvas) {
          var b = this.canvas.getBoundingClientRect();
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

    }, {
      key: "setZoom",
      value: function setZoom(value, zoomingCenter) {
        this.ds.changeScale(value, zoomingCenter);
        this.dirty_canvas = true;
        this.dirty_bgcanvas = true;
      }
      /**
       * converts a coordinate from graph coordinates to canvas2D coordinates
       * @method convertOffsetToCanvas
       * @memberOf LGraphCanvas
       * */

    }, {
      key: "convertOffsetToCanvas",
      value: function convertOffsetToCanvas(pos) {
        return this.ds.convertOffsetToCanvas(pos);
      }
      /**
       * converts a coordinate from Canvas2D coordinates to graph space
       * @method convertCanvasToOffset
       * @memberOf LGraphCanvas
       * */

    }, {
      key: "convertCanvasToOffset",
      value: function convertCanvasToOffset(pos, out) {
        return this.ds.convertCanvasToOffset(pos, out);
      }
      /**
       * converts event coordinates from canvas2D to graph coordinates
       * @method convertEventToCanvasOffset
       * @param e
       * @returns {Array}
       * @memberOf LGraphCanvas
       */

    }, {
      key: "convertEventToCanvasOffset",
      value: function convertEventToCanvasOffset(e) {
        var rect = this.canvas.getBoundingClientRect();
        return this.convertCanvasToOffset([e.clientX - rect.left, e.clientY - rect.top]);
      }
      /**
       * brings a node to front (above all other nodes)
       * @method bringToFront
       * @param {LGraphNode} node
       * @memberOf LGraphCanvas
       * */

    }, {
      key: "bringToFront",
      value: function bringToFront(node) {
        var i = this.graph._nodes.indexOf(node);

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

    }, {
      key: "sendToBack",
      value: function sendToBack(node) {
        var i = this.graph._nodes.indexOf(node);

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

    }, {
      key: "computeVisibleNodes",
      value: function computeVisibleNodes(nodes) {
        var out = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var visibleNodes = out;
        nodes = this.graph._nodes;
        visibleNodes.length = 0;

        var _iterator19 = _createForOfIteratorHelper(nodes),
            _step19;

        try {
          for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {
            var n = _step19.value;

            // skip rendering nodes in live mode
            if (this.live_mode && !n.onDrawBackground && !n.onDrawForeground) {
              continue;
            }

            if (!overlapBounding$1(this.visible_area, n.getBounding(temp))) {
              continue;
            } // out of the visible area


            visibleNodes.push(n);
          }
        } catch (err) {
          _iterator19.e(err);
        } finally {
          _iterator19.f();
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

    }, {
      key: "draw",
      value: function draw(force_canvas, force_bgcanvas) {
        if (!this.canvas || this.canvas.width === 0 || this.canvas.height === 0) return; // fps counting

        var now = getTime();
        this.render_time = (now - this.last_draw_time) * 0.001;
        this.last_draw_time = now;
        if (this.graph) this.ds.computeVisibleArea();
        if (this.dirty_bgcanvas || force_bgcanvas || this.always_render_background || this.graph && this.graph._last_trigger_time && now - this.graph._last_trigger_time < 1000) this.drawBackCanvas();
        if (this.dirty_canvas || force_canvas) this.drawFrontCanvas();
        this.fps = this.render_time ? 1.0 / this.render_time : 0;
        this.frame += 1;
      }
      /**
       * draws the front canvas (the one containing all the nodes)
       * @method drawFrontCanvas
       * @memberOf LGraphCanvas
       * */

    }, {
      key: "drawFrontCanvas",
      value: function drawFrontCanvas() {
        this.dirty_canvas = false;
        if (!this.ctx) this.ctx = this.bgcanvas.getContext("2d");
        var ctx = this.ctx;
        if (!ctx) return;

        if (ctx.start2D) {
          ctx.start2D();
        }

        var canvas = this.canvas; // reset in case of error

        ctx.restore();
        ctx.setTransform(1, 0, 0, 1, 0, 0); // clip dirty area if there is one, otherwise work in full canvas

        if (this.dirty_area) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(this.dirty_area[0], this.dirty_area[1], this.dirty_area[2], this.dirty_area[3]);
          ctx.clip();
        }

        if (this.clear_background) ctx.clearRect(0, 0, canvas.width, canvas.height); // draw bg canvas

        if (this.bgcanvas === this.canvas) {
          this.drawBackCanvas();
        } else {
          ctx.drawImage(this.bgcanvas, 0, 0);
        } // rendering


        if (this.onRender) this.onRender(canvas, ctx); // info widget

        if (this.show_info) this.renderInfo(ctx);

        if (this.graph) {
          // apply transformations
          ctx.save();
          this.ds.toCanvasContext(ctx); // draw nodes

          var drawnNodes = 0;
          var visibleNodes = this.computeVisibleNodes(null, this.visible_nodes);

          var _iterator20 = _createForOfIteratorHelper(visibleNodes),
              _step20;

          try {
            for (_iterator20.s(); !(_step20 = _iterator20.n()).done;) {
              var _node14 = _step20.value;
              // transform coords system
              ctx.save();
              ctx.translate(_node14.pos[0], _node14.pos[1]); // Draw

              this.drawNode(_node14, ctx);
              drawnNodes += 1; // Restore

              ctx.restore();
            } // on top (debug)

          } catch (err) {
            _iterator20.e(err);
          } finally {
            _iterator20.f();
          }

          if (this.render_execution_order) this.drawExecutionOrder(ctx); // connections ontop?

          if (this.graph.config.links_ontop && !this.live_mode) this.drawConnections(ctx); // current connection (the one being dragged by the mouse)

          if (this.connecting_pos) {
            ctx.lineWidth = this.connections_width;
            var linkColor = null;

            switch (this.connecting_output.type) {
              case defaultConfig.EVENT:
                linkColor = defaultConfig.EVENT_LINK_COLOR;
                break;

              default:
                linkColor = defaultConfig.CONNECTING_LINK_COLOR;
            } // the connection being dragged by the mouse


            this.renderLink(ctx, this.connecting_pos, [this.graph_mouse[0], this.graph_mouse[1]], null, false, null, linkColor, this.connecting_output.dir || (this.connecting_node.horizontal ? defaultConfig.DOWN : defaultConfig.RIGHT), defaultConfig.CENTER);
            ctx.beginPath();

            if (this.connecting_output.type === defaultConfig.EVENT || this.connecting_output.shape === defaultConfig.BOX_SHAPE) {
              ctx.rect(this.connecting_pos[0] - 6 + 0.5, this.connecting_pos[1] - 5 + 0.5, 14, 10);
            } else {
              ctx.arc(this.connecting_pos[0], this.connecting_pos[1], 4, 0, Math.PI * 2);
            }

            ctx.fill();
            ctx.fillStyle = "#ffcc00";

            if (this._highlight_input) {
              ctx.beginPath();
              ctx.arc(this._highlight_input[0], this._highlight_input[1], 6, 0, Math.PI * 2);
              ctx.fill();
            }
          } // the selection rectangle


          if (this.dragging_rectangle) {
            ctx.strokeStyle = "#FFF";
            ctx.strokeRect(this.dragging_rectangle[0], this.dragging_rectangle[1], this.dragging_rectangle[2], this.dragging_rectangle[3]);
          } // on top of link center


          if (this.over_link_center && this.render_link_tooltip) {
            this.drawLinkTooltip(ctx, this.over_link_center);
          } else if (this.onDrawLinkTooltip) {
            this.onDrawLinkTooltip(ctx, null);
          } // custom info


          if (this.onDrawForeground) {
            this.onDrawForeground(ctx, this.visible_rect);
          }

          ctx.restore();
        } // draws panel in the corner


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

    }, {
      key: "drawSubgraphPanel",
      value: function drawSubgraphPanel(ctx) {
        var subgraph = this.graph;
        var subnode = subgraph._subgraph_node;

        if (!subnode) {
          console.warn("subgraph without subnode");
          return;
        }

        var num = subnode.inputs ? subnode.inputs.length : 0;
        var w = 300;
        var h = Math.floor(defaultConfig.NODE_SLOT_HEIGHT * 1.6);
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

        var y = 50;
        ctx.font = "20px Arial";

        if (subnode.inputs) {
          var _iterator21 = _createForOfIteratorHelper(subnode.inputs),
              _step21;

          try {
            for (_iterator21.s(); !(_step21 = _iterator21.n()).done;) {
              var _input6 = _step21.value;
              if (_input6.not_subgraph_input) continue; // input button clicked

              if (this.drawButton(20, y + 2, w - 20, h - 2)) {
                var type = subnode.constructor.input_node_type || "graph/input";
                this.graph.beforeChange();
                var newnode = createNode(type);

                if (newnode) {
                  subgraph.add(newnode);
                  this.block_click = false;
                  this.last_click_position = null;
                  this.selectNodes([newnode]);
                  this.node_dragged = newnode;
                  this.dragging_canvas = false;
                  newnode.setProperty("name", _input6.name);
                  newnode.setProperty("type", _input6.type);
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
              ctx.fillText(_input6.name, 50, y + h * 0.75);
              var tw = ctx.measureText(_input6.name);
              ctx.fillStyle = "#777";
              ctx.fillText(_input6.type, 50 + tw.width + 10, y + h * 0.75);
              y += h;
            }
          } catch (err) {
            _iterator21.e(err);
          } finally {
            _iterator21.f();
          }
        } // add + button


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

    }, {
      key: "drawButton",
      value: function drawButton(x, y, w, h, text) {
        var bgcolor = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : defaultConfig.NODE_DEFAULT_COLOR;
        var hovercolor = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "#555";
        var textcolor = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : defaultConfig.NODE_TEXT_COLOR;
        var ctx = this.ctx;
        var pos = this.mouse;
        var hover = isInsideRectangle(pos[0], pos[1], x, y, w, h);
        pos = this.last_click_position;
        var clicked = pos && isInsideRectangle(pos[0], pos[1], x, y, w, h);
        ctx.fillStyle = hover ? hovercolor : bgcolor;
        if (clicked) ctx.fillStyle = "#AAA";
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 4);
        ctx.fill();

        if (text) {
          if (text.constructor === String) {
            ctx.fillStyle = textcolor;
            ctx.textAlign = "center"; // eslint-disable-next-line

            ctx.font = "".concat(h * 0.65 | 0, "px Arial");
            ctx.fillText(text, x + w * 0.5, y + h * 0.75);
            ctx.textAlign = "left";
          }
        }

        if (clicked) this.blockClick();
        return clicked && !this.block_click;
      }
    }, {
      key: "isAreaClicked",
      value: function isAreaClicked(x, y, w, h, holdClick) {
        var pos = this.last_click_position;
        var clicked = pos && isInsideRectangle(pos[0], pos[1], x, y, w, h);
        if (clicked && holdClick) this.blockClick();
        return clicked && !this.block_click;
      }
      /**
       * draws some useful stats in the corner of the canvas
       * @method renderInfo
       * @memberOf LGraphCanvas
       * */

    }, {
      key: "renderInfo",
      value: function renderInfo(ctx) {
        var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
        var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.canvas.height - 80;
        ctx.save();
        ctx.translate(x, y);
        ctx.font = "10px Arial";
        ctx.fillStyle = "#888";

        if (this.graph) {
          ctx.fillText("T: ".concat(this.graph.globaltime.toFixed(2), "s"), 5, 13);
          ctx.fillText("I: ".concat(this.graph.iteration), 5, 13 * 2);
          ctx.fillText("N: ".concat(this.graph._nodes.length, " [").concat(this.visible_nodes.length, "]"), 5, 13 * 3);
          ctx.fillText("V: ".concat(this.graph._version), 5, 13 * 4);
          ctx.fillText("FPS:".concat(this.fps.toFixed(2)), 5, 13 * 5);
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

    }, {
      key: "drawBackCanvas",
      value: function drawBackCanvas() {
        var _this4 = this;

        var canvas = this.bgcanvas;

        if (canvas.width !== this.canvas.width || canvas.height !== this.canvas.height) {
          canvas.width = this.canvas.width;
          canvas.height = this.canvas.height;
        }

        if (!this.bgctx) this.bgctx = this.bgcanvas.getContext("2d");
        var ctx = this.bgctx;
        if (ctx.start) ctx.start(); // clear

        if (this.clear_background) ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (this._graph_stack && this._graph_stack.length) {
          ctx.save();
          var subgraphNode = this.graph._subgraph_node;
          ctx.strokeStyle = subgraphNode.bgcolor;
          ctx.lineWidth = 10;
          ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
          ctx.lineWidth = 1;
          ctx.font = "40px Arial";
          ctx.textAlign = "center";
          ctx.fillStyle = subgraphNode.bgcolor || "#AAA";
          var title = "";

          var _iterator22 = _createForOfIteratorHelper(this._graph_stack),
              _step22;

          try {
            for (_iterator22.s(); !(_step22 = _iterator22.n()).done;) {
              var g = _step22.value;
              title += "".concat(g._subgraph_node.getTitle(), " >> ");
            }
          } catch (err) {
            _iterator22.e(err);
          } finally {
            _iterator22.f();
          }

          ctx.fillText(title + subgraphNode.getTitle(), canvas.width * 0.5, 40);
          ctx.restore();
        }

        var bgAlreadyPainted = false;

        if (this.onRenderBackground) {
          bgAlreadyPainted = this.onRenderBackground(canvas, ctx);
        } // reset in case of error


        ctx.restore();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.visible_links.length = 0;

        if (this.graph) {
          // apply transformations
          ctx.save();
          this.ds.toCanvasContext(ctx); // render BG

          if (this.background_image && this.ds.scale > 0.5 && !bgAlreadyPainted) {
            ctx.globalAlpha = this.zoom_modify_alpha ? (1.0 - 0.5 / this.ds.scale) * this.editor_alpha : this.editor_alpha;
            ctx.imageSmoothingEnabled = false;
            ctx.mozImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;

            if (!this._bg_img || this._bg_img.id !== this.background_image) {
              this._bg_img = new Image();
              this._bg_img.id = this.background_image;
              this._bg_img.src = this.background_image;

              this._bg_img.onload = function () {
                return _this4.draw(true, true);
              };
            }

            var pattern = null;

            if (this._pattern == null && this._bg_img.width > 0) {
              pattern = ctx.createPattern(this._bg_img, "repeat");
              this._pattern_img = this._bg_img;
              this._pattern = pattern;
            } else {
              pattern = this._pattern;
            }

            if (pattern) {
              ctx.fillStyle = pattern;
              ctx.fillRect(this.visible_area[0], this.visible_area[1], this.visible_area[2], this.visible_area[3]);
              ctx.fillStyle = "transparent";
            }

            ctx.globalAlpha = 1.0;
            ctx.imageSmoothingEnabled = true;
            ctx.mozImageSmoothingEnabled = true;
            ctx.imageSmoothingEnabled = true;
          } // groups


          if (this.graph._groups.length && !this.live_mode) this.drawGroups(canvas, ctx);
          if (this.onDrawBackground) this.onDrawBackground(ctx, this.visible_area); // bg

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
          } // draw connections


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

    }, {
      key: "drawNode",
      value: function drawNode(node, ctx) {
        this.current_node = node;
        var color = node.color || node.constructor.color || defaultConfig.NODE_DEFAULT_COLOR;
        var bgcolor = node.bgcolor || node.constructor.bgcolor || defaultConfig.NODE_DEFAULT_BGCOLOR; // shadow and glow

        if (node.mouseOver) ;
        var lowQuality = this.ds.scale < 0.6; // zoomed out
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
        } // custom draw collapsed method (draw after shadows because they are affected)


        if (node.flags.collapsed && node.onDrawCollapsed && node.onDrawCollapsed(ctx, this) == true) {
          return;
        } // clip if required (mask)


        var shape = node._shape || defaultConfig.BOX_SHAPE;
        var size = tempVC2;
        tempVC2.set(node.size);
        var horizontal = node.horizontal; // || node.flags.horizontal;

        if (node.flags.collapsed) {
          ctx.font = this.inner_text_font;
          var title = node.getTitle ? node.getTitle() : node.title;

          if (title) {
            node._collapsed_width = Math.min(node.size[0], ctx.measureText(title).width + defaultConfig.NODE_TITLE_HEIGHT * 2); // LiteGraph.NODE_COLLAPSED_WIDTH;

            size[0] = node._collapsed_width;
            size[1] = 0;
          }
        }

        if (node.clip_area) {
          // Start clipping
          ctx.save();
          ctx.beginPath();
          if (shape === defaultConfig.BOX_SHAPE) ctx.rect(0, 0, size[0], size[1]);else if (shape === defaultConfig.ROUND_SHAPE) ctx.roundRect(0, 0, size[0], size[1], 10);else if (shape === defaultConfig.CIRCLE_SHAPE) {
            ctx.arc(size[0] * 0.5, size[1] * 0.5, size[0] * 0.5, 0, Math.PI * 2);
          }
          ctx.clip();
        } // draw shape


        if (node.has_errors) bgcolor = "red";
        this.drawNodeShape(node, ctx, size, color, bgcolor, node.is_selected, node.mouseOver);
        ctx.shadowColor = "transparent"; // draw foreground

        if (node.onDrawForeground) {
          node.onDrawForeground(ctx, this, this.canvas);
        } // connection slots


        ctx.textAlign = horizontal ? "center" : "left";
        ctx.font = this.inner_text_font;
        var renderText = !lowQuality;
        var outSlot = this.connecting_output;
        ctx.lineWidth = 1;
        var maxY = 0;
        var slotPos = new Float32Array(2); // to reuse
        // render inputs and outputs

        if (!node.flags.collapsed) {
          // input connection slots
          if (node.inputs) {
            for (var _i12 = 0; _i12 < node.inputs.length; _i12++) {
              var _slot4 = node.inputs[_i12];
              ctx.globalAlpha = this.editor_alpha; // change opacity of incompatible slots when dragging a connection

              if (this.connecting_node && !isValidConnection(_slot4.type, outSlot.type)) {
                ctx.globalAlpha = 0.4 * this.editor_alpha;
              }

              ctx.fillStyle = _slot4.link ? _slot4.color_on || this.default_connection_color.input_on : _slot4.color_off || this.default_connection_color.input_off;
              var pos = node.getConnectionPos(true, _i12, slotPos);
              pos[0] -= node.pos[0];
              pos[1] -= node.pos[1];

              if (maxY < pos[1] + defaultConfig.NODE_SLOT_HEIGHT * 0.5) {
                maxY = pos[1] + defaultConfig.NODE_SLOT_HEIGHT * 0.5;
              }

              ctx.beginPath();

              if (_slot4.type === defaultConfig.EVENT || _slot4.shape === defaultConfig.BOX_SHAPE) {
                if (horizontal) ctx.rect(pos[0] - 5 + 0.5, pos[1] - 8 + 0.5, 10, 14);else ctx.rect(pos[0] - 6 + 0.5, pos[1] - 5 + 0.5, 14, 10);
              } else if (_slot4.shape === defaultConfig.ARROW_SHAPE) {
                ctx.moveTo(pos[0] + 8, pos[1] + 0.5);
                ctx.lineTo(pos[0] - 4, pos[1] + 6 + 0.5);
                ctx.lineTo(pos[0] - 4, pos[1] - 6 + 0.5);
                ctx.closePath();
              } else if (lowQuality) {
                ctx.rect(pos[0] - 4, pos[1] - 4, 8, 8);
              } else {
                ctx.arc(pos[0], pos[1], 4, 0, Math.PI * 2);
              }

              ctx.fill(); // render name

              if (renderText) {
                var text = _slot4.label ? _slot4.label : _slot4.name;

                if (text) {
                  ctx.fillStyle = defaultConfig.NODE_TEXT_COLOR;

                  if (horizontal || _slot4.dir === defaultConfig.UP) {
                    ctx.fillText(text, pos[0], pos[1] - 10);
                  } else {
                    ctx.fillText(text, pos[0] + 10, pos[1] + 5);
                  }
                }
              }
            }
          } // output connection slots


          if (this.connecting_node) {
            ctx.globalAlpha = 0.4 * this.editor_alpha;
          }

          ctx.textAlign = horizontal ? "center" : "right";
          ctx.strokeStyle = "black";

          if (node.outputs) {
            for (var _i13 = 0; _i13 < node.outputs.length; _i13++) {
              var _slot5 = node.outputs[_i13];

              var _pos = node.getConnectionPos(false, _i13, slotPos);

              _pos[0] -= node.pos[0];
              _pos[1] -= node.pos[1];

              if (maxY < _pos[1] + defaultConfig.NODE_SLOT_HEIGHT * 0.5) {
                maxY = _pos[1] + defaultConfig.NODE_SLOT_HEIGHT * 0.5;
              }

              ctx.fillStyle = _slot5.links && _slot5.links.length ? _slot5.color_on || this.default_connection_color.output_on : _slot5.color_off || this.default_connection_color.output_off;
              ctx.beginPath(); // ctx.rect( node.size[0] - 14,i*14,10,10);

              if (_slot5.type === defaultConfig.EVENT || _slot5.shape === defaultConfig.BOX_SHAPE) {
                if (horizontal) {
                  ctx.rect(_pos[0] - 5 + 0.5, _pos[1] - 8 + 0.5, 10, 14);
                } else {
                  ctx.rect(_pos[0] - 6 + 0.5, _pos[1] - 5 + 0.5, 14, 10);
                }
              } else if (_slot5.shape === defaultConfig.ARROW_SHAPE) {
                ctx.moveTo(_pos[0] + 8, _pos[1] + 0.5);
                ctx.lineTo(_pos[0] - 4, _pos[1] + 6 + 0.5);
                ctx.lineTo(_pos[0] - 4, _pos[1] - 6 + 0.5);
                ctx.closePath();
              } else if (lowQuality) {
                ctx.rect(_pos[0] - 4, _pos[1] - 4, 8, 8);
              } else {
                ctx.arc(_pos[0], _pos[1], 4, 0, Math.PI * 2);
              }

              ctx.fill();
              if (!lowQuality) ctx.stroke(); // render output name

              if (renderText) {
                var _text = _slot5.label != null ? _slot5.label : _slot5.name;

                if (_text) {
                  ctx.fillStyle = defaultConfig.NODE_TEXT_COLOR;

                  if (horizontal || _slot5.dir === defaultConfig.DOWN) {
                    ctx.fillText(_text, _pos[0], _pos[1] - 8);
                  } else {
                    ctx.fillText(_text, _pos[0] - 10, _pos[1] + 5);
                  }
                }
              }
            }
          }

          ctx.textAlign = "left";
          ctx.globalAlpha = 1;

          if (node.widgets) {
            var widgetsY = maxY;
            if (horizontal || node.widgets_up) widgetsY = 2;
            if (node.widgets_start_y) widgetsY = node.widgets_start_y;
            this.drawNodeWidgets(node, widgetsY, ctx, this.node_widget && this.node_widget[0] === node ? this.node_widget[1] : null);
          }
        } else if (this.render_collapsed_slots) {
          // if collapsed
          var inputSlot = null;
          var outputSlot = null;
          var storedSlot; // get first connected slot to render

          if (node.inputs) {
            var _iterator23 = _createForOfIteratorHelper(node.inputs),
                _step23;

            try {
              for (_iterator23.s(); !(_step23 = _iterator23.n()).done;) {
                var _slot6 = _step23.value;
                if (_slot6.link == null) continue;
                inputSlot = _slot6;
                storedSlot = _slot6;
                break;
              }
            } catch (err) {
              _iterator23.e(err);
            } finally {
              _iterator23.f();
            }
          }

          if (node.outputs) {
            var _iterator24 = _createForOfIteratorHelper(node.outputs),
                _step24;

            try {
              for (_iterator24.s(); !(_step24 = _iterator24.n()).done;) {
                var _slot7 = _step24.value;
                if (!_slot7.links || !_slot7.links.length) continue;
                outputSlot = _slot7;
                storedSlot = _slot7;
              }
            } catch (err) {
              _iterator24.e(err);
            } finally {
              _iterator24.f();
            }
          }

          if (inputSlot) {
            var x = 0;
            var y = defaultConfig.NODE_TITLE_HEIGHT * -0.5; // center

            if (horizontal) {
              x = node._collapsed_width * 0.5;
              y = -defaultConfig.NODE_TITLE_HEIGHT;
            }

            ctx.fillStyle = "#686";
            ctx.beginPath();

            if (storedSlot.type === defaultConfig.EVENT || storedSlot.shape === defaultConfig.BOX_SHAPE) {
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
            var _x = node._collapsed_width;

            var _y = defaultConfig.NODE_TITLE_HEIGHT * -0.5; // center


            if (horizontal) {
              _x = node._collapsed_width * 0.5;
              _y = 0;
            }

            ctx.fillStyle = "#686";
            ctx.strokeStyle = "black";
            ctx.beginPath();

            if (storedSlot.type === defaultConfig.EVENT || storedSlot.shape === defaultConfig.BOX_SHAPE) {
              ctx.rect(_x - 7 + 0.5, _y - 4, 14, 8);
            } else if (slot.shape === defaultConfig.ARROW_SHAPE) {
              ctx.moveTo(_x + 6, _y);
              ctx.lineTo(_x - 6, _y - 4);
              ctx.lineTo(_x - 6, _y + 4);
              ctx.closePath();
            } else ctx.arc(_x, _y, 4, 0, Math.PI * 2);

            ctx.fill(); // ctx.stroke();
          }
        }

        if (node.clip_area) ctx.restore();
        ctx.globalAlpha = 1.0;
      } // used by this.over_link_center

    }, {
      key: "drawLinkTooltip",
      value: function drawLinkTooltip(ctx, link) {
        var pos = link._pos;
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(pos[0], pos[1], 3, 0, Math.PI * 2);
        ctx.fill();
        if (link.data == null) return;
        if (this.onDrawLinkTooltip && this.onDrawLinkTooltip(ctx, link, this)) return;
        var data = link.data;
        var text;
        if (data.constructor === Number) text = data.toFixed(2);else if (data.constructor === String) text = "\"".concat(data, "\"");else if (data.constructor === Boolean) text = String(data);else if (data.toToolTip) text = data.toToolTip();else text = "[".concat(data.constructor.name, "]");
        if (!text) return;
        text = text.substr(0, 30); // avoid weird

        ctx.font = "14px Courier New";
        var info = ctx.measureText(text);
        var w = info.width + 20;
        var h = 24;
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

    }, {
      key: "drawNodeShape",
      value: function drawNodeShape(node, ctx, size, fgcolor, bgcolor, selected, mouseHover) {
        // bg rect
        ctx.strokeStyle = fgcolor;
        ctx.fillStyle = bgcolor;
        var titleHeight = defaultConfig.NODE_TITLE_HEIGHT;
        var lowQuality = this.ds.scale < 0.5; // render node area depending on shape

        var shape = node._shape || node.constructor.shape || defaultConfig.ROUND_SHAPE;
        var title_mode = node.constructor.title_mode;
        var renderTitle = true;
        if (title_mode === defaultConfig.TRANSPARENT_TITLE) renderTitle = false;else if (title_mode === defaultConfig.AUTOHIDE_TITLE && mouseHover) renderTitle = true;
        var area = tempArea;
        area[0] = 0; // x

        area[1] = renderTitle ? -titleHeight : 0; // y

        area[2] = size[0] + 1; // w

        area[3] = renderTitle ? size[1] + titleHeight : size[1]; // h

        var oldAlpha = ctx.globalAlpha;
        ctx.beginPath();

        if (shape === defaultConfig.BOX_SHAPE || lowQuality) {
          ctx.fillRect(area[0], area[1], area[2], area[3]);
        } else if (shape === defaultConfig.ROUND_SHAPE || shape === defaultConfig.CARD_SHAPE) {
          ctx.roundRect(area[0], area[1], area[2], area[3], this.round_radius, shape === defaultConfig.CARD_SHAPE ? 0 : this.round_radius);
        } else if (shape === defaultConfig.CIRCLE_SHAPE) {
          ctx.arc(size[0] * 0.5, size[1] * 0.5, size[0] * 0.5, 0, Math.PI * 2);
        }

        ctx.fill(); // separator

        if (!node.flags.collapsed) {
          ctx.shadowColor = "transparent";
          ctx.fillStyle = "rgba(0,0,0,0.2)";
          ctx.fillRect(0, -1, area[2], 2);
        }

        ctx.shadowColor = "transparent";
        if (node.onDrawBackground) node.onDrawBackground(ctx, this, this.canvas, this.graph_mouse); // title bg (remember, it is rendered ABOVE the node)

        if (renderTitle || title_mode === defaultConfig.TRANSPARENT_TITLE) {
          // title bar
          if (node.onDrawTitleBar) {
            node.onDrawTitleBar(ctx, titleHeight, size, this.ds.scale, fgcolor);
          } else if (title_mode !== defaultConfig.TRANSPARENT_TITLE && (node.constructor.title_color || this.render_title_colored)) {
            var titleColor = node.constructor.title_color || fgcolor;

            if (node.flags.collapsed) {
              ctx.shadowColor = defaultConfig.DEFAULT_SHADOW_COLOR;
            } //* gradient test


            if (this.use_gradients) {
              var grad = LGraphCanvas.gradients[titleColor];

              if (!grad) {
                grad = ctx.createLinearGradient(0, 0, 400, 0);
                LGraphCanvas.gradients[titleColor] = grad;
                grad.addColorStop(0, titleColor);
                grad.addColorStop(1, "#000");
              }

              ctx.fillStyle = grad;
            } else {
              ctx.fillStyle = titleColor;
            } // ctx.globalAlpha = 0.5 * old_alpha;


            ctx.beginPath();

            if (shape === defaultConfig.BOX_SHAPE || lowQuality) {
              ctx.rect(0, -titleHeight, size[0] + 1, titleHeight);
            } else if (shape === defaultConfig.ROUND_SHAPE || shape === defaultConfig.CARD_SHAPE) {
              ctx.roundRect(0, -titleHeight, size[0] + 1, titleHeight, this.round_radius, node.flags.collapsed ? this.round_radius : 0);
            }

            ctx.fill();
            ctx.shadowColor = "transparent";
          } // title box


          var boxSize = 10;

          if (node.onDrawTitleBox) {
            node.onDrawTitleBox(ctx, titleHeight, size, this.ds.scale);
          } else if ([defaultConfig.ROUND_SHAPE, defaultConfig.CIRCLE_SHAPE, defaultConfig.CARD_SHAPE].includes(shape)) {
            if (lowQuality) {
              ctx.fillStyle = "black";
              ctx.beginPath();
              ctx.arc(titleHeight * 0.5, titleHeight * -0.5, boxSize * 0.5 + 1, 0, Math.PI * 2);
              ctx.fill();
            }

            ctx.fillStyle = node.boxcolor || defaultConfig.NODE_DEFAULT_BOXCOLOR;
            if (lowQuality) ctx.fillRect(titleHeight * 0.5 - boxSize * 0.5, titleHeight * -0.5 - boxSize * 0.5, boxSize, boxSize);else {
              ctx.beginPath();
              ctx.arc(titleHeight * 0.5, titleHeight * -0.5, boxSize * 0.5, 0, Math.PI * 2);
              ctx.fill();
            }
          } else {
            if (lowQuality) {
              ctx.fillStyle = "black";
              ctx.fillRect((titleHeight - boxSize) * 0.5 - 1, (titleHeight + boxSize) * -0.5 - 1, boxSize + 2, boxSize + 2);
            }

            ctx.fillStyle = node.boxcolor || defaultConfig.NODE_DEFAULT_BOXCOLOR;
            ctx.fillRect((titleHeight - boxSize) * 0.5, (titleHeight + boxSize) * -0.5, boxSize, boxSize);
          }

          ctx.globalAlpha = oldAlpha; // title text

          if (node.onDrawTitleText) {
            node.onDrawTitleText(ctx, titleHeight, size, this.ds.scale, this.title_text_font, selected);
          }

          if (!lowQuality) {
            ctx.font = this.title_text_font;
            var title = String(node.getTitle());

            if (title) {
              if (selected) ctx.fillStyle = defaultConfig.NODE_SELECTED_TITLE_COLOR;else ctx.fillStyle = node.constructor.title_text_color || this.node_title_color;

              if (node.flags.collapsed) {
                ctx.textAlign = "left";
                ctx.measureText(title);
                ctx.fillText(title.substr(0, 20), // avoid urls too long
                titleHeight, // + measure.width * 0.5,
                defaultConfig.NODE_TITLE_TEXT_Y - titleHeight);
                ctx.textAlign = "left";
              } else {
                ctx.textAlign = "left";
                ctx.fillText(title, titleHeight, defaultConfig.NODE_TITLE_TEXT_Y - titleHeight);
              }
            }
          } // subgraph box


          if (!node.flags.collapsed && node.subgraph && !node.skip_subgraph_button) {
            var w = defaultConfig.NODE_TITLE_HEIGHT;
            var x = node.size[0] - w;
            var over = isInsideRectangle(this.graph_mouse[0] - node.pos[0], this.graph_mouse[1] - node.pos[1], x + 2, -w + 2, w - 4, w - 4);
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
          } // custom title render


          if (node.onDrawTitle) node.onDrawTitle(ctx);
        } // render selection marker


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
            ctx.rect(-6 + area[0], -6 + area[1], 12 + area[2], 12 + area[3]);
          } else if (shape === defaultConfig.ROUND_SHAPE || shape === defaultConfig.CARD_SHAPE && node.flags.collapsed) {
            ctx.roundRect(-6 + area[0], -6 + area[1], 12 + area[2], 12 + area[3], this.round_radius * 2);
          } else if (shape === defaultConfig.CARD_SHAPE) {
            ctx.roundRect(-6 + area[0], -6 + area[1], 12 + area[2], 12 + area[3], this.round_radius * 2, 2);
          } else if (shape === defaultConfig.CIRCLE_SHAPE) {
            ctx.arc(size[0] * 0.5, size[1] * 0.5, size[0] * 0.5 + 6, 0, Math.PI * 2);
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

    }, {
      key: "drawConnections",
      value: function drawConnections(ctx) {
        var now = getTime();
        var visible_area = this.visible_area;
        marginArea[0] = visible_area[0] - 20;
        marginArea[1] = visible_area[1] - 20;
        marginArea[2] = visible_area[2] + 40;
        marginArea[3] = visible_area[3] + 40; // draw connections

        ctx.lineWidth = this.connections_width;
        ctx.fillStyle = "#AAA";
        ctx.strokeStyle = "#AAA";
        ctx.globalAlpha = this.editor_alpha; // for every node

        var nodes = this.graph._nodes;

        var _iterator25 = _createForOfIteratorHelper(nodes),
            _step25;

        try {
          for (_iterator25.s(); !(_step25 = _iterator25.n()).done;) {
            var _node15 = _step25.value;

            // for every input (we render just inputs because it is easier as every slot can only
            // have one input)
            if (!_node15.inputs || !_node15.inputs.length) {
              continue;
            }

            for (var _i14 = 0; _i14 < _node15.inputs.length; ++_i14) {
              var _input7 = _node15.inputs[_i14];
              if (!_input7 || _input7.link == null) continue;
              var linkId = _input7.link;
              var link = this.graph.links[linkId];
              if (!link) continue; // find link info

              var startNode = this.graph.getNodeById(link.origin_id);
              if (!startNode) continue;
              var startNodeSlot = link.origin_slot;
              var startNodeSlotPos = null;

              if (startNodeSlot === -1) {
                startNodeSlotPos = [startNode.pos[0] + 10, startNode.pos[1] + 10];
              } else {
                startNodeSlotPos = startNode.getConnectionPos(false, startNodeSlot, tempA);
              }

              var endNodeSlotPos = _node15.getConnectionPos(true, _i14, tempB); // compute link bounding


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
              } // skip links outside of the visible area of the canvas


              if (!overlapBounding$1(linkBounding, marginArea)) {
                continue;
              }

              var startSlot = startNode.outputs[startNodeSlot];
              var endSlot = _node15.inputs[_i14];
              if (!startSlot || !endSlot) continue;
              var startDir = startSlot.dir || (startNode.horizontal ? defaultConfig.DOWN : defaultConfig.RIGHT);
              var endDir = endSlot.dir || (_node15.horizontal ? defaultConfig.UP : defaultConfig.LEFT);
              this.renderLink(ctx, startNodeSlotPos, endNodeSlotPos, link, false, 0, null, startDir, endDir); // event triggered rendered on top

              if (link && link._last_time && now - link._last_time < 1000) {
                var f = 2.0 - (now - link._last_time) * 0.002;
                var tmp = ctx.globalAlpha;
                ctx.globalAlpha = tmp * f;
                this.renderLink(ctx, startNodeSlotPos, endNodeSlotPos, link, true, f, "white", startDir, endDir);
                ctx.globalAlpha = tmp;
              }
            }
          }
        } catch (err) {
          _iterator25.e(err);
        } finally {
          _iterator25.f();
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

    }, {
      key: "renderLink",
      value: function renderLink(ctx, a, b, link, skipBorder, flow, color, startDir, endDir, numSubline) {
        if (link) this.visible_links.push(link); // choose color

        if (!color && link) color = link.color || LGraphCanvas.link_type_colors[link.type];
        if (!color) color = this.default_link_color;
        if (link != null && this.highlighted_links[link.id]) color = "#FFF";
        startDir = startDir || defaultConfig.RIGHT;
        endDir = endDir || defaultConfig.LEFT;
        var dist = distance(a, b);

        if (this.render_connections_border && this.ds.scale > 0.6) {
          ctx.lineWidth = this.connections_width + 4;
        }

        ctx.lineJoin = "round";
        numSubline = numSubline || 1;
        if (numSubline > 1) ctx.lineWidth = 0.5; // begin line shape

        ctx.beginPath();

        for (var _i15 = 0; _i15 < numSubline; _i15 += 1) {
          var offsety = (_i15 - (numSubline - 1) * 0.5) * 5;

          if (this.links_render_mode === defaultConfig.SPLINE_LINK) {
            ctx.moveTo(a[0], a[1] + offsety);
            var startOffsetX = 0;
            var startOffsetY = 0;
            var endOffsetX = 0;
            var endOffsetY = 0;

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
            }

            ctx.bezierCurveTo(a[0] + startOffsetX, a[1] + startOffsetY + offsety, b[0] + endOffsetX, b[1] + endOffsetY + offsety, b[0], b[1] + offsety);
          } else if (this.links_render_mode === defaultConfig.LINEAR_LINK) {
            ctx.moveTo(a[0], a[1] + offsety);
            var _startOffsetX = 0;
            var _startOffsetY = 0;
            var _endOffsetX = 0;
            var _endOffsetY = 0;

            switch (startDir) {
              case defaultConfig.LEFT:
                _startOffsetX = -1;
                break;

              case defaultConfig.RIGHT:
                _startOffsetX = 1;
                break;

              case defaultConfig.UP:
                _startOffsetY = -1;
                break;

              case defaultConfig.DOWN:
                _startOffsetY = 1;
                break;
            }

            switch (endDir) {
              case defaultConfig.LEFT:
                _endOffsetX = -1;
                break;

              case defaultConfig.RIGHT:
                _endOffsetX = 1;
                break;

              case defaultConfig.UP:
                _endOffsetY = -1;
                break;

              case defaultConfig.DOWN:
                _endOffsetY = 1;
                break;
            }

            var l = 15;
            ctx.lineTo(a[0] + _startOffsetX * l, a[1] + _startOffsetY * l + offsety);
            ctx.lineTo(b[0] + _endOffsetX * l, b[1] + _endOffsetY * l + offsety);
            ctx.lineTo(b[0], b[1] + offsety);
          } else if (this.links_render_mode === defaultConfig.STRAIGHT_LINK) {
            ctx.moveTo(a[0], a[1]);
            var startX = a[0];
            var startY = a[1];
            var endX = b[0];
            var endY = b[1];
            if (startDir === defaultConfig.RIGHT) startX += 10;else startY += 10;
            if (endDir === defaultConfig.LEFT) endX -= 10;else endY -= 10;
            ctx.lineTo(startX, startY);
            ctx.lineTo((startX + endX) * 0.5, startY);
            ctx.lineTo((startX + endX) * 0.5, endY);
            ctx.lineTo(endX, endY);
            ctx.lineTo(b[0], b[1]);
          } else return;
        } // rendering the outline of the connection can be a little bit slow


        if (this.render_connections_border && this.ds.scale > 0.6 && !skipBorder) {
          ctx.strokeStyle = "rgba(0,0,0,0.5)";
          ctx.stroke();
        }

        ctx.lineWidth = this.connections_width;
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.stroke(); // end line shape

        var posConnectionPoint = this.computeConnectionPoint(a, b, 0.5, startDir, endDir);

        if (link && link._pos) {
          link._pos[0] = posConnectionPoint[0];
          link._pos[1] = posConnectionPoint[1];
        } // render arrow in the middle


        if (this.ds.scale >= 0.6 && this.highquality_render && endDir !== defaultConfig.CENTER) {
          // render arrow
          if (this.render_connection_arrows) {
            // compute two points in the connection
            var posA = this.computeConnectionPoint(a, b, 0.25, startDir, endDir);
            var posB = this.computeConnectionPoint(a, b, 0.26, startDir, endDir);
            var posC = this.computeConnectionPoint(a, b, 0.75, startDir, endDir);
            var posD = this.computeConnectionPoint(a, b, 0.76, startDir, endDir); // compute the angle between them so the arrow points in the right direction

            var angleA = 0;
            var angleB = 0;

            if (this.render_curved_connections) {
              angleA = -Math.atan2(posB[0] - posA[0], posB[1] - posA[1]);
              angleB = -Math.atan2(posD[0] - posC[0], posD[1] - posC[1]);
            } else angleB = angleA = b[1] > a[1] ? 0 : Math.PI; // render arrow


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
          } // circle


          ctx.beginPath();
          ctx.arc(posConnectionPoint[0], posConnectionPoint[1], 5, 0, Math.PI * 2);
          ctx.fill();
        } // render flowing points


        if (flow) {
          ctx.fillStyle = color;

          for (var _i16 = 0; _i16 < 5; ++_i16) {
            var f = (getTime() * 0.001 + _i16 * 0.2) % 1;
            var pos = this.computeConnectionPoint(a, b, f, startDir, endDir);
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

    }, {
      key: "computeConnectionPoint",
      value: function computeConnectionPoint(a, b, t) {
        var startDir = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : defaultConfig.RIGHT;
        var endDir = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : defaultConfig.LEFT;
        var dist = distance(a, b);
        var p0 = a;
        var p1 = [a[0], a[1]];
        var p2 = [b[0], b[1]];
        var p3 = b;

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
        }

        var c1 = (1 - t) * (1 - t) * (1 - t);
        var c2 = 3 * ((1 - t) * (1 - t)) * t;
        var c3 = 3 * (1 - t) * (t * t);
        var c4 = t * t * t;
        var x = c1 * p0[0] + c2 * p1[0] + c3 * p2[0] + c4 * p3[0];
        var y = c1 * p0[1] + c2 * p1[1] + c3 * p2[1] + c4 * p3[1];
        return [x, y];
      }
    }, {
      key: "drawExecutionOrder",
      value: function drawExecutionOrder(ctx) {
        ctx.shadowColor = "transparent";
        ctx.globalAlpha = 0.25;
        ctx.textAlign = "center";
        ctx.strokeStyle = "white";
        ctx.globalAlpha = 0.75;
        var visible_nodes = this.visible_nodes;

        var _iterator26 = _createForOfIteratorHelper(visible_nodes),
            _step26;

        try {
          for (_iterator26.s(); !(_step26 = _iterator26.n()).done;) {
            var _node16 = _step26.value;
            ctx.fillStyle = "black";
            ctx.fillRect(_node16.pos[0] - defaultConfig.NODE_TITLE_HEIGHT, _node16.pos[1] - defaultConfig.NODE_TITLE_HEIGHT, defaultConfig.NODE_TITLE_HEIGHT, defaultConfig.NODE_TITLE_HEIGHT);

            if (_node16.order === 0) {
              ctx.strokeRect(_node16.pos[0] - defaultConfig.NODE_TITLE_HEIGHT + 0.5, _node16.pos[1] - defaultConfig.NODE_TITLE_HEIGHT + 0.5, defaultConfig.NODE_TITLE_HEIGHT, defaultConfig.NODE_TITLE_HEIGHT);
            }

            ctx.fillStyle = "#FFF";
            ctx.fillText(_node16.order, _node16.pos[0] + defaultConfig.NODE_TITLE_HEIGHT * -0.5, _node16.pos[1] - 6);
          }
        } catch (err) {
          _iterator26.e(err);
        } finally {
          _iterator26.f();
        }

        ctx.globalAlpha = 1;
      }
      /**
       * draws the widgets stored inside a node
       * @method drawNodeWidgets
       * @memberOf LGraphCanvas
       * */

    }, {
      key: "drawNodeWidgets",
      value: function drawNodeWidgets(node, posY, ctx, active_widget) {
        if (!node.widgets || !node.widgets.length) return 0;
        var width = node.size[0];
        var widgets = node.widgets;
        posY += 2;
        var H = defaultConfig.NODE_WIDGET_HEIGHT;
        var showText = this.ds.scale > 0.5;
        ctx.save();
        ctx.globalAlpha = this.editor_alpha;
        var outlineColor = defaultConfig.WIDGET_OUTLINE_COLOR;
        var backgroundColor = defaultConfig.WIDGET_BGCOLOR;
        var textColor = defaultConfig.WIDGET_TEXT_COLOR;
        var secondaryTextColor = defaultConfig.WIDGET_SECONDARY_TEXT_COLOR;
        var margin = 15;

        var _iterator27 = _createForOfIteratorHelper(widgets),
            _step27;

        try {
          for (_iterator27.s(); !(_step27 = _iterator27.n()).done;) {
            var w = _step27.value;
            var y = posY;
            if (w.y) y = w.y;
            w.last_y = y;
            ctx.strokeStyle = outlineColor;
            ctx.fillStyle = "#222";
            ctx.textAlign = "left"; // ctx.lineWidth = 2;

            if (w.disabled) ctx.globalAlpha *= 0.5;
            var widgetWidth = w.width || width;

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
                if (showText) ctx.roundRect(margin, posY, widgetWidth - margin * 2, H, H * 0.5);else ctx.rect(margin, posY, widgetWidth - margin * 2, H);
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
                  ctx.fillText(w.value ? w.options.on || "true" : w.options.off || "false", widgetWidth - 40, y + H * 0.7);
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
                  var marker_nvalue = (w.marker - w.options.min) / range;
                  ctx.fillStyle = "#AA9";
                  ctx.fillRect(margin + marker_nvalue * (widgetWidth - margin * 2), y, 2, H);
                }

                if (showText) {
                  ctx.textAlign = "center";
                  ctx.fillStyle = textColor;
                  ctx.fillText("".concat(w.name, "  ").concat(Number(w.value).toFixed(3)), widgetWidth * 0.5, y + H * 0.7);
                }

                break;

              case "number":
              case "combo":
                ctx.textAlign = "left";
                ctx.strokeStyle = outlineColor;
                ctx.fillStyle = backgroundColor;
                ctx.beginPath();
                if (showText) ctx.roundRect(margin, posY, widgetWidth - margin * 2, H, H * 0.5);else ctx.rect(margin, posY, widgetWidth - margin * 2, H);
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
                    ctx.fillText(Number(w.value).toFixed(w.options.precision ? w.options.precision : 3), widgetWidth - margin * 2 - 20, y + H * 0.7);
                  } else {
                    var v = w.value;

                    if (w.options.values) {
                      var values = w.options.values;
                      if (values.constructor === Function) values = values();
                      if (values && values.constructor !== Array) v = values[w.value];
                    }

                    ctx.fillText(v, widgetWidth - margin * 2 - 20, y + H * 0.7);
                  }
                }

                break;

              case "string":
              case "text":
                ctx.textAlign = "left";
                ctx.strokeStyle = outlineColor;
                ctx.fillStyle = backgroundColor;
                ctx.beginPath();
                if (showText) ctx.roundRect(margin, posY, widgetWidth - margin * 2, H, H * 0.5);else ctx.rect(margin, posY, widgetWidth - margin * 2, H);
                ctx.fill();

                if (showText) {
                  if (!w.disabled) ctx.stroke();
                  ctx.save();
                  ctx.beginPath();
                  ctx.rect(margin, posY, widgetWidth - margin * 2, H);
                  ctx.clip(); // ctx.stroke();

                  ctx.fillStyle = secondaryTextColor;
                  if (w.name) ctx.fillText(w.name, margin * 2, y + H * 0.7);
                  ctx.fillStyle = textColor;
                  ctx.textAlign = "right";
                  ctx.fillText(String(w.value).substr(0, 30), widgetWidth - margin * 2, y + H * 0.7); // 30 chars max

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
        } catch (err) {
          _iterator27.e(err);
        } finally {
          _iterator27.f();
        }

        ctx.restore();
        ctx.textAlign = "left";
      }
      /**
       * process an event on widgets
       * @method processNodeWidgets
       * @memberOf LGraphCanvas
       * */

    }, {
      key: "processNodeWidgets",
      value: function processNodeWidgets(node, pos, event, activeWidget) {
        var _this5 = this;

        if (!node.widgets || !node.widgets.length) return null;
        var x = pos[0] - node.pos[0];
        var y = pos[1] - node.pos[1];
        var width = node.size[0];
        var refWindow = this.getCanvasWindow();

        var _iterator28 = _createForOfIteratorHelper(node.widgets),
            _step28;

        try {
          var _loop2 = function _loop2() {
            var w = _step28.value;
            if (!w || w.disabled) return "continue";
            var widgetHeight = w.computeSize ? w.computeSize(width)[1] : defaultConfig.NODE_WIDGET_HEIGHT;
            var widgetWidth = w.width || width; // outside

            if (w !== activeWidget && (x < 6 || x > widgetWidth - 12 || y < w.last_y || y > w.last_y + widgetHeight)) {
              return "continue";
            }

            var oldValue = w.value; // if ( w == active_widget || (x > 6 && x < widget_width - 12 && y > w.last_y && y <
            // w.last_y + widget_height) ) { inside widget

            switch (w.type) {
              case "button":
                if (event.type === "mousemove") {
                  break;
                }

                if (w.callback) {
                  setTimeout(function () {
                    return w.callback(w, _this5, node, pos, event);
                  }, 20);
                }

                w.clicked = true;
                _this5.dirty_canvas = true;
                break;

              case "slider":
                var range = w.options.max - w.options.min;
                var nvalue = Math.clamp((x - 15) / (widgetWidth - 30), 0, 1);
                w.value = w.options.min + (w.options.max - w.options.min) * nvalue;

                if (w.callback) {
                  setTimeout(function () {
                    return innerValueChange(w, w.value);
                  }, 20);
                }

                _this5.dirty_canvas = true;
                break;

              case "number":
              case "combo":
                var _oldValue = w.value;

                if (event.type === "mousemove" && w.type === "number") {
                  w.value += event.deltaX * 0.1 * (w.options.step || 1);
                  if (w.options.min && w.value < w.options.min) w.value = w.options.min;
                  if (w.options.max && w.value > w.options.max) w.value = w.options.max;
                } else if (event.type === "mousedown") {
                  var values = w.options.values;

                  if (values && values.constructor === Function) {
                    values = w.options.values(w, node);
                  }

                  var valuesList = [];
                  if (w.type !== "number") valuesList = values.constructor === Array ? values : Object.keys(values);
                  var delta = x < 40 ? -1 : x > widgetWidth - 40 ? 1 : 0;

                  if (w.type === "number") {
                    w.value += delta * 0.1 * (w.options.step || 1);

                    if (w.options.min != null && w.value < w.options.min) {
                      w.value = w.options.min;
                    }

                    if (w.options.max != null && w.value > w.options.max) {
                      w.value = w.options.max;
                    }
                  } else if (delta) {
                    // clicked in arrow, used for combos
                    var index = -1;
                    _this5.last_mouseclick = 0; // avoids dobl click event

                    if (values.constructor === Object) {
                      index = valuesList.indexOf(String(w.value)) + delta;
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
                      w.value = index;
                    }
                  } else {
                    var innerClicked = function innerClicked(v, option, event) {
                      if (values != valuesList) v = textValues.indexOf(v);
                      this.value = v;
                      innerValueChange(this, v);
                      that.dirty_canvas = true;
                      return false;
                    };

                    // combo clicked
                    var textValues = values !== valuesList ? Object.values(values) : values;
                    var menu = new ContextMenu(textValues, {
                      scale: Math.max(1, _this5.ds.scale),
                      event: event,
                      className: "dark",
                      callback: innerClicked.bind(w)
                    }, refWindow);
                  }
                } else if (event.type === "mouseup" && w.type === "number") {
                  var _delta = x < 40 ? -1 : x > widgetWidth - 40 ? 1 : 0;

                  if (event.click_time < 200 && _delta == 0) {
                    _this5.prompt("Value", w.value, function (v) {
                      w.value = Number(v);
                      innerValueChange(w, w.value);
                    }, event);
                  }
                }

                if (_oldValue !== w.value) {
                  setTimeout(function () {
                    innerValueChange(_this5, _this5.value);
                  }, 20);
                }

                _this5.dirty_canvas = true;
                break;

              case "toggle":
                if (event.type === "mousedown") {
                  w.value = !w.value;
                  setTimeout(function () {
                    innerValueChange(w, w.value);
                  }, 20);
                }

                break;

              case "string":
              case "text":
                if (event.type === "mousedown") {
                  _this5.prompt("Value", w.value, function (v) {
                    w.value = v;
                    innerValueChange(w, v);
                  }, event, w.options ? w.options.multiline : false);
                }

                break;

              default:
                if (w.mouse) {
                  _this5.dirty_canvas = w.mouse(event, [x, y], node);
                }

                break;
            } // end switch
            // value changed


            if (oldValue !== w.value) {
              if (node.onWidgetChanged) node.onWidgetChanged(w.name, w.value, oldValue, w);
              node.graph._version++;
            }

            return {
              v: w
            };
          };

          for (_iterator28.s(); !(_step28 = _iterator28.n()).done;) {
            var _ret = _loop2();

            if (_ret === "continue") continue;
            if (_typeof(_ret) === "object") return _ret.v;
          }
        } catch (err) {
          _iterator28.e(err);
        } finally {
          _iterator28.f();
        }

        var that = this;

        function innerValueChange(widget, value) {
          widget.value = value;

          if (widget.options && widget.options.property && node.properties[widget.options.property]) {
            node.setProperty(widget.options.property, value);
          }

          if (widget.callback) {
            widget.callback(widget.value, that, node, pos, event);
          }
        }

        return null;
      }
      /**
       * draws every group area in the background
       * @method drawGroups
       * @memberOf LGraphCanvas
       * */

    }, {
      key: "drawGroups",
      value: function drawGroups(canvas, ctx) {
        if (!this.graph) return;
        var groups = this.graph._groups;
        ctx.save();
        ctx.globalAlpha = 0.5 * this.editor_alpha;

        var _iterator29 = _createForOfIteratorHelper(groups),
            _step29;

        try {
          for (_iterator29.s(); !(_step29 = _iterator29.n()).done;) {
            var group = _step29.value;

            if (!overlapBounding$1(this.visible_area, group._bounding)) {
              continue;
            } // out of the visible area


            ctx.fillStyle = group.color || "#335";
            ctx.strokeStyle = group.color || "#335";
            var pos = group._pos;
            var size = group._size;
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
            var fontSize = group.font_size || defaultConfig.DEFAULT_GROUP_FONT_SIZE;
            ctx.font = "".concat(fontSize, "px Arial");
            ctx.fillText(group.title, pos[0] + 4, pos[1] + fontSize);
          }
        } catch (err) {
          _iterator29.e(err);
        } finally {
          _iterator29.f();
        }

        ctx.restore();
      }
    }, {
      key: "adjustNodesSize",
      value: function adjustNodesSize() {
        var nodes = this.graph._nodes;

        var _iterator30 = _createForOfIteratorHelper(nodes),
            _step30;

        try {
          for (_iterator30.s(); !(_step30 = _iterator30.n()).done;) {
            var _node17 = _step30.value;
            _node17.size = _node17.computeSize();
          }
        } catch (err) {
          _iterator30.e(err);
        } finally {
          _iterator30.f();
        }

        this.setDirty(true, true);
      }
      /**
       * resizes the canvas to a given size, if no size is passed, then it tries to fill the
       * parentNode
       * @method resize
       * @memberOf LGraphCanvas
       * */

    }, {
      key: "resize",
      value: function resize(width, height) {
        if (!width && !height) {
          var parent = this.canvas.parentNode;
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

    }, {
      key: "switchLiveMode",
      value: function switchLiveMode(transition) {
        var _this6 = this;

        if (!transition) {
          this.live_mode = !this.live_mode;
          this.dirty_canvas = true;
          this.dirty_bgcanvas = true;
          return;
        }

        var delta = this.live_mode ? 1.1 : 0.9;

        if (this.live_mode) {
          this.live_mode = false;
          this.editor_alpha = 0.1;
        }

        var t = setInterval(function () {
          _this6.editor_alpha *= delta;
          _this6.dirty_canvas = true;
          _this6.dirty_bgcanvas = true;

          if (delta < 1 && _this6.editor_alpha < 0.01) {
            clearInterval(t);

            if (delta < 1) {
              _this6.live_mode = true;
            }
          }

          if (delta > 1 && _this6.editor_alpha > 0.99) {
            clearInterval(t);
            _this6.editor_alpha = 1;
          }
        }, 1);
      }
      /**
       * @method onNodeSelectionChange
       * @param node
       * @todo Need create event
       * @memberOf LGraphCanvas
       */

    }, {
      key: "onNodeSelectionChange",
      value: function onNodeSelectionChange(node) {// disabled
      }
      /**
       * @method touchHandler
       * @param {TouchEvent} event
       * @memberOf LGraphCanvas
       */

    }, {
      key: "touchHandler",
      value: function touchHandler(event) {
        // alert("foo");
        var touches = event.changedTouches;
        var first = touches[0];
        var type = "";

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
        } // initMouseEvent(type, canBubble, cancelable, view, clickCount,
        //           screenX, screenY, clientX, clientY, ctrlKey,
        //           altKey, shiftKey, metaKey, button, relatedTarget);


        var window = this.getCanvasWindow();
        var document = window.document;
        var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 0
        /* left */
        , null);
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

    }, {
      key: "showLinkMenu",
      value: function showLinkMenu(link, e) {
        var that = this;
        var options = ["Add Node", null, "Delete"];
        var menu = new ContextMenu(options, {
          event: e,
          title: link.data != null ? link.data.constructor.name : null,
          callback: innerClicked
        });

        function innerClicked(v, options, e) {
          switch (v) {
            case "Add Node":
              LGraphCanvas.onMenuAdd(null, null, e, menu, function (node) {
                console.log("node autoconnect");
                var nodeLeft = that.graph.getNodeById(link.origin_id);
                var nodeRight = that.graph.getNodeById(link.target_id);
                if (!node.inputs || !node.inputs.length || !node.outputs || !node.outputs.length) return;

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
          }
        }

        return false;
      }
    }, {
      key: "prompt",
      value: function prompt() {
        var _this7 = this;

        var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
        var value = arguments.length > 1 ? arguments[1] : undefined;
        var callback = arguments.length > 2 ? arguments[2] : undefined;
        var event = arguments.length > 3 ? arguments[3] : undefined;
        var multiline = arguments.length > 4 ? arguments[4] : undefined;
        var modified = false;
        var dialog = document.createElement("div");
        dialog.className = "graphdialog rounded";

        if (multiline) {
          dialog.innerHTML = "<span class='name'></span> <textarea autofocus class='value'></textarea><button class='rounded'>OK</button>";
        } else {
          dialog.innerHTML = "<span class='name'></span> <input autofocus type='text' class='value'/><button class='rounded'>OK</button>";
        }

        dialog.close = function () {
          _this7.prompt_box = null;
          if (dialog.parentNode) dialog.remove();
        };

        if (this.ds.scale > 1) {
          dialog.style.transform = "scale(".concat(this.ds.scale, ")");
        }

        dialog.addEventListener("mouseleave", function (e) {
          if (!modified) dialog.close();
        });

        if (this.prompt_box) {
          this.prompt_box.close();
        }

        this.prompt_box = dialog;
        var nameElement = dialog.querySelector(".name");
        nameElement.innerText = title;
        var valueElement = dialog.querySelector(".value");
        valueElement.value = value;
        var input = valueElement;
        input.addEventListener("keydown", function (e) {
          modified = true;
          if (e.keyCode === 27) dialog.close();else if (e.keyCode === 13 && e.target.localName !== "textarea") {
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
        var button = dialog.querySelector("button");
        button.addEventListener("click", function () {
          if (callback) callback(input.value);

          _this7.setDirty(true);

          dialog.close();
        });
        var graphcanvas = LGraphCanvas.active_canvas;
        var canvas = graphcanvas.canvas;
        var rect = canvas.getBoundingClientRect();
        var offsetx = -20;
        var offsety = -20;

        if (rect) {
          offsetx -= rect.left;
          offsety -= rect.top;
        }

        if (event) {
          dialog.style.left = "".concat(event.clientX + offsetx, "px");
          dialog.style.top = "".concat(event.clientY + offsety, "px");
        } else {
          dialog.style.left = "".concat(canvas.width * 0.5 + offsetx, "px");
          dialog.style.top = "".concat(canvas.height * 0.5 + offsety, "px");
        }

        canvas.parentNode.appendChild(dialog);
        setTimeout(function () {
          return input.focus();
        }, 10);
        return dialog;
      }
    }, {
      key: "showEditPropertyValue",
      value: function showEditPropertyValue(node, property) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        if (!node || node.properties[property] === undefined) return;
        var info = node.getPropertyInfo(property);
        var type = info.type;
        var inputHTML = "";

        if (["sring", "number", "array", "object"].includes(type)) {
          inputHTML = "<input autofocus type='text' class='value'/>";
        } else if (["enum", "combo"].includes(type) && info.values) {
          inputHTML = "<select autofocus type='text' class='value'>"; // eslint-disable-next-line

          for (var _i17 in info.values) {
            var value = _i17;
            if (info.values.constructor === Array) value = info.values[_i17];
            inputHTML += "<option value=\"".concat(value, "\" ").concat(value == node.properties[property] ? "selected" : "", ">").concat(info.values[_i17], "</option>");
          }

          inputHTML += "</select>";
        } else if (type === "boolean") {
          inputHTML = "<input autofocus type=\"checkbox\" class=\"value\" ".concat(node.properties[property] ? "checked" : "", "/>");
        } else {
          console.warn("unknown type: ".concat(type));
          return;
        }

        var dialog = this.createDialog("<span class=\"name\">".concat(info.label ? info.label : property, "</span>").concat(inputHTML, "<button>OK</button>"), options);

        if (["enum", "combo"].includes(type) && info.values) {
          var _input8 = dialog.querySelector("select");

          _input8.addEventListener("change", function (e) {
            setValue(e.target.value);
          });
        } else if (type === "boolean") {
          var _input9 = dialog.querySelector("input");

          if (_input9) {
            _input9.addEventListener("click", function () {
              return setValue(!!_input9.checked);
            });
          }
        } else {
          var _input10 = dialog.querySelector("input");

          if (_input10) {
            _input10.addEventListener("blur", function () {
              _input10.focus();
            });

            var v = node.properties[property] ? node.properties[property] : "";

            if (type !== "string") {
              v = JSON.stringify(v);
            }

            _input10.value = v;

            _input10.addEventListener("keydown", function (e) {
              if (e.keyCode != 13) return;
              setValue(_input10.value);
              e.preventDefault();
              e.stopPropagation();
            });
          }
        }

        var button = dialog.querySelector("button");
        button.addEventListener("click", function () {
          return setValue(input.value);
        });

        function setValue(value) {
          if (info && info.values && info.values.constructor === Object && info.values[value]) value = info.values[value];

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
    }, {
      key: "createDialog",
      value: function createDialog(html) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var dialog = document.createElement("div");
        dialog.className = "graphdialog";
        dialog.innerHTML = html;
        var rect = this.canvas.getBoundingClientRect();
        var offsetx = -20;
        var offsety = -20;

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

        dialog.style.left = "".concat(offsetx, "px");
        dialog.style.top = "".concat(offsety, "px");
        this.canvas.parentNode.appendChild(dialog);

        dialog.close = function () {
          if (dialog.parentNode) dialog.remove();
        };

        return dialog;
      }
    }, {
      key: "createPanel",
      value: function createPanel(title) {
        var _this8 = this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var refWindow = options.window || window;
        var root = document.createElement("div");
        root.className = "litegraph dialog";
        root.innerHTML = "<div class='dialog-header'><span class='dialog-title'></span></div><div class='dialog-content'></div><div class='dialog-footer'></div>";
        root.header = root.querySelector(".dialog-header");
        if (options.width) root.style.width = options.width + (options.width.constructor === Number ? "px" : "");
        if (options.height) root.style.height = options.height + (options.height.constructor === Number ? "px" : "");

        if (options.closable) {
          var close = document.createElement("span");
          close.innerHTML = "&#10005;";
          close.classList.add("close");
          close.addEventListener("click", function () {
            return root.close();
          });
          root.header.appendChild(close);
        }

        root.title_element = root.querySelector(".dialog-title");
        root.title_element.innerText = title;
        root.content = root.querySelector(".dialog-content");
        root.footer = root.querySelector(".dialog-footer");

        root.close = function () {
          return root.remove();
        };

        root.clear = function () {
          return root.content.innerHTML = "";
        };

        root.addHTML = function (code, classname, onFooter) {
          var elem = document.createElement("div");
          if (classname) elem.className = classname;
          elem.innerHTML = code;
          if (onFooter) root.footer.appendChild(elem);else root.content.appendChild(elem);
          return elem;
        };

        root.addButton = function (name, callback, options) {
          var elem = document.createElement("button");
          elem.innerText = name;
          elem.options = options;
          elem.classList.add("btn");
          elem.addEventListener("click", callback);
          root.footer.appendChild(elem);
          return elem;
        };

        root.addSeparator = function () {
          var elem = document.createElement("div");
          elem.className = "separator";
          root.content.appendChild(elem);
        };

        root.addWidget = function (type, name, value) {
          var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
          var callback = arguments.length > 4 ? arguments[4] : undefined;
          type = type.toLowerCase();
          value = String(value);
          var strValue = type === "number" ? new Number(value).toFixed(3) : value.toString();
          var elem = document.createElement("div");
          elem.className = "property";
          elem.innerHTML = "<span class='property_name'></span><span class='property_value'></span>";
          elem.querySelector(".property_name").innerText = name;
          var valueElement = elem.querySelector(".property_value");
          valueElement.innerText = strValue;
          elem.dataset.property = name;
          elem.dataset.type = options.type || type;
          elem.options = options;
          elem.value = strValue;

          if (type === "boolean") {
            elem.classList.add("boolean");
            if (value) elem.classList.add("bool-on");
            elem.addEventListener("click", function () {
              // var v = node.properties[this.dataset["property"]];
              // node.setProperty(this.dataset["property"],!v); this.innerText = v ? "true" :
              // "false";
              var propname = elem.dataset.property;
              _this8.value = !elem.value;

              _this8.classList.toggle("bool-on");

              _this8.querySelector(".property_value").innerText = elem.value ? "true" : "false";
              innerChange(propname, elem.value);
            });
          } else if (["string", "number"].includes(type)) {
            valueElement.setAttribute("contenteditable", true);
            valueElement.addEventListener("keydown", function (e) {
              if (e.code === "Enter") {
                e.preventDefault();
                valueElement.blur();
              }
            });
            valueElement.addEventListener("blur", function () {
              var v = valueElement.innerText;
              var propname = valueElement.parentNode.dataset.property;
              var proptype = valueElement.parentNode.dataset.type;
              if (proptype === "number") v = Number(v);
              innerChange(propname, v);
            });
          } else if (["enum", "combo"].includes(type)) strValue = LGraphCanvas.getPropertyPrintableValue(value, options.values);

          valueElement.innerText = strValue;
          valueElement.addEventListener("click", function (event) {
            var values = options.values || [];
            var propname = valueElement.parentNode.dataset.property;
            new ContextMenu(values, {
              event: event,
              className: "dark",
              callback: function callback(v, option, event) {
                _this8.innerText = v;
                innerChange(propname, v);
                return false;
              }
            }, refWindow);
          });
          root.content.appendChild(elem);

          function innerChange(name, value) {
            console.log("change", name, value); // that.dirty_canvas = true;

            if (options.callback) options.callback(name, value);
            if (callback) callback(name, value);
          }

          return elem;
        };

        return root;
      }
    }, {
      key: "showSubgraphPropertiesDialog",
      value: function showSubgraphPropertiesDialog(node) {
        console.log("showing subgraph properties dialog");
        var old_panel = this.canvas.parentNode.querySelector(".subgraph_dialog");
        if (old_panel) old_panel.close();
        var panel = this.createPanel("Subgraph Inputs", {
          closable: true,
          width: 500
        });
        panel.node = node;
        panel.classList.add("subgraph_dialog");

        function inner_refresh() {
          panel.clear(); // show currents

          if (node.inputs) {
            var _iterator31 = _createForOfIteratorHelper(node.inputs),
                _step31;

            try {
              var _loop3 = function _loop3() {
                var input = _step31.value;
                if (input.not_subgraph_input) return "continue";
                var html = "<button>&#10005;</button> <span class='bullet_icon'></span><span class='name'></span><span class='type'></span>";
                var elem = panel.addHTML(html, "subgraph_property");
                elem.dataset.name = input.name;
                elem.dataset.slot = i;
                elem.querySelector(".name").innerText = input.name;
                elem.querySelector(".type").innerText = input.type;
                elem.querySelector("button").addEventListener("click", function () {
                  node.removeInput(Number(elem.parentNode.dataset.slot));
                  inner_refresh();
                });
              };

              for (_iterator31.s(); !(_step31 = _iterator31.n()).done;) {
                var _ret2 = _loop3();

                if (_ret2 === "continue") continue;
              }
            } catch (err) {
              _iterator31.e(err);
            } finally {
              _iterator31.f();
            }
          }
        } // add extra


        var html = " + <span class='label'>Name</span><input class='name'/><span class='label'>Type</span><input class='type'/><button>+</button>";
        var elem = panel.addHTML(html, "subgraph_property extra", true);
        elem.querySelector("button").addEventListener("click", function (e) {
          var elem = this.parentNode;
          var name = elem.querySelector(".name").value;
          var type = elem.querySelector(".type").value;
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
    }, {
      key: "checkPanels",
      value: function checkPanels() {
        if (!this.canvas) return;
        var panels = this.canvas.parentNode.querySelectorAll(".litegraph.dialog");

        var _iterator32 = _createForOfIteratorHelper(panels),
            _step32;

        try {
          for (_iterator32.s(); !(_step32 = _iterator32.n()).done;) {
            var panel = _step32.value;
            if (!panel.node) continue;
            if (!panel.node.graph || panel.graph !== this.graph) panel.close();
          }
        } catch (err) {
          _iterator32.e(err);
        } finally {
          _iterator32.f();
        }
      }
    }, {
      key: "getCanvasMenuOptions",
      value: function getCanvasMenuOptions() {
        var options = null;

        if (this.getMenuOptions) {
          options = this.getMenuOptions();
        } else {
          options = [{
            content: "Add Node",
            has_submenu: true,
            callback: LGraphCanvas.onMenuAdd
          }, {
            content: "Add Group",
            callback: LGraphCanvas.onGroupAdd
          } // {content:"Collapse All", callback: LGraphCanvas.onMenuCollapseAll }
          ];

          if (this._graph_stack && this._graph_stack.length > 0) {
            options.push(null, {
              content: "Close subgraph",
              callback: this.closeSubgraph.bind(this)
            });
          }
        }

        if (this.getExtraMenuOptions) {
          var extra = this.getExtraMenuOptions(this, options);
          if (extra) options = options.concat(extra);
        }

        return options;
      }
    }, {
      key: "getNodeMenuOptions",
      value: function getNodeMenuOptions(node) {
        var options = null;
        if (node.getMenuOptions) options = node.getMenuOptions(this);else {
          options = [{
            content: "Inputs",
            has_submenu: true,
            disabled: true,
            callback: LGraphCanvas.showMenuNodeOptionalInputs
          }, {
            content: "Outputs",
            has_submenu: true,
            disabled: true,
            callback: LGraphCanvas.showMenuNodeOptionalOutputs
          }, null, {
            content: "Properties",
            has_submenu: true,
            callback: LGraphCanvas.onShowMenuNodeProperties
          }, null, {
            content: "Title",
            callback: LGraphCanvas.onShowPropertyEditor
          }, {
            content: "Mode",
            has_submenu: true,
            callback: LGraphCanvas.onMenuNodeMode
          }, {
            content: "Resize",
            callback: function callback() {
              if (node.resizable) {
                return LGraphCanvas.onResizeNode;
              }
            }
          }, {
            content: "Collapse",
            callback: LGraphCanvas.onMenuNodeCollapse
          }, {
            content: "Pin",
            callback: LGraphCanvas.onMenuNodePin
          }, {
            content: "Colors",
            has_submenu: true,
            callback: LGraphCanvas.onMenuNodeColors
          }, {
            content: "Shapes",
            has_submenu: true,
            callback: LGraphCanvas.onMenuNodeShapes
          }, null];
        }

        if (node.onGetInputs) {
          var inputs = node.onGetInputs();
          if (inputs && inputs.length) options[0].disabled = false;
        }

        if (node.onGetOutputs) {
          var outputs = node.onGetOutputs();
          if (outputs && outputs.length) options[1].disabled = false;
        }

        if (node.getExtraMenuOptions) {
          var extra = node.getExtraMenuOptions(this, options);

          if (extra) {
            extra.push(null);
            options = extra.concat(options);
          }
        }

        if (node.clonable) {
          options.push({
            content: "Clone",
            callback: LGraphCanvas.onMenuNodeClone
          });
        }

        options.push(null, {
          content: "Remove",
          disabled: !(node.removable !== false && !node.block_delete),
          callback: LGraphCanvas.onMenuNodeRemove
        });

        if (node.graph && node.graph.onGetNodeMenuOptions) {
          node.graph.onGetNodeMenuOptions(options, node);
        }

        return options;
      }
    }, {
      key: "getGroupMenuOptions",
      value: function getGroupMenuOptions() {
        return [{
          content: "Title",
          callback: LGraphCanvas.onShowPropertyEditor
        }, {
          content: "Color",
          has_submenu: true,
          callback: LGraphCanvas.onMenuNodeColors
        }, {
          content: "Font size",
          property: "font_size",
          type: "Number",
          callback: LGraphCanvas.onShowPropertyEditor
        }, null, {
          content: "Remove",
          callback: LGraphCanvas.onMenuNodeRemove
        }];
      }
    }, {
      key: "processContextMenu",
      value: function processContextMenu(node, event) {
        var that = this;
        var canvas = LGraphCanvas.active_canvas;
        var refWindow = canvas.getCanvasWindow();
        var menuInfo = null;
        var options = {
          event: event,
          callback: inner_option_clicked,
          extra: node
        };
        if (node) options.title = node.type; // check if mouse is in input

        var slot = null;

        if (node) {
          slot = node.getSlotInPosition(event.canvasX, event.canvasY);
          LGraphCanvas.active_node = node;
        }

        if (slot) {
          // on slot
          menuInfo = [];
          if (node.getSlotMenuOptions) menuInfo = node.getSlotMenuOptions(slot);else {
            if (slot && slot.output && slot.output.links && slot.output.links.length) {
              menuInfo.push({
                content: "Disconnect Links",
                slot: slot
              });
            }

            var _slot = slot.input || slot.output;

            menuInfo.push(_slot.locked ? "Cannot remove" : {
              content: "Remove Slot",
              slot: slot
            });
            menuInfo.push(_slot.nameLocked ? "Cannot rename" : {
              content: "Rename Slot",
              slot: slot
            });
          }
          options.title = (slot.input ? slot.input.type : slot.output.type) || "*";
          if (slot.input && slot.input.type === defaultConfig.ACTION) options.title = "Action";
          if (slot.output && slot.output.type === defaultConfig.EVENT) options.title = "Event";
        } else if (node) {
          menuInfo = this.getNodeMenuOptions(node);
        } else {
          menuInfo = this.getCanvasMenuOptions();
          var group = this.graph.getGroupOnPos(event.canvasX, event.canvasY);

          if (group) {
            // on group
            menuInfo.push(null, {
              content: "Edit Group",
              has_submenu: true,
              submenu: {
                title: "Group",
                extra: group,
                options: this.getGroupMenuOptions(group)
              }
            });
          }
        } // show menu


        if (!menuInfo) return;
        new ContextMenu(menuInfo, options, refWindow);

        function inner_option_clicked(v, options, e) {
          if (!v) {
            return;
          }

          if (v.content === "Remove Slot") {
            var info = v.slot;
            if (info.input) node.removeInput(info.slot);else if (info.output) node.removeOutput(info.slot);
          } else if (v.content === "Disconnect Links") {
            var _info = v.slot;
            if (_info.output) node.disconnectOutput(_info.slot);else if (_info.input) node.disconnectInput(_info.slot);
          } else if (v.content === "Rename Slot") {
            var _info2 = v.slot;
            var slotInfo = _info2.input ? node.getInputInfo(_info2.slot) : node.getOutputInfo(_info2.slot);
            var dialog = that.createDialog("<span class='name'>Name</span><input autofocus type='text'/><button>OK</button>", options);

            var _input11 = dialog.querySelector("input");

            if (_input11 && slotInfo) _input11.value = slotInfo.label || "";
            dialog.querySelector("button").addEventListener("click", function () {
              if (_input11.value) {
                if (slotInfo) slotInfo.label = _input11.value;
                that.setDirty(true);
              }

              dialog.close();
            });
          }
        }
      }
    }], [{
      key: "onGroupAdd",
      value: function onGroupAdd(info, entry, mouseEvent) {
        var canvas = LGraphCanvas.active_canvas;
        var group = new LGraphGroup();
        group.pos = canvas.convertEventToCanvasOffset(mouseEvent);
        canvas.graph.add(group);
      }
    }, {
      key: "onMenuAdd",
      value: function onMenuAdd(node, options, e, previousMenu, _callback) {
        var canvas = LGraphCanvas.active_canvas;
        var refWindow = canvas.getCanvasWindow();
        var graph = canvas.graph;
        if (!graph) return;

        function inner_onMenuAdded(base_category, prev_menu) {
          var categories = getNodeTypesCategories(canvas.filter || graph.filter).filter(function (category) {
            return category.startsWith(base_category);
          });
          var entries = [];
          categories.forEach(function (category) {
            if (!category) {
              return;
            }

            var base_category_regex = new RegExp("^(".concat(base_category, ")"));
            var category_name = category.replace(base_category_regex, "").split("/")[0];
            var category_path = base_category === "" ? "".concat(category_name, "/") : "".concat(base_category + category_name, "/");
            var name = category_name;

            if (name.indexOf("::") != -1) {
              name = name.split("::")[1];
            }

            var index = entries.findIndex(function (entry) {
              return entry.value === category_path;
            });

            if (index === -1) {
              entries.push({
                value: category_path,
                content: name,
                has_submenu: true,
                callback: function callback(value, event, mouseEvent, contextMenu) {
                  inner_onMenuAdded(value.value, contextMenu);
                }
              });
            }
          });
          var nodes = getNodeTypesInCategory(base_category.slice(0, -1), canvas.filter || graph.filter);
          nodes.forEach(function (node) {
            if (node.skip_list) return;
            var entry = {
              value: node.type,
              content: node.title,
              has_submenu: false,
              callback: function callback(value, event, mouseEvent, contextMenu) {
                var first_event = contextMenu.getFirstEvent();
                canvas.graph.beforeChange();
                var node = LGraphNode.createNode(value.value);

                if (node) {
                  node.pos = canvas.convertEventToCanvasOffset(first_event);
                  canvas.graph.add(node);
                }

                if (_callback) _callback(node);
                canvas.graph.afterChange();
              }
            };
            entries.push(entry);
          });
          new ContextMenu(entries, {
            event: e,
            parentMenu: prev_menu
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

    }, {
      key: "onMenuCollapseAll",
      value: function onMenuCollapseAll() {}
      /**
       * @method onMenuNodeEdit
       * @todo Need create event
       * @memberOf LGraphCanvas
       */

    }, {
      key: "onMenuNodeEdit",
      value: function onMenuNodeEdit() {}
    }, {
      key: "showMenuNodeOptionalInputs",
      value: function showMenuNodeOptionalInputs(v, optionsParam, e, previousMenu, node) {
        if (!node) return;
        var that = this;
        var canvas = LGraphCanvas.active_canvas;
        var refWindow = canvas.getCanvasWindow();
        var options = node.optional_inputs;
        if (node.onGetInputs) options = node.onGetInputs();
        var entries = [];

        if (options) {
          var _iterator33 = _createForOfIteratorHelper(options),
              _step33;

          try {
            for (_iterator33.s(); !(_step33 = _iterator33.n()).done;) {
              var entry = _step33.value;

              if (!entry) {
                entries.push(null);
                continue;
              }

              var label = entry[0];

              if (entry[2] && entry[2].label) {
                label = entry[2].label;
              }

              var data = {
                content: label,
                value: entry
              };

              if (entry[1] === defaultConfig.ACTION) {
                data.className = "event";
              }

              entries.push(data);
            }
          } catch (err) {
            _iterator33.e(err);
          } finally {
            _iterator33.f();
          }
        }

        if (this.onMenuNodeInputs) entries = this.onMenuNodeInputs(entries);

        if (!entries.length) {
          console.log("no input entries");
          return;
        }

        new ContextMenu(entries, {
          event: e,
          callback: innerClicked,
          parentMenu: previousMenu,
          node: node
        }, refWindow);

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
    }, {
      key: "showMenuNodeOptionalOutputs",
      value: function showMenuNodeOptionalOutputs(v, optionsParam, e, previousMenu, node) {
        if (!node) return;
        var that = this;
        var canvas = LGraphCanvas.active_canvas;
        var refWindow = canvas.getCanvasWindow();
        var options = node.optional_outputs;

        if (node.onGetOutputs) {
          options = node.onGetOutputs();
        }

        var entries = [];

        if (options) {
          var _iterator34 = _createForOfIteratorHelper(options),
              _step34;

          try {
            for (_iterator34.s(); !(_step34 = _iterator34.n()).done;) {
              var entry = _step34.value;

              if (!entry) {
                // separator?
                entries.push(null);
                continue;
              }

              if (node.flags && node.flags.skip_repeated_outputs && node.findOutputSlot(entry[0]) !== -1) {
                continue;
              } // skip the ones already on


              var label = entry[0];
              if (entry[2] && entry[2].label) label = entry[2].label;
              var data = {
                content: label,
                value: entry
              };
              if (entry[1] === defaultConfig.EVENT) data.className = "event";
              entries.push(data);
            }
          } catch (err) {
            _iterator34.e(err);
          } finally {
            _iterator34.f();
          }
        }

        if (this.onMenuNodeOutputs) entries = this.onMenuNodeOutputs(entries);
        if (!entries.length) return;
        new ContextMenu(entries, {
          event: e,
          callback: innerClicked,
          parentMenu: previousMenu,
          node: node
        }, refWindow);

        function innerClicked(v, e, prev) {
          if (!node) return;
          if (v.callback) v.callback.call(that, node, v, e, prev);

          if (!v.value) {
            return;
          }

          var value = v.value[1];

          if (value && (value.constructor === Object || value.constructor === Array)) {
            // submenu why?
            var _entries = [];

            for (var _i18 in value) {
              _entries.push({
                content: _i18,
                value: value[_i18]
              });
            }

            new ContextMenu(_entries, {
              event: e,
              callback: innerClicked,
              parentMenu: previousMenu,
              node: node
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
    }, {
      key: "onShowMenuNodeProperties",
      value: function onShowMenuNodeProperties(value, options, e, previousMenu, node) {
        if (!node || !node.properties) {
          return;
        }

        var canvas = LGraphCanvas.active_canvas;
        var refWindow = canvas.getCanvasWindow();
        var entries = []; // eslint-disable-next-line

        for (var _i19 in node.properties) {
          var _value = node.properties[_i19] ? node.properties[_i19] : " ";

          if (_typeof(_value) === "object") _value = JSON.stringify(_value);
          var info = node.getPropertyInfo(_i19);
          if (info.type == "enum" || info.type == "combo") _value = LGraphCanvas.getPropertyPrintableValue(_value, info.values); // value could contain invalid html characters, clean that

          _value = LGraphCanvas.decodeHTML(_value);
          entries.push({
            content: "<span class=\"property_name\">".concat(info.label ? info.label : _i19, "</span>") + "<span class=\"property_value\">".concat(_value, "</span>"),
            value: _i19
          });
        }

        if (!entries.length) {
          return;
        }

        new ContextMenu(entries, {
          event: e,
          callback: innerClicked,
          parentMenu: previousMenu,
          allow_html: true,
          node: node
        }, refWindow);

        function innerClicked(v) {
          if (!node) {
            return;
          }

          var rect = this.getBoundingClientRect();
          canvas.showEditPropertyValue(node, v.value, {
            position: [rect.left, rect.top]
          });
        }

        return false;
      }
    }, {
      key: "decodeHTML",
      value: function decodeHTML(str) {
        var e = document.createElement("div");
        e.innerText = str;
        return e.innerHTML;
      }
    }, {
      key: "onResizeNode",
      value: function onResizeNode(value, options, e, menu, node) {
        if (!node) return;
        node.size = node.computeSize();
        if (node.onResize) node.onResize(node.size);
        node.setDirtyCanvas(true, true);
      }
    }, {
      key: "onShowPropertyEditor",
      value: function onShowPropertyEditor(item, options, e, menu, node) {
        var property = item.property || "title";
        var value = node[property];
        var dialog = document.createElement("div");
        dialog.className = "graphdialog";
        dialog.innerHTML = "<span class='name'></span><input autofocus type='text' class='value'/><button>OK</button>";
        var title = dialog.querySelector(".name");
        title.innerText = property;
        var input = dialog.querySelector(".value");

        if (input) {
          input.value = value;
          input.addEventListener("blur", function (e) {
            input.focus();
          });
          input.addEventListener("keydown", function (e) {
            if (e.keyCode !== 13 && e.target.localName !== "textarea") return;
            setValue(input.value);
            e.preventDefault();
            e.stopPropagation();
          });
        }

        var graphcanvas = LGraphCanvas.active_canvas;
        var canvas = graphcanvas.canvas;
        var rect = canvas.getBoundingClientRect();
        var offsetx = -20;
        var offsety = -20;

        if (rect) {
          offsetx -= rect.left;
          offsety -= rect.top;
        }

        if (e) {
          dialog.style.left = "".concat(e.clientX + offsetx, "px");
          dialog.style.top = "".concat(e.clientY + offsety, "px");
        } else {
          dialog.style.left = "".concat(canvas.width * 0.5 + offsetx, "px");
          dialog.style.top = "".concat(canvas.height * 0.5 + offsety, "px");
        }

        var button = dialog.querySelector("button");
        button.addEventListener("click", function () {
          return setValue(input.value);
        });
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
    }, {
      key: "getPropertyPrintableValue",
      value: function getPropertyPrintableValue(value, values) {
        if (!values) return String(value);
        if (values.constructor === Array) return String(value);

        if (values.constructor === Object) {
          var desc_value = "";

          for (var k in values) {
            if (values[k] !== value) continue;
            desc_value = k;
            break;
          }

          return "".concat(String(value), " (").concat(desc_value, ")");
        }
      }
    }, {
      key: "onMenuNodeCollapse",
      value: function onMenuNodeCollapse(value, options, e, menu, node) {
        node.graph.beforeChange(node);
        node.collapse();
        node.graph.afterChange(node);
      }
    }, {
      key: "onMenuNodePin",
      value: function onMenuNodePin(value, options, e, menu, node) {
        node.pin();
      }
    }, {
      key: "onMenuNodeColors",
      value: function onMenuNodeColors(value, options, e, menu, node) {
        if (!node) throw new Error("no node for color");
        var values = [];
        values.push({
          value: null,
          content: "<span style='display: block; padding-left: 4px;'>No color</span>"
        }); // eslint-disable-next-line

        for (var _i20 in LGraphCanvas.node_colors) {
          var color = LGraphCanvas.node_colors[_i20];
          values.push({
            value: _i20,
            content: "<span style=\"display: block; color: #999; padding-left: 4px; border-left: 8px solid ".concat(color.color, "; background-color:").concat(color.bgcolor, "\">").concat(_i20, "</span>")
          });
        }

        new ContextMenu(values, {
          event: e,
          callback: function callback(v) {
            if (!node) {
              return;
            }

            var color = v.value ? LGraphCanvas.node_colors[v.value] : null;

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
          node: node
        });
        return false;
      }
    }, {
      key: "onMenuNodeShapes",
      value: function onMenuNodeShapes(value, options, e, menu, node) {
        if (!node) {
          throw new Error("no node passed");
        }

        new ContextMenu(defaultConfig.VALID_SHAPES, {
          event: e,
          callback: function callback(v) {
            if (!node) return;
            node.graph.beforeChange(node);
            node.shape = v;
            node.graph.afterChange(node);
            node.setDirtyCanvas(true);
          }
        }, {
          parentMenu: menu,
          node: node
        });
        return false;
      }
    }, {
      key: "onMenuNodeRemove",
      value: function onMenuNodeRemove(value, options, e, menu, node) {
        if (!node) throw new Error("no node passed");
        if (node.removable === false) return;
        var graph = node.graph;
        graph.beforeChange();
        graph.remove(node);
        graph.afterChange();
        node.setDirtyCanvas(true, true);
      }
    }, {
      key: "onMenuNodeToSubgraph",
      value: function onMenuNodeToSubgraph(value, options, e, menu, node) {
        var graph = node.graph;
        var graphcanvas = LGraphCanvas.active_canvas;
        if (!graphcanvas) return;
        var nodesList = Object.values(graphcanvas.selected_nodes || {});
        if (!nodesList.length) nodesList = [node];
        var subgraphNode = LGraphNode.createNode("graph/subgraph");
        subgraphNode.pos = node.pos.concat();
        graph.add(subgraphNode);
        subgraphNode.buildFromNodes(nodesList);
        graphcanvas.deselectAllNodes();
        node.setDirtyCanvas(true, true);
      }
    }, {
      key: "onMenuNodeClone",
      value: function onMenuNodeClone(value, options, e, menu, node) {
        if (node.clonable === false) return;
        var newnode = node.clone();
        if (!newnode) return;
        newnode.pos = [node.pos[0] + 5, node.pos[1] + 5];
        node.graph.beforeChange();
        node.graph.add(newnode);
        node.graph.afterChange();
        node.setDirtyCanvas(true, true);
      }
    }]);

    return LGraphCanvas;
  }();

  _defineProperty(LGraphCanvas, "DEFAULT_BACKGROUND_IMAGE", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQBJREFUeNrs1rEKwjAUhlETUkj3vP9rdmr1Ysammk2w5wdxuLgcMHyptfawuZX4pJSWZTnfnu/lnIe/jNNxHHGNn//HNbbv+4dr6V+11uF527arU7+u63qfa/bnmh8sWLBgwYJlqRf8MEptXPBXJXa37BSl3ixYsGDBMliwFLyCV/DeLIMFCxYsWLBMwSt4Be/NggXLYMGCBUvBK3iNruC9WbBgwYJlsGApeAWv4L1ZBgsWLFiwYJmCV/AK3psFC5bBggULloJX8BpdwXuzYMGCBctgwVLwCl7Be7MMFixYsGDBsu8FH1FaSmExVfAxBa/gvVmwYMGCZbBg/W4vAQYA5tRF9QYlv/QAAAAASUVORK5CYII=");

  _defineProperty(LGraphCanvas, "link_type_colors", {
    "-1": defaultConfig.EVENT_LINK_COLOR,
    number: "#AAA",
    node: "#DCA"
  });

  _defineProperty(LGraphCanvas, "gradients", {});

  _defineProperty(LGraphCanvas, "search_limit", -1);

  _defineProperty(LGraphCanvas, "onMenuNodeMode", function (value, options, e, menu, node) {
    new ContextMenu(["Always", "On Event", "On Trigger", "Never"], {
      event: e,
      callback: function callback(v) {
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
      node: node
    });
    return false;
  });

  _defineProperty(LGraphCanvas, "node_colors", {
    red: {
      color: "#322",
      bgcolor: "#533",
      groupcolor: "#A88"
    },
    brown: {
      color: "#332922",
      bgcolor: "#593930",
      groupcolor: "#b06634"
    },
    green: {
      color: "#232",
      bgcolor: "#353",
      groupcolor: "#8A8"
    },
    blue: {
      color: "#223",
      bgcolor: "#335",
      groupcolor: "#88A"
    },
    pale_blue: {
      color: "#2a363b",
      bgcolor: "#3f5159",
      groupcolor: "#3f789e"
    },
    cyan: {
      color: "#233",
      bgcolor: "#355",
      groupcolor: "#8AA"
    },
    purple: {
      color: "#323",
      bgcolor: "#535",
      groupcolor: "#a1309b"
    },
    yellow: {
      color: "#432",
      bgcolor: "#653",
      groupcolor: "#b58b2a"
    },
    black: {
      color: "#222",
      bgcolor: "#000",
      groupcolor: "#444"
    }
  });

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

  var LGraph = /*#__PURE__*/function () {
    function LGraph(o) {
      _classCallCheck(this, LGraph);

      _defineProperty(this, "STATUS_STOPPED", 1);

      _defineProperty(this, "STATUS_RUNNING", 2);

      _defineProperty(this, "supportedTypes", ["number", "string", "boolean"]);

      if (defaultConfig.debug) {
        console.log("Graph created");
      }

      this.list_of_graphcanvas = null;
      this.clear();

      if (o) {
        this.configure(o);
      }
    }

    _createClass(LGraph, [{
      key: "getSupportedTypes",
      value: function getSupportedTypes() {
        return this.supportedTypes || LGraph.supportedTypes;
      }
    }, {
      key: "clear",
      value: // used to know which types of connections support this graph (some graphs do not allow certain
      // types)

      /**
       * Removes all nodes from this graph
       * @method clear
       * @memberOf LGraph
       */
      function clear() {
        this.stop();
        this.status = this.STATUS_STOPPED;
        this.last_node_id = 0;
        this.last_link_id = 0;
        this._version = -1; // used to detect changes
        // safe clear

        if (this._nodes) {
          var _iterator = _createForOfIteratorHelper(this._nodes),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var node = _step.value;
              if (node.onRemoved) node.onRemoved();
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        } // nodes


        this._nodes = [];
        this._nodes_by_id = {};
        this._nodes_in_order = []; // nodes sorted in execution order

        this._nodes_executable = null; // nodes that contain onExecute sorted in execution order
        // other scene stuff

        this._groups = []; // links

        this.links = {}; // container with all the links
        // iterations

        this.iteration = 0; // custom data

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
        this.catch_errors = true; // subgraph_data

        this.inputs = {};
        this.outputs = {}; // notify canvas to redraw

        this.change();
        this.sendActionToCanvas("clear");
      }
      /**
       * Attach Canvas to this graph
       * @method attachCanvas
       * @param {GraphCanvas} graphcanvas
       * @memberOf LGraph
       */

    }, {
      key: "attachCanvas",
      value: function attachCanvas(graphcanvas) {
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

    }, {
      key: "detachCanvas",
      value: function detachCanvas(graphcanvas) {
        if (!this.list_of_graphcanvas) {
          return;
        }

        var pos = this.list_of_graphcanvas.indexOf(graphcanvas);

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

    }, {
      key: "start",
      value: function start(interval) {
        if (this.status === LGraph.STATUS_RUNNING) {
          return;
        }

        this.status = LGraph.STATUS_RUNNING;

        if (this.onPlayEvent) {
          this.onPlayEvent();
        }

        this.sendEventToAllNodes("onStart"); // launch

        this.starttime = getTime();
        this.last_update_time = this.starttime;
        interval = interval || 0;
        var that = this; // execute once per frame

        if (interval === 0 && typeof window !== "undefined" && window.requestAnimationFrame) {
          // eslint-disable-next-line no-inner-declarations
          var onFrame = function onFrame() {
            if (that.execution_timer_id !== -1) {
              return;
            }

            window.requestAnimationFrame(onFrame);
            if (that.onBeforeStep) that.onBeforeStep();
            that.runStep(1, !that.catch_errors);
            if (that.onAfterStep) that.onAfterStep();
          };

          this.execution_timer_id = -1;
          onFrame();
        } else {
          // execute every 'interval' ms
          this.execution_timer_id = setInterval(function () {
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

    }, {
      key: "stop",
      value: function stop() {
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

    }, {
      key: "runStep",
      value: function runStep(num, doNotCatchError, limit) {
        num = num || 1;
        var start = getTime();
        this.globaltime = 0.001 * (start - this.starttime);
        var nodes = this._nodes_executable ? this._nodes_executable : this._nodes;

        if (!nodes) {
          return;
        }

        limit = limit || nodes.length;

        if (doNotCatchError) {
          // iterations
          for (var i = 0; i < num; i++) {
            for (var j = 0; j < limit; j++) {
              var node = nodes[j];

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
            for (var _i = 0; _i < num; _i++) {
              for (var _j = 0; _j < limit; ++_j) {
                var _node = nodes[_j];

                if (_node.mode === defaultConfig.ALWAYS && _node.onExecute) {
                  _node.onExecute();
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
              console.log("Error during execution: ".concat(err));
            }

            this.stop();
          }
        }

        var now = getTime();
        var elapsed = now - start;

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

    }, {
      key: "updateExecutionOrder",
      value: function updateExecutionOrder() {
        this._nodes_in_order = this.computeExecutionOrder(false);
        this._nodes_executable = [];

        var _iterator2 = _createForOfIteratorHelper(this._nodes_in_order),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var node = _step2.value;

            if (node.onExecute) {
              this._nodes_executable.push(node);
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
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

    }, {
      key: "computeExecutionOrder",
      value: function computeExecutionOrder(onlyOnExecute, setLevel) {
        var L = [];
        var S = [];
        var M = {};
        var visitedLinks = {}; // to avoid repeating links

        var remainingLinks = {}; // to a
        // search for the nodes without inputs (starting nodes)

        var _iterator3 = _createForOfIteratorHelper(this._nodes),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var _node2 = _step3.value;

            if (onlyOnExecute && !_node2.onExecute) {
              continue;
            }

            M[_node2.id] = _node2; // add to pending nodes

            var num = 0; // num of input connections

            if (_node2.inputs) {
              for (var j = 0, l2 = _node2.inputs.length; j < l2; j++) {
                if (_node2.inputs[j] && _node2.inputs[j].link != null) {
                  num += 1;
                }
              }
            }

            if (num === 0) {
              // is a starting node
              S.push(_node2);

              if (setLevel) {
                _node2._level = 1;
              }
            } else {
              if (setLevel) {
                _node2._level = 0;
              }

              remainingLinks[_node2.id] = num;
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        while (true) {
          if (S.length === 0) {
            break;
          } // get an starting node


          var node = S.shift();
          L.push(node); // add to ordered list

          delete M[node.id]; // remove from the pending nodes

          if (!node.outputs) {
            continue;
          } // for every output


          var _iterator4 = _createForOfIteratorHelper(node.outputs),
              _step4;

          try {
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              var output = _step4.value;

              if (output == null || output.links == null || output.links.length === 0) {
                continue;
              } // for every connection


              var _iterator5 = _createForOfIteratorHelper(output.links),
                  _step5;

              try {
                for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                  var linkId = _step5.value;
                  var link = this.links[linkId];

                  if (!link) {
                    continue;
                  } // already visited link (ignore it)


                  if (visitedLinks[link.id]) {
                    continue;
                  }

                  var targetNode = this.getNodeById(link.target_id);

                  if (targetNode == null) {
                    visitedLinks[link.id] = true;
                    continue;
                  }

                  if (setLevel && (!targetNode._level || targetNode._level <= node._level)) {
                    targetNode._level = node._level + 1;
                  }

                  visitedLinks[link.id] = true; // mark as visited

                  remainingLinks[targetNode.id] -= 1; // reduce the number of links remaining

                  if (remainingLinks[targetNode.id] === 0) {
                    S.push(targetNode);
                  } // if no more links, then add to starters array

                }
              } catch (err) {
                _iterator5.e(err);
              } finally {
                _iterator5.f();
              }
            }
          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }
        } // the remaining ones (loops)
        // eslint-disable-next-line guard-for-in,no-restricted-syntax


        for (var i in M) {
          L.push(M[i]);
        }

        if (L.length !== this._nodes.length && defaultConfig.debug) {
          console.warn("something went wrong, nodes missing");
        }

        var l = L.length; // save order number in the node

        for (var _i2 = 0; _i2 < l; _i2++) {
          L[_i2].order = _i2;
        } // sort now by priority


        L = L.sort(function (A, B) {
          var Ap = A.constructor.priority || A.priority || 0;
          var Bp = B.constructor.priority || B.priority || 0;

          if (Ap === Bp) {
            // if same priority, sort by order
            return A.order - B.order;
          }

          return Ap - Bp; // sort by priority
        }); // save order number in the node, again...

        for (var _i3 = 0; _i3 < l; ++_i3) {
          L[_i3].order = _i3;
        }

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

    }, {
      key: "getAncestors",
      value: function getAncestors(node) {
        var ancestors = [];
        var pending = [node];
        var visited = {};

        while (pending.length) {
          var current = pending.shift();

          if (!current.inputs) {
            continue;
          }

          if (!visited[current.id] && current !== node) {
            visited[current.id] = true;
            ancestors.push(current);
          }

          for (var i = 0; i < current.inputs.length; ++i) {
            var input = current.getInputNode(i);

            if (input && ancestors.indexOf(input) === -1) {
              pending.push(input);
            }
          }
        }

        ancestors.sort(function (a, b) {
          return a.order - b.order;
        });
        return ancestors;
      }
      /**
       * Positions every node in a more readable manner
       * @method arrange
       * @memberOf LGraph
       */

    }, {
      key: "arrange",
      value: function arrange(margin) {
        margin = margin || 100;
        var nodes = this.computeExecutionOrder(false, true);
        var columns = [];

        var _iterator6 = _createForOfIteratorHelper(nodes),
            _step6;

        try {
          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            var _node3 = _step6.value;
            var col = _node3._level || 1;

            if (!columns[col]) {
              columns[col] = [];
            }

            columns[col].push(_node3);
          }
        } catch (err) {
          _iterator6.e(err);
        } finally {
          _iterator6.f();
        }

        var x = margin;

        for (var _i4 = 0, _columns = columns; _i4 < _columns.length; _i4++) {
          var column = _columns[_i4];

          if (!column) {
            continue;
          }

          var maxSize = 100;
          var y = margin + defaultConfig.NODE_TITLE_HEIGHT;

          var _iterator7 = _createForOfIteratorHelper(column),
              _step7;

          try {
            for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
              var node = _step7.value;
              node.pos[0] = x;
              node.pos[1] = y;
              if (node.size[0] > maxSize) maxSize = node.size[0];
              y += node.size[1] + margin + defaultConfig.NODE_TITLE_HEIGHT;
            }
          } catch (err) {
            _iterator7.e(err);
          } finally {
            _iterator7.f();
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

    }, {
      key: "getTime",
      value: function getTime() {
        return this.globaltime;
      }
      /**
       * Returns the amount of time accumulated using the fixedtime_lapse var. This is used in
       * context where the time increments should be constant
       * @method getFixedTime
       * @return {number} number of milliseconds the graph has been running
       * @memberOf LGraph
       */

    }, {
      key: "getFixedTime",
      value: function getFixedTime() {
        return this.fixedtime;
      }
      /**
       * Returns the amount of time it took to compute the latest iteration. Take into account that
       * this number could be not correct if the nodes are using graphical actions
       * @method getElapsedTime
       * @return {number} number of milliseconds it took the last cycle
       * @memberOf LGraph
       */

    }, {
      key: "getElapsedTime",
      value: function getElapsedTime() {
        return this.elapsed_time;
      }
      /**
       * Sends an event to all the nodes, useful to trigger stuff
       * @method sendEventToAllNodes
       * @param {String} eventname the name of the event (function to be called)
       * @param {Array} params parameters in array format
       * @memberOf LGraph
       */

    }, {
      key: "sendEventToAllNodes",
      value: function sendEventToAllNodes(eventname, params, mode) {
        mode = mode || defaultConfig.ALWAYS;
        var nodes = this._nodes_in_order ? this._nodes_in_order : this._nodes;

        if (!nodes) {
          return;
        }

        for (var j = 0, l = nodes.length; j < l; ++j) {
          var node = nodes[j];

          if (node.constructor.name === "Subgraph" && eventname !== "onExecute") {
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
            node[eventname].apply(node, _toConsumableArray(params));
          } else {
            node[eventname](params);
          }
        }
      }
    }, {
      key: "sendActionToCanvas",
      value: function sendActionToCanvas(action) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        if (!this.list_of_graphcanvas) {
          return;
        }

        var _iterator8 = _createForOfIteratorHelper(this.list_of_graphcanvas),
            _step8;

        try {
          for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
            var c = _step8.value;

            if (c[action]) {
              c[action].apply(c, _toConsumableArray(params));
            }
          }
        } catch (err) {
          _iterator8.e(err);
        } finally {
          _iterator8.f();
        }
      }
      /**
       * Adds a new node instance to this graph
       * @method add
       * @param {LGraphNode} node the instance of the node
       * @param {boolean} skipComputeOrder
       * @memberOf LGraph
       */

    }, {
      key: "add",
      value: function add(node, skipComputeOrder) {
        if (!node) {
          return;
        } // groups


        if (node.constructor === LGraphGroup) {
          this._groups.push(node);

          this.setDirtyCanvas(true);
          this.change();
          node.graph = this;
          this._version++;
          return;
        } // nodes


        if (node.id !== -1 && this._nodes_by_id[node.id]) {
          console.warn("LiteGraph: there is already a node with this ID, changing it");
          node.id = ++this.last_node_id;
        }

        if (this._nodes.length >= defaultConfig.MAX_NUMBER_OF_NODES) {
          throw new Error("LiteGraph: max number of nodes in a graph reached");
        } // give him an id


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

    }, {
      key: "remove",
      value: function remove(node) {
        if (node.constructor.name === "LGraphGroup") {
          var index = this._groups.indexOf(node);

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
          for (var i = 0; i < node.inputs.length; i++) {
            var slot = node.inputs[i];

            if (slot.link != null) {
              node.disconnectInput(i);
            }
          }
        } // disconnect outputs


        if (node.outputs) {
          for (var _i5 = 0; _i5 < node.outputs.length; _i5++) {
            var _slot = node.outputs[_i5];

            if (_slot.links != null && _slot.links.length) {
              node.disconnectOutput(_i5);
            }
          }
        } // node.id = -1; //why?
        // callback


        if (node.onRemoved) {
          node.onRemoved();
        }

        node.graph = null;
        this._version++; // remove from canvas render

        if (this.list_of_graphcanvas) {
          var _iterator9 = _createForOfIteratorHelper(this.list_of_graphcanvas),
              _step9;

          try {
            for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
              var canvas = _step9.value;

              if (canvas.selected_nodes[node.id]) {
                delete canvas.selected_nodes[node.id];
              }

              if (canvas.node_dragged === node) {
                canvas.node_dragged = null;
              }
            }
          } catch (err) {
            _iterator9.e(err);
          } finally {
            _iterator9.f();
          }
        } // remove from containers


        if (this._nodes.includes(node)) {
          this._nodes = this._nodes.filter(function (n) {
            return n !== node;
          });
        }

        delete this._nodes_by_id[node.id];

        if (this.onNodeRemoved) {
          this.onNodeRemoved(node);
        } // close panels


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

    }, {
      key: "getNodeById",
      value: function getNodeById(id) {
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

    }, {
      key: "findNodesByClass",
      value: function findNodesByClass(classObject) {
        var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        result.length = 0;

        var _iterator10 = _createForOfIteratorHelper(this._nodes),
            _step10;

        try {
          for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
            var node = _step10.value;
            if (node.constructor === classObject) result.push(node);
          }
        } catch (err) {
          _iterator10.e(err);
        } finally {
          _iterator10.f();
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

    }, {
      key: "findNodesByType",
      value: function findNodesByType(type) {
        var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        type = type.toLowerCase();
        result = result || [];
        result.length = 0;

        var _iterator11 = _createForOfIteratorHelper(this._nodes),
            _step11;

        try {
          for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
            var node = _step11.value;
            if (node.type.toLowerCase() === type) result.push(node);
          }
        } catch (err) {
          _iterator11.e(err);
        } finally {
          _iterator11.f();
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

    }, {
      key: "findNodeByTitle",
      value: function findNodeByTitle(title) {
        var _iterator12 = _createForOfIteratorHelper(this._nodes),
            _step12;

        try {
          for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
            var node = _step12.value;
            if (node.title === title) return node;
          }
        } catch (err) {
          _iterator12.e(err);
        } finally {
          _iterator12.f();
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

    }, {
      key: "findNodesByTitle",
      value: function findNodesByTitle(title) {
        var result = [];

        var _iterator13 = _createForOfIteratorHelper(this._nodes),
            _step13;

        try {
          for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
            var node = _step13.value;
            if (node.title === title) result.push(node);
          }
        } catch (err) {
          _iterator13.e(err);
        } finally {
          _iterator13.f();
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

    }, {
      key: "getNodeOnPos",
      value: function getNodeOnPos(x, y) {
        var nodesList = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this._nodes;
        var margin = arguments.length > 3 ? arguments[3] : undefined;

        var _iterator14 = _createForOfIteratorHelper(nodesList),
            _step14;

        try {
          for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
            var n = _step14.value;
            if (n.isPointInside(x, y, margin)) return n;
          }
        } catch (err) {
          _iterator14.e(err);
        } finally {
          _iterator14.f();
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

    }, {
      key: "getGroupOnPos",
      value: function getGroupOnPos(x, y) {
        var _iterator15 = _createForOfIteratorHelper(this._groups),
            _step15;

        try {
          for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
            var g = _step15.value;
            if (g.isPointInside(x, y, 2, true)) return g;
          }
        } catch (err) {
          _iterator15.e(err);
        } finally {
          _iterator15.f();
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

    }, {
      key: "checkNodeTypes",
      value: function checkNodeTypes() {
        var _iterator16 = _createForOfIteratorHelper(this._nodes),
            _step16;

        try {
          for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
            var node = _step16.value;
            var ctor = defaultConfig.registered_node_types[node.type];

            if (node.constructor === ctor) {
              continue;
            }

            console.log("node being replaced by newer version: ".concat(node.type));
            var newnode = LGraphNode.createNode(node.type);
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
        } catch (err) {
          _iterator16.e(err);
        } finally {
          _iterator16.f();
        }

        this.updateExecutionOrder();
      }
    }, {
      key: "onAction",
      value: function onAction(action, param) {
        this._input_nodes = this.findNodesByClass(LiteGraph.GraphInput, this._input_nodes);

        var _iterator17 = _createForOfIteratorHelper(this._input_nodes),
            _step17;

        try {
          for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
            var node = _step17.value;

            if (node.properties.name !== action) {
              continue;
            }

            node.onAction(action, param);
            break;
          }
        } catch (err) {
          _iterator17.e(err);
        } finally {
          _iterator17.f();
        }
      }
    }, {
      key: "trigger",
      value: function trigger(action, param) {
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

    }, {
      key: "addInput",
      value: function addInput(name, type, value) {
        var input = this.inputs[name];

        if (input) {
          // already exist
          return;
        }

        this.beforeChange();
        this.inputs[name] = {
          name: name,
          type: type,
          value: value
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

    }, {
      key: "setInputData",
      value: function setInputData(name, data) {
        var input = this.inputs[name];

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

    }, {
      key: "getInputData",
      value: function getInputData(name) {
        var input = this.inputs[name];

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

    }, {
      key: "renameInput",
      value: function renameInput(oldName, newName) {
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

    }, {
      key: "changeInputType",
      value: function changeInputType(name, type) {
        if (!this.inputs[name]) {
          return false;
        }

        if (this.inputs[name].type && String(this.inputs[name].type).toLowerCase() === String(type).toLowerCase()) {
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

    }, {
      key: "removeInput",
      value: function removeInput(name) {
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

    }, {
      key: "addOutput",
      value: function addOutput(name, type, value) {
        this.outputs[name] = {
          name: name,
          type: type,
          value: value
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

    }, {
      key: "setOutputData",
      value: function setOutputData(name, value) {
        var output = this.outputs[name];

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

    }, {
      key: "getOutputData",
      value: function getOutputData(name) {
        var output = this.outputs[name];

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

    }, {
      key: "renameOutput",
      value: function renameOutput(oldName, newName) {
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

    }, {
      key: "changeOutputType",
      value: function changeOutputType(name, type) {
        if (!this.outputs[name]) {
          return false;
        }

        if (this.outputs[name].type && String(this.outputs[name].type).toLowerCase() === String(type).toLowerCase()) {
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

    }, {
      key: "removeOutput",
      value: function removeOutput(name) {
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
    }, {
      key: "triggerInput",
      value: function triggerInput(name, value) {
        var nodes = this.findNodesByTitle(name);

        for (var i = 0; i < nodes.length; ++i) {
          nodes[i].onTrigger(value);
        }
      }
    }, {
      key: "setCallback",
      value: function setCallback(name, func) {
        var nodes = this.findNodesByTitle(name);

        for (var i = 0; i < nodes.length; ++i) {
          nodes[i].setTrigger(func);
        }
      } // used for undo, called before any change is made to the graph

    }, {
      key: "beforeChange",
      value: function beforeChange(info) {
        if (this.onBeforeChange) {
          this.onBeforeChange(this, info);
        }

        this.sendActionToCanvas("onBeforeChange", this);
      } // used to resend actions, called after any change is made to the graph

    }, {
      key: "afterChange",
      value: function afterChange(info) {
        if (this.onAfterChange) {
          this.onAfterChange(this, info);
        }

        this.sendActionToCanvas("onAfterChange", this);
      }
    }, {
      key: "connectionChange",
      value: function connectionChange(node) {
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

    }, {
      key: "isLive",
      value: function isLive() {
        if (!this.list_of_graphcanvas) {
          return false;
        }

        for (var i = 0; i < this.list_of_graphcanvas.length; ++i) {
          var c = this.list_of_graphcanvas[i];

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

    }, {
      key: "clearTriggeredSlots",
      value: function clearTriggeredSlots() {
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (var i in this.links) {
          var linkInfo = this.links[i];

          if (!linkInfo) {
            continue;
          }

          if (linkInfo._last_time) {
            linkInfo._last_time = 0;
          }
        }
      }
      /* Called when something visually changed (not the graph!) */

    }, {
      key: "change",
      value: function change() {
        if (defaultConfig.debug) {
          console.log("Graph changed");
        }

        this.sendActionToCanvas("setDirty", [true, true]);
        if (this.on_change) this.on_change(this);
      }
    }, {
      key: "setDirtyCanvas",
      value: function setDirtyCanvas(fg, bg) {
        this.sendActionToCanvas("setDirty", [fg, bg]);
      }
      /**
       * Destroys a link
       * @method removeLink
       * @param {Number} linkId
       * @memberOf LGraph
       */

    }, {
      key: "removeLink",
      value: function removeLink(linkId) {
        var link = this.links[linkId];

        if (!link) {
          return;
        }

        var node = this.getNodeById(link.target_id);

        if (node) {
          node.disconnectInput(link.target_slot);
        }
      } // save and recover app state ***************************************

      /**
       * Creates a Object containing all the info about this graph, it can be serialized
       * @method serialize
       * @return {Object} value of the node
       * @memberOf LGraph
       */

    }, {
      key: "serialize",
      value: function serialize() {
        var nodesInfo = [];

        var _iterator18 = _createForOfIteratorHelper(this._nodes),
            _step18;

        try {
          for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
            var node = _step18.value;
            nodesInfo.push(node.serialize());
          } // pack link info into a non-verbose format

        } catch (err) {
          _iterator18.e(err);
        } finally {
          _iterator18.f();
        }

        var links = []; // eslint-disable-next-line guard-for-in,no-restricted-syntax

        for (var i in this.links) {
          // links is an OBJECT
          var link = this.links[i];

          if (!link.serialize) {
            // weird bug I havent solved yet
            console.warn("weird LLink bug, link info is not a LLink but a regular object");
            var link2 = new LLink(); // eslint-disable-next-line guard-for-in,no-restricted-syntax

            for (var j in link) {
              link2[j] = link[j];
            }

            this.links[i] = link2;
            link = link2;
          }

          links.push(link.serialize());
        }

        var groupsInfo = [];

        var _iterator19 = _createForOfIteratorHelper(this._groups),
            _step19;

        try {
          for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {
            var group = _step19.value;
            groupsInfo.push(group.serialize());
          }
        } catch (err) {
          _iterator19.e(err);
        } finally {
          _iterator19.f();
        }

        var data = {
          last_node_id: this.last_node_id,
          last_link_id: this.last_link_id,
          nodes: nodesInfo,
          links: links,
          groups: groupsInfo,
          config: this.config,
          extra: this.extra,
          version: defaultConfig.VERSION
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

    }, {
      key: "configure",
      value: function configure(data, keepOld) {
        if (!data) {
          return;
        }

        if (!keepOld) this.clear();
        var nodes = data.nodes; // decode links info (they are very verbose)

        if (data.links && data.links.constructor === Array) {
          var links = [];

          var _iterator20 = _createForOfIteratorHelper(data.links),
              _step20;

          try {
            for (_iterator20.s(); !(_step20 = _iterator20.n()).done;) {
              var linkData = _step20.value;

              if (!linkData) {
                console.warn("serialized graph link data contains errors, skipping.");
                continue;
              }

              var link = new LLink();
              link.configure(linkData);
              links[link.id] = link;
            }
          } catch (err) {
            _iterator20.e(err);
          } finally {
            _iterator20.f();
          }

          data.links = links;
        } // copy all stored fields
        // eslint-disable-next-line guard-for-in,no-restricted-syntax


        for (var i in data) {
          if (i === "nodes" || i === "groups") {
            continue;
          }

          this[i] = data[i];
        }

        var error = false; // create nodes

        this._nodes = [];

        if (nodes) {
          var _iterator21 = _createForOfIteratorHelper(nodes),
              _step21;

          try {
            for (_iterator21.s(); !(_step21 = _iterator21.n()).done;) {
              var nInfo = _step21.value;
              var node = LGraphNode.createNode(nInfo.type, nInfo.title);

              if (!node) {
                if (defaultConfig.debug) {
                  console.log("Node not found or has errors: ".concat(nInfo.type));
                } // in case of error we create a replacement node to avoid losing info


                node = new LGraphNode();
                node.last_serialization = nInfo;
                node.has_errors = true;
                error = true; // continue;
              }

              node.id = nInfo.id; // id it or it will create a new id

              this.add(node, true); // add before configure, otherwise configure cannot create
              // links
            } // configure nodes afterwards so they can reach each other

          } catch (err) {
            _iterator21.e(err);
          } finally {
            _iterator21.f();
          }

          var _iterator22 = _createForOfIteratorHelper(nodes),
              _step22;

          try {
            for (_iterator22.s(); !(_step22 = _iterator22.n()).done;) {
              var _nInfo = _step22.value;

              var _node4 = this.getNodeById(_nInfo.id);

              if (_node4) {
                _node4.configure(_nInfo);
              }
            }
          } catch (err) {
            _iterator22.e(err);
          } finally {
            _iterator22.f();
          }
        } // groups


        this._groups.length = 0;

        if (data.groups) {
          var _iterator23 = _createForOfIteratorHelper(data.groups),
              _step23;

          try {
            for (_iterator23.s(); !(_step23 = _iterator23.n()).done;) {
              var dataGroup = _step23.value;
              var group = new LGraphGroup();
              group.configure(dataGroup);
              this.add(group);
            }
          } catch (err) {
            _iterator23.e(err);
          } finally {
            _iterator23.f();
          }
        }

        this.updateExecutionOrder();
        this.extra = data.extra || {};
        if (this.onConfigure) this.onConfigure(data);
        this._version++;
        this.setDirtyCanvas(true, true);
        return error;
      }
    }, {
      key: "load",
      value: function load(url, callback) {
        var that = this; // from file

        if (url.constructor === File || url.constructor === Blob) {
          var reader = new FileReader();
          reader.addEventListener("load", function (event) {
            var data = JSON.parse(event.target.result);
            that.configure(data);
            if (callback) callback();
          });
          reader.readAsText(url);
          return;
        } // is a string, then an URL


        var req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.send(null);
        req.onload(function () {
          if (req.status !== 200) {
            console.error("Error loading graph:", req.status, req.response);
            return;
          }

          var data = JSON.parse(req.response);
          that.configure(data);
          if (callback) callback();
        });
        req.onerror(function (err) {
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

    }, {
      key: "onNodeTrace",
      value: function onNodeTrace(node, msg, color) {// TODO
      }
    }]);

    return LGraph;
  }();

  _defineProperty(LGraph, "supportedTypes", ["number", "string", "boolean"]);

  /**
   * @class CurveEditor
   * @param points
   */
  var CurveEditor = /*#__PURE__*/function () {
    function CurveEditor(points) {
      _classCallCheck(this, CurveEditor);

      this.points = points;
      this.selected = -1;
      this.nearest = -1;
      this.size = null; // stores last size used

      this.must_update = true;
      this.margin = 5;
    }

    _createClass(CurveEditor, [{
      key: "sampleCurve",
      value: function sampleCurve(f, points) {
        if (!points) return;

        for (var i = 0; i < points.length - 1; ++i) {
          var p = points[i];
          var pn = points[i + 1];
          if (pn[0] < f) continue;
          var r = pn[0] - p[0];
          if (Math.abs(r) < 0.00001) return p[1];
          var localF = (f - p[0]) / r;
          return p[1] * (1.0 - localF) + pn[1] * localF;
        }

        return 0;
      }
    }, {
      key: "draw",
      value: function draw(ctx, size, graphcanvas, backgroundColor) {
        var lineColor = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "#666";
        var inactive = arguments.length > 5 ? arguments[5] : undefined;
        var points = this.points;
        if (!points) return;
        this.size = size;
        var w = size[0] - this.margin * 2;
        var h = size[1] - this.margin * 2;
        ctx.save();
        ctx.translate(this.margin, this.margin);

        if (backgroundColor) {
          ctx.fillStyle = "#111";
          ctx.fillRect(0, 0, w, h);
          ctx.fillStyle = "#222";
          ctx.fillRect(w * 0.5, 0, 1, h);
          ctx.strokeStyle = "#333";
          ctx.strokeRect(0, 0, w, h);
        }

        ctx.strokeStyle = lineColor;
        if (inactive) ctx.globalAlpha = 0.5;
        ctx.beginPath();

        var _iterator = _createForOfIteratorHelper(points),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var point = _step.value;
            ctx.lineTo(point[0] * w, (1.0 - point[1]) * h);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        ctx.stroke();
        ctx.globalAlpha = 1;

        if (!inactive) {
          for (var i = 0; i < points.length; ++i) {
            var p = points[i];
            if (this.selected === i) ctx.fillStyle = "#FFF";else if (this.nearest === i) ctx.fillStyle = "#DDD";else ctx.fillStyle = "#AAA";
            ctx.beginPath();
            ctx.arc(p[0] * w, (1.0 - p[1]) * h, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.restore();
      }
    }, {
      key: "onMouseDown",
      value: function onMouseDown(localpos, graphcanvas) {
        var points = this.points;
        if (!points) return;
        if (localpos[1] < 0) return; // this.captureInput(true);

        var w = this.size[0] - this.margin * 2;
        var h = this.size[1] - this.margin * 2;
        var x = localpos[0] - this.margin;
        var y = localpos[1] - this.margin;
        var pos = [x, y];
        var maxDist = 30 / graphcanvas.ds.scale; // search closer one

        this.selected = this.getCloserPoint(pos, maxDist); // create one

        if (this.selected === -1) {
          var point = [x / w, 1 - y / h];
          points.push(point);
          points.sort(function (a, b) {
            return a[0] - b[0];
          });
          this.selected = points.indexOf(point);
          this.must_update = true;
        }

        if (this.selected !== -1) return true;
      }
    }, {
      key: "onMouseMove",
      value: function onMouseMove(localpos, graphcanvas) {
        var points = this.points;
        if (!points) return;
        var s = this.selected;
        if (s < 0) return;
        var x = (localpos[0] - this.margin) / (this.size[0] - this.margin * 2);
        var y = (localpos[1] - this.margin) / (this.size[1] - this.margin * 2);
        var curvepos = [localpos[0] - this.margin, localpos[1] - this.margin];
        var maxDist = 30 / graphcanvas.ds.scale;
        this._nearest = this.getCloserPoint(curvepos, maxDist);
        var point = points[s];

        if (point) {
          var isEdgePoint = s === 0 || s === points.length - 1;

          if (!isEdgePoint && (localpos[0] < -10 || localpos[0] > this.size[0] + 10 || localpos[1] < -10 || localpos[1] > this.size[1] + 10)) {
            points.splice(s, 1);
            this.selected = -1;
            return;
          }

          if (!isEdgePoint) {
            point[0] = Math.clamp(x, 0, 1);
          } else {
            point[0] = s === 0 ? 0 : 1;
          }

          point[1] = 1.0 - Math.clamp(y, 0, 1);
          points.sort(function (a, b) {
            return a[0] - b[0];
          });
          this.selected = points.indexOf(point);
          this.must_update = true;
        }
      }
    }, {
      key: "onMouseUp",
      value: function onMouseUp() {
        this.selected = -1;
        return false;
      }
    }, {
      key: "getCloserPoint",
      value: function getCloserPoint(pos) {
        var maxDist = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 30;
        var points = this.points;
        if (!points) return -1;
        var w = this.size[0] - this.margin * 2;
        var h = this.size[1] - this.margin * 2;
        var num = points.length;
        var p2 = [0, 0];
        var minDist = 1000000;
        var closest = -1;

        for (var i = 0; i < num; ++i) {
          var p = points[i];
          p2[0] = p[0] * w;
          p2[1] = (1.0 - p[1]) * h; // eslint-disable-next-line no-unused-vars

          if (p2[0] < pos[0]) ;
          var dist = vec2.distance(pos, p2);
          if (dist > minDist || dist > maxDist) continue;
          closest = i;
          minDist = dist;
        }

        return closest;
      }
    }]);

    return CurveEditor;
  }();

  /**
   * @class Editor
   * @param containerId
   * @param options
   */

  var Editor = /*#__PURE__*/function () {
    function Editor(containerId, options) {
      _classCallCheck(this, Editor);

      options = options || {}; // fill container

      var html = "<div class='content'><div class='editor-area'><canvas class='graphcanvas' width='1000' height='500' tabindex=10></canvas></div></div>";
      var root = document.createElement("div");
      this.root = root;
      root.className = "litegraph litegraph-editor";
      root.innerHTML = html;
      this.content = root.querySelector(".content");
      this.footer = root.querySelector(".footer");
      var canvas = root.querySelector(".graphcanvas"); // create graph

      var graph = this.graph = new LGraph();
      var graphcanvas = this.graphcanvas = new LGraphCanvas(canvas, graph);
      graphcanvas.background_image = "imgs/grid.png";

      graph.onAfterExecute = function () {
        graphcanvas.draw(true);
      };

      graphcanvas.onDropItem = this.onDropItem.bind(this);

      if (options.miniwindow) {
        this.addMiniWindow(300, 200);
      } // append to DOM


      var parent = document.getElementById(containerId);

      if (parent) {
        parent.appendChild(root);
      }

      graphcanvas.resize(); // graphcanvas.draw(true,true);
    }

    _createClass(Editor, [{
      key: "onDropItem",
      value: function onDropItem(e) {
        var _this = this;

        var _iterator = _createForOfIteratorHelper(e.dataTransfer.files),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var file = _step.value;
            var ext = LGraphCanvas.getFileExtension(file.name);
            var reader = new FileReader();

            if (ext === "json") {
              reader.onload = function (event) {
                _this.graph.configure(JSON.parse(event.target.result));
              };

              reader.readAsText(file);
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }, {
      key: "addMiniWindow",
      value: function addMiniWindow(w, h) {
        var miniwindow = document.createElement("div");
        miniwindow.className = "litegraph miniwindow";
        miniwindow.innerHTML = "<canvas class='graphcanvas' width='".concat(w, "' height='").concat(h, "' tabindex=10></canvas>");
        var canvas = miniwindow.querySelector("canvas");
        var that = this;
        var graphcanvas = new LGraphCanvas(canvas, this.graph);
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
          var tl = that.graphcanvas.convertOffsetToCanvas([0, 0]);
          var br = that.graphcanvas.convertOffsetToCanvas([that.graphcanvas.canvas.width, that.graphcanvas.canvas.height]);
          tl = this.convertCanvasToOffset(tl);
          br = this.convertCanvasToOffset(br);
          ctx.lineWidth = 1;
          ctx.strokeRect(Math.floor(tl[0]) + 0.5, Math.floor(tl[1]) + 0.5, Math.floor(br[0] - tl[0]), Math.floor(br[1] - tl[1]));
        };

        miniwindow.style.position = "absolute";
        miniwindow.style.top = "4px";
        miniwindow.style.right = "4px";
        var closeBouton = document.createElement("div");
        closeBouton.className = "corner-button";
        closeBouton.innerHTML = "&#10060;";
        closeBouton.addEventListener("click", function (e) {
          graphcanvas.setGraph(null);
          miniwindow.remove();
        });
        miniwindow.appendChild(closeBouton);
        this.root.querySelector(".content").appendChild(miniwindow);
      }
    }]);

    return Editor;
  }();

  if (typeof CanvasRenderingContext2D !== "undefined") {
    CanvasRenderingContext2D.prototype.roundRect = function roundRect(x, y, width, height) {
      var radius = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 5;
      var radiusLow = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : radius;
      this.moveTo(x + radius, y);
      this.lineTo(x + width - radius, y);
      this.quadraticCurveTo(x + width, y, x + width, y + radius);
      this.lineTo(x + width, y + height - radiusLow);
      this.quadraticCurveTo(x + width, y + height, x + width - radiusLow, y + height);
      this.lineTo(x + radiusLow, y + height);
      this.quadraticCurveTo(x, y + height, x, y + height - radiusLow);
      this.lineTo(x, y + radius);
      this.quadraticCurveTo(x, y, x + radius, y);
    };
  }

  exports.ContextMenu = ContextMenu;
  exports.CurveEditor = CurveEditor;
  exports.DragAndScale = DragAndScale;
  exports.Editor = Editor;
  exports.LGraph = LGraph;
  exports.LGraphCanvas = LGraphCanvas;
  exports.LGraphGroup = LGraphGroup;
  exports.LGraphNode = LGraphNode;
  exports.LLink = LLink$1;
  exports.clamp = clamp;
  exports.clearRegisteredTypes = clearRegisteredTypes;
  exports.defaultConfig = defaultConfig;
  exports.distance = distance;
  exports.getNodeType = getNodeType;
  exports.getNodeTypesCategories = getNodeTypesCategories;
  exports.getNodeTypesInCategory = getNodeTypesInCategory;
  exports.getParameterNames = getParameterNames;
  exports.isInsideRectangle = isInsideRectangle;
  exports.isValidConnection = isValidConnection;
  exports.overlapBounding = overlapBounding$1;
  exports.registerNodeType = registerNodeType;
  exports.registerSearchboxExtra = registerSearchboxExtra;
  exports.unregisterNodeType = unregisterNodeType;
  exports.wrapFunctionAsNode = wrapFunctionAsNode;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=litegraph.js.map
