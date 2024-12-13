import { useState } from "react";
import { Schema } from "../../amplify/data/resource";
import GiftCreateForm from "../ui-components/GiftCreateForm";

function GiftCreate({ gamePerson }: {
    readonly gamePerson: Schema["GamePerson"]["type"]
}) {
    const [ownerGamePersonId,] = useState(gamePerson.id);
    return (
        <>
            <GiftCreateForm

                overrides={{
                    name: { label: "Il tuo regalo", placeholder: "Boomerang" },
                    attribute_1: { label: "Attributo 1", placeholder: "Lancio" },
                    attribute_2: { label: "Attributo 2", placeholder: "Sport" },
                    attribute_3: { label: "Attributo 3", placeholder: "Legno" },

                    ownerGamePersonId: { display: 'none', value: ownerGamePersonId, readOnly: true },
                    number: { display: 'none' },
                    winnerGamePersonId: { display: 'none' },
                }}
                onChange={(data) => { console.debug("Gift changed", data); return data; }}
                onSubmit={(data) => { console.debug("Gift to create", data); return data; }}
                onError={(error) => { console.error("Gift creation error", error); }}
                onSuccess={(data) => { console.debug("Gift created", data); }}
            // onSubmit={(gift) => {
            //     gift.ownerGamePersonId = gamePerson.id;
            //     console.debug("Gift to create", gift);
            //     return gift
            // }}
            />
        </>
    );
}

export default GiftCreate;