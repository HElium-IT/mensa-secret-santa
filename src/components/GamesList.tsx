import { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import Game from './Game';
import { sortGames } from '../utils';


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
            next: async ({ items: gamePeople }) => {
                setGames(
                    (await Promise.all(await gamePeople.map(async (gamePerson) => {
                        const { data: game } = await gamePerson.game();
                        return game;
                    }))
                    ).filter(game => !!game)
                );
            }
        });
        return () => subscription.unsubscribe();
    }, [user]);

    return (
        <>
            <h2>Le tue partite</h2>
            <ul className='over'>
                {games.sort(sortGames).map(game => (
                    <li key={game.id} onClick={() => setGame(game)}>
                        <Game game={game} compact />
                    </li>
                ))}
            </ul>
        </>
    );
}

export default GamesList;