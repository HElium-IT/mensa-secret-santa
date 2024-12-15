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
    const [promptDeleteConfirmation, setPromptDeleteConfirmation] = useState(false);

    useEffect(() => {
        if (!gift) return;

        // client.models.Gift.update({
        //     ownerGameId: gift.ownerGameId,
        //     ownerPersonId: gift.ownerPersonId,
        //     isSelected: false
        // })

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

        fetchGiftWinner();
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

    if (gift.isSelected && selected && gift.ownerPersonId === ownerGamePerson?.personId)
        return null;


    if (gift.isSelected && gift.ownerPersonId !== ownerGamePerson?.personId) {
        return (
            <div className="gift-card">
                <h2 style={{ margin: '0px' }}>{gift.number}</h2>
                <p>{gift.attribute_1}</p>
                <p>{gift.attribute_2}</p>
                <p>{gift.attribute_3}</p>
                <p>Se lo vuoi, prova ad indovinare:</p>
                <input type="text" placeholder="Credo che sia..." />
                <p>TIMER 10</p>
            </div>
        );
    }

    if (gift.winnerPersonId === ownerGamePerson?.personId) {
        return (
            <div className="gift-card">
                <h2 className="gift-winner" style={{ margin: '0px' }}>Hai vinto il regalo {gift.number} !</h2>
                <p>L'ha scelto {gift.ownerPersonId}, quindi se non ti piace prenditela con lui 😜</p>
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
                        <button style={{ background: 'lightcoral' }} onClick={() => {
                            setPromptDeleteConfirmation(false);
                        }}>Annulla</button>
                    </>
                }
            </div>

            <p>{gift.attribute_1}</p>
            <p>{gift.attribute_2}</p>
            <p>{gift.attribute_3}</p>
            {gift.isSelected && gift.ownerPersonId === ownerGamePerson?.personId &&
                <h4 className="gift-winner">Il tuo regalo è stato pescato!</h4>
            }
            {giftWinner && <h4 className="gift-winner">Il tuo regalo è stato vinto da {giftWinner}</h4>}
        </div >}
        </>
    );
}

export default Gift;
