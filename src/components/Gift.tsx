import { useEffect, useState } from "react";
import { Schema } from "../../amplify/data/resource";

import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function Gift({ gift, gamePerson }: {
    readonly gift: Schema["Gift"]["type"]
    readonly gamePerson: Schema["GamePerson"]["type"]
}) {
    const [giftWinner, setGiftWinner] = useState<Schema["GamePerson"]["type"]["personId"]>();

    useEffect(() => {
        if (!gift?.winnerGamePersonId || gift.winnerGamePersonId === "") return;

        client.models.GamePerson.get({ id: gift.winnerGamePersonId })
            .then(({ data: gamePerson }) => {
                if (!gamePerson) return;
                setGiftWinner(gamePerson.personId);
            });


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
