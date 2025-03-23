import { RemainingVotes } from "./RemainingVotes"
import React, { useState, useEffect, useRef } from 'react'
import { Button } from "./Button";
import { w3cwebsocket as W3CWebSocket } from 'websocket'

export function StandardsPoll({ sessionID }) {
    const [percentage, setPercentage] = useState(0.0);
    const [yesData, setYesData] = useState(null);
    const [noData, setNoData] = useState(null);
    const [idkData, setIdkData] = useState(null);
    const [rusheeName, setRusheeName] = useState("");
    const [activePoll, setActivePoll] = useState(false);
    const [remainingVoters, setRemainingVoters] = useState([]);
    
    const client = useRef(null);
    useEffect(() => {
        if (sessionID.length === 0) { // check if empty string
            return;
        }
        
        if (client.current && client.current.readyState === WebSocket.OPEN) // do not reinitialize socket if it already exists on remount
            return;

        client.current = new W3CWebSocket(`${process.env.REACT_APP_WS_URL}${sessionID}/`);

        client.current.onopen = () => {
            console.log('WebSocket client connected: ', `${process.env.REACT_APP_WS_URL}${sessionID}/`);
        };

        client.current.onclose = (event) => {
            console.log("WebSocket client disconnected: ", event.reason);
        }

        client.current.onerror = (error) => {
            console.error("WebSocket error: ", error);
        }

        return () => {
            if (client.current) {
                client.current.close();
                console.log("WebSocket connection closed via cleanup.");
            }
        }
    }, [sessionID]);

    useEffect(() => {
        client.current.onmessage = (message) => {
            let messageJson = JSON.parse(message['data']);
            
            if (messageJson['message'] === 'voted' || messageJson['message'] === 'logged out') {
                let removeName = messageJson['name'];
                setRemainingVoters((voters) => {
                    if (voters.includes(removeName)) {
                        const updatedVoters = remainingVoters.filter(voter => voter !== removeName);
                        return updatedVoters;
                    }
                    return voters;
                });
            }
        }
    }, [sessionID, remainingVoters])

    const sendRusheeName = () => {
        if (!client.current || client.current.readyState !== WebSocket.OPEN) {
            console.error("WebSocket not connected. Cannot send rushee name.");
            return;
        }

        client.current.send(JSON.stringify({
            type: 'message',
            message: {rushee_name: rusheeName},
            name: 'standards'
        }));
    }

    const startPoll = async () => {
        sendRusheeName();

        client.current.send(JSON.stringify({
            type: 'message',
            message: 'get_logged_in',
            name: 'for_regent'
        }));

        const getResponse = await fetch(`${process.env.REACT_APP_API_URL}/user/get_logged_in/`);
        const getData = await getResponse.json();
        
        let voters = [];
        getData.forEach((jsonVoter, i) => {
            voters.push(jsonVoter['full_name'])
        });

        setRemainingVoters(voters);

        setActivePoll(true);
    }

    const next = () => {
        setRusheeName("");
        setPercentage(0.0);
    }

    const endPoll = async () => {
        const params = {rushee_name: rusheeName};
        const queryParams = new URLSearchParams(params).toString();
        const percentResponse = await fetch(`${process.env.REACT_APP_API_URL}/poll/percentage/?${queryParams}`);
        const percentData = await percentResponse.json();

        setPercentage(percentData['percentage']);

        const breakdownResponse = await fetch(`${process.env.REACT_APP_API_URL}/poll/breakdown/?${queryParams}`);
        const breakdownData = await breakdownResponse.json();

        setYesData(breakdownData['yes']);
        setNoData(breakdownData['no']);
        setIdkData(breakdownData['idk']);

        const deleteResponse = await fetch(`${process.env.REACT_APP_API_URL}/poll/delete/`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                rushee_name: rusheeName
            })
        })

        client.current.send(JSON.stringify({
            type: 'message',
            message: {rushee_name: ""},
            name: 'standards'
        }));

        setActivePoll(false);
    }

    if (activePoll) {
        return (
            <>
                <RemainingVotes
                    remainingVoters={remainingVoters}
                    className="remaining-votes-standards"
                />
                <div className="poll-section">
                    <h3 className="red" style={{textDecorationLine: 'none'}}>
                        {rusheeName}
                    </h3>
                    <br /><br />
                    <Button
                        label="Resend Poll"
                        clickFunc={sendRusheeName}
                        className="red"
                    />
                    &emsp;
                    <Button
                        label="End Poll"
                        clickFunc={endPoll}
                        className="red"
                    />
                </div>
            </>
            
        );
    }

    if (!activePoll && percentage === 0.0) {
        return (
            <div className="poll-section">
                <h3 className="red" style={{textDecorationLine: 'none'}}>
                    Insert PNM Name Here:
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
                    clickFunc={startPoll}
                    className="red"
                />
            </div>
        );
    }
    
    return (
        <div className="poll-section">
            <h3 className="red" style={{textDecorationLine: 'none'}}>
                {rusheeName}: {percentage}%
            </h3>
            <br />
            <p className="red">
                Yes: {yesData[0]}%, {yesData[1]} votes
                <br />
                No: {noData[0]}%, {noData[1]} votes
                <br />
                I Don't Know: {idkData[0]}%, {idkData[1]} votes
            </p>
            <br />
            <Button
                label="Next"
                clickFunc={next}
                className="red"
            />
        </div>
    );
}