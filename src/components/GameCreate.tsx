
import { useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

function GameCreate({ onGameCreated }: { onGameCreated: () => void }) {
    const { user } = useAuthenticator();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    async function createGame(event: React.FormEvent) {
        event.preventDefault();
        const game = await client.models.Game.create({
            name,
            description,
            phase: "LOBBY"
        });
        if (!game.data) return;

        await client.models.GamePerson.create({
            gameId: game.data.id,
            personId: user?.signInDetails?.loginId || '',
            role: "CREATOR",
            acceptedInvitation: true,
        });
        onGameCreated();
    }

    return (
        <form onSubmit={createGame}>
            <h2>Crea un nuovo gioco</h2>
            <label>
                Nome del gioco:
                <input type="text" value={name} onChange={e => setName(e.target.value)} required />
            </label>
            <label>
                Descrizione:
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} required />
            </label>
            <button type="submit">Crea</button>
        </form>
    );
}

export default GameCreate;