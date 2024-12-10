
import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { gamePersonRoleToIcon, getUserPerson } from '../utils';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function GamePeople({ gamePeople, filterRole, userRole }: {
    readonly gamePeople: Schema["GamePerson"]["type"][],
    readonly filterRole: Schema["GamePerson"]["type"]["role"],
    readonly userRole: Schema["GamePerson"]["type"]["role"],
}) {
    const { user } = useAuthenticator();
    const [person, setPerson] = useState<Schema["Person"]["type"]>();
    const [hasGift, setHasGift] = useState<Record<string, boolean>>({});

    const filteredGamePeople = gamePeople.filter(gamePerson => gamePerson.role === filterRole);

    useEffect(() => {
        getUserPerson(user).then(setPerson);

        gamePeople.forEach(async gamePerson => {
            const { data: gift } = await gamePerson.gift();
            setHasGift(prevHasGift => ({ ...prevHasGift, [gamePerson.id]: !!gift }));
        });

    }, [user]);

    async function upgradeToAdmin(gamePerson: Schema["GamePerson"]["type"]) {
        if (!person?.isAdmin) return;
        const { errors } = await client.models.GamePerson.update({
            ...gamePerson,
            role: 'ADMIN',
        })
        if (errors) {
            alert(errors);
        }
    }

    return (
        <ul>
            {filteredGamePeople.map(gamePerson => (
                <li key={gamePerson.id}>
                    {person?.isAdmin && !gamePerson.acceptedInvitation ? '📧' : ''}
                    {hasGift[gamePerson.id] ? '🎁' : ''}
                    {gamePerson.personId}
                    {
                        userRole === 'CREATOR' && gamePerson.role !== 'CREATOR' &&
                        <button onClick={() => upgradeToAdmin(gamePerson)}>
                            {gamePersonRoleToIcon("ADMIN")}
                        </button>
                    }
                </li>
            ))}
        </ul>
    );
}

export default GamePeople;
