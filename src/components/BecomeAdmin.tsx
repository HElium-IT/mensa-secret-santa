import { useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { type Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { getAuthenticatedData } from "../utils";

const ADMIN_SECRET_KEY = "test";

const client = generateClient<Schema>();

function BecomeAdmin() {
    const { user } = useAuthenticator();

    const [secretKey, setSecretKey] = useState('');

    async function becomeAdmin() {
        if (!user.signInDetails?.loginId) {
            alert('Devi effettuare il login per diventare admin');
            return;
        }

        if (secretKey !== ADMIN_SECRET_KEY) {
            alert('Segreto non valido');
            return;
        }

        const { person } = await getAuthenticatedData({ user });
        if (person) {
            if (person.isAdmin) {
                alert('Sei già admin');
                return;
            }
            client.models.Person.update({
                ...person,
                isAdmin: true,
            });

        } else {
            client.models.Person.create({
                isAdmin: true,
                ownerLoginId: user.signInDetails.loginId,
            });
        }

    }

    return (
        <>
            <input
                type="text"
                placeholder="Secret Key"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
            />
            <button onClick={becomeAdmin}> Diventa admin </button>
        </>
    );
}

export default BecomeAdmin;
