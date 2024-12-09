import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";
import GamePeople from './GamePeople';

import { gamePhaseToText, gamePersonRoleToText } from "../utils";

const client = generateClient<Schema>();

function Game({ game, compact = false, onDelete }: {
    readonly game: Schema["Game"]["type"],
    readonly compact?: boolean
    readonly onDelete?: () => void
}) {
    const { user } = useAuthenticator();
    const [gamePerson, setGamePerson] = useState<Schema["GamePerson"]["type"]>();
    const [gamePeople, setGamePeople] = useState<Schema["GamePerson"]["type"][]>([]);
    const [promptDeleteConfirmation, setPromptDeleteConfirmation] = useState(false);

    const [gameRoleText, setGameRoleText] = useState<string>("");

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
            setGameRoleText(gamePersonRoleToText(gamePerson.role));
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
                <span>{gameRoleText}</span><span>{gamePhaseToText(game.phase)}</span> - {game.name}
            </h3>
        );
    }

    return (
        <>
            <h2><span>{gameRoleText}</span>{game.name}</h2>
            <p>Fase: {gamePhaseToText(game.phase)}</p>
            <p>Descrizione: {game.description}</p>
            <h3>Creators</h3>
            <GamePeople gamePeople={gamePeople} filterRole="CREATOR" userRole={gamePerson.role} />
            <h3>Admins</h3>
            <GamePeople gamePeople={gamePeople} filterRole="ADMIN" userRole={gamePerson.role} />
            <h3>Players</h3>
            <GamePeople gamePeople={gamePeople} filterRole="PLAYER" userRole={gamePerson.role} />
            {gamePerson.role === "CREATOR" &&
                <button onClick={() => setPromptDeleteConfirmation(true)}>Delete Game</button>
            }
            {promptDeleteConfirmation &&
                <button style={{ background: 'red' }} onClick={deleteGame}>Confirm Delete</button >
            }
        </>
    );
}

export default Game;