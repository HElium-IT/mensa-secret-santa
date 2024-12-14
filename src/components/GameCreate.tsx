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
    const { user } = useAuthenticator((context) => [context.user]);
    const [showCreateForm, setShowCreateForm] = useState(false);

    useEffect(() => {
        if (!user.signInDetails?.loginId) return;
        const subscription = client.models.Game.onCreate({
            filter: {
                ownerId: { eq: user.signInDetails?.loginId }
            }
        }).subscribe({
            next: async (game) => {
                if (game.ownerId !== user.signInDetails?.loginId) return;
                console.info("GameCreate.GameOnCreateSubscription", "triggered", game);
                const { data: gamePerson } = await client.models.GamePerson.create({
                    gameId: game.id,
                    personId: user.signInDetails?.loginId ?? '',
                    role: "CREATOR",
                    acceptedInvitation: true,
                });
                console.debug("GamePerson created", gamePerson);
                setGame(game);
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

                            joinQrCode: { display: 'none' },
                            ownerId: { display: 'none', required: false, value: user.signInDetails?.loginId },
                            phase: { display: 'none', required: false, value: "REGISTRATION_OPEN" }
                        }}
                        onValidate={{
                            ownerId: () => { return { hasError: false } },
                            phase: () => { return { hasError: false } }
                        }}
                        onSubmit={(data) => {
                            // TODO Check if thise 2 lines can be removed (since the "value" attribute is set in the overrides)
                            data.ownerId = user.signInDetails?.loginId ?? 'UNKNOWN';
                            data.phase = "REGISTRATION_OPEN";
                            console.debug("Game to create", data);
                            return data;
                        }}
                        onError={(fields, errors) => { console.error("Game creation error", { fields, errors }); }}
                        onSuccess={(data) => { console.debug("Game created", data); }}
                    // onSubmit={(game) => {
                    //     game.ownerId = user.signInDetails?.loginId ?? '';
                    //     game.phase = "REGISTRATION_OPEN";
                    //     console.debug("Game to create", game);
                    //     return game;
                    // }}
                    />
                </>
            }

        </>
    );
}

export default GameCreate;
