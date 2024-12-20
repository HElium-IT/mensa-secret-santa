
import { Flex } from "@aws-amplify/ui-react";
import type { Schema } from "../../amplify/data/resource";
import { gamePhaseToText } from "../utils";

function GameBaseDetails({ game, phaseIcon, onBack }: {
    readonly game: Schema["Game"]["type"];
    readonly phaseIcon: string;
    readonly onBack: () => void;
}) {
    return (
        <>
            <Flex direction="row" justifyContent="space-between" alignItems="center" style={{ width: "100%" }}>
                <h2 style={{ margin: "0" }}>
                    {game.name}
                </h2>
                <button style={{ margin: "0", padding: "0px", height: "35px", width: "35px" }} onClick={onBack}>{"<"}</button>
            </Flex >
            <p style={{ margin: "0" }}>{game.description}</p>
            <h3 style={{ margin: "0" }}>
                <span>{phaseIcon}</span> {gamePhaseToText(game.phase)}
            </h3>
        </>
    );
}

export default GameBaseDetails;