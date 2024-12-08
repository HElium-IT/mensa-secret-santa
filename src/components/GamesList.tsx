import { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { getPersonGames } from "../utils";
import Game from './Game';
import GameCreate from './GameCreate';

const client = generateClient<Schema>();

function GamesList() {
    const { user } = useAuthenticator();
    const [games, setGames] = useState<Schema["Game"]["type"][]>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);

    useEffect(() => {
        if (!user) return;
        const subscription = client.models.GamePerson.observeQuery({
            filter: {
                personId: { eq: user.signInDetails?.loginId ?? '' }
            }
        }).subscribe({
            next: ({ items: gamePeople }) => {
                getPersonGames(gamePeople, user.signInDetails?.loginId ?? '').then(setGames);
            }
        });
        return () => subscription.unsubscribe();
    }, [user]);

    return (
        <>
            <h2>La tua lista di giochi</h2>
            {<button onClick={() => setShowCreateForm(true)}>Crea Nuovo Gioco</button>}
            {showCreateForm &&
                <GameCreate
                    onCreated={() => setShowCreateForm(false)}
                    onCancel={() => setShowCreateForm(false)}
                />
            }
            <ul style={{ height: '400px', overflowY: 'scroll' }}>
                {games.map(game => (
                    <li key={game.id}>
                        <Game game={game} />
                    </li>
                ))}
            </ul>
        </>
    );
}

export default GamesList;
