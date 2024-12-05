import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";

const schema = a.schema({
  Gift: a
    .model({
      ownerLoginId: a.id().required(),
      attribute_1: a.string().required(),
      attribute_2: a.string().required(),
      attribute_3: a.string().required(),
      number: a.integer().required(),
    })
    .authorization((allow) => [allow.publicApiKey()])
    .identifier(["ownerLoginId"]),
  Person: a
    .model({
      ownerLoginId: a.id().required(),
      isAdmin: a.boolean().default(false).required(),
    })
    .authorization((allow) => [allow.publicApiKey()])
    .identifier(["ownerLoginId"]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

const { user } = useAuthenticator();
const client = generateClient<Schema>();

export async function getAuthenticatedData({ setGift, setPerson }: {
  setGift?: (gift: Schema["Gift"]["type"]) => void,
  setPerson?: (person: Schema["Person"]["type"]) => void,
}) {
  const ownerLoginId = user.signInDetails?.loginId;
  const returnData: { gift?: Schema["Gift"]["type"], person?: Schema["Person"]["type"] } = {};

  if (!ownerLoginId) {
    alert('Devi effettuare il login per registrare un regalo');
    return returnData;
  }


  const { data: person } = await client.models.Person.get({ ownerLoginId });
  if (person) {
    if (setPerson)
      setPerson(person);
    returnData.person = person;
  }

  const { data: gift } = await client.models.Gift.get({ ownerLoginId });
  if (gift) {
    if (setGift)
      setGift(gift);
    returnData.gift = gift;
  }

  return returnData;
}