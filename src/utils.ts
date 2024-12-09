import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { AuthUser } from "aws-amplify/auth";

const client = generateClient<Schema>();

export async function getPersonGames(gamePeople: Schema["GamePerson"]["type"][], personId: string) {
    const games = await Promise.all(gamePeople.map(async gp => {
        if (gp.personId !== personId) return null;
        const { data: game } = await gp.game();
        return game;
    }));
    return games.filter(game => game !== null);
}

export function gamePhaseToText(phase: Schema["Game"]["type"]["phase"]): string {
    switch (phase) {
        case "LOBBY":
            return "🟢 Lobby";
        case "REGISTRATION_OPEN":
            return "🟡 Aperto";
        case "STARTED":
            return "🔵 Iniziato";
        case "FINISHED":
            return "🔴 Finito";
        default:
            return "";
    }
}

export function gamePersonRoleToText(role: Schema["GamePerson"]["type"]["role"]): string {
    switch (role) {
        case "CREATOR":
            return "👑";
        case "ADMIN":
            return "🛡️";
        case "PLAYER":
            return "🎮";
        default:
            return "";
    }
}

export async function getUserPerson(user: AuthUser): Promise<Schema["Person"]["type"] | undefined> {
    if (!user.signInDetails?.loginId) return undefined;
    const { data: person } = await client.models.Person.get({ ownerLoginId: user.signInDetails.loginId });
    return person ?? undefined;
}