import type { Schema } from "../amplify/data/resource";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

export async function getAuthenticatedData({ user, setGamePerson, setPerson }: {
    user: ReturnType<typeof useAuthenticator>["user"],
    setGamePerson?: (games: Schema["GamePerson"]["type"][]) => void,
    setPerson?: (person: Schema["Person"]["type"]) => void,
}) {
    const ownerLoginId = user.signInDetails?.loginId;
    const returnData: { game?: Schema["Game"]["type"], person?: Schema["Person"]["type"] } = {};

    if (!ownerLoginId) {
        alert('Devi effettuare il login per registrare un gioco');
        return returnData;
    }

    if (setPerson) {
        const { data: person } = await client.models.Person.get({ ownerLoginId });
        if (person) {
            if (setPerson)
                setPerson(person);
            returnData.person = person;
        }
    }

    if (setGamePerson) {
        const { data: gamePerson } = await client.models.GamePerson.list({
            filter: {
                personId: { eq: ownerLoginId }
            }
        });
        if (gamePerson) {
            setGamePerson(gamePerson);
        }
    }

    return returnData;
}
