import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

import { Game, GameSelector, GameCreate, GamesList, UserDetails } from ".";

const client = generateClient<Schema>();


function RoutingView() {
    const { user, signOut } = useAuthenticator((context) => [context.user]);
    const [person, setPerson] = useState<Schema["Person"]["type"]>();
    const [selectedGame, setSelectedGame] = useState<Schema["Game"]["type"]>();

    const [isSelectingGame, setIsSelectingGame] = useState(true);
    const [isCreatingGame, setIsCreatingGame] = useState(false);

    async function getOrCreatePerson() {
        let { data: person } = await client.models.Person.get({ ownerId: user.signInDetails?.loginId ?? '' });

        if (!person) {
            const { data, errors } = await client.models.Person.create({
                ownerId: user.signInDetails?.loginId as string,
                isAdmin: user.signInDetails?.loginId === "elio.palomba.dev@gmail.com"
            });
            if (!data || errors) {
                console.error(errors);
                return;
            }
            person = data;
        }
        setPerson(person);
        console.debug("Person", person);
    }

    useEffect(() => {
        if (!user) return;
        console.debug("User", user);

        getOrCreatePerson()
    }, []);

    async function handleSignOut() {
        await signOut()
    }

    async function selectGame(game?: Schema["Game"]["type"]) {
        setSelectedGame(game);
        if (game)
            console.debug("Game", { ...game, secret: "***" });
    }

    return (
        <main style={{ maxHeight: "95vh" }}>
            {selectedGame
                ? <Game game={selectedGame} onDelete={() => selectGame()} isAdmin={!!person?.isAdmin} />
                : <>
                    <UserDetails user={user} signOut={handleSignOut} />
                    {person?.isAdmin && !isSelectingGame && <GameCreate setIsCreatingGame={setIsCreatingGame} setGame={selectGame} />}
                    {!isCreatingGame && <GameSelector setGame={selectGame} setIsSelectingGame={setIsSelectingGame} isAdmin={!!person?.isAdmin} />}
                    {!isCreatingGame && !isSelectingGame && <GamesList setGame={selectGame} isAdmin={!!person?.isAdmin} />}
                </>
            }
        </main>
    );
}

export default RoutingView;
