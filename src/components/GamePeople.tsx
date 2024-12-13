import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { gamePersonRoleToIcon } from '../utils';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function GamePeople({ gamePeople, filterRole, userRole }: {
    readonly gamePeople: Schema["GamePerson"]["type"][],
    readonly filterRole: Schema["GamePerson"]["type"]["role"],
    readonly userRole: Schema["GamePerson"]["type"]["role"],
}) {
    const { user } = useAuthenticator((context) => [context.user]);
    const [hasGift, setHasGift] = useState<Record<string, boolean>>({});

    const filteredGamePeople = gamePeople.filter(gamePerson => gamePerson.role === filterRole).sort(
        (a, b) => a.personId.localeCompare(b.personId)
    )

    useEffect(() => {
        gamePeople.forEach(async gamePerson => {
            // const { data: gift } = await gamePerson.ownedGift();
            const { data: gifts } = await client.models.Gift.list({ filter: { ownerGamePersonId: { eq: gamePerson.id } } });
            const gift = gifts?.[0];
            if (!gift) return;
            setHasGift(prevHasGift => ({ ...prevHasGift, [gamePerson.id]: !!gift }));
        });

    }, [user]);

    async function upgradeToAdmin(gamePerson: Schema["GamePerson"]["type"]) {
        if (userRole === 'PLAYER') return;
        const { errors } = await client.models.GamePerson.update({
            id: gamePerson.id,
            role: 'ADMIN',
        })
        if (errors) {
            alert(errors);
        }
    }

    return (
        <>
            <ul>
                {filteredGamePeople.map(gamePerson => (
                    <li key={gamePerson.id}>
                        {(userRole === "CREATOR" || userRole === "ADMIN") && !gamePerson.acceptedInvitation && '📧'}
                        {hasGift[gamePerson.id] && '🎁'}
                        {gamePerson.personId}
                        {
                            gamePerson.role === 'PLAYER' &&
                            <button style={{ padding: 1 }} onClick={() => upgradeToAdmin(gamePerson)}>
                                {gamePersonRoleToIcon("ADMIN")}
                            </button>
                        }
                    </li>
                ))}
            </ul>
        </>
    );
}

export default GamePeople;
