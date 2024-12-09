import { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { getPersonGames } from "../utils";
import Game from './Game';


const client = generateClient<Schema>();

function GamesList({ setGame }: { readonly setGame: (game: Schema["Game"]["type"] | undefined) => void }) {
    const { user } = useAuthenticator();
    const [games, setGames] = useState<Schema["Game"]["type"][]>([]);

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
            <h2>I tuoi giochi</h2>
            <ul className='fancy-bg' style={{ width: '600px', overflowY: 'auto' }}>
                {games.map(game => (
                    <li key={game.id} onClick={() => setGame(game)}>
                        <Game game={game} compact />
                    </li>
                ))}
            </ul>
        </>
    );
}

export default GamesList;
