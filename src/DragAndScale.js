/**
 * @class DragAndScale
 * @param element
 * @param skipEvents
 */
export default class DragAndScale {
    constructor(element, skipEvents) {
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

    bindEvents(element) {
        this.last_mouse = new Float32Array(2);

        this._binded_mouse_callback = this.onMouse.bind(this);

        element.addEventListener("mousedown", this._binded_mouse_callback);
        element.addEventListener("mousemove", this._binded_mouse_callback);

        element.addEventListener(
            "mousewheel",
            this._binded_mouse_callback,
            false,
        );
        element.addEventListener("wheel", this._binded_mouse_callback, false);
    }

    computeVisibleArea() {
        if (!this.element) {
            // eslint-disable-next-line
            this.visible_area[0] = this.visible_area[1] = this.visible_area[2] = this.visible_area[3] = 0;
            return;
        }
        const { width } = this.element;
        const { height } = this.element;
        const startx = -this.offset[0];
        const starty = -this.offset[1];
        const endx = startx + width / this.scale;
        const endy = starty + height / this.scale;
        this.visible_area[0] = startx;
        this.visible_area[1] = starty;
        this.visible_area[2] = endx - startx;
        this.visible_area[3] = endy - starty;
    }

    onMouse(e) {
        if (!this.enabled) {
            return;
        }

        const canvas = this.element;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        e.canvasx = x;
        e.canvasy = y;
        e.dragging = this.dragging;

        let ignore = false;
        if (this.onmouse) {
            ignore = this.onmouse(e);
        }

        if (e.type === "mousedown") {
            this.dragging = true;
            canvas.removeEventListener(
                "mousemove",
                this._binded_mouse_callback,
            );
            document.body.addEventListener(
                "mousemove",
                this._binded_mouse_callback,
            );
            document.body.addEventListener(
                "mouseup",
                this._binded_mouse_callback,
            );
        } else if (e.type === "mousemove") {
            if (!ignore) {
                const deltax = x - this.last_mouse[0];
                const deltay = y - this.last_mouse[1];
                if (this.dragging) {
                    this.mouseDrag(deltax, deltay);
                }
            }
        } else if (e.type === "mouseup") {
            this.dragging = false;
            document.body.removeEventListener(
                "mousemove",
                this._binded_mouse_callback,
            );
            document.body.removeEventListener(
                "mouseup",
                this._binded_mouse_callback,
            );
            canvas.addEventListener("mousemove", this._binded_mouse_callback);
        } else if (
            e.type === "mousewheel"
            || e.type === "wheel"
            || e.type === "DOMMouseScroll"
        ) {
            e.eventType = "mousewheel";
            if (e.type === "wheel") {
                e.wheel = -e.deltaY;
            } else {
                e.wheel = e.wheelDeltaY != null ? e.wheelDeltaY : e.detail * -60;
            }

            // from stack overflow
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

    toCanvasContext(ctx) {
        ctx.scale(this.scale, this.scale);
        ctx.translate(this.offset[0], this.offset[1]);
    }

    convertOffsetToCanvas(pos) {
        // return [pos[0] / this.scale - this.offset[0], pos[1] / this.scale - this.offset[1]];
        return [
            (pos[0] + this.offset[0]) * this.scale,
            (pos[1] + this.offset[1]) * this.scale,
        ];
    }

    convertCanvasToOffset(pos, out) {
        out = out || [0, 0];
        out[0] = pos[0] / this.scale - this.offset[0];
        out[1] = pos[1] / this.scale - this.offset[1];
        return out;
    }

    mouseDrag(x, y) {
        this.offset[0] += x / this.scale;
        this.offset[1] += y / this.scale;

        if (this.onredraw) {
            this.onredraw(this);
        }
    }

    changeScale(value, zoomingCenter) {
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

        const rect = this.element.getBoundingClientRect();
        if (!rect) {
            return;
        }

        zoomingCenter = zoomingCenter || [
            rect.width * 0.5,
            rect.height * 0.5,
        ];
        const center = this.convertCanvasToOffset(zoomingCenter);
        this.scale = value;
        if (Math.abs(this.scale - 1) < 0.01) {
            this.scale = 1;
        }

        const newCenter = this.convertCanvasToOffset(zoomingCenter);
        const deltaOffset = [
            newCenter[0] - center[0],
            newCenter[1] - center[1],
        ];

        this.offset[0] += deltaOffset[0];
        this.offset[1] += deltaOffset[1];

        if (this.onredraw) {
            this.onredraw(this);
        }
    }

    changeDeltaScale(value, zoomingCenter) {
        this.changeScale(this.scale * value, zoomingCenter);
    }

    reset() {
        this.scale = 1;
        this.offset[0] = 0;
        this.offset[1] = 0;
    }
}
