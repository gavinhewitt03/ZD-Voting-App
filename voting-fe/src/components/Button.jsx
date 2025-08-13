function classSelector(className) {
    switch(className) {
        case "red": return "red-button";
        case "yellow": return "yellow-button";
        default: return "red-button";
    }
}

export function Button({ label, clickFunc, className, type, disabled }) {
    return(
        <button
            onClick={ clickFunc }
            className={ classSelector(className) }
            type={type}
            disabled={disabled}
        >
            <p className="button">{label}</p>
        </button>
    );
}

Button.defaultProps = {
    type: 'button',
    disabled: false
}