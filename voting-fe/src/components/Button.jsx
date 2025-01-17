function classSelector(className) {
    switch(className) {
        case "red": return "red-button";
        case "yellow": return "yellow-button";
        default: return "red-button";
    }
}

export function Button({ label, clickFunc, className }) {
    return(
        <button
            onClick={ clickFunc }
            className={ classSelector(className) }
        >
            {label}
        </button>
    );
}