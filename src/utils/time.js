/**
 * @module Time Utils
 */

export default function getTime() {
    if (typeof performance !== "undefined") return performance.now();
    if (typeof Date !== "undefined" && typeof Date.now !== "undefined") return Date.now;
    if (typeof process !== "undefined") {
        const t = process.hrtime();
        return t[0] * 0.001 + t[1] * 1e-6;
    }
    return new Date().getTime();
}
