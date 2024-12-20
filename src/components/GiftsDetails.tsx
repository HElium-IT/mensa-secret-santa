
import type { Schema } from "../../amplify/data/resource";

function GiftsDetails({ dynamicGame, totalGifts, gamePeople, gamePerson, registeredGifts, wonGifts, gamePeopleGifts }: {
    readonly dynamicGame: Schema["Game"]["type"];
    readonly totalGifts: number;
    readonly gamePeople: Schema["GamePerson"]["type"][];
    readonly gamePerson: Schema["GamePerson"]["type"];
    readonly registeredGifts: number;
    readonly wonGifts: number;
    readonly gamePeopleGifts: Record<string, Schema["Gift"]["type"]>;
}) {
    return (
        <>
            {["REGISTRATION_OPEN", "LOBBY"].includes(dynamicGame.phase ?? '') && (
                <h4>
                    Regali totali {totalGifts} / {gamePeople.length} giocatori totali
                </h4>
            )}
            {dynamicGame.phase === "LOBBY" && (
                <h4>
                    Regali registrati {registeredGifts} / {totalGifts} giocatori totali
                </h4>
            )}
            {["STARTED", "PAUSED"].includes(dynamicGame.phase ?? '') && (
                <h4>
                    Regali vinti {wonGifts} / {totalGifts} giocatori totali
                </h4>
            )}
            {dynamicGame.phase === "FINISHED" && gamePerson.role !== "PLAYER" && (
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