function getFileExtension(url) {
    const question = url.indexOf("?");
    if (question !== -1) {
        url = url.substr(0, question);
    }
    const point = url.lastIndexOf(".");
    if (point === -1) {
        return "";
    }
    return url.substr(point + 1).toLowerCase();
};
