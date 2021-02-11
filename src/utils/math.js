export function distance(a, b) {
    return Math.sqrt(
        (b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]),
    );
}

export function isInsideRectangle(x, y, left, top, width, height) {
    return left < x && left + width > x && top < y && top + height > y;
}

// bounding overlap, format: [ startx, starty, width, height ]
export function overlapBounding(a, b) {
    const AEndX = a[0] + a[2];
    const AEndY = a[1] + a[3];
    const BEndX = b[0] + b[2];
    const BEndY = b[1] + b[3];

    return !(a[0] > BEndX
        || a[1] > BEndY
        || AEndX < b[0]
        || AEndY < b[1]);
}

export function clamp(v, a, b) {
    // eslint-disable-next-line no-nested-ternary
    return a > v ? a : b < v ? b : v;
}
