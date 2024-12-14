import { useEffect, useState, useMemo } from "react";
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
    const gamePeopleMemo = useMemo(
        () => gamePeople
            .filter(gamePerson => gamePerson.role === filterRole)
            .sort((a, b) => a.personId.localeCompare(b.personId)),
        [gamePeople]
    );

    useEffect(() => {
        if (!gamePeopleMemo?.length) return;

        const subscription = client.models.Gift.observeQuery({
            filter: {
                ownerGameId: { eq: gamePeopleMemo[0].gameId }
            }
        }).subscribe({
            next: ({ items: gifts }) => {
                const giftOwners = gifts.map(gift => gift.ownerPersonId);
                const hasGift = gamePeopleMemo.reduce((acc, gamePerson) => {
                    acc[gamePerson.personId] = giftOwners.includes(gamePerson.personId);
                    return acc;
                }, {} as Record<string, boolean>);
                setHasGift(hasGift);
            }
        });

        return () => subscription.unsubscribe();

    }, [gamePeopleMemo]);

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
                {gamePeopleMemo.map(gamePerson => (
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
