import { Schema } from "../../amplify/data/resource";
import GiftCreateForm from "../ui-components/GiftCreateForm";

function GiftCreate({ gamePerson }: {
    readonly gamePerson: Schema["GamePerson"]["type"]
}) {
    return (
        <>
            <GiftCreateForm
                overrides={{
                    name: { label: "Il tuo regalo", placeholder: "Boomerang" },
                    attribute_1: { label: "Attributo 1", placeholder: "Lancio" },
                    attribute_2: { label: "Attributo 2", placeholder: "Sport" },
                    attribute_3: { label: "Attributo 3", placeholder: "Legno" },

                    number: { display: 'none', required: false },
                    isSelected: { display: 'none' },
                }}
                onSubmit={(data) => {
                    console.debug("GiftCreateForm.onSubmit", data);
                    data.ownerPersonId = gamePerson.personId;
                    data.ownerGameId = gamePerson.gameId;
                    console.debug("Gift to create", data);
                    return data;
                }}
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