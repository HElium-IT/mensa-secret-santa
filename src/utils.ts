
import type { Schema } from "../amplify/data/resource";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";

const { user } = useAuthenticator();
const client = generateClient<Schema>();

export async function getAuthenticatedData({ setGift, setPerson }: {
    setGift?: (gift: Schema["Gift"]["type"]) => void,
    setPerson?: (person: Schema["Person"]["type"]) => void,
}) {
    const ownerLoginId = user.signInDetails?.loginId;
    const returnData: { gift?: Schema["Gift"]["type"], person?: Schema["Person"]["type"] } = {};

    if (!ownerLoginId) {
        alert('Devi effettuare il login per registrare un regalo');
        return returnData;
    }


    const { data: person } = await client.models.Person.get({ ownerLoginId });
    if (person) {
        if (setPerson)
            setPerson(person);
        returnData.person = person;
    }

    const { data: gift } = await client.models.Gift.get({ ownerLoginId });
    if (gift) {
        if (setGift)
            setGift(gift);
        returnData.gift = gift;
    }

    return returnData;
}