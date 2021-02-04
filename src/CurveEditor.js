export default class CurveEditor {
    constructor(points) {
        this.points = points;
        this.selected = -1;
        this.nearest = -1;
        this.size = null; // stores last size used
        this.must_update = true;
        this.margin = 5;
    }

    sampleCurve(f, points) {
        if (!points) return;
        for (let i = 0; i < points.length - 1; ++i) {
            const p = points[i];
            const pn = points[i + 1];
            if (pn[0] < f) continue;
            const r = (pn[0] - p[0]);
            if (Math.abs(r) < 0.00001) return p[1];
            const localF = (f - p[0]) / r;
            return p[1] * (1.0 - localF) + pn[1] * localF;
        }
        return 0;
    }

    draw(ctx, size, graphcanvas, backgroundColor, lineColor = "#666", inactive) {
        const { points } = this;
        if (!points) return;
        this.size = size;
        const w = size[0] - this.margin * 2;
        const h = size[1] - this.margin * 2;

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
        for (const point of points) {
            ctx.lineTo(point[0] * w, (1.0 - point[1]) * h);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
        if (!inactive) {
            for (let i = 0; i < points.length; ++i) {
                const p = points[i];
                if (this.selected === i) ctx.fillStyle = "#FFF";
                else if (this.nearest === i) ctx.fillStyle = "#DDD";
                else ctx.fillStyle = "#AAA";
                ctx.beginPath();
                ctx.arc(p[0] * w, (1.0 - p[1]) * h, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.restore();
    }

    onMouseDown(localpos, graphcanvas) {
        const { points } = this;
        if (!points) return;
        if (localpos[1] < 0) return;

        // this.captureInput(true);
        const w = this.size[0] - this.margin * 2;
        const h = this.size[1] - this.margin * 2;
        const x = localpos[0] - this.margin;
        const y = localpos[1] - this.margin;
        const pos = [x, y];
        const maxDist = 30 / graphcanvas.ds.scale;
        // search closer one
        this.selected = this.getCloserPoint(pos, maxDist);
        // create one
        if (this.selected === -1) {
            const point = [x / w, 1 - y / h];
            points.push(point);
            points.sort((a, b) => a[0] - b[0]);
            this.selected = points.indexOf(point);
            this.must_update = true;
        }
        if (this.selected !== -1) return true;
    }

    onMouseMove(localpos, graphcanvas) {
        const { points } = this;
        if (!points) return;
        const s = this.selected;
        if (s < 0) return;
        const x = (localpos[0] - this.margin) / (this.size[0] - this.margin * 2);
        const y = (localpos[1] - this.margin) / (this.size[1] - this.margin * 2);
        const curvepos = [(localpos[0] - this.margin), (localpos[1] - this.margin)];
        const maxDist = 30 / graphcanvas.ds.scale;
        this._nearest = this.getCloserPoint(curvepos, maxDist);
        const point = points[s];
        if (point) {
            const isEdgePoint = s === 0 || s === points.length - 1;
            if (!isEdgePoint
                && (localpos[0] < -10
                    || localpos[0] > this.size[0] + 10
                    || localpos[1] < -10
                    || localpos[1] > this.size[1] + 10)) {
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
            points.sort((a, b) => a[0] - b[0]);
            this.selected = points.indexOf(point);
            this.must_update = true;
        }
    }

    onMouseUp() {
        this.selected = -1;
        return false;
    }

    getCloserPoint(pos, maxDist = 30) {
        const { points } = this;
        if (!points) return -1;
        const w = (this.size[0] - this.margin * 2);
        const h = (this.size[1] - this.margin * 2);
        const num = points.length;
        const p2 = [0, 0];
        let minDist = 1000000;
        let closest = -1;
        let lastValid = -1;
        for (let i = 0; i < num; ++i) {
            const p = points[i];
            p2[0] = p[0] * w;
            p2[1] = (1.0 - p[1]) * h;
            // eslint-disable-next-line no-unused-vars
            if (p2[0] < pos[0]) lastValid = i;
            const dist = vec2.distance(pos, p2);
            if (dist > minDist || dist > maxDist) continue;
            closest = i;
            minDist = dist;
        }
        return closest;
    }
}
