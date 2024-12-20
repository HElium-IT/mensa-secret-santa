
import { useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

function InviteGamePerson({ gameId, userRole, invitationRole }: {
    readonly gameId: string,
    readonly userRole: Schema["GamePerson"]["type"]["role"]
    readonly invitationRole?: Schema["GamePerson"]["type"]["role"]
}) {
    const [inviteEmails, setInviteEmails] = useState<string>("");
    const [role, setRole] = useState<NonNullable<Schema["GamePerson"]["type"]["role"]>>(invitationRole ?? "PLAYER");

    async function invite() {
        const emails = inviteEmails.split(";").map(email => email.trim());
        await Promise.all(emails.map(async email => {
            const { data: people } = await client.models.Person.list({ filter: { ownerId: { eq: email } } });
            if (people.length === 0) {
                alert(`Person with email ${email} not found`);
                return;
            }
            await client.models.GamePerson.create({
                gameId,
                personId: people[0].ownerId,
                role,
            },);
        }));
        setInviteEmails("");
    }

    return (
        <div className="flex-row">
            <input
                type="text"
                placeholder="user@example.it; user@ciccio.it; user@boh.com; user@nice.net"
                value={inviteEmails}
                onChange={(e) => setInviteEmails(e.target.value)}
            />
            {userRole === "CREATOR" && !invitationRole && (
                <select value={role} onChange={(e) => setRole(e.target.value as NonNullable<Schema["GamePerson"]["type"]["role"]>)}>
                    <option value="PLAYER">Player</option>
                    <option value="ADMIN">Admin</option>
                </select>
            )}
            <button onClick={invite}>Invite</button>
        </div>
    );
}

export default InviteGamePerson;