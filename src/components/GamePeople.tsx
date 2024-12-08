
import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { getUserPerson } from '../utils';
import { useAuthenticator } from '@aws-amplify/ui-react';

function GamePeople({ gamePeople, filterRole }: {
    readonly gamePeople: Schema["GamePerson"]["type"][],
    readonly filterRole: Schema["GamePerson"]["type"]["role"],
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

    return (
        <ul>
            {filteredGamePeople.map(gamePerson => (
                <li key={gamePerson.id}>
                    {person?.isAdmin && !gamePerson.acceptedInvitation ? '📧' : ''}
                    {hasGift[gamePerson.id] ? '🎁' : ''}
                    {gamePerson.personId}
                </li>
            ))}
        </ul>
    );
}

export default GamePeople;
