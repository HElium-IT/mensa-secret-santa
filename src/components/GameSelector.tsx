
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { useAuthenticator } from '@aws-amplify/ui-react';
import Game from "./Game";

const client = generateClient<Schema>();

function GameSelector({
    setGame,
    setIsSelectingGame,
}: {
    readonly setGame: (game?: Schema["Game"]["type"]) => void
    readonly setIsSelectingGame: (isSelectingGame: boolean) => void
}) {
    const { user } = useAuthenticator((context) => [context.user]);
    const [searchTerm, setSearchTerm] = useState("");
    const [fetchedGames, setFetchedGames] = useState<Schema["Game"]["type"][]>([]);
    const [games, setGames] = useState<Schema["Game"]["type"][]>([]);
    const [selectedGame, setSelectedGame] = useState<Schema["Game"]["type"] | null>(null);
    const [promptSecret, setPromptSecret] = useState(false);
    const [secretInput, setSecretInput] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const subscription = client.models.Game.observeQuery().subscribe({
            next: async ({ items: games }) => {
                console.debug("GameSelector.FetchedGames", games);
                setFetchedGames(games);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (!searchTerm || !fetchedGames) {
            setGames([]);
            setIsSelectingGame(false);
            return;
        }
        setIsSelectingGame(true);
        const games = fetchedGames.filter(game =>
            ["REGISTRATION_OPEN", "LOBBY"].includes(game.phase ?? '')
            && game.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        console.debug("GameSelector.Games", games);
        setGames(games);
    }, [searchTerm, fetchedGames]);

    useEffect(() => {
        console.debug("GameSelector.SelectedGame", selectedGame);
        if (!selectedGame) {
            setPromptSecret(false);
            return;
        }
        async function fetchGamePerson(game: Schema["Game"]["type"]) {
            if (!user.signInDetails?.loginId) return;

            const { data: gamePerson } = await client.models.GamePerson.get({ gameId: game.id, personId: user.signInDetails?.loginId });
            if (!gamePerson) {
                console.debug("GameSelector.PromptSecret", true);
                setPromptSecret(true);
                return;
            }
            console.debug("GameSelector.GamePersonFound", gamePerson);
            if (!gamePerson.acceptedInvitation) {
                const { data: gamePerson, errors } = await client.models.GamePerson.update({
                    gameId: game.id,
                    personId: user.signInDetails?.loginId,
                    acceptedInvitation: true
                });
                if (errors || !gamePerson) {
                    console.error(errors);
                    return;
                }
                console.debug("GameSelector.GamePersonUpdate", gamePerson);
                console.info(`Implicitly accepted invitation with role ${gamePerson.role}`);
            }
            setGame(game);
        }

        fetchGamePerson(selectedGame);
    }, [selectedGame]);

    async function validateSecret() {
        if (!selectedGame || !user.signInDetails?.loginId) return;

        if (selectedGame?.secret === secretInput) {
            const { data: gamePerson, errors } = await client.models.GamePerson.create({
                gameId: selectedGame.id,
                personId: user.signInDetails?.loginId,
                role: "PLAYER",
                acceptedInvitation: true
            });
            if (errors) {
                console.error(errors);
                return;
            }
            console.debug("GameSelector.GamePersonCreate", gamePerson);
            setGame(selectedGame);
        } else {
            setError("Invalid secret");
        }
    }

    return (
        <>
            <h2> Cerca una partita </h2>
            <input
                type="text"
                placeholder="Secret Santa 2024"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul className='over'>
                {games.map(game => (
                    <li key={game.id} onClick={() => {
                        setSelectedGame(game)
                    }}>
                        <Game game={game} compact />
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