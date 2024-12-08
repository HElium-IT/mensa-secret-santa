import { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { getPersonGames } from "../utils";
import Game from './Game';
import type { GameCreateFormInputValues } from "../ui-components/GameCreateForm";
import GameCreateForm from "../ui-components/GameCreateForm";


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

    async function createGame(fields: GameCreateFormInputValues) {
        if (!fields.name || !fields.description) {
            console.error("Name and description are required");
            return;
        }

        const game = await client.models.Game.create({
            name: fields.name,
            description: fields.description,
            joinQrCode: fields.joinQrCode ?? "",
            phase: (fields.phase ?? "LOBBY") as Schema["Game"]["type"]["phase"],
        });
        if (!game.data) return;

        await client.models.GamePerson.create({
            gameId: game.data.id,
            personId: user?.signInDetails?.loginId ?? '',
            role: "CREATOR",
            acceptedInvitation: true,
        });
    }

    return (
        <>
            <h2>La tua lista di giochi</h2>
            {<button onClick={() => setShowCreateForm(true)}>Crea Nuovo Gioco</button>}
            {showCreateForm &&
                <GameCreateForm
                    overrides={{
                        joinQrCode: { display: 'none', value: "" },
                        phase: { display: 'none', value: "LOBBY" },

                    }}
                    onSuccess={(fields) => {
                        createGame(fields).then(() => {
                            setShowCreateForm(false);
                        }, alert);
                    }}
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
