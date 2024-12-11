
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { useAuthenticator } from '@aws-amplify/ui-react';

const client = generateClient<Schema>();

function GameSelector({ setGame }: { readonly setGame: (game?: Schema["Game"]["type"]) => void }) {
    const { user } = useAuthenticator();
    const [searchTerm, setSearchTerm] = useState("");
    const [games, setGames] = useState<Schema["Game"]["type"][]>([]);
    const [selectedGame, setSelectedGame] = useState<Schema["Game"]["type"] | null>(null);
    const [promptSecret, setPromptSecret] = useState(false);
    const [secretInput, setSecretInput] = useState("");
    const [error, setError] = useState("");


    useEffect(() => {
        if (searchTerm.length < 3) {
            setGames([]);
            return;
        }
        async function fetchGames(searchTerm: string = "") {
            // This is the worst way to do this, but it's fine for now.
            // The filtering should be done server-side but I don't know
            // how to do it, docs are shamefully lacking.
            const gamesData = (await client.models.Game.list({
                filter: {
                    // name: { contains: searchTerm }
                    or: [
                        { phase: { eq: "REGISTRATION_OPEN" } },
                        { phase: { eq: "LOBBY" } }
                    ]
                }
            })).data.filter(game => game.name.toLowerCase().includes(searchTerm.toLowerCase()));
            setGames(gamesData.length > 0 ? gamesData : []);
        }
        fetchGames(searchTerm);
    }, [searchTerm]);

    async function validateSecret() {
        if (selectedGame?.secret === secretInput) {
            setGame(selectedGame);
        } else {
            setError("Invalid secret");
        }
    }

    useEffect(() => {
        if (!selectedGame) {
            setPromptSecret(false);
            return;
        }
        async function fetchGamePerson(game: Schema["Game"]["type"]) {
            const { data: gamePeople } = await client.models.GamePerson.listGamePersonByGameId({ gameId: game.id }, {
                filter: {
                    personId: { eq: user.signInDetails?.loginId }
                }
            });
            if (!gamePeople) return;
            const gamePerson = gamePeople.find(gp => gp.personId === user.signInDetails?.loginId);
            if (!gamePerson) return;
            if (gamePerson.acceptedInvitation) {
                setGame(game);
            } else {
                setPromptSecret(true);
            }
        }
        fetchGamePerson(selectedGame);
    }, [selectedGame]);

    return (
        <>
            <h2> Cerca un gioco </h2>
            <input
                type="text"
                placeholder="Secret Santa 2024"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul>
                {games.map(game => (
                    <li key={game.id} onClick={() => setSelectedGame(game)}>
                        {game.name}
                    </li>
                ))}
            </ul>
            {promptSecret && (
                <div>
                    <input
                        type="text"
                        placeholder="Enter secret"
                        value={secretInput}
                        onChange={(e) => setSecretInput(e.target.value)}
                    />
                    <button onClick={validateSecret}>Join Game</button>
                    {error && <p>{error}</p>}
                </div>
            )}
        </>
    );
}

export default GameSelector;