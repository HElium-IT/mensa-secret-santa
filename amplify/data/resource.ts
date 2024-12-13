import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Gift: a
    .model({
      ownedGamePersonId: a.id().required(),
      ownedGamePerson: a.belongsTo("GamePerson", "ownedGamePersonId"),

      name: a.string().required(),
      attribute_1: a.string().required(),
      attribute_2: a.string().required(),
      attribute_3: a.string().required(),

      number: a.integer(),

      winnerGamePersonId: a.id(),
      winnerGamePerson: a.belongsTo("GamePerson", "winnerGamePersonId"),
    })
    .identifier(["ownedGamePersonId"])
    .secondaryIndexes((index) => [
      index("winnerGamePersonId").name("byWinnerGamePerson"),
    ])
    .authorization(allow => [
      allow.publicApiKey(),
      allow.authenticated(),
      allow.ownerDefinedIn("ownedGamePersonId"),
    ]),

  GamePerson: a
    .model({
      gameId: a.id().required(),
      game: a.belongsTo("Game", "gameId"),

      personId: a.id().required(),
      person: a.belongsTo("Person", "personId"),

      ownedGift: a.hasOne("Gift", "ownedGamePersonId"),
      wonGift: a.hasOne("Gift", "winnerGamePersonId"),

      role: a.enum(["CREATOR", "ADMIN", "PLAYER"]),
      acceptedInvitation: a.boolean().default(false),
    })
    .secondaryIndexes((index) => [
      index("gameId").name("byGame"),
      index("personId").name("byPerson"),
    ])
    .authorization(allow => [
      allow.publicApiKey(),
      allow.authenticated(),
      allow.ownerDefinedIn("personId"),
    ]),

  Person: a
    .model({
      ownerLoginId: a.id().required(),
      isAdmin: a.boolean().default(false),
      games: a.hasMany("GamePerson", "personId"),
    })
    .identifier(["ownerLoginId"])
    .authorization(allow => [
      allow.publicApiKey(),
      allow.authenticated(),
      allow.ownerDefinedIn("ownerLoginId"),
    ]),

  Game: a
    .model({
      creatorId: a.id(),
      name: a.string().required(),
      description: a.string().required(),
      secret: a.string().required(),
      joinQrCode: a.string(),
      phase: a.enum(["REGISTRATION_OPEN", "LOBBY", "STARTED", "PAUSED", "FINISHED"]),
      people: a.hasMany("GamePerson", "gameId"),
    })
    .authorization(allow => [
      allow.publicApiKey(),
      allow.authenticated(),
      allow.ownerDefinedIn("creatorId"),
    ]),

})

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    }
  },
});

