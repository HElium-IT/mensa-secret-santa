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
                    number: { display: 'none', isRequired: false },
                    ownedGamePersonId: { display: 'none', value: gamePerson.id },
                    winnerGamePersonId: { display: 'none', isRequired: false },
                }}
                onError={console.error}
                onSuccess={console.debug}
            />
        </>
    );
}

export default GiftCreate;