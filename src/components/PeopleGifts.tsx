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
            next: (data) => setPeople([...data.items]),
        });
    }, []);

    if (!gifts)
        return <></>;

    return (
        <>
            <h2>Persone registrate</h2>
            <ul>
                {people.map((person) => {
                    const gift = gifts?.find((gift) => gift?.number === person?.giftNumber);
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
