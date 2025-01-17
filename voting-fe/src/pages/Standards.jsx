import React, { useState } from 'react'
import { Button } from "../components/Button"
import { Header } from "../components/Header"
import { RemainingVotes } from "../components/RemainingVotes"

function EndPoll(setActivePoll, setDisplayPercentage) {
    setActivePoll(false);
    setDisplayPercentage(true);
}

function Next(setDisplayPercentage, setRusheeName) {
    setDisplayPercentage(false);
    setRusheeName("");
}

function SetPollContent(activePoll, setActivePoll, rusheeName, setRusheeName, 
                        displayPercentage, setDisplayPercentage, percentage) {
    if (activePoll) {
        return (
            <>
                <h3 className="red" style={{textDecorationLine: 'none'}}>
                    {rusheeName}
                </h3>
                <br /><br />
                <Button
                    label="End Poll"
                    clickFunc={() => EndPoll(setActivePoll, setDisplayPercentage)}
                    className="red"
                />
            </>
        );
    }

    if (displayPercentage) {
        return (
            <>
                <h3 className="red" style={{textDecorationLine: 'none'}}>
                    {rusheeName}: {percentage}%
                </h3>
                <br /><br />
                <Button
                    label="Next"
                    clickFunc={() => Next(setDisplayPercentage, setRusheeName)}
                    className="red"
                />
            </>
        );
    }

    return (
        <>
            <h3 className="red" style={{textDecorationLine: 'none'}}>
                Insert Rushee Name Here:
            </h3>
            <input 
                type="text" 
                value={rusheeName}
                onChange={(event) => setRusheeName(event.target.value)}
            />
            <br />
            <br />
            <Button
                label="Start Poll"
                clickFunc={() => { setActivePoll(true) }}
                className="red"
            />
        </>
                
    );
}

export function Standards() {
    const [activePoll, setActivePoll] = useState(false);
    const [rusheeName, setRusheeName] = useState("");
    const [displayPercentage, setDisplayPercentage] = useState(false);
    const [percentage, setPercentage] = useState(0.0);

    return(
        <>
            <Header />
            <div style={{display: 'flex'}}>
                <RemainingVotes
                    remainingVoters={[]}
                    className="remaining-votes-standards"
                />
                <div className="poll-section">
                    { SetPollContent(
                        activePoll, setActivePoll,
                        rusheeName, setRusheeName,
                        displayPercentage, setDisplayPercentage,
                        percentage
                    ) }
                </div>
            </div>
        </>
    );
}