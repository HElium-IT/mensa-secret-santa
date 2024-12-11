import { useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import type { GameCreateFormInputValues } from "../ui-components/GameCreateForm";
import GameCreateForm from "../ui-components/GameCreateForm";


const client = generateClient<Schema>();

function GamesList({
    setIsCreatingGame,
}: {
    readonly setIsCreatingGame: (isCreatingGame: boolean) => void;
}) {
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
            joinQrCode: "",
            phase: "REGISTRATION_OPEN" as Schema["Game"]["type"]["phase"],
        }, { authMode: 'none' });
        if (!game.data)
            throw new Error(game.errors?.join(", ") ?? "Failed to create game");
        console.debug("Game created", game.data);

        const gamePerson = await client.models.GamePerson.create({
            gameId: game.data.id,
            personId: user?.signInDetails?.loginId ?? '',
            role: "CREATOR",
            acceptedInvitation: true,
        }, { authMode: 'none' });
        if (!gamePerson.data) {
            client.models.Game.delete({ id: game.data.id }, { authMode: 'none' });
            throw new Error(gamePerson.errors?.join(", ") ?? "Failed to create game person");
        }
        console.debug("GamePerson created", gamePerson.data);
    }

    useEffect(() => {
        setIsCreatingGame(showCreateForm);
    }, [showCreateForm]);

    return (
        <>
            {!showCreateForm && <button onClick={() => setShowCreateForm(true)}>Crea Nuovo Partita</button>}
            {showCreateForm &&
                <>
                    <button onClick={() => setShowCreateForm(false)}>Annulla</button>
                    <GameCreateForm
                        overrides={{
                            name: { label: "Nome", placeholder: "Cenone di natale" },
                            description: { label: "Descrizione", placeholder: "Cena Natale 2024 a casa di Francesco" },
                            secret: { label: "Segreto", placeholder: "Ciccio2024" },
                            joinQrCode: { display: 'none', isRequired: false },
                            phase: { display: 'none', isRequired: false },
                        }}
                        onSuccess={(fields) => {
                            createGame(fields)
                                .then(() => { setShowCreateForm(false); })
                                .catch(alert);
                        }}
                    />
                </>
            }

        </>
    );
}

export default GamesList;
