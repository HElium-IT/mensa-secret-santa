import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Gift: a
    .model({
      gamePersonId: a.id(),
      gamePerson: a.belongsTo("GamePerson", "gamePersonId"),
      name: a.string().required(),
      attribute_1: a.string().required(),
      attribute_2: a.string().required(),
      attribute_3: a.string().required(),
      number: a.integer(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  GamePerson: a
    .model({
      gameId: a.id().required(),
      personId: a.id().required(),
      game: a.belongsTo("Game", "gameId"),
      person: a.belongsTo("Person", "personId"),
      gift: a.hasOne("Gift", "gamePersonId"),
      role: a.enum(["CREATOR", "ADMIN", "PLAYER"]),
      acceptedInvitation: a.boolean().required().default(false),
    }).authorization((allow) => [allow.publicApiKey()]),
  Person: a
    .model({
      ownerLoginId: a.id().required(),
      games: a.hasMany("GamePerson", "personId"),
    })
    .authorization((allow) => [allow.publicApiKey()])
    .identifier(["ownerLoginId"]),
  Game: a
    .model({
      name: a.string().required(),
      description: a.string().required(),
      people: a.hasMany("GamePerson", "gameId"),
      joinQrCode: a.string(),
      phase: a.enum(["LOBBY", "REGISTRATION_OPEN", "STARTED", "FINISHED"]),
    }).authorization((allow) => [allow.publicApiKey()]),
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

