import { Schema } from "../../amplify/data/resource";
import GiftCreateForm, { GiftCreateFormInputValues } from "../ui-components/GiftCreateForm";

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

                    ownerGamePersonId: { display: 'none', isRequired: false },
                    number: { display: 'none', isRequired: false },
                    winnerGamePersonId: { display: 'none', isRequired: false },
                }}
                onError={console.error}
                onSuccess={console.debug}
                onSubmit={(fields) => {
                    const updatedFields = { ...fields } as Schema["Gift"]["type"];
                    updatedFields.ownerGamePersonId = gamePerson.id;
                    return updatedFields as GiftCreateFormInputValues
                }}
            />
        </>
    );
}

export default GiftCreate;