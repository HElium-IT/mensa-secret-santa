import { useEffect, useState } from "react";
import { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function Gift({ gift }: {
    readonly gift: Schema["Gift"]["type"]
}) {
    const [giftWinner, setGiftWinner] = useState<Schema["GamePerson"]["type"]["personId"]>();

    useEffect(() => {
        if (!gift) return;
        async function getGiftWinner() {
            // const { data: gamePerson } = await gift.winnerGamePerson();
            if (!gift.winnerGamePersonId) return;
            const { data: gamePerson } = await client.models.GamePerson.get({ id: gift.winnerGamePersonId });
            setGiftWinner(gamePerson?.personId);
        }
        getGiftWinner();
    }, [gift]);

    return (
        <div className="gift-card">
            <h4>{gift.name}</h4>
            <p>{gift.attribute_1}</p>
            <p>{gift.attribute_2}</p>
            <p>{gift.attribute_3}</p>
            {giftWinner && <p className="gift-winner">Il tuo regalo è stato vinto da {giftWinner}!</p>}
        </div>
    );
}

export default Gift;
