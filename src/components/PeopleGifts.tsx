import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
const client = generateClient<Schema>();

function PeopleGifts() {
    const [gifts, setGifts] = useState<Array<Schema["Gift"]["type"]>>([]);
    const [people, setPeople] = useState<Array<Schema["Person"]["type"] | null>>([]);


    useEffect(() => {
        client.models.Gift.observeQuery().subscribe({
            next: (data) => setGifts([...data.items]),
        });
        client.models.Person.observeQuery().subscribe({
            next: (data) => setPeople([...data.items].sort((a, b) => peopleSorter(a, b))),
        });
    }, []);

    // async function assignNumbersToGifts() {
    //     const { data: giftsList } = await client.models.Gift.list();
    //     giftsList.forEach((gift, index) => {
    //         client.models.Gift.update({
    //             ...gift,
    //             number: index + 1,
    //         });
    //     });
    // }

    // async function resetGiftsNumbers() {
    //     const { data: giftsList } = await client.models.Gift.list();
    //     giftsList.forEach((gift) => {
    //         client.models.Gift.update({
    //             ...gift,
    //             number: null,
    //         });
    //     });
    // }

    function peopleSorter(a: Schema["Person"]["type"], b: Schema["Person"]["type"]) {
        const aHasGift = gifts.some(gift => gift?.ownerLoginId === a?.ownerLoginId);
        const bHasGift = gifts.some(gift => gift?.ownerLoginId === b?.ownerLoginId);

        if (a?.isAdmin && !b?.isAdmin) {
            return -1;
        } else if (!a?.isAdmin && b?.isAdmin) {
            return 1;
        } else if ((a?.isAdmin && b?.isAdmin) || (!a?.isAdmin && !b?.isAdmin)) {
            if (aHasGift && !bHasGift) {
                return -1;
            } else if (!aHasGift && bHasGift) {
                return 1;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }

    if (!gifts)
        return <></>;


    return (
        <>
            <h2>Persone registrate</h2>
            <ul>
                {people.map((person) => {
                    const gift = gifts?.find((gift) => gift?.ownerLoginId === person?.ownerLoginId);
                    return (
                        <li key={person?.ownerLoginId}>
                            {
                                person?.isAdmin ? (
                                    <>
                                        🌟
                                    </>
                                ) : (
                                    <>
                                        👤
                                    </>
                                )
                            }
                            {person?.ownerLoginId} - {
                                gift ? (
                                    <>
                                        🎁 {gift.attribute_1} {gift.attribute_2} {gift.attribute_3}
                                    </>
                                ) : (
                                    <>
                                        🚫 - - -
                                    </>
                                )
                            }
                        </li>
                    )
                })}
            </ul>
        </>

    );
}

export default PeopleGifts;
