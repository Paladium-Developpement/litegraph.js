LiteGraph.allow_scripts = true;

const editor = new LiteGraph.Editor("main", { miniwindow: false });
window.graphcanvas = editor.graphcanvas;
window.graph = editor.graph;
window.addEventListener("resize", () => { editor.graphcanvas.resize(); });
