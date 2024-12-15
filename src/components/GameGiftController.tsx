import { useEffect, useState } from "react";
import { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Autocomplete } from '@aws-amplify/ui-react';

const client = generateClient<Schema>();

function GameGiftControl({ game, gamePeople, userRole }: {
    readonly game: Schema["Game"]["type"],
    readonly gamePeople: Schema["GamePerson"]["type"][],
    readonly userRole: Schema["GamePerson"]["type"]["role"]
}) {
    const [gamePeopleWithUnregisteredGift, setGamePeopleWithUnregisteredGift] = useState<Schema["GamePerson"]["type"][]>([]);
    const [gamePeopleWithoutWonGift, setGamePeopleWithoutWonGift] = useState<Schema["GamePerson"]["type"][]>([]);
    const [GiftNotWonYet, setGiftNotWonYet] = useState<Schema["Gift"]["type"][]>([]);

    const [selectedGamePersonId, setSelectedGamePersonId] = useState<string>("");
    const [selectedGamePersonIdIsValid, setSelectedGamePersonIdIsValid] = useState(false);

    const [selectedGiftNumber, setSelectedGiftNumber] = useState<string>("");
    const [selectedGiftNumberIsValid, setSelectedGiftNumberIsValid] = useState(false);
    const [timerStarted, setTimerStarted] = useState(-1);

    if (!game || userRole === "PLAYER") {
        return null;
    }

    useEffect(() => {

        const subscription = client.models.Gift.observeQuery({
            filter: {
                ownerGameId: { eq: game.id }
            }
        }).subscribe({
            next: async ({ items: gifts }) => {
                console.log("GameGiftControl.Gifts", gifts);

                const unregisteredGiftGamePeoples = gamePeople.filter(gamePerson => {
                    const gift = gifts.find(gift => gift.ownerPersonId === gamePerson.personId);
                    console.debug("GameGiftControl.unregisteredGiftGamePeoples.Gift", gift);
                    return gift && (gift.number ?? 0) === 0;
                })
                setGamePeopleWithUnregisteredGift(unregisteredGiftGamePeoples);
                console.log("GameGiftControl.unregisteredGiftGamePeoples", unregisteredGiftGamePeoples);

                const gamePeopleWithoutWonGift = gamePeople.filter(gamePerson => {
                    return !gifts.find(gift => gift.winnerPersonId === gamePerson.personId);
                });
                setGamePeopleWithoutWonGift(gamePeopleWithoutWonGift);
                console.log("GameGiftControl.gamePeopleWithoutWonGift", gamePeopleWithoutWonGift);

                const giftNowWonYet = gifts.filter(gift => !gift.winnerGameId);
                setGiftNotWonYet(giftNowWonYet);
                console.log("GameGiftControl.GiftNowWonYet", giftNowWonYet);

            }
        });

        return () => subscription.unsubscribe();
    }, [gamePeople]);

    async function registerGift() {
        if (!selectedGamePersonId) {
            return;
        }

        const { data: updatedGift, errors } = await client.models.Gift.update({
            ownerGameId: game.id,
            ownerPersonId: selectedGamePersonId,
            number: (await client.models.Gift.list({
                filter: {
                    ownerGameId: { eq: game.id },
                    number: { gt: 0 }
                }
            })).data.length + 1
        });
        if (errors) {
            console.error("GameGiftControl.RegisterGiftError", errors);
            return;
        }
        console.log("GameGiftControl.RegisteredGift", updatedGift);
        setSelectedGamePersonId('');
        setSelectedGamePersonIdIsValid(false);
    }

    async function pickGiftWinner(gift: Schema["Gift"]["type"]) {
        const filteredGamePeople = gamePeopleWithoutWonGift
            .filter(gamePerson => gamePerson.personId !== gift.ownerPersonId);

        // const weights = filteredGamePeople
        //     .map(gamePerson => {
        //         return gamePerson.role === "ADMIN" ? 3 : 1;
        //     });

        const weights = filteredGamePeople.map(() => 1);

        const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
        const random = Math.random() * totalWeight;
        let winnerIndex = 0;
        let accumulatedWeight = 0;
        for (let i = 0; i < weights.length; i++) {
            accumulatedWeight += weights[i];
            if (random < accumulatedWeight) {
                winnerIndex = i;
                break;
            }
        }
        console.log({ winnerIndex, filteredGamePeople })
        const winner = filteredGamePeople[winnerIndex];
        console.debug("GameGiftControl.PickedGamePeople", winner);

        const { data: updatedGift, errors } = await client.models.Gift.update({
            ownerGameId: gift.ownerGameId,
            ownerPersonId: gift.ownerPersonId,

            winnerGameId: gift.ownerGameId,
            winnerPersonId: winner.personId,
        });
        if (errors) {
            console.error("GameGiftControl.PickGiftWinnerError", errors);
            return;
        }
        console.log("GameGiftControl.PickedGiftWinner", updatedGift);

    }

    async function selectGift() {
        if (!selectedGiftNumber) {
            return;
        }

        const gift = GiftNotWonYet.find(gift => gift.number === Number(selectedGiftNumber));
        if (!gift) {
            setSelectedGiftNumberIsValid(false);
            return;
        }

        const { data: updatedGift, errors } = await client.models.Gift.update({
            ownerGameId: game.id,
            ownerPersonId: gift.ownerPersonId,
            isSelected: true
        });
        if (errors) {
            console.error("GameGiftControl.DrawGiftError", errors);
            return;
        }
        console.log("GameGiftControl.DrawnGift", updatedGift);

        setTimerStarted(10);
        const timer = setInterval(() => {
            setTimerStarted(prev => prev - 1);
        }, 1000);

        setTimeout(async () => {
            clearInterval(timer);
            await pickGiftWinner(gift);
            setTimerStarted(-1);
            deselectGift(gift);
        }, 10000);
    }

    async function deselectGift(gift: Schema["Gift"]["type"]) {
        if (!gift) {
            setSelectedGiftNumberIsValid(false);
            return;
        }

        const { data: updatedGift, errors } = await client.models.Gift.update({
            ownerGameId: game.id,
            ownerPersonId: gift.ownerPersonId,
            isSelected: false
        });
        if (errors) {
            console.error("GameGiftControl.DeselectGiftError", errors);
            return;
        }
        console.log("GameGiftControl.DeselectedGift", updatedGift);

        setSelectedGiftNumber("");
        setSelectedGiftNumberIsValid(false);
    }


    useEffect(() => {
        if (!selectedGamePersonId) {
            return;
        }
        if (!gamePeopleWithUnregisteredGift.find(gamePerson => gamePerson.personId === selectedGamePersonId)) {
            setSelectedGamePersonIdIsValid(false);
            return;
        }
        setSelectedGamePersonIdIsValid(true);
    }, [selectedGamePersonId]);

    useEffect(() => {
        if (!selectedGiftNumber) {
            return;
        }
        if (!GiftNotWonYet.find(gift => gift.number === Number(selectedGiftNumber))) {
            setSelectedGiftNumberIsValid(false);
            return;
        }
        setSelectedGiftNumberIsValid(true);
    }, [selectedGiftNumber]);

    return (
        <div className="flex-row">
            {game.phase === "LOBBY" &&
                <>
                    <Autocomplete
                        label="Registrazione"
                        placeholder="Registra regalo di ..."
                        value={selectedGamePersonId}
                        options={gamePeopleWithUnregisteredGift.map((gamePeople) => {
                            return {
                                label: gamePeople.personId,
                                id: gamePeople.personId
                            }
                        })}
                        // onChange={onChange}
                        // onClear={onClear}
                        // onSelect={onSelect}
                        onClear={() => setSelectedGamePersonId('')}
                        onChange={(e) => setSelectedGamePersonId(e.target.value)}
                        onSelect={(e) => setSelectedGamePersonId(e.id)}
                    />
                    {selectedGamePersonIdIsValid && <button onClick={registerGift}>Registra regalo</button>}
                </>
            }
            {game.phase === "STARTED" &&
                <>
                    <Autocomplete
                        label="Pescaggio"
                        placeholder="Pescato il regalo numero ..."
                        value={selectedGiftNumber}
                        options={GiftNotWonYet.map((gift) => {
                            return {
                                label: `${String(gift.number)} - ${gift.ownerPersonId}`,
                                id: String(gift.number)
                            }
                        })}
                        onClear={() => setSelectedGiftNumber("")}
                        onChange={(e) => setSelectedGiftNumber(e.target.value)}
                        onSelect={(e) => setSelectedGiftNumber(e.id)}
                    />
                    {selectedGiftNumberIsValid && <button onClick={selectGift}>Seleziona regalo</button>}
                    {timerStarted > 0 && <p>Tempo rimanente: {timerStarted}</p>}
                </>
            }
        </div>
    )
}

export default GameGiftControl;