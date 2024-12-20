
import type { Schema } from "../../amplify/data/resource";
import Gift from "./Gift";

function SelectedGiftDetails({ selectedGift, gamePerson }: {
    readonly selectedGift?: Schema["Gift"]["type"];
    readonly gamePerson: Schema["GamePerson"]["type"];
}) {
    return (
        <>
            {selectedGift && !selectedGift.winnerPersonId && (
                <Gift gift={selectedGift} ownerGamePerson={gamePerson} selected />
            )}
        </>
    );
}

export default SelectedGiftDetails;