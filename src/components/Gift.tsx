import { useEffect, useState } from "react";
import { Schema } from "../../amplify/data/resource";

function Gift({ gift }: {
    readonly gift: Schema["Gift"]["type"]
}) {
    const [giftWinner, setGiftWinner] = useState<Schema["GamePerson"]["type"]["personId"]>();

    useEffect(() => {
        if (!gift) return;
        async function getGiftWinner() {
            const { data: gamePerson } = await gift.winnerGamePerson();
            setGiftWinner(gamePerson?.personId);
        }
        getGiftWinner();
    }, [gift]);

    return (
        <>
            <h3>{gift.name}</h3>
            <p>{gift.attribute_1}</p>
            <p>{gift.attribute_2}</p>
            <p>{gift.attribute_3}</p>
            {giftWinner && <p>Il tuo regalo è stato vinto da {giftWinner}!</p>}
        </>
    );
}

export default Gift;
