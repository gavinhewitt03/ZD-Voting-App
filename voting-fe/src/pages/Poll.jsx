import React, { useState } from 'react'
import { Button } from '../components/Button'
import { Header } from '../components/Header'

async function SendVote(vote) {
    let data;
    if (vote)
        data = { 'vote': 'yes' };
    else
        data = { 'vote': 'no' };

    // const response = await fetch(`${process.env.REACT_APP_API_URL}/poll/vote`, {
    //     method: 'POST',
    //     headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(data)
    // });
}

function GetRusheeName() {
    // GET request to backend for rusheeName
    // how to get this to run continuously... idk
}

// rusheeName use effect would function as follows (I think): once rusheeName changes via request, set activePoll according to it being "" or an actual name

function SetContent() {
    const [rusheeName, setRusheeName] = useState("");
    let activePoll = true; 

    if (activePoll) {
        return (
            <>
                <div style={{ marginTop: '100px' }}>
                    <h2 className="red"> { rusheeName } </h2>
                </div>
                <div className='center' style={{marginTop: '45px'}}>
                    <Button
                        label="Yes"
                        clickFunc={ () => SendVote(true) }
                        className="red"
                    />
                    &emsp;
                    <Button
                        label="No"
                        clickFunc={ () => SendVote(false) }
                        className="red"
                    />
                    </div>
            </>
        )
    } else {
        return (
            <h2 className="red">
                Please wait for Standards to start the poll.
            </h2>
        )
    }
}

export function Poll() {
    return (
        <>
            <Header />
            { SetContent() }
        </>
    );
}