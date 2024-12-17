import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

//  'read' to limit access only to 'get,list,listen,search,sync' operations

const schema = a.schema({
  Gift: a
    .model({
      ownerGameId: a.id().required(),
      ownerPersonId: a.id().required(),
      ownerGamePerson: a.belongsTo("GamePerson", ["ownerGameId", "ownerPersonId"]),

      winnerGameId: a.id(),
      winnerPersonId: a.id(),
      winnerGamePerson: a.belongsTo("GamePerson", ["winnerGameId", "winnerPersonId"]),

      name: a.string().required(),
      attribute_1: a.string().required(),
      attribute_2: a.string().required(),
      attribute_3: a.string().required(),

      number: a.integer(),
      isSelected: a.boolean().default(false),
    })
    .identifier(["ownerGameId", "ownerPersonId"])
    .secondaryIndexes((index) => [
      index("ownerGameId").name("byGame"),
      index("ownerPersonId").name("byPerson"),
    ])
    .authorization(allow => [
      allow.authenticated()
    ]),

  GamePerson: a
    .model({
      gameId: a.id().required(),
      game: a.belongsTo("Game", "gameId"),

      personId: a.id().required(),
      person: a.belongsTo("Person", "personId"),

      role: a.enum(["CREATOR", "ADMIN", "PLAYER"]),
      acceptedInvitation: a.boolean().default(false),

      ownedGift: a.hasOne("Gift", ["ownerGameId", "ownerPersonId"]),
      wonGift: a.hasOne("Gift", ["winnerGameId", "winnerPersonId"]),
      wantsGiftPersonId: a.id(),
    })
    .identifier(["gameId", "personId"])
    .secondaryIndexes((index) => [
      index("gameId").name("byGame"),
      index("personId").name("byPerson"),
    ])
    .authorization(allow => [
      allow.authenticated()
    ]),

  Person: a
    .model({
      ownerId: a.id().required(),
      isAdmin: a.boolean().default(false),
      games: a.hasMany("GamePerson", "personId"),
    })
    .identifier(["ownerId"])
    .authorization(allow => [
      allow.ownerDefinedIn("ownerId", "userPools"),
      allow.authenticated(),
    ]),

  Game: a
    .model({
      ownerId: a.id().required(),
      name: a.string().required(),
      description: a.string().required(),
      secret: a.string().required(),
      joinQrCode: a.string(),
      phase: a.enum(["REGISTRATION_OPEN", "LOBBY", "STARTED", "PAUSED", "FINISHED"]),
      people: a.hasMany("GamePerson", "gameId"),
    })
    .authorization(allow => [
      allow.ownerDefinedIn("ownerId", "userPools"),
      allow.authenticated()
    ]),

})

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    }
  },
});

