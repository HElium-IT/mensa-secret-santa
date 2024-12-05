import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Gift: a
    .model({
      ownerLoginId: a.id().required(),
      name: a.string().required(),
      attribute_1: a.string().required(),
      attribute_2: a.string().required(),
      attribute_3: a.string().required(),
      number: a.integer(),
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

