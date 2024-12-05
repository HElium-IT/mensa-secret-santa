import { Schema } from "../amplify/data/resource";

export function createPersonMockup(ownerLoginId: string, isAdmin: boolean) {
    return {
        ownerLoginId,
        isAdmin,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}

export function createGiftMockup(ownerLoginId: string, number: number) {
    return {
        ownerLoginId,
        number,
        attribute_1: "attribute_1",
        attribute_2: "attribute_2",
        attribute_3: "attribute_3",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}

export const mockedPeople: Schema["Person"]["type"][] = [
    createPersonMockup("admin1", true),
    createPersonMockup("admin2", true),
    createPersonMockup("user1", false),
    createPersonMockup("user2", false),
    createPersonMockup("user3", false),
];

export const mockedGifts: Schema["Gift"]["type"][] = [
    createGiftMockup("admin1", 1),
    createGiftMockup("admin2", 2),
    createGiftMockup("user1", 3),
    createGiftMockup("user2", 4),
    createGiftMockup("user3", 5),
];