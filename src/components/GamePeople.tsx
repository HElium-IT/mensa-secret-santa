import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { gamePersonRoleToIcon } from '../utils';
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function GamePeople({ gamePeople, filterRole, userRole }: {
    readonly gamePeople: Schema["GamePerson"]["type"][],
    readonly filterRole: Schema["GamePerson"]["type"]["role"],
    readonly userRole: Schema["GamePerson"]["type"]["role"],
}) {
    const [hasGift, setHasGift] = useState<Record<string, boolean>>({});

    useEffect(() => {
        gamePeople.forEach(async gamePerson => {
            const { data: gift } = await gamePerson.ownedGift();
            if (!gift) return;
            setHasGift(prevHasGift => ({ ...prevHasGift, [gamePerson.personId]: !!gift }));
        });

    }, [gamePeople]);

    async function upgradeToAdmin(gamePerson: Schema["GamePerson"]["type"]) {
        if (userRole === 'PLAYER') return;
        const { data: updatedGamePerson, errors } = await client.models.GamePerson.update({
            gameId: gamePerson.gameId,
            personId: gamePerson.personId,
            role: 'ADMIN',
        })
        if (errors || !updatedGamePerson) {
            console.error("GamePeople.upgradeToAdmin", errors);
            return;
        }
        console.debug("GamePeople.upgradeToAdmin", updatedGamePerson);
    }

    return (
        <>
            <ul>
                {gamePeople
                    .filter(gamePerson => gamePerson.role === filterRole)
                    .sort((a, b) => a.personId.localeCompare(b.personId))
                    .map(gamePerson => (
                        <li key={gamePerson.personId}>
                            {(userRole === "CREATOR" || userRole === "ADMIN") && !gamePerson.acceptedInvitation && '📧'}
                            {hasGift[gamePerson.personId] && '🎁'}
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
