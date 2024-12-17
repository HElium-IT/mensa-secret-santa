import { useEffect, useMemo, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";

import type { Schema } from "../../amplify/data/resource";
import { gamePhaseToIcon, gamePersonRoleToIcon, gamePhaseToText } from "../utils";

import GamePeople from './GamePeople';
import Gift from "./Gift";
import GiftCreate from "./GiftCreate";
import GamePhaseUpdater from "./GamePhaseUpdater";
import InviteGamePerson from "./InviteGamePerson";
import GameGiftControl from "./GameGiftController";

// TODO: everything should be reactive, so we should use the subscription to update the UI.

function Game({ game, compact = false, onDelete, isAdmin = false }: {
    readonly game: Schema["Game"]["type"],
    readonly compact?: boolean
    readonly onDelete?: () => void
    readonly isAdmin?: boolean
}) {
    const { user } = useAuthenticator((context) => [context.user]);
    const gameMemo = useMemo(() => game, [game]);
    const [dynamicGame, setDynamicGame] = useState<Schema["Game"]["type"]>(gameMemo);
    const [phaseText, setPhaseText] = useState<string>(gamePhaseToText(gameMemo.phase));
    const [phaseIcon, setPhaseIcon] = useState<string>(gamePhaseToIcon(gameMemo.phase));

    const [gamePeople, setGamePeople] = useState<Schema["GamePerson"]["type"][]>([]);
    const [gamePeopleGifts, setGamePeopleGifts] = useState<Record<string, Schema["Gift"]["type"]>>({});
    const [gamePerson, setGamePerson] = useState<Schema["GamePerson"]["type"]>();
    const [gamePersonRoleText, setPersonGameRoleText] = useState<string>("");

    const [promptDeleteConfirmation, setPromptDeleteConfirmation] = useState(false);
    const [promptAbandonConfirmation, setPromptAbandonConfirmation] = useState(false);

    const [ownedGift, setOwnedGift] = useState<Schema["Gift"]["type"]>();
    const [wonGift, setWonGift] = useState<Schema["Gift"]["type"]>();
    const [selectedGift, setSelectedGift] = useState<Schema["Gift"]["type"]>();
    const client = generateClient<Schema>();

    const [totalGifts, setTotalGifts] = useState<number>(0);
    const [nonPlayerTotalGifts, setNonPlayerTotalGifts] = useState<number>(0);

    const [registeredGifts, setRegisteredGifts] = useState<number>(0);
    const [nonPlayerRegisteredGifts, setNonPlayerRegisteredGifts] = useState<number>(0);

    const [wonGifts, setWonGifts] = useState<number>(0);
    const [nonPlayerWonGifts, setNonPlayerWonGifts] = useState<number>(0);

    async function _setGamePeople(gamePeople?: Schema["GamePerson"]["type"][]) {
        if (!gamePeople) {
            const { data, errors } = await gameMemo.people();
            if (errors) {
                console.error("Game._setGamePeople", errors);
                return;
            }
            gamePeople = data;
        }
        setGamePeople(gamePeople);
        console.debug("Game.GamePeople", gamePeople);

        gamePeople.forEach(async gamePerson => {
            const { data: gift } = await gamePerson.wonGift();
            if (gift) {
                setGamePeopleGifts((prev) => ({
                    ...prev,
                    [gamePerson.personId as string]: gift
                }));
            }
        });
        const gamePerson = gamePeople.find(gp => gp.personId === user.signInDetails?.loginId);
        if (!gamePerson) return;

        setGamePerson(gamePerson);
        setPersonGameRoleText(gamePersonRoleToIcon(gamePerson.role));
        console.debug("Game.GamePerson", gamePerson);
    }


    useEffect(() => {
        if (!gameMemo) return;


        const gamePeopleSubscription = client.models.GamePerson.observeQuery({
            filter: {
                gameId: { eq: gameMemo.id }
            }
        }).subscribe({
            next: async ({ items: gamePeople }) => {
                _setGamePeople(gamePeople.filter(gp => gp.gameId === gameMemo.id));
            }
        });
        console.debug("Game.GamePeopleSubscription", gamePeopleSubscription);

        if (compact)
            return () => gamePeopleSubscription.unsubscribe();

        // TODO : Move this 2 next subscriptions to one of the parents components
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
        console.debug("Game.onDeleteSubscription", gameOnDelete);

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
            gamePeopleSubscription.unsubscribe();
            gameOnDelete.unsubscribe();
            gameOnUpdate.unsubscribe();
        }
    }, [gameMemo]);

    useEffect(() => {
        if (!gamePerson || compact) return;

        const gameGiftsSubscription = client.models.Gift.observeQuery({
            filter: {
                ownerGameId: { eq: dynamicGame.id }
            }
        }).subscribe({
            next: ({ items: gifts }) => {

                setTotalGifts(gifts.length);
                console.log("Game.GiftsSubscription.TotalGifts", gifts);
                setNonPlayerTotalGifts(gifts.filter(gift => gamePeople.find(gp => gp.personId === gift.ownerPersonId)?.role !== "PLAYER").length);
                console.log("Game.GiftsSubscription.NonPlayerTotalGifts", nonPlayerTotalGifts);

                setRegisteredGifts(gifts.filter(gift => (gift.number ?? 0) > 0).length);
                console.log("Game.GiftsSubscription.RegisteredGifts", registeredGifts);
                setNonPlayerRegisteredGifts(gifts.filter(gift => (gift.number ?? 0) > 0 && gamePeople.find(gp => gp.personId === gift.ownerPersonId)?.role !== "PLAYER").length);

                setWonGifts(gifts.filter(gift => !!gift.winnerGameId).length);
                console.log("Game.GiftsSubscription.WonGifts", wonGifts);
                setNonPlayerWonGifts(gifts.filter(gift => !!gift.winnerGameId && gamePeople.find(gp => gp.personId === gift.ownerPersonId)?.role !== "PLAYER").length);
                console.log("Game.GiftsSubscription.NonPlayerWonGifts", nonPlayerWonGifts);

                const ownedGift = gifts.find(gift => gift.ownerPersonId === gamePerson.personId);
                if (ownedGift) {
                    console.debug("Game.GiftsSubscription.OwnedGift", ownedGift);
                    setOwnedGift(ownedGift);
                }
                const selectedGift = gifts.find(gift => gift.isSelected);
                if (selectedGift) {
                    console.debug("Game.GiftsSubscription.SelectedGift", selectedGift);
                    setSelectedGift(selectedGift);
                } else {
                    setSelectedGift(undefined);
                }
                const wonGift = gifts.find(gift => gift.winnerPersonId === gamePerson.personId);
                if (wonGift) {
                    console.debug("Game.GiftsSubscription.WonGift", wonGift);
                    setWonGift(wonGift);
                } else {
                    setWonGift(undefined);
                }
            }
        });
        console.debug("Game.GiftsSubscription", gameGiftsSubscription);

        return () => gameGiftsSubscription.unsubscribe();

    }, [gamePerson]);

    useEffect(() => {
        if (!dynamicGame.phase) return;
        setPhaseIcon(gamePhaseToIcon(dynamicGame.phase));
        setPhaseText(gamePhaseToText(dynamicGame.phase, !!ownedGift, (ownedGift?.number ?? -1) > 0));
    }, [dynamicGame.phase, ownedGift]);

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
            <p><span>{phaseIcon}</span> {phaseText}</p>
        </>
    )

    const ownedGiftDetails = (
        <>
            {ownedGift ?
                <Gift gift={ownedGift} onDelete={() => setOwnedGift(undefined)} ownerGamePerson={gamePerson} />
                :
                <GiftCreate gamePerson={gamePerson} />
            }
        </>
    )

    const selectedGiftDetails = (
        <>
            {selectedGift && <Gift gift={selectedGift} ownerGamePerson={gamePerson} selected />}
        </>
    )

    const wonGiftDetails = (
        <>
            {wonGift && <Gift gift={wonGift} ownerGamePerson={gamePerson} />}
        </>
    )

    const abandonPrompt = (
        <>
            {!promptAbandonConfirmation
                && gamePerson.role !== "CREATOR" &&
                <button style={{ background: 'red' }} onClick={() => setPromptAbandonConfirmation(true)}>Abbandona</button>
            }
            {promptAbandonConfirmation &&
                <button style={{ background: 'red' }} onClick={abandonGame}>Conferma</button>
            }
            {promptAbandonConfirmation &&
                <button style={{ background: 'lightcoral' }} onClick={() => {
                    setPromptAbandonConfirmation(false);
                }}>Annulla</button>
            }
        </>
    )

    const deletePrompt = (
        <>
            {!promptDeleteConfirmation
                && (gamePerson.role === "CREATOR" || isAdmin) &&
                <button style={{ background: 'red' }} onClick={() => setPromptDeleteConfirmation(true)}>Elimina</button>
            }
            {promptDeleteConfirmation &&
                <button style={{ background: 'red' }} onClick={deleteGame}>Conferma</button >
            }
            {promptDeleteConfirmation &&
                <button style={{ background: 'lightcoral' }} onClick={() => {
                    setPromptDeleteConfirmation(false);
                }}>Annulla</button>
            }
        </>
    )

    const giftsDetails = (
        <>
            {["REGISTRATION_OPEN", "LOBBY"].includes(dynamicGame.phase ?? '') &&
                <h4>Regali totali {totalGifts} / {gamePeople.filter(gp => gp.role === "PLAYER").length + nonPlayerTotalGifts} giocatori totali</h4>}
            {dynamicGame.phase === "LOBBY" &&
                <h4>Regali registrati {registeredGifts} / {gamePeople.filter(gp => gp.role === "PLAYER").length + nonPlayerRegisteredGifts} giocatori totali</h4>}
            {["STARTED", "PAUSED"].includes(dynamicGame.phase ?? '') &&
                <h4>Regali vinti {wonGifts} / {gamePeople.filter(gp => gp.role === "PLAYER").length + nonPlayerWonGifts} giocatori totali</h4>}
            {dynamicGame.phase === "FINISHED" &&
                <ul>
                    {gamePeopleGifts && Object.entries(gamePeopleGifts).map(([personId, gift]) => (
                        <li key={personId}>
                            <p style={{ margin: '0px' }}>
                                {personId.split("@")[0]} ha ricevuto
                            </p>
                            <p style={{ margin: '0px' }}>
                                "{gift.name}" da {gift.ownerPersonId.split("@")[0]}
                            </p>
                        </li>
                    ))
                    }
                </ul>
            }
        </>

    )

    if (gamePerson.role === "PLAYER") {
        return (
            <>
                {gameBaseDetails}
                {ownedGiftDetails}
                {selectedGiftDetails}
                {wonGiftDetails}
                {dynamicGame.phase === "FINISHED" && <h3>Regali vinti</h3>}
                {giftsDetails}
                {abandonPrompt}
            </>
        )
    }

    return (
        <>
            {gameBaseDetails}
            {ownedGiftDetails}
            {selectedGiftDetails}
            {wonGiftDetails}

            <h3>Creatori</h3>
            <GamePeople gamePeople={gamePeople} filterRole="CREATOR" userRole={gamePerson.role} />
            <div className="flex-row" style={{ justifyContent: "space-between", flexWrap: 'wrap' }}>
                <h3>Admin </h3>
                {(gamePerson.role === "CREATOR") && (
                    <InviteGamePerson gameId={dynamicGame.id} userRole={gamePerson.role}
                        invitationRole={"ADMIN"}
                    />
                )}
            </div>
            <GamePeople gamePeople={gamePeople} filterRole="ADMIN" userRole={gamePerson.role} />
            <div className="flex-row" style={{ justifyContent: "space-between", flexWrap: 'wrap' }}>
                <h3>Giocatori </h3>
                {(gamePerson.role === "CREATOR" || gamePerson.role === "ADMIN") && (
                    <InviteGamePerson gameId={dynamicGame.id} userRole={gamePerson.role}
                        invitationRole={"PLAYER"}
                    />
                )}
            </div>
            <GamePeople gamePeople={gamePeople} filterRole="PLAYER" userRole={gamePerson.role} />

            <h3>Regali </h3>
            {giftsDetails}
            <GameGiftControl game={dynamicGame} gamePeople={gamePeople} userRole={gamePerson.role} />

            <h3>Controlli del gioco</h3>
            <div className="flex-row">
                {deletePrompt}
                {abandonPrompt}
                |
                <GamePhaseUpdater
                    game={gameMemo}
                    gamePerson={gamePerson}
                    phase={dynamicGame.phase}
                    setPhase={(phase: Schema["Game"]["type"]["phase"]) => setDynamicGame({ ...dynamicGame, phase })}
                />
            </div>


        </>
    );
}

export default Game;