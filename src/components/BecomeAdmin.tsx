import { useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

import { ADMIN_SECRET_KEY } from "../vite-env";

const client = generateClient<Schema>();

function BecomeAdmin() {
    const { user } = useAuthenticator();

    const [secretKey, setSecretKey] = useState('');

    function becomeAdmin() {
        if (!user.signInDetails?.loginId) {
            alert('Devi effettuare il login per diventare admin');
            return;
        }
        if (secretKey === ADMIN_SECRET_KEY) {
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
