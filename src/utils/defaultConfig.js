export default {
    VERSION: 0.4,

    CANVAS_GRID_SIZE: 10,

    NODE_TITLE_HEIGHT: 30,
    NODE_TITLE_TEXT_Y: 20,
    NODE_SLOT_HEIGHT: 20,
    NODE_WIDGET_HEIGHT: 20,
    NODE_WIDTH: 140,
    NODE_MIN_WIDTH: 50,
    NODE_COLLAPSED_RADIUS: 10,
    NODE_COLLAPSED_WIDTH: 80,
    NODE_TITLE_COLOR: "#999",
    NODE_SELECTED_TITLE_COLOR: "#FFF",
    NODE_TEXT_SIZE: 14,
    NODE_TEXT_COLOR: "#AAA",
    NODE_SUBTEXT_SIZE: 12,
    NODE_DEFAULT_COLOR: "#333",
    NODE_DEFAULT_BGCOLOR: "#353535",
    NODE_DEFAULT_BOXCOLOR: "#666",
    NODE_DEFAULT_SHAPE: "box",
    NODE_BOX_OUTLINE_COLOR: "#FFF",
    DEFAULT_SHADOW_COLOR: "rgba(0,0,0,0.5)",
    DEFAULT_GROUP_FONT: 24,

    WIDGET_BGCOLOR: "#222",
    WIDGET_OUTLINE_COLOR: "#666",
    WIDGET_TEXT_COLOR: "#DDD",
    WIDGET_SECONDARY_TEXT_COLOR: "#999",

    LINK_COLOR: "#9A9",
    EVENT_LINK_COLOR: "#A86",
    CONNECTING_LINK_COLOR: "#AFA",

    MAX_NUMBER_OF_NODES: 1000, // avoid infinite loops
    DEFAULT_POSITION: [100, 100], // default node position
    VALID_SHAPES: ["default", "box", "round", "card"], // ,"circle"

    // shapes are used for nodes but also for slots
    BOX_SHAPE: 1,
    ROUND_SHAPE: 2,
    CIRCLE_SHAPE: 3,
    CARD_SHAPE: 4,
    ARROW_SHAPE: 5,

    // enums
    INPUT: 1,
    OUTPUT: 2,

    EVENT: -1, // for outputs
    ACTION: -1, // for inputs

    ALWAYS: 0,
    ON_EVENT: 1,
    NEVER: 2,
    ON_TRIGGER: 3,

    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4,
    CENTER: 5,

    STRAIGHT_LINK: 0,
    LINEAR_LINK: 1,
    SPLINE_LINK: 2,

    NORMAL_TITLE: 0,
    NO_TITLE: 1,
    TRANSPARENT_TITLE: 2,
    AUTOHIDE_TITLE: 3,

    proxy: null, // used to redirect calls
    node_images_path: "",

    debug: false,
    catch_exceptions: true,
    throw_errors: true,
    allow_scripts: false,
    // if set to true some nodes like Formula would be allowed
    // to evaluate code that comes from unsafe sources
    // (like node configuration), which could lead to exploits
    registered_node_types: {}, // nodetypes by string
    node_types_by_file_extension: {}, // used for dropping files in the canvas
    Nodes: {}, // node types by classname
    Globals: {}, // used to store vars between graphs

    searchbox_extras: {}, // used to add extra features to the search box
    auto_sort_node_types: false,
    // If set to true, will automatically sort node types / categories in the context menus
};
