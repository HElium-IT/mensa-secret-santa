
import type { Schema } from "../../amplify/data/resource";
import Gift from "./Gift";
import GiftCreate from "./GiftCreate";

function OwnedGiftDetails({ ownedGift, gamePerson, onDelete }: {
    readonly ownedGift?: Schema["Gift"]["type"];
    readonly gamePerson: Schema["GamePerson"]["type"];
    readonly onDelete: () => void;
}) {
    return (
        <>
            {ownedGift ? (
                <Gift gift={ownedGift} onDelete={onDelete} ownerGamePerson={gamePerson} />
            ) : (
                <GiftCreate gamePerson={gamePerson} />
            )}
        </>
    );
}

export default OwnedGiftDetails;