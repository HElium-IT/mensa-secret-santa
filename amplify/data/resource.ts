import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Gift: a
    .model({
      ownerLoginId: a.id().required(),
      attribute_1: a.string().required(),
      attribute_2: a.string().required(),
      attribute_3: a.string().required(),
      number: a.integer().required()
    })
    .authorization((allow) => [allow.publicApiKey()])
    .identifier(["ownerLoginId"]),
  GamePlayer: a.model({
    playerLoginId: a.id().required(),
    gameId: a.id().required(),
    person: a.belongsTo("Person", "playerLoginId"),
    game: a.belongsTo("Game", "gameId"),
  }),
  GameAdmin: a.model({
    adminLoginId: a.id().required(),
    gameId: a.id().required(),
    person: a.belongsTo("Person", "adminLoginId"),
    game: a.belongsTo("Game", "gameId"),
  }),
  Person: a
    .model({
      ownerLoginId: a.id().required(),
      isAdmin: a.boolean().default(false).required(),
      gift: a.belongsTo("Gift", "ownerLoginId"),
      games: a.hasMany("GamePlayer", "playerLoginId"),
    })
    .authorization((allow) => [allow.publicApiKey()])
    .identifier(["ownerLoginId"]),
  Game: a
    .model({
      creatorLoginId: a.id().required(),
      name: a.string().required(),
      description: a.string().required(),
      admins: a.hasMany("GameAdmin", "gameId"),
      people: a.hasMany("GamePlayer", "gameId"),
      joinQrCode: a.string(),
      phase: a.enum(["LOBBY", "REGISTRATION_OPEN", "STARTED", "FINISHED"]),
    }),
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
