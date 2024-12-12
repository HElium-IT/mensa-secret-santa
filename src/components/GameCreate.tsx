import { useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import GameCreateForm from "../ui-components/GameCreateForm";


const client = generateClient<Schema>();

function GamesList({
    setIsCreatingGame,
}: {
    readonly setIsCreatingGame: (isCreatingGame: boolean) => void;
}) {
    const { user } = useAuthenticator();
    const [showCreateForm, setShowCreateForm] = useState(false);

    useEffect(() => {
        if (!user) return;
        const subscription = client.models.Game.observeQuery({
            filter: {
                creatorId: { eq: user?.signInDetails?.loginId }
            }
        }).subscribe({
            next: async ({ items: games }) => {
                await Promise.all([
                    games.forEach(async game => {
                        const { data: GamesPerson } = await client.models.GamePerson.listGamePersonByPersonId({
                            personId: user?.signInDetails?.loginId ?? ''
                        })
                        let found = false;
                        GamesPerson.forEach(gp => {
                            if (gp.role === "CREATOR") {
                                found = true;
                            }
                        })
                        if (!found) {
                            await client.models.GamePerson.create({
                                gameId: game.id,
                                personId: user?.signInDetails?.loginId ?? '',
                                role: "CREATOR",
                                acceptedInvitation: true,
                            });
                        }
                    })
                ]);
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
                            creatorId: { display: 'none', value: user?.signInDetails?.loginId },
                            name: { label: "Nome", placeholder: "Cenone di natale" },
                            description: { label: "Descrizione", placeholder: "Cena Natale 2024 a casa di Francesco" },
                            secret: { label: "Segreto", placeholder: "Ciccio2024" },
                            joinQrCode: { display: 'none', isRequired: false },
                            phase: { display: 'none', isRequired: false, value: "REGISTRATION_OPEN" },
                        }}
                        onError={console.error}
                        onSuccess={console.debug}
                        onSubmit={(game) => {
                            console.debug("Game", game);
                            return game
                        }}
                    />
                </>
            }

        </>
    );
}

export default GamesList;
