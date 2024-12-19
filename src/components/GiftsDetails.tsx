
import type { Schema } from "../../amplify/data/resource";

function GiftsDetails({ dynamicGame, totalGifts, gamePeople, registeredGifts, wonGifts, gamePeopleGifts, nonPlayerTotalGifts, nonPlayerRegisteredGifts, nonPlayerWonGifts }: {
    readonly dynamicGame: Schema["Game"]["type"];
    readonly totalGifts: number;
    readonly gamePeople: Schema["GamePerson"]["type"][];
    readonly registeredGifts: number;
    readonly wonGifts: number;
    readonly gamePeopleGifts: Record<string, Schema["Gift"]["type"]>;
    readonly nonPlayerTotalGifts: number;
    readonly nonPlayerRegisteredGifts: number;
    readonly nonPlayerWonGifts: number;
}) {
    return (
        <>
            {["REGISTRATION_OPEN", "LOBBY"].includes(dynamicGame.phase ?? '') && (
                <h4>
                    Regali totali {totalGifts} / {gamePeople.filter(gp => gp.role === "PLAYER").length + nonPlayerTotalGifts} giocatori totali
                </h4>
            )}
            {dynamicGame.phase === "LOBBY" && (
                <h4>
                    Regali registrati {registeredGifts} / {gamePeople.filter(gp => gp.role === "PLAYER").length + nonPlayerRegisteredGifts} giocatori totali
                </h4>
            )}
            {["STARTED", "PAUSED"].includes(dynamicGame.phase ?? '') && (
                <h4>
                    Regali vinti {wonGifts} / {gamePeople.filter(gp => gp.role === "PLAYER").length + nonPlayerWonGifts} giocatori totali
                </h4>
            )}
            {dynamicGame.phase === "FINISHED" && (
                <ul>
                    {gamePeopleGifts && Object.entries(gamePeopleGifts).map(([personId, gift]) => (
                        <li key={personId}>
                            <p style={{ margin: '0px' }}>
                                {personId.split("@")[0]} ha ricevuto
                            </p>
                            <p style={{ margin: '0px' }}>
                                "{gift.name}" da {gift.ownerPersonId.split("@")[0]}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}

export default GiftsDetails;