import { useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import type { GameCreateFormInputValues } from "../ui-components/GameCreateForm";
import GameCreateForm from "../ui-components/GameCreateForm";


const client = generateClient<Schema>();

function GamesList() {
    const { user } = useAuthenticator();
    const [showCreateForm, setShowCreateForm] = useState(false);

    async function createGame(fields: GameCreateFormInputValues) {
        if (!fields.name || !fields.description || !fields.secret) {
            throw new Error("Name, description, and secret are required");
        }

        const game = await client.models.Game.create({
            name: fields.name,
            description: fields.description,
            secret: fields.secret,
            joinQrCode: fields.joinQrCode ?? "",
            phase: (fields.phase ?? "REGISTRATION_OPEN") as Schema["Game"]["type"]["phase"],
        });
        if (!game.data)
            throw new Error(game.errors?.join(", ") ?? "Failed to create game");

        const gamePerson = await client.models.GamePerson.create({
            gameId: game.data.id,
            personId: user?.signInDetails?.loginId ?? '',
            role: "CREATOR",
            acceptedInvitation: true,
        });
        if (!gamePerson.data)
            throw new Error(gamePerson.errors?.join(", ") ?? "Failed to create game person");
    }

    return (
        <>
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

        </>
    );
}

export default GamesList;
