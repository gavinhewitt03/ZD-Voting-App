export function InputField({ text, stateVar, stateFunc, name, type="text" }) {
    return (
        <div style={{display: 'inline-block'}}>
            <p className="login-text">
                {text}
            </p>
            <input
                type={type}
                value={stateVar}
                onChange={(event) => stateFunc(event)}
                name={name}
            />
        </div>
    )
}