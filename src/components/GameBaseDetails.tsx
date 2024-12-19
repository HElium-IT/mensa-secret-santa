
import type { Schema } from "../../amplify/data/resource";
import { gamePhaseToText } from "../utils";

function GameBaseDetails({ game, phaseIcon, onBack }: {
    readonly game: Schema["Game"]["type"];
    readonly phaseIcon: string;
    readonly onBack: () => void;
}) {
    return (
        <>
            <h2>
                <button style={{ margin: "1rem" }} onClick={onBack}>{"<"}</button>
                <span>{phaseIcon}</span>
                {game.name}
            </h2>
            <p>Descrizione: {game.description}</p>
            <p>
                <span>{phaseIcon}</span> {gamePhaseToText(game.phase)}
            </p>
        </>
    );
}

export default GameBaseDetails;