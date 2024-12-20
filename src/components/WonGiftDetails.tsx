
import type { Schema } from "../../amplify/data/resource";
import Gift from "./Gift";

function WonGiftDetails({ wonGift, gamePerson }: {
    readonly wonGift?: Schema["Gift"]["type"];
    readonly gamePerson: Schema["GamePerson"]["type"];
}) {
    return (
        <>
            {wonGift && <Gift gift={wonGift} ownerGamePerson={gamePerson} />}
        </>
    );
}

export default WonGiftDetails;