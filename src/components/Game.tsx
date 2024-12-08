import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";
import GamePeople from './GamePeople';

import { gamePhaseToText, gamePersonRoleToText } from "../utils";

const client = generateClient<Schema>();

function Game({ game, compact = false }: { readonly game: Schema["Game"]["type"], readonly compact?: boolean }) {
    const { user } = useAuthenticator();
    const [gamePerson, setGamePerson] = useState<Schema["GamePerson"]["type"]>();
    const [gamePeople, setGamePeople] = useState<Schema["GamePerson"]["type"][]>([]);

    const [gamePhaseText, setGamePhaseText] = useState<string>("");
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
        setGamePhaseText(gamePhaseToText(game));
    }, [game.phase]);

    useEffect(() => {
        if (gamePerson)
            setGameRoleText(gamePersonRoleToText(gamePerson));
    }, [gamePerson]);

    async function acceptGameInvitation() {
        if (!gamePerson) return
        client.models.GamePerson.update({
            ...gamePerson,
            acceptedInvitation: true
        })
    }

    if (gamePerson === undefined) {
        return <></>
    }

    if (!gamePerson.acceptedInvitation) {
        return (
            <>
                <h3>{game.name}</h3>
                <button onClick={acceptGameInvitation}>Accetta invito come {gamePerson.role?.toLowerCase()}</button>
            </>
        );
    }

    const gameHeader = (
        <h3>
            <span>{gameRoleText}</span> {game.name} - <span>{gamePhaseText}</span>
        </h3>
    )

    if (compact) {
        return gameHeader;
    }

    return (
        <>
            {gameHeader}
            <p>Descrizione: {game.description}</p>
            <h3>Creators</h3>
            <GamePeople gamePeople={gamePeople} filterRole="CREATOR" />
            <h3>Admins</h3>
            <GamePeople gamePeople={gamePeople} filterRole="ADMIN" />
            <h3>Players</h3>
            <GamePeople gamePeople={gamePeople} filterRole="PLAYER" />
        </>
    );
}

export default Game;