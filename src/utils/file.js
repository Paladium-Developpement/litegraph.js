/**
 * @module File Utils
 */
import defaultConfig from "./defaultConfig";

export function getFileExtension(url) {
    const question = url.indexOf("?");
    if (question !== -1) {
        url = url.substr(0, question);
    }
    const point = url.lastIndexOf(".");
    if (point === -1) {
        return "";
    }
    return url.substr(point + 1).toLowerCase();
}

/**
 * Wrapper to load files (from url using fetch or from file using FileReader)
 * @method fetchFile
 * @param {String|File|Blob} url the url of the file (or the file itself)
 * @param {String} type an string to know how to fetch it:
 *     "text","arraybuffer","json","blob"
 * @param {Function} onComplete callback(data)
 * @param {Function} onError in case of an error
 * @return {FileReader|Promise|void} returns the object used to
 */
export function fetchFile(url, type = "text", onComplete, onError) {
    if (!url) return null;

    if (url.constructor === String) {
        if (url.substr(0, 4) === "http" && defaultConfig.proxy) {
            url = defaultConfig.proxy + url.substr(url.indexOf(":") + 3);
        }
        return fetch(url)
            .then((response) => {
                if (!response.ok) throw new Error("File not found"); // it will be catch
                // below
                if (type === "arraybuffer") return response.arrayBuffer();
                if (["string", "text"].includes(type)) return response.text();
                if (type === "json") return response.json();
                if (type === "blob") return response.blob();
            })
            .then((data) => {
                if (onComplete) onComplete(data);
            })
            .catch((error) => {
                console.error("error fetching file:", url);
                if (onError) onError(error);
            });
    }
    if (url.constructor === File || url.constructor === Blob) {
        const reader = new FileReader();
        reader.onload = (e) => {
            let v = e.target.result;
            if (type === "json") v = JSON.parse(v);
            if (onComplete) onComplete(v);
        };
        if (type === "arraybuffer") return reader.readAsArrayBuffer(url);
        if (["string", "text"].includes(type)) return reader.readAsText(url);
        if (type === "blob") return reader.readAsBinaryString(url);
    }
    return null;
}
