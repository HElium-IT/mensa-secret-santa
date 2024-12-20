import { useEffect, useMemo, useState } from "react";
import { useOrientation, useWindowSize } from 'react-use';
import { Flex, useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";

import type { Schema } from "../../amplify/data/resource";
import { gamePhaseToIcon, gamePersonRoleToIcon, gamePhaseToText } from "../utils";

import GamePeople from './GamePeople';

import GamePhaseUpdater from "./GamePhaseUpdater";
import InviteGamePerson from "./InviteGamePerson";
import GameGiftControl from "./GameGiftController";
import GameBaseDetails from './GameBaseDetails';
import OwnedGiftDetails from './OwnedGiftDetails';
import SelectedGiftDetails from './SelectedGiftDetails';
import WonGiftDetails from './WonGiftDetails';
import AbandonPrompt from './AbandonPrompt';
import DeletePrompt from './DeletePrompt';
import GiftsDetails from './GiftsDetails';

// TODO: everything should be reactive, so we should use the subscription to update the UI.

function Game({ game, compact = false, onDelete = () => { }, isAdmin = false }: {
    readonly game: Schema["Game"]["type"],
    readonly compact?: boolean
    readonly onDelete?: () => void
    readonly isAdmin?: boolean
}) {
    const { user } = useAuthenticator((context) => [context.user]);
    const gameMemo = useMemo(() => game, [game]);
    const [dynamicGame, setDynamicGame] = useState<Schema["Game"]["type"]>(gameMemo);
    const [_, setPhaseText] = useState<string>(gamePhaseToText(gameMemo.phase));
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
    const [registeredGifts, setRegisteredGifts] = useState<number>(0);
    const [wonGifts, setWonGifts] = useState<number>(0);

    const { type } = useOrientation();
    const { width, height } = useWindowSize();

    useEffect(() => {
        console.debug("type", type);
    }, [type]);

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

    function updateGiftsData(gifts: Schema["Gift"]["type"][]) {
        if (!gamePerson || compact) return;
        setTotalGifts(gifts.length);
        console.log("Game.GiftsSubscription.TotalGifts", gifts);

        setRegisteredGifts(gifts.filter(gift => (gift.number ?? 0) > 0).length);
        console.log("Game.GiftsSubscription.RegisteredGifts", registeredGifts);

        setWonGifts(gifts.filter(gift => !!gift.winnerGameId).length);
        console.log("Game.GiftsSubscription.WonGifts", wonGifts);

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

    useEffect(() => {

        client.models.Gift.list({
            filter: {
                ownerGameId: { eq: dynamicGame.id }
            }
        }).then(({ data: gifts, errors }) => {
            if (errors) {
                console.error("Game.Gifts", errors);
                return;
            }
            updateGiftsData(gifts);
        });

        const gameGiftsSubscription = client.models.Gift.observeQuery({
            filter: {
                ownerGameId: { eq: dynamicGame.id },
            }
        }).subscribe({
            next: ({ items: gifts }) => {
                updateGiftsData(gifts);
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

    return (
        <>
            <GameBaseDetails game={dynamicGame} phaseIcon={phaseIcon} onBack={onDelete} />
            <Flex direction={(
                width > height
            ) ? "row" : "column"}
                justifyContent={(
                    width > height
                ) ? "unset" : "space-between"}
                style={{ width: "100%" }}
            >
                <OwnedGiftDetails ownedGift={ownedGift} gamePerson={gamePerson} onDelete={() => setOwnedGift(undefined)} />
                <SelectedGiftDetails selectedGift={selectedGift} gamePerson={gamePerson} />
                <WonGiftDetails wonGift={wonGift} gamePerson={gamePerson} />
            </Flex>


            {gamePerson.role === "PLAYER"
                && game.phase !== "FINISHED" && <>
                    <h3>Regali</h3>
                    <GiftsDetails
                        dynamicGame={dynamicGame}
                        totalGifts={totalGifts}
                        gamePeople={gamePeople}
                        gamePerson={gamePerson}
                        registeredGifts={registeredGifts}
                        wonGifts={wonGifts}
                        gamePeopleGifts={gamePeopleGifts}
                    />
                </>
            }
            <AbandonPrompt
                promptAbandonConfirmation={promptAbandonConfirmation}
                setPromptAbandonConfirmation={setPromptAbandonConfirmation}
                abandonGame={abandonGame}
                role={gamePerson.role ?? "PLAYER"}
            />
            {
                gamePerson.role != "PLAYER"
                && <>

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
                    <GiftsDetails
                        dynamicGame={dynamicGame}
                        totalGifts={totalGifts}
                        gamePeople={gamePeople}
                        gamePerson={gamePerson}
                        registeredGifts={registeredGifts}
                        wonGifts={wonGifts}
                        gamePeopleGifts={gamePeopleGifts}
                    />
                    <GameGiftControl game={dynamicGame} gamePeople={gamePeople} gamePerson={gamePerson} userRole={gamePerson.role} />

                    <h3>Controlli del gioco</h3>
                    <div className="flex-row">
                        <GamePhaseUpdater
                            game={gameMemo}
                            gamePerson={gamePerson}
                            phase={dynamicGame.phase}
                            setPhase={(phase: Schema["Game"]["type"]["phase"]) => setDynamicGame({ ...dynamicGame, phase })}
                        />
                    </div>
                    <DeletePrompt
                        promptDeleteConfirmation={promptDeleteConfirmation}
                        setPromptDeleteConfirmation={setPromptDeleteConfirmation}
                        deleteGame={deleteGame}
                        role={gamePerson.role ?? "PLAYER"}
                        isAdmin={isAdmin}
                    />
                </>
            }
        </>
    );
}

export default Game;