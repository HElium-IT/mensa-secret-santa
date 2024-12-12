import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { type AllowModifier } from "@aws-amplify/data-schema/internals";

const crud = (allow: Omit<AllowModifier, "resource">) => [allow.authenticated().to(["create", "read", "update", "delete"])]

const schema = a.schema({
  Gift: a
    .model({
      name: a.string().required(),
      number: a.integer(),

      attribute_1: a.string().required(),
      attribute_2: a.string().required(),
      attribute_3: a.string().required(),

      ownedGamePersonId: a.id().required(),
      ownedGamePerson: a.belongsTo("GamePerson", "ownedGamePersonId"),

      winnerGamePersonId: a.id(),
      winnerGamePerson: a.belongsTo("GamePerson", "winnerGamePersonId"),
    })
    .identifier(["ownedGamePersonId"])
    .authorization(crud)
    .secondaryIndexes((index) => [
      index("ownedGamePersonId").name("byOwnedGamePerson"),
      index("winnerGamePersonId").name("byWinnerGamePerson"),
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
    .authorization(crud)
    .secondaryIndexes((index) => [
      index("gameId").name("byGame"),
      index("personId").name("byPerson"),
    ]),

  Person: a
    .model({
      ownerLoginId: a.id().required(),
      games: a.hasMany("GamePerson", "personId"),
      isAdmin: a.boolean().default(false),
    })
    .authorization(crud)
    .identifier(["ownerLoginId"]),

  Game: a
    .model({
      creatorId: a.id().required(),
      name: a.string().required(),
      description: a.string().required(),
      secret: a.string().required(),
      people: a.hasMany("GamePerson", "gameId"),
      joinQrCode: a.string(),
      phase: a.enum(["REGISTRATION_OPEN", "LOBBY", "STARTED", "PAUSED", "FINISHED"]),
    })
    .authorization(crud)
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    // apiKeyAuthorizationMode: {
    //   expiresInDays: 30,
    // },
  },
});

