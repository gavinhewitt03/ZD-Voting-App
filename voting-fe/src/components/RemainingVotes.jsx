export function RemainingVotes({ remainingVoters, className }) {
    return (
        <div className={className}>
            <h3>Remaining Voters</h3>
            { remainingVoters.map(voter => (
                <p className="yellow" key={voter}>{voter}</p>
            ))}
        </div>
    )
}