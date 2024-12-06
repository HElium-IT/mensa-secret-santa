
import { useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function GameCreateAdminPanel() {
    const { user } = useAuthenticator();

    const [gameData, setGameData] = useState({
        name: '',
        description: '',
    });

    async function createGame() {
        if (!user.signInDetails?.loginId) {
            alert('Devi effettuare il login per creare un gioco');
            return;
        }

        const { data: game, errors } = await client.models.Game.create({
            creatorLoginId: user.signInDetails.loginId,
            name: gameData.name,
            description: gameData.description,
            phase: 'LOBBY',
        });

        if (game) {
            alert('Gioco creato con successo');
            // ...additional logic...
        } else {
            console.error('Errore nella creazione del gioco:', errors);
        }
    }

    return (
        <div>
            <h2>Crea un nuovo gioco</h2>
            <input
                type="text"
                placeholder="Nome del gioco"
                value={gameData.name}
                onChange={(e) => setGameData({ ...gameData, name: e.target.value })}
            />
            <input
                type="text"
                placeholder="Descrizione"
                value={gameData.description}
                onChange={(e) => setGameData({ ...gameData, description: e.target.value })}
            />
            <button onClick={createGame}>Crea gioco</button>
        </div>
    );
}

export default GameCreateAdminPanel;