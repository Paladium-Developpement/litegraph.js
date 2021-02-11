export default function getTime() {
    if (performance) return performance.now();
    if (Date && Date.now) return Date.now;
    if (process) {
        const t = process.hrtime();
        return t[0] * 0.001 + t[1] * 1e-6;
    }
    return new Date().getTime();
}
