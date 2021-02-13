import "../css/litegraph.css";
import "../css/litegraph-editor.css";

export { default as LGraph } from "./LGraph";
export { default as LLink } from "./LLink";
export { default as LGraphNode } from "./LGraphNode";
export { default as LGraphGroup } from "./LGraphGroup";
export { default as DragAndScale } from "./DragAndScale";
export { default as CurveEditor } from "./CurveEditor";
export { default as LGraphCanvas } from "./LGraphCanvas";
export { default as ContextMenu } from "./ContextMenu";
export { default as Editor } from "./litegraph-editor";

export { default as defaultConfig } from "./utils/defaultConfig";
export * from "./utils/registry";
export * from "./utils/math";
export * from "./utils/function";

if (typeof CanvasRenderingContext2D !== "undefined") {
    CanvasRenderingContext2D.prototype.roundRect = function roundRect(
        x,
        y,
        width,
        height,
        radius = 5,
        radiusLow = radius,
    ) {
        this.moveTo(x + radius, y);
        this.lineTo(x + width - radius, y);
        this.quadraticCurveTo(x + width, y, x + width, y + radius);

        this.lineTo(x + width, y + height - radiusLow);
        this.quadraticCurveTo(
            x + width,
            y + height,
            x + width - radiusLow,
            y + height,
        );
        this.lineTo(x + radiusLow, y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - radiusLow);
        this.lineTo(x, y + radius);
        this.quadraticCurveTo(x, y, x + radius, y);
    };
}
