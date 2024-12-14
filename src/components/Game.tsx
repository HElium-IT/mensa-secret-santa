import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";

import type { Schema } from "../../amplify/data/resource";
import { gamePhaseToIcon, gamePersonRoleToIcon, gamePhaseToText } from "../utils";

import GamePeople from './GamePeople';
import Gift from "./Gift";
import GiftCreate from "./GiftCreate";
import GamePhaseUpdater from "./GamePhaseUpdater";
import InviteGamePerson from "./InviteGamePerson";


function Game({ game, compact = false, onDelete }: {
    readonly game: Schema["Game"]["type"],
    readonly compact?: boolean
    readonly onDelete?: () => void
}) {
    const { user } = useAuthenticator((context) => [context.user]);
    const [phase, setPhase] = useState<Schema["Game"]["type"]["phase"]>(game.phase);
    const [phaseText, setPhaseText] = useState<string>(gamePhaseToText(game.phase));
    const [phaseIcon, setPhaseIcon] = useState<string>(gamePhaseToIcon(game.phase));

    const [gamePeople, setGamePeople] = useState<Schema["GamePerson"]["type"][]>([]);
    const [gamePerson, setGamePerson] = useState<Schema["GamePerson"]["type"]>();
    const [gamePersonRoleText, setPersonGameRoleText] = useState<string>("");

    const [promptDeleteConfirmation, setPromptDeleteConfirmation] = useState(false);

    const [gift, setGift] = useState<Schema["Gift"]["type"]>();
    const client = generateClient<Schema>();

    const [totalGifts, setTotalGifts] = useState<number>(0);
    const [nonPlayerTotalGifts, setNonPlayerTotalGifts] = useState<number>(0);

    useEffect(() => {
        if (!game) return;
        game.people().then(({ data: gamePeopleData }) => {
            if (!gamePeopleData) return;
            console.debug("Game.GamePeople", gamePeopleData);
            setGamePeople(gamePeopleData);
            gamePeopleData.forEach(gp => {
                if (!gp) return;
                if (gp.personId === user.signInDetails?.loginId) {
                    console.debug("Game.GamePerson", gp);
                    setGamePerson(gp);
                    setPersonGameRoleText(gamePersonRoleToIcon(gp.role));
                }
            });
        });

        const subscription = client.models.Game.onDelete({
            filter: {
                id: { eq: game.id }
            }
        }).subscribe({
            next: async (game) => {
                const { data: gamePeople } = await game.people();
                gamePeople.forEach(async gamePerson => {
                    client.models.GamePerson.delete({
                        gameId: game.id,
                        personId: gamePerson.personId
                    });
                });
            }
        });
        console.log("Game.onDeleteSubscription", subscription);

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (!gamePeople?.length) return;
        gamePeople.forEach(async gamePerson => {
            const { data: fetchedGift, errors } = await client.models.Gift.get({
                ownerGameId: game.id,
                ownerPersonId: gamePerson.personId
            })
            if (errors) {
                console.error("Game.fetchedGift", errors)
                return;
            }
            if (!fetchedGift) return
            setTotalGifts(totalGifts + 1);
            if (gamePerson.role !== "PLAYER") {
                setNonPlayerTotalGifts(nonPlayerTotalGifts + 1);
            }
        });
    }, [gamePeople]);

    useEffect(() => {
        if (!gamePerson) return;
        const subscription = client.models.Gift.observeQuery({
            filter: {
                ownerGameId: { eq: game.id },
                ownerPersonId: { eq: gamePerson.personId }
            }
        }).subscribe({
            next: ({ items: gifts }) => {
                if (gifts && gifts.length > 0) {
                    setGift(gifts[0]);
                }
            }
        })
        return () => subscription.unsubscribe();
    }, [gamePerson]);

    useEffect(() => {
        if (!phase) return;
        setPhaseIcon(gamePhaseToIcon(phase));
        setPhaseText(gamePhaseToText(phase, !!gift, (gift?.number ?? -1) > 0));
    }, [phase, gift]);

    async function acceptGameInvitation() {
        if (!gamePerson) return
        const { data: updatedGamePerson, errors } = await client.models.GamePerson.update({
            gameId: game.id,
            personId: gamePerson.personId,
            acceptedInvitation: true
        })
        if (errors || !updatedGamePerson) {
            console.error("Game.acceptGameInvitation", errors);
            return;
        }
        console.debug("Game.acceptGameInvitation", updatedGamePerson);
    }

    async function deleteGame() {
        if (!gamePerson) return
        const { data: gamePeople } = await client.models.GamePerson.listGamePersonByGameId({ gameId: game.id });
        if (gamePeople) {
            await Promise.all(gamePeople.map(async gp => {
                const resultGamePerson = await client.models.GamePerson.delete(
                    { gameId: game.id, personId: gp.personId }
                );
                console.log("Game.deleteGamePeople",
                    resultGamePerson.errors ?? resultGamePerson.data);
            }));
        }
        const resultGame = await client.models.Game.delete({ id: game.id });
        console.log("Game.deleteGame",
            resultGame.errors ?? resultGame.data);
        if (onDelete) {
            onDelete();
        }
    }

    if (gamePerson === undefined || compact) {
        return <div className="flex-row">
            <h3 >
                <span>{gamePersonRoleText}</span><span>{phaseIcon}</span>{game.name}
            </h3>
        </div>
    }

    if (!gamePerson.acceptedInvitation) {
        return (
            <div className="flex-row">
                <h3><span>{phaseIcon}</span>{game.name}</h3>
                <button onClick={acceptGameInvitation}>
                    Accetta invito come {gamePerson.role?.toLowerCase()}
                </button>
            </div>
        );
    }

    const gameBaseDetails = (
        <>
            <h2><button style={{ margin: "1rem" }} onClick={onDelete}>{"<"}</button><span>{gamePersonRoleText}</span>{game.name}</h2>
            <p>Descrizione: {game.description}</p>
        </>
    )

    const giftDetails = (
        <>
            <p><span>{phaseIcon}</span> {phaseText}</p>
            {phase !== "FINISHED" && (
                gift ?
                    <Gift gift={gift} />
                    :
                    <GiftCreate gamePerson={gamePerson} />
            )}
        </>
    )

    if (gamePerson.role === "PLAYER") {
        return (
            <>
                {gameBaseDetails}
                {/* <p>Numero di giocatori: {gamePeople.filter(gp => gp.role === "PLAYER").length}</p> */}

                {
                    <p>
                        regali totali {
                            totalGifts
                        } / {
                            gamePeople.filter(gp => gp.role === "PLAYER").length + nonPlayerTotalGifts
                        } giocatori totali
                    </p>
                }
                {giftDetails}
            </>
        )
    }

    return (
        <>
            {gameBaseDetails}
            {giftDetails}
            <h3>Creatori</h3>
            <GamePeople gamePeople={gamePeople} filterRole="CREATOR" userRole={gamePerson.role} />
            <h3>Admin</h3>
            <GamePeople gamePeople={gamePeople} filterRole="ADMIN" userRole={gamePerson.role} />
            <h3>Giocatori</h3>
            <GamePeople gamePeople={gamePeople} filterRole="PLAYER" userRole={gamePerson.role} />
            {(gamePerson.role === "CREATOR" || gamePerson.role === "ADMIN") && (
                <InviteGamePerson gameId={game.id} userRole={gamePerson.role} />
            )}
            <div className="flex-row">
                <p>
                    {!promptDeleteConfirmation && gamePerson.role === "CREATOR" &&
                        <button style={{ background: 'red' }} onClick={() => setPromptDeleteConfirmation(true)}>Elimina</button>
                    }
                    {promptDeleteConfirmation &&
                        <button style={{ background: 'red' }} onClick={deleteGame}>Conferma</button >
                    }
                </p>
                <GamePhaseUpdater
                    game={game}
                    gamePerson={gamePerson}
                    phase={phase}
                    setPhase={setPhase}
                />
            </div>
        </>
    );
}

export default Game;