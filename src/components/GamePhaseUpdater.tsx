
import { useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/api";

const client = generateClient<Schema>();

function GamePhaseUpdater({ game, gamePerson, phase, setPhase }: {
    readonly game: Schema["Game"]["type"],
    readonly gamePerson: Schema["GamePerson"]["type"],
    readonly phase: Schema["Game"]["type"]["phase"],
    readonly setPhase: React.Dispatch<React.SetStateAction<Schema["Game"]["type"]["phase"]>>
}) {
    const [upgradeAction, setUpgradeAction] = useState<"ADVANCE" | "PAUSE" | "FINISH" | "RESUME" | undefined>();
    const [promptUpgradePhaseConfirmation, setPromptUpgradePhaseConfirmation] = useState(false);

    async function upgradeGamePhase(finish: boolean = false) {
        if (!gamePerson || !phase) return;
        const nextPhase = {
            "REGISTRATION_OPEN": "LOBBY",
            "LOBBY": "STARTED",
            "STARTED": finish ? "FINISHED" : "PAUSED",
            "PAUSED": "STARTED",
            "FINISHED": "REGISTRATION_OPEN"
        }[phase] as Schema["Game"]["type"]["phase"];

        await client.models.Game.update({ id: game.id, phase: nextPhase });
        setPhase(nextPhase);
        setPromptUpgradePhaseConfirmation(false);
    }

    return (
        <p>
            {phase !== "FINISHED" && (
                <>
                    {!promptUpgradePhaseConfirmation && (
                        <>
                            {phase === "STARTED" ? (
                                <>
                                    <button
                                        onClick={() => {
                                            setUpgradeAction("PAUSE");
                                            setPromptUpgradePhaseConfirmation(true);
                                        }}
                                    >
                                        Pausa
                                    </button>
                                    <button
                                        onClick={() => {
                                            setUpgradeAction("FINISH");
                                            setPromptUpgradePhaseConfirmation(true);
                                        }}
                                    >
                                        Finisci
                                    </button>
                                </>
                            ) : phase === "PAUSED" ? (
                                <button
                                    onClick={() => {
                                        setUpgradeAction("RESUME");
                                        setPromptUpgradePhaseConfirmation(true);
                                    }}
                                >
                                    Riprendi
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setUpgradeAction("ADVANCE");
                                        setPromptUpgradePhaseConfirmation(true);
                                    }}
                                >
                                    Avanza Fase
                                </button>
                            )}
                        </>
                    )}
                    {promptUpgradePhaseConfirmation && (
                        <>
                            <button
                                onClick={() => {
                                    if (upgradeAction === "FINISH") {
                                        upgradeGamePhase(true);
                                    } else {
                                        upgradeGamePhase();
                                    }
                                    setUpgradeAction(undefined);
                                }}
                            >
                                Conferma
                            </button>
                            <button
                                onClick={() => {
                                    setPromptUpgradePhaseConfirmation(false);
                                    setUpgradeAction(undefined);
                                }}
                            >
                                Annulla
                            </button>
                        </>
                    )}
                </>
            )}
        </p>
    );
}

export default GamePhaseUpdater;