import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { type Schema } from "../../amplify/data/resource";
import { getAuthenticatedData } from "../utils";


function PersonGift() {
    const [gift, setGift] = useState<Schema["Gift"]["type"] | null>(null);
    const { user } = useAuthenticator();

    useEffect(() => {
        getAuthenticatedData({ user, setGift });
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
