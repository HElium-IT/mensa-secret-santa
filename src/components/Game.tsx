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
import { Subscription } from "rxjs";

// TODO: everything should be reactive, so we should use the subscription to update the UI.

function Game({ game, compact = false, onDelete, isAdmin = false }: {
    readonly game: Schema["Game"]["type"],
    readonly compact?: boolean
    readonly onDelete?: () => void
    readonly isAdmin?: boolean
}) {
    const { user } = useAuthenticator((context) => [context.user]);
    const [dynamicGame, setDynamicGame] = useState<Schema["Game"]["type"]>(game);
    const [phaseText, setPhaseText] = useState<string>(gamePhaseToText(game.phase));
    const [phaseIcon, setPhaseIcon] = useState<string>(gamePhaseToIcon(game.phase));

    const [gamePeople, setGamePeople] = useState<Schema["GamePerson"]["type"][]>([]);
    const [gamePerson, setGamePerson] = useState<Schema["GamePerson"]["type"]>();
    const [gamePersonRoleText, setPersonGameRoleText] = useState<string>("");

    const [promptDeleteConfirmation, setPromptDeleteConfirmation] = useState(false);
    const [promptAbandonConfirmation, setPromptAbandonConfirmation] = useState(false);

    const [gift, setGift] = useState<Schema["Gift"]["type"]>();
    const client = generateClient<Schema>();

    const [totalGifts, setTotalGifts] = useState<number>(0);
    const [nonPlayerTotalGifts, setNonPlayerTotalGifts] = useState<number>(0);

    useEffect(() => {
        if (!game) return;

        let gamePeopleSubscriptions: Subscription[] = [];
        client.models.GamePerson.listGamePersonByGameId({
            gameId: game.id
        }).then(({ data: gamePeople }) => {

            gamePeopleSubscriptions = gamePeople.map(gamePerson => {
                const subscription = client.models.GamePerson.observeQuery({
                    filter: {
                        gameId: { eq: game.id },
                        personId: { eq: gamePerson.personId }
                    }
                }).subscribe({
                    next: async ({ items: gamePeople }) => {
                        setGamePeople(gamePeople);

                        const gamePerson = gamePeople.find(gp => gp.personId === user.signInDetails?.loginId);
                        if (!gamePerson) return;

                        setGamePerson(gamePerson);
                        setPersonGameRoleText(gamePersonRoleToIcon(gamePerson?.role));
                        console.debug("Game.GamePeople", gamePeople);
                        console.debug("Game.GamePerson", gamePerson);
                    }
                });
                return subscription;
            });
        })
        console.debug("Game.GamePeopleSubscriptions", gamePeopleSubscriptions);


        const gameOnDelete = client.models.Game.onDelete({
            filter: {
                id: { eq: dynamicGame.id }
            }
        }).subscribe({
            next: async (game) => {
                const { data: gamePeople } = await game.people();
                gamePeople.forEach(async gamePerson => {
                    client.models.GamePerson.delete({
                        gameId: dynamicGame.id,
                        personId: gamePerson.personId
                    });
                });
            }
        });
        console.debug("Game.onDeleteSubscription", onDelete);

        const gameOnUpdate = client.models.Game.onUpdate({
            filter: {
                id: { eq: dynamicGame.id }
            }
        }).subscribe({
            next: async (game) => {
                setDynamicGame(game);
            }
        });
        console.debug("Game.onUpdateSubscription", gameOnUpdate);

        return () => {
            gamePeopleSubscriptions.forEach(observer => observer.unsubscribe());
            gameOnDelete.unsubscribe();
            gameOnUpdate.unsubscribe();
        }
    }, []);

    useEffect(() => {
        if (!gamePeople?.length) return;
        gamePeople.forEach(async gamePerson => {
            const { data: fetchedGift, errors } = await client.models.Gift.get({
                ownerGameId: dynamicGame.id,
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
                ownerGameId: { eq: dynamicGame.id },
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
        if (!dynamicGame.phase) return;
        setPhaseIcon(gamePhaseToIcon(dynamicGame.phase));
        setPhaseText(gamePhaseToText(dynamicGame.phase, !!gift, (gift?.number ?? -1) > 0));
    }, [dynamicGame.phase, gift]);

    async function acceptGameInvitation() {
        if (!gamePerson) return
        const { data: updatedGamePerson, errors } = await client.models.GamePerson.update({
            gameId: dynamicGame.id,
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
        const { data: gamePeople } = await client.models.GamePerson.listGamePersonByGameId({ gameId: dynamicGame.id });
        if (gamePeople) {
            await Promise.all(gamePeople.map(async gp => {
                const resultGamePerson = await client.models.GamePerson.delete(
                    { gameId: dynamicGame.id, personId: gp.personId }
                );
                console.log("Game.deleteGame.DeletePeople",
                    resultGamePerson.errors ?? resultGamePerson.data);
            }));
        }
        const { data: resultGame, errors } = await client.models.Game.delete({ id: dynamicGame.id });
        if (errors) {
            console.error("Game.deleteGame.DeleteGame", errors);
            return;
        }
        console.debug("Game.deleteGame.DeleteGame", resultGame);

        if (onDelete) {
            onDelete();
        }
    }

    async function abandonGame() {
        if (!gamePerson) return
        const { data: resultGamePerson, errors } = await client.models.GamePerson.delete(
            { gameId: dynamicGame.id, personId: gamePerson.personId }
        );
        if (errors) {
            console.error("Game.abandonGame.DeletedGamePerson", errors);
            return;
        }
        console.debug("Game.abandonGame.DeletedGamePerson", resultGamePerson);

        const { data: gift, errors: giftErrors } = await client.models.Gift.delete({
            ownerGameId: dynamicGame.id,
            ownerPersonId: gamePerson.personId
        });
        if (giftErrors) {
            console.error("Game.abandonGame.DeletedGift", giftErrors);
            return;
        }

        console.debug("Game.abandonGame.DeletedGift", gift);

        if (onDelete) {
            onDelete();
        }

    }

    if (gamePerson === undefined || compact) {
        return (
            <div className="flex-row">
                <h3>
                    {gamePersonRoleText && <span>{gamePersonRoleText}</span>}
                    <span>{phaseIcon}</span>{dynamicGame.name}
                </h3>
            </div>
        )
    }

    if (!gamePerson.acceptedInvitation) {
        return (
            <div className="flex-row">
                <h3><span>{phaseIcon}</span>{dynamicGame.name}</h3>
                <button onClick={acceptGameInvitation}>
                    Accetta invito come {gamePerson.role?.toLowerCase()}
                </button>
            </div>
        );
    }

    const gameBaseDetails = (
        <>
            <h2><button style={{ margin: "1rem" }} onClick={onDelete}>{"<"}</button><span>{gamePersonRoleText}</span>{dynamicGame.name}</h2>
            <p>Descrizione: {dynamicGame.description}</p>
        </>
    )

    const giftDetails = (
        <>
            <p><span>{phaseIcon}</span> {phaseText}</p>
            {dynamicGame.phase !== "FINISHED" && (
                gift ?
                    <Gift gift={gift} onDelete={() => setGift(undefined)} />
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
                <button onClick={abandonGame}>Abbandona</button>
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
                <InviteGamePerson gameId={dynamicGame.id} userRole={gamePerson.role} />
            )}
            <div className="flex-row">
                {!promptDeleteConfirmation
                    && (gamePerson.role === "CREATOR" || isAdmin) &&
                    <button style={{ background: 'red' }} onClick={() => setPromptDeleteConfirmation(true)}>Elimina</button>
                }
                {promptDeleteConfirmation &&
                    <button style={{ background: 'red' }} onClick={deleteGame}>Conferma</button >
                }
                {!promptAbandonConfirmation
                    && gamePerson.role !== "CREATOR" &&
                    <button style={{ background: 'red' }} onClick={() => setPromptAbandonConfirmation(true)}>Abbandona</button>
                }
                {promptAbandonConfirmation &&
                    <button style={{ background: 'red' }} onClick={abandonGame}>Conferma</button>
                }
                {(promptDeleteConfirmation || promptAbandonConfirmation) &&
                    <button style={{ background: 'lightcoral' }} onClick={() => {
                        setPromptDeleteConfirmation(false);
                        setPromptAbandonConfirmation(false);
                    }}>Annulla</button>
                }
                <GamePhaseUpdater
                    game={game}
                    gamePerson={gamePerson}
                    phase={dynamicGame.phase}
                    setPhase={(phase: Schema["Game"]["type"]["phase"]) => setDynamicGame({ ...dynamicGame, phase })}
                />
            </div>

        </>
    );
}

export default Game;