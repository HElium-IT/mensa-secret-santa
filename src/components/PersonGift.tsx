import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";
import { getAuthenticatedData } from "../utils";

const client = generateClient<Schema>();

function PersonGift() {
    const [gift, setGift] = useState<Schema["Gift"]["type"] | null>(null);
    const { user } = useAuthenticator();

    useEffect(() => {
        client.models.Gift.observeQuery().subscribe({
            next: () => {
                getAuthenticatedData({ user, setGift });
            },
        });

    }, [user]);

    if (!gift) {
        return <></>;
    }

    return (
        <div className="gift">
            <h2>Il tuo regalo</h2>
            <div className="details">
                <p>{gift.number ? `Numero: ${gift.number}` : ''}</p>
                <p>{gift.name ? `Regalo: ${gift.name}` : ''}</p>
                <p>Attributi: {gift.attribute_1} - {gift.attribute_2} - {gift.attribute_3}</p>
            </div>
        </div>
    );
}

export default PersonGift;
