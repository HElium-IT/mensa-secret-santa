
import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import GameCreateAdminPanel from './GameCreateAdminPanel';
import GameInviteAdminPanel from './GameInviteAdminPanel';

const client = generateClient<Schema>();

function GameAdminPanel() {
    const { user } = useAuthenticator();
    const [game, setGame] = useState<Schema['Game']['type'] | null>(null);
    const [gameData, setGameData] = useState({
        name: '',
        description: '',
        phase: 'LOBBY' as Schema['Game']['type']['phase'],
    });

    useEffect(() => {
        async function fetchGame() {
            if (!user.signInDetails?.loginId) return;
            const { data: games } = await client.models.Game.list();
            const userGame = games.find(g => g?.creatorLoginId === user.signInDetails?.loginId);
            if (userGame) {
                setGame(userGame);
                setGameData({
                    name: userGame.name,
                    description: userGame.description,
                    phase: userGame.phase,
                });
            }
        }
        fetchGame();
    }, [user]);

    async function updateGame() {
        if (game) {
            const updatedGame = {
                ...game,
                name: gameData.name,
                description: gameData.description,
                phase: gameData.phase,
            };
            const { data, errors } = await client.models.Game.update(updatedGame);
            if (data) {
                setGame(data);
                alert('Gioco aggiornato con successo');
            } else {
                console.error('Errore nell\'aggiornamento del gioco:', errors);
            }
        }
    }

    if (!game) {
        return <GameCreateAdminPanel />;
    }

    return (
        <div>
            <h2>Pannello di Amministrazione del Gioco</h2>
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
            <select
                value={gameData.phase as string}
                onChange={(e) => setGameData({ ...gameData, phase: e.target.value as Schema['Game']['type']['phase'] })}
            >
                <option value="LOBBY">Lobby</option>
                <option value="REGISTRATION_OPEN">Registrazioni Aperte</option>
                <option value="STARTED">Iniziato</option>
                <option value="FINISHED">Terminato</option>
            </select>
            <button onClick={updateGame}>Aggiorna Gioco</button>
            <GameInviteAdminPanel gameId={game.id} />
        </div>
    );
}

export default GameAdminPanel;