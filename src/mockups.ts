import { Schema } from "../amplify/data/resource";


export function createPersonMockup(ownerLoginId: string, isAdmin: boolean) {
    return {
        ownerLoginId,
        isAdmin,
    };
}

export function createGiftMockup(ownerLoginId: string, name: string, number?: number) {
    return {
        ownerLoginId,
        name,
        number,
        attribute_1: "attribute_1",
        attribute_2: "attribute_2",
        attribute_3: "attribute_3",
    };
}

export function createGameMockup(creatorLoginId: string, name: string, description: string, phase: Schema["Game"]["createType"]["phase"] = "LOBBY") {
    return {
        creatorLoginId,
        name,
        description,
        phase,
    };
}

export const mockedPeople: Schema["Person"]["createType"][] = [
    createPersonMockup("admin1", true),
    createPersonMockup("admin2", true),
    createPersonMockup("user1", false),
    createPersonMockup("user2", false),
    createPersonMockup("user3", false),
];

export const mockedGifts: Schema["Gift"]["createType"][] = [
    createGiftMockup("admin1", "gift1"),
    createGiftMockup("admin2", "gift2"),
    createGiftMockup("user1", "gift3"),
    createGiftMockup("user2", "gift4"),
    createGiftMockup("user3", "gift5"),
];

export const mockedGames: Schema["Game"]["createType"][] = [
    createGameMockup("admin1", "game1", "description1"),
    createGameMockup("admin1", "game2", "description2"),
    createGameMockup("admin2", "game1", "description3"),
];
