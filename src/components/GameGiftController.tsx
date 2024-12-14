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
    const [selectedGamePersonId, setSelectedGamePersonId] = useState<Schema["GamePerson"]["type"]["personId"]>("");
    const [selectedIsValid, setSelectedIsValid] = useState(false);
    const [fetchedGifts, setFetchedGifts] = useState<Schema["Gift"]["type"][]>([]);
    const [gamePeopleWithUnregisteredGift, setGamePeopleWithUnregisteredGift] = useState<Schema["GamePerson"]["type"][]>([]);
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

                const filteredGamePeople = gamePeople.filter(gamePerson => {

                    const gift = gifts.find(gift => gift.ownerPersonId === gamePerson.personId);
                    console.debug("GameGiftControl.FilteredGamePeople.Gift", gift);
                    return gift && (gift.number ?? 0) === 0;
                })

                setGamePeopleWithUnregisteredGift(filteredGamePeople);
                console.log("GameGiftControl.FilteredGamePeople", filteredGamePeople);
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
        setSelectedIsValid(false);
    }

    useEffect(() => {
        if (!selectedGamePersonId) {
            return;
        }
        if (!gamePeopleWithUnregisteredGift.find(gamePerson => gamePerson.personId === selectedGamePersonId)) {
            setSelectedIsValid(false);
            return;
        }
        setSelectedIsValid(true);
    }, [selectedGamePersonId]);

    return (
        <div className="flex-row">
            {game.phase === "REGISTRATION_OPEN" &&
                <>
                    <Autocomplete
                        label="Regalo"
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
                    {selectedIsValid && <button onClick={registerGift}>Registra regalo</button>}
                </>
            }
        </div>
    )
}

export default GameGiftControl;