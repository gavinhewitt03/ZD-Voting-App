import { RemainingVotes } from "../components/RemainingVotes"
import { Header } from "../components/Header"

let remainingVoters = ['Gavin Hewitt', 'Jackson Ginn', 'Shannon DePratter', 'Kelly Sullivan', 'Grace Yaegel']

export function Regent() {
    return(
        <>
            <Header />
            <RemainingVotes 
                remainingVoters={remainingVoters}
                className="remaining-votes-regent"
            />
        </>
        
    );
}