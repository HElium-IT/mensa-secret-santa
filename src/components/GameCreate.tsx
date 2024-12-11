import { useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import type { GameCreateFormInputValues } from "../ui-components/GameCreateForm";
import GameCreateForm from "../ui-components/GameCreateForm";
import Game from './Game';


const client = generateClient<Schema>();

function GamesList({
    setIsCreatingGame,
}: {
    readonly setIsCreatingGame: (isCreatingGame: boolean) => void;
}) {
    const { user } = useAuthenticator();
    const [showCreateForm, setShowCreateForm] = useState(false);

    async function createGamePerson(gameValues: GameCreateFormInputValues) {
        console.debug("Game created", gameValues);
        const gamePerson = await client.models.GamePerson.create({
            gameId: game.id,
            personId: user?.signInDetails?.loginId ?? '',
            role: "CREATOR",
            acceptedInvitation: true,
        }, { authMode: 'userPool' });
        if (!gamePerson.data) {
            client.models.Game.delete({ id: game.id }, { authMode: 'userPool' });
            throw new Error(gamePerson.errors?.join(", ") ?? "Failed to create game person");
        }
        console.debug("GamePerson created", gamePerson.data);
    }

    useEffect(() => {
        // TODO only one creator per game, saved in Game.creatorId.
        // TODO client.models.Game.onCreate => client.models.GamePerson.create ["CREATOR"]
    }, []);

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
                            createGamePerson(fields)
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
