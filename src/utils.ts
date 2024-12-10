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




export function gamePhaseToIcon(phase: Schema["Game"]["type"]["phase"]): string {
    const gamePhaseIcons = {
        "REGISTRATION_OPEN": "🟢",
        "LOBBY": "🟡",
        "STARTED": "🔵",
        "FINISHED": "🔴",
    }
    if (phase)
        return gamePhaseIcons[phase];
    return "";
}

export function gamePhaseToText(phase: Schema["Game"]["type"]["phase"]): string {
    const gamePhaseText = {
        "REGISTRATION_OPEN": "Registra il tuo regalo in attesa che l'evento cominci!",
        "LOBBY": "Consegna il tuo regalo e ottieni il numero!",
        "STARTED": "La partita è iniziata!",
        "FINISHED": "La partita è finita!",
    }
    if (phase)
        return gamePhaseText[phase];
    return "";
}


export function gamePersonRoleToIcon(role: Schema["GamePerson"]["type"]["role"]): string {
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