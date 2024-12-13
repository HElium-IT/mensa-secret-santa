import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import type { AuthUser } from "aws-amplify/auth";

const client = generateClient<Schema>();

export function gamePhaseToIcon(phase: Schema["Game"]["type"]["phase"]): string {
    const gamePhaseIcons = {
        "REGISTRATION_OPEN": "🔵|✔️",
        "LOBBY": "🟡|⏳",
        "STARTED": "🟢|🏁",
        "PAUSED": "🟢|⏸️",
        "FINISHED": "🔴|🏁",
    }
    if (phase)
        return gamePhaseIcons[phase];
    return "";
}

export function gamePhaseToText(phase: Schema["Game"]["type"]["phase"], hasGift: boolean = false, giftHasNumber: boolean = false): string {
    const gamePhaseText = {
        "REGISTRATION_OPEN": (!hasGift)
            ? "Il giorno dell'evento sta arrivando. Registra gli attributi che più descrivono il tuo regalo; perchè tu l'hai già comprato, giusto? GIUSTO?!"
            : "L'evento non è ancora iniziato... il regalo l'hai registrato, mo port nu poco 'e pazienza!",
        "LOBBY": (!giftHasNumber)
            ? "Oggi è il giorno! Consegna il tuo regalo a chi di dovere, jamm ja' ca te stamm aspettan!"
            : "La partita sta per iniziare, stamm aspettanno tutta l'ata gente!",
        "STARTED": "La partita è iniziata, bona furtuna!",
        "PAUSED": "La partita è in pausa, aproffittane pe' magnà e, mi raccomando, bbìve!",
        "FINISHED": "La partita è finita, spero che tu sia soddisfatto del tuo regalo; se così non fosse puoi sempre proporre uno scambio a qualcun altro!"
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

export function sortGames(a: Schema["Game"]["type"], b: Schema["Game"]["type"]) {
    const phaseOrder = ["STARTED", "PAUSED", "LOBBY", "REGISTRATION_OPEN", "FINISHED"];
    const phaseComparison =
        phaseOrder.indexOf(a.phase as NonNullable<Schema["Game"]["type"]["phase"]>)
        - phaseOrder.indexOf(b.phase as NonNullable<Schema["Game"]["type"]["phase"]>);
    if (phaseComparison !== 0) {
        return phaseComparison;
    }
    return a.name.localeCompare(b.name);
}