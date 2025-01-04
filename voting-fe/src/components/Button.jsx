function styleSelector(style) {
    switch(style) {
        case "red": return "red-button";
        case "yellow": return "yellow-button";
        default: return "red-button";
    }
}

export function Button({ label, clickFunc, style }) {
    return(
        <button
            onClick={ clickFunc }
            className={ styleSelector(style) }
        >
            {label}
        </button>
    );
}