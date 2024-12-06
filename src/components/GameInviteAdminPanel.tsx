
import { useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

interface Props {
    readonly gameId: string;
}

function GameInviteAdminPanel({ gameId }: Props) {
    const [inviteeLoginId, setInviteeLoginId] = useState('');
    const [role, setRole] = useState<'admin' | 'player'>('player');

    async function invite() {
        const { data: game, errors } = await client.models.Game.get({ id: gameId });

        if (game) {
            if (role === 'admin') {
                const updatedAdmins = [...game.administrators, inviteeLoginId];
                await client.models.Game.update({
                    ...game,
                    administrators: updatedAdmins,
                });
            } else {
                const updatedPlayers = [...game.players, inviteeLoginId];
                await client.models.Game.update({
                    ...game,
                    players: updatedPlayers,
                });
            }
            alert(`Invitato ${inviteeLoginId} come ${role}`);
        } else {
            console.error('Errore nel recupero del gioco:', errors);
        }
    }

    return (
        <div>
            <h2>Invita Utenti</h2>
            <input
                type="text"
                placeholder="Login ID Utente"
                value={inviteeLoginId}
                onChange={(e) => setInviteeLoginId(e.target.value)}
            />
            <select value={role} onChange={(e) => setRole(e.target.value as 'admin' | 'player')}>
                <option value="player">Giocatore</option>
                <option value="admin">Amministratore</option>
            </select>
            <button onClick={invite}>Invia Invito</button>
        </div>
    );
}

export default GameInviteAdminPanel;