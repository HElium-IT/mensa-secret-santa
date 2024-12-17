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
    const [gamePeopleWithotOwnedGift, setGamePeopleWithotOwnedGift] = useState<Schema["GamePerson"]["type"][]>([]);
    const [gamePeopleWithUnregisteredGift, setGamePeopleWithUnregisteredGift] = useState<Schema["GamePerson"]["type"][]>([]);
    const [gamePeopleWithoutWonGift, setGamePeopleWithoutWonGift] = useState<Schema["GamePerson"]["type"][]>([]);
    const [GiftNotWonYet, setGiftNotWonYet] = useState<Schema["Gift"]["type"][]>([]);

    const [selectedGamePersonId, setSelectedGamePersonId] = useState<string>("");
    const [selectedGamePersonIdIsValid, setSelectedGamePersonIdIsValid] = useState(false);

    const [selectedGiftNumber, setSelectedGiftNumber] = useState<string>("");
    const [selectedGiftNumberIsValid, setSelectedGiftNumberIsValid] = useState(false);
    const [selectedGift, setSelectedGift] = useState<Schema["Gift"]["type"]>();
    const [selectedGiftWinnerPicked, setSelectedGiftWinnerPicked] = useState(false);

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

                const selectedGift = gifts.find(gift => gift.isSelected);
                setSelectedGift(selectedGift);
                setSelectedGiftNumber(selectedGift?.number?.toString() ?? "");
                setSelectedGiftNumberIsValid(!!selectedGift);
                console.log("GameGiftControl.SelectedGift", selectedGift);

                const unownedGiftGamePeoples = gamePeople.filter(gamePerson => {
                    return !gifts.find(gift => gift.ownerPersonId === gamePerson.personId);
                });
                setGamePeopleWithotOwnedGift(unownedGiftGamePeoples);
                console.log("GameGiftControl.unownedGiftGamePeoples", unownedGiftGamePeoples);

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

    async function pickGiftWinner() {
        if (!selectedGift) return;

        const filteredGamePeople = gamePeopleWithoutWonGift.filter(gamePerson =>
            gamePerson.personId !== selectedGift.ownerPersonId &&
            !gamePeopleWithotOwnedGift.some(gp => gp.personId === gamePerson.personId)
        );

        if (filteredGamePeople.length === 0) {
            console.error("GameGiftControl.PickGiftWinnerError", "No people to pick from");
            return;
        }

        let winner = null;
        if (filteredGamePeople.length === 1) {
            winner = filteredGamePeople[0];
        } else {
            const peopleThatWantsGift = filteredGamePeople.filter(gamePerson =>
                gamePerson.wantsGiftPersonId === selectedGift.ownerPersonId
            );

            if (peopleThatWantsGift.length >= gamePeopleWithoutWonGift.length / 2) {
                winner = peopleThatWantsGift[Math.floor(Math.random() * peopleThatWantsGift.length)];
            }

            const weights = filteredGamePeople.map(gamePerson =>
                gamePerson.wantsGiftPersonId === selectedGift.ownerPersonId ? 3 : 1
            )

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
            winner = filteredGamePeople[winnerIndex];
            if (!winner) {
                console.error("GameGiftControl.PickGiftWinnerError", "No winner found");
                return;
            }
            console.debug("GameGiftControl.PickedGamePeople", winner);
        }

        const { data: updatedGift, errors } = await client.models.Gift.update({
            ownerGameId: selectedGift.ownerGameId,
            ownerPersonId: selectedGift.ownerPersonId,

            winnerGameId: selectedGift.ownerGameId,
            winnerPersonId: winner.personId,
        });
        if (errors) {
            console.error("GameGiftControl.PickGiftWinnerError", errors);
            return;
        }
        console.log("GameGiftControl.PickedGiftWinner", updatedGift);
        setSelectedGiftWinnerPicked(true);

    }

    async function selectGift() {
        if (!selectedGiftNumber || !selectedGiftNumberIsValid) {
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

        setSelectedGift(gift);
    }

    async function deselectGift() {
        if (!selectedGift) return;

        const { data: updatedGift, errors } = await client.models.Gift.update({
            ownerGameId: selectedGift.ownerGameId,
            ownerPersonId: selectedGift.ownerPersonId,
            isSelected: false
        });
        if (errors) {
            console.error("GameGiftControl.DeselectGiftError", errors);
            throw new Error("GameGiftControl.DeselectGiftError");
        }
        console.log("GameGiftControl.DeselectedGift", updatedGift);
        setSelectedGift(undefined);
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

        setSelectedGiftNumberIsValid(true)
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
                        options={GiftNotWonYet.map((gift) => ({
                            label: `${gift.number} - ${gift.ownerPersonId}`,
                            id: String(gift.number),
                        }))}
                        onClear={() => setSelectedGiftNumber("")}
                        onChange={(e) => setSelectedGiftNumber(e.target.value)}
                        onSelect={(e) => setSelectedGiftNumber(e.id)}
                    />
                    {selectedGiftNumberIsValid && (!selectedGift || selectedGiftWinnerPicked) && (
                        <button onClick={selectGift}>Seleziona regalo</button>
                    )}
                    {selectedGift && (
                        <button onClick={selectedGiftWinnerPicked ? deselectGift : pickGiftWinner}>
                            {selectedGiftWinnerPicked ? "Deseleziona regalo" : "Pesca vincitore"}
                        </button>
                    )}
                </>
            }
        </div>
    )
}

export default GameGiftControl;