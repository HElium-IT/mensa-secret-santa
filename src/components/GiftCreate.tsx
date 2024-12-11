import { Schema } from "../../amplify/data/resource";
import type { GiftCreateFormInputValues } from "../ui-components/GiftCreateForm";
import GiftCreateForm from "../ui-components/GiftCreateForm";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function GiftCreate({ gamePerson }: {
    readonly gamePerson: Schema["GamePerson"]["type"]
}) {
    async function createGift(fields: GiftCreateFormInputValues) {
        console.debug("Gift Create call", fields);
        if (!fields.name || !fields.attribute_1 || !fields.attribute_2 || !fields.attribute_3) {
            throw new Error("All fields are required");
        }

        const gift = await client.models.Gift.create({
            name: fields.name,
            attribute_1: fields.attribute_1,
            attribute_2: fields.attribute_2,
            attribute_3: fields.attribute_3,
            ownedGamePersonId: gamePerson.id,
            number: null,

        });
        if (!gift.data)
            throw new Error(gift.errors?.join(", ") ?? "Failed to create gift");
        console.debug("Gift created", gift.data);


    }

    return (
        <>
            <GiftCreateForm
                overrides={{
                    number: { display: 'none', isRequired: false },
                    ownedGamePersonId: { display: 'none', value: gamePerson.id },
                    winnerGamePersonId: { display: 'none', isRequired: false },
                }}
                onError={console.log}
                onSuccess={(fields) => {
                    console.debug("GiftCreateForm success", fields);
                    createGift(fields)
                        .catch(alert);
                }}
            />
        </>
    );
}

export default GiftCreate;
