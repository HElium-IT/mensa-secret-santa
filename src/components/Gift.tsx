import { useEffect, useState } from "react";
import { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function Gift({ gift, onDelete }: {
    readonly gift: Schema["Gift"]["type"],
    readonly onDelete?: () => void
}) {
    const [giftWinner, setGiftWinner] = useState<Schema["GamePerson"]["type"]["personId"]>();
    const [promptDeleteConfirmation, setPromptDeleteConfirmation] = useState(false);

    useEffect(() => {
        if (!gift) return;

        const subscription = client.models.Gift.onUpdate({
            filter: {
                ownerGameId: { eq: gift.ownerGameId },
                ownerPersonId: { eq: gift.ownerPersonId }
            }
        }).subscribe({
            next: async (updatedGift) => {
                // if (!updatedGift.winnerGamePersonId) return;
                // const { data: gamePerson } = await client.models.GamePerson.get({ id: updatedGift.winnerGamePersonId });
                // setGiftWinner(gamePerson?.personId);
                if (!updatedGift) return;
                const { data: winnerGamePerson } = await updatedGift.winnerGamePerson();
                setGiftWinner(winnerGamePerson?.personId);
            }
        });

        return () => subscription.unsubscribe();
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

    return (
        <div className="gift-card">
            <div className="flex-row">
                <h4>{gift.name}</h4>
                {!promptDeleteConfirmation &&
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
            {giftWinner && <p className="gift-winner">Il tuo regalo è stato vinto da {giftWinner}!</p>}
        </div>
    );
}

export default Gift;
