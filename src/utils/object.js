// separated just to improve if it doesn't work
export default function cloneObject(obj, target) {
    if (obj == null) return null;
    const r = JSON.parse(JSON.stringify(obj));
    if (!target) return r;

    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const i in r) target[i] = r[i];
    return target;
}
