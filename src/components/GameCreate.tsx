import { useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import GameCreateForm from "../ui-components/GameCreateForm";


const client = generateClient<Schema>();

function GameCreate({
    setIsCreatingGame,
    setGame,
}: {
    readonly setIsCreatingGame: (isCreatingGame: boolean) => void;
    readonly setGame: (createdGame: Schema["Game"]["type"] | undefined
    ) => void;
}) {
    const { user } = useAuthenticator();
    const [showCreateForm, setShowCreateForm] = useState(false);

    useEffect(() => {
        if (!user.signInDetails?.loginId) return;
        const subscription = client.models.Game.onCreate().subscribe({
            next: async (data) => {
                if (data.ownerId !== user.signInDetails?.loginId) return;
                console.debug("Game created", data);
                const gamePerson = await client.models.GamePerson.create({
                    gameId: data.id,
                    personId: user.signInDetails?.loginId ?? '',
                    role: "CREATOR",
                    acceptedInvitation: true,
                });
                console.debug("GamePerson created", gamePerson);
                setGame(data);
            }
        });

        return () => subscription.unsubscribe();
    }, [user]);

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
                            ownerId: { display: 'none', isRequired: false },
                            phase: { display: 'none', isRequired: false },
                        }}
                        onError={(error) => { console.error("Game creation error", error); }}
                        onSuccess={(game) => { console.debug("Game created", game); }}
                        onSubmit={(game) => {
                            game.ownerId = user.signInDetails?.loginId ?? '';
                            game.phase = "REGISTRATION_OPEN";
                            console.debug("Game to create", game);
                            return game;
                        }}
                    />
                </>
            }

        </>
    );
}

export default GameCreate;
