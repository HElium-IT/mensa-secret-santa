
import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function Game({ game, compact = false }: { game: Schema["Game"]["type"], compact?: boolean }) {
    const { user } = useAuthenticator();

    const [gamePeople, setGamePeople] = useState<Schema["GamePerson"]["type"][]>([]);
    const [gamePerson, setGamePerson] = useState<Schema["GamePerson"]["type"]>();

    const [creators, setCreators] = useState<Schema["GamePerson"]["type"][]>([]);
    const [admins, setAdmins] = useState<Schema["GamePerson"]["type"][]>([]);
    const [players, setPlayers] = useState<Schema["GamePerson"]["type"][]>([]);

    useEffect(() => {
        async function getGamePeople() {
            const { data: gamePeople } = await game.people();
            if (gamePeople) {
                setGamePeople(gamePeople);
            }
        }

        getGamePeople();
    }, [game]);

    useEffect(() => {
        if (gamePeople.length) {
            gamePeople.forEach(gamePerson => {
                if (gamePerson.personId === user.signInDetails?.loginId) {
                    setGamePerson(gamePerson);
                }
                switch (gamePerson.role) {
                    case "CREATOR":
                        setCreators([...creators, gamePerson]);
                        break;
                    case "ADMIN":
                        setAdmins([...admins, gamePerson]);
                        break;
                    case "PLAYER":
                        setPlayers([...players, gamePerson]);
                        break;
                }
            });
        } else {
            setGamePerson(undefined);
            setCreators([]);
            setAdmins([]);
            setPlayers([]);
        }
    }, [gamePeople]);

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

    if (compact) {
        return (
            <>
                <h3>
                    <span>{gamePerson.role && gamePerson.role === "CREATOR" ? "👑" : gamePerson.role === "ADMIN" ? "🛡️" : "🎮"} </span>
                    {game.name} - <span>{
                        game.phase === "LOBBY" ? "🟢"
                            : game.phase === "REGISTRATION_OPEN" ? "🟡"
                                : game.phase === "STARTED" ? "🔵"
                                    : "🔴"
                    }</span> {game.phase?.toLowerCase()}
                </h3>
            </>
        )
    }

    return (

        <>
            <h3>
                <span>{gamePerson.role && gamePerson.role === "CREATOR" ? "👑" : gamePerson.role === "ADMIN" ? "🛡️" : "🎮"} </span>
                {game.name}
            </h3>
            <p>Fase: {game.phase?.toLowerCase()}</p>
            <p>Descrizione: {game.description}</p>
            <ul>
                <li>
                    <h4>Creators</h4>
                    <ul>
                        {creators.map(creator => (
                            <li key={creator.id}>{creator.personId}</li>
                        ))}
                    </ul>
                </li>
                <li>
                    <h4>Admins</h4>
                    <ul>
                        {admins.map(admin => (
                            <li key={admin.id}>{admin.personId}</li>
                        ))}
                    </ul>
                </li>
                <li>
                    <h4>Players</h4>
                    <ul>
                        {players.map(player => (
                            <li key={player.id}>{player.personId}</li>
                        ))}
                    </ul>
                </li>
            </ul>
        </>
    );
}

export default Game;