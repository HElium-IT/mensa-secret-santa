import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";
import GamePeople from './GamePeople';

import { gamePhaseToIcon, gamePersonRoleToIcon, gamePhaseToText } from "../utils";

const client = generateClient<Schema>();

function Game({ game, compact = false, onDelete }: {
    readonly game: Schema["Game"]["type"],
    readonly compact?: boolean
    readonly onDelete?: () => void
}) {
    const { user } = useAuthenticator();
    const [gamePerson, setGamePerson] = useState<Schema["GamePerson"]["type"]>();
    const [gamePeople, setGamePeople] = useState<Schema["GamePerson"]["type"][]>([]);
    const [promptUpgradePhaseConfirmation, setPromptUpgradePhaseConfirmation] = useState(false);
    const [promptDeleteConfirmation, setPromptDeleteConfirmation] = useState(false);

    const [gameRoleText, setGameRoleText] = useState<string>("");
    const [gamePhaseText, setGamePhaseText] = useState<string>(gamePhaseToText(game.phase));
    const [gamePhaseIcon, setGamePhaseIcon] = useState<string>(gamePhaseToIcon(game.phase));

    useEffect(() => {
        game.people().then(({ data: gamePeopleData }) => {
            if (!gamePeopleData) return;
            setGamePeople(gamePeopleData);
            gamePeopleData.forEach(gp => {
                if (gp.personId === user.signInDetails?.loginId) {
                    setGamePerson(gp);
                }
            });
        });
    }, [game]);

    useEffect(() => {
        if (gamePerson)
            setGameRoleText(gamePersonRoleToIcon(gamePerson.role));
    }, [gamePerson]);


    async function acceptGameInvitation() {
        if (!gamePerson) return
        client.models.GamePerson.update({
            ...gamePerson,
            acceptedInvitation: true
        })
    }

    async function deleteGame() {
        if (!gamePerson) return
        const { data: gamePeople } = await client.models.GamePerson.listGamePersonByGameId({ gameId: game.id });
        if (gamePeople) {
            await Promise.all(gamePeople.map(async gp => {
                const resultGamePerson = await client.models.GamePerson.delete({ id: gp.id });
                console.log(resultGamePerson.errors ?? resultGamePerson.data);
            }));
        }
        const resultGame = await client.models.Game.delete({ id: game.id });
        console.log(resultGame.errors ?? resultGame.data);
        if (onDelete) {
            console.log("calling onDelete");
            onDelete();
            console.log("called onDelete");
        }
    }

    async function upgradeGamePhase() {
        if (!gamePerson || !game.phase) return
        const nextPhase = {
            "REGISTRATION_OPEN": "LOBBY",
            "LOBBY": "STARTED",
            "STARTED": "FINISHED",
            "FINISHED": "REGISTRATION_OPEN"
        }[game.phase] as Schema["Game"]["type"]["phase"];

        client.models.Game.update({ ...game, phase: nextPhase });
        game.phase = nextPhase;
        setGamePhaseText(gamePhaseToText(nextPhase));
        setGamePhaseIcon(gamePhaseToIcon(nextPhase));
        setPromptUpgradePhaseConfirmation(false);
    }

    if (gamePerson === undefined) {
        return <></>
    }

    if (!gamePerson.acceptedInvitation) {
        return (
            <>
                <h3 >{game.name}</h3>
                <button onClick={acceptGameInvitation}>Accetta invito come {gamePerson.role?.toLowerCase()}</button>
            </>
        );
    }

    if (compact) {
        return (
            <h3 >
                <span>{gameRoleText}</span><span>{gamePhaseIcon}</span> {game.name}
            </h3>
        );
    }

    if (gamePerson.role === "PLAYER") {
        return (
            <>
                <h2><span>{gameRoleText}</span>{game.name}</h2>
                <p><span>{gamePhaseIcon}</span> {gamePhaseText}</p>
                <p>Descrizione: {game.description}</p>
                <p>Numero di giocatori: {gamePeople.filter(gp => gp.role === "PLAYER").length}
                </p>
            </>
        )
    }

    return (
        <>
            <h2><span>{gameRoleText}</span>{game.name}</h2>
            <p>
                <span>{gamePhaseIcon}</span> {gamePhaseText}
            </p>
            <p>Descrizione: {game.description}</p>
            <h3>Creatori</h3>
            <GamePeople gamePeople={gamePeople} filterRole="CREATOR" userRole={gamePerson.role} />
            <h3>Admin</h3>
            <GamePeople gamePeople={gamePeople} filterRole="ADMIN" userRole={gamePerson.role} />
            <h3>Giocatori</h3>
            <GamePeople gamePeople={gamePeople} filterRole="PLAYER" userRole={gamePerson.role} />
            {gamePerson.role === "CREATOR" &&
                <button style={{ background: 'red' }} onClick={() => setPromptDeleteConfirmation(true)}>Elimina</button>
            }
            {promptDeleteConfirmation &&
                <button style={{ background: 'red' }} onClick={deleteGame}>Conferma</button >
            }
            {game.phase !== "FINISHED" &&
                <button onClick={() => setPromptUpgradePhaseConfirmation(true)}>Avanza</button>
            }
            {promptUpgradePhaseConfirmation &&
                <button onClick={upgradeGamePhase}>Conferma</button>
            }
        </>
    );
}

export default Game;