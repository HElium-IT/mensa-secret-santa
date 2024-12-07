import { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import Game from './Game';
import GameCreate from './GameCreate';

const client = generateClient<Schema>();

function GamesList() {
    const { user } = useAuthenticator();
    const [games, setGames] = useState<Schema["Game"]["type"][]>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);

    useEffect(() => {
        client.models.Game.observeQuery().subscribe({
            next: (data) => setGames([...data.items])
        });
    }, [user]);

    function handleGameCreated() {
        setShowCreateForm(false);
    }

    return (
        <div>
            <h2>La tua lista di giochi
                <button onClick={() => setShowCreateForm(true)}>Crea Nuovo Gioco</button></h2>
            {showCreateForm && <GameCreate onGameCreated={handleGameCreated} />}
            <ul>
                {games.map(game => (
                    <li key={game.id}>
                        <Game game={game} compact />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default GamesList;
