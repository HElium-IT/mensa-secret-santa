import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function PersonGift() {
    const [gift, setGift] = useState<Schema["Gift"]["type"] | null>(null);
    const { user } = useAuthenticator();

    useEffect(() => {
        async function fetchGift() {
            const ownerLoginId = user.signInDetails?.loginId;
            if (!ownerLoginId) return;

            // Fetch the gift associated with the person
            const { data: gift } = await client.models.Gift.get({
                ownerLoginId
            });
            if (gift) setGift(gift);
        }

        fetchGift();
    }, [user]);

    if (!gift) {
        return <></>;
    }

    return (
        <div className="gift">
            <p className="number"> Numero {gift.number}</p>
            <ul className="attributes">
                <li>{gift.attribute_1}</li>
                <li>{gift.attribute_2}</li>
                <li>{gift.attribute_3}</li>
            </ul>
        </div>
    );
}

export default PersonGift;
