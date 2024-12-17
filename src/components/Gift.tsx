import { useEffect, useState } from "react";
import { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function Gift({ gift, ownerGamePerson, onDelete, selected = false }: {
    readonly gift: Schema["Gift"]["type"],
    readonly ownerGamePerson?: Schema["GamePerson"]["type"],
    readonly onDelete?: () => void,
    readonly selected?: boolean
}) {
    const [giftWinner, setGiftWinner] = useState<Schema["GamePerson"]["type"]["personId"]>();
    const [giftWanters, setGiftWanters] = useState<Schema["GamePerson"]["type"][]>();
    const [promptDeleteConfirmation, setPromptDeleteConfirmation] = useState(false);
    const [personWantsGift, setPersonWantsGift] = useState(ownerGamePerson?.wantsGiftPersonId !== null);

    useEffect(() => {
        if (!gift) return;

        async function fetchGiftWinner() {
            if (!gift.winnerPersonId) return;
            const { data: person, errors } = await client.models.Person.get({
                ownerId: gift.winnerPersonId
            })
            if (errors) {
                console.error("Gift.fetchGiftWinner", errors);
                return;
            }
            if (!person) return;
            setGiftWinner(person.ownerId);
        }

        if (gift.winnerPersonId) {
            fetchGiftWinner();
            return;
        }

        const wantersSubscription = client.models.GamePerson.observeQuery({
            filter: {
                gameId: { eq: gift.ownerGameId },
            }
        }).subscribe({
            next: ({ items: gamePeople }) => {
                console.log("Gift.wantersSubscription", gamePeople);
                setGiftWanters(gamePeople.filter(({ wantsGiftPersonId }) => wantsGiftPersonId === gift.ownerPersonId));
            }
        });

        return () => wantersSubscription.unsubscribe();

    }, [gift]);

    async function deleteGift() {
        if (!gift) return;
        const { data: resultGift, errors } = await client.models.Gift.delete({
            ownerGameId: gift.ownerGameId,
            ownerPersonId: gift.ownerPersonId
        });
        if (errors) {
            console.error("Gift.deleteGift", errors);
            return;
        }
        console.debug("Gift.deleteGift", resultGift);
        if (onDelete)
            onDelete();

    }

    async function setGiftAsWanted(value: boolean = true) {
        if (!gift || !ownerGamePerson) return;
        const { data: gamePerson, errors } = await client.models.GamePerson.update({
            personId: ownerGamePerson.personId,
            gameId: ownerGamePerson.gameId,
            wantsGiftPersonId: (value && gift.ownerPersonId) || null
        })
        if (errors) {
            console.error("Gift.setGiftAsWanted", errors);
            return;
        }
        console.debug("Gift.setGiftAsWanted", gamePerson);
        setPersonWantsGift(value);
    }


    if (gift.isSelected && selected && gift.ownerPersonId === ownerGamePerson?.personId)
        return null;


    if (gift.isSelected && gift.ownerPersonId !== ownerGamePerson?.personId) {
        return (
            <div className="gift-card">
                <div className="flex-row">
                    <h2 style={{ margin: '0px' }}>{gift.number} |</h2>
                    {!personWantsGift ?
                        <button onClick={() => setGiftAsWanted()}>Lo voglio!</button>
                        :
                        <button style={{ background: 'red' }}
                            onClick={() => setGiftAsWanted(false)}>Non lo voglio</button>
                    }
                </div>
                <p>{gift.attribute_1}</p>
                <p>{gift.attribute_2}</p>
                <p>{gift.attribute_3}</p>
            </div>
        );
    }

    if (gift.winnerPersonId === ownerGamePerson?.personId) {
        return (
            <div className="gift-card">
                <h2 className="gift-winner" style={{ margin: '0px' }}>Hai vinto il regalo {gift.number} !</h2>
                <p>L'ha scelto "{gift.ownerPersonId.split("@")[0]}".</p>
                <p>Se non ti piace sai chi maledire!😜</p>
            </div>
        );
    }

    return (
        <>{<div className="gift-card">
            <div className="flex-row" style={{ flexWrap: 'wrap' }}>
                <h2 style={{ margin: '0px' }}>{gift.number ? gift.number + ' - ' : ''}{gift.name}</h2>
                {!promptDeleteConfirmation && ownerGamePerson?.personId === gift.ownerPersonId && (gift.number ?? 0) === 0 &&
                    <button style={{ background: 'red' }} onClick={() => setPromptDeleteConfirmation(true)}>Elimina</button>
                }
                {promptDeleteConfirmation &&
                    <>
                        <button style={{ background: 'red' }} onClick={deleteGift}>Conferma</button >
                        <button onClick={() => {
                            setPromptDeleteConfirmation(false);
                        }}>Annulla</button>
                    </>
                }
            </div>

            <p>{gift.attribute_1}</p>
            <p>{gift.attribute_2}</p>
            <p>{gift.attribute_3}</p>
            {!giftWinner && gift.isSelected && gift.ownerPersonId === ownerGamePerson?.personId &&
                <h4 className="gift-winner">Il tuo regalo è stato pescato!</h4>
            }
            {!giftWinner && gift.isSelected && giftWanters && (giftWanters.length > 0) &&
                <h4>Voluto da {giftWanters.length} person{giftWanters.length === 1 ? 'a' : 'e'}
                </h4>
            }

            {giftWinner && <h4 className="gift-winner">Il tuo regalo è stato vinto da {giftWinner}</h4>}
        </div >}
        </>
    );
}

export default Gift;
