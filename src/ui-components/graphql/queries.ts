/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getGame = /* GraphQL */ `
  query GetGame($id: ID!) {
    getGame(id: $id) {
      createdAt
      description
      id
      joinQrCode
      name
      ownerId
      people {
        nextToken
        __typename
      }
      phase
      secret
      updatedAt
      __typename
    }
  }
`;
export const getGamePerson = /* GraphQL */ `
  query GetGamePerson($gameId: ID!, $personId: ID!) {
    getGamePerson(gameId: $gameId, personId: $personId) {
      acceptedInvitation
      createdAt
      game {
        createdAt
        description
        id
        joinQrCode
        name
        ownerId
        phase
        secret
        updatedAt
        __typename
      }
      gameId
      ownedGift {
        attribute_1
        attribute_2
        attribute_3
        createdAt
        isSelected
        name
        number
        ownerGameId
        ownerPersonId
        updatedAt
        winnerGameId
        winnerPersonId
        __typename
      }
      person {
        createdAt
        isAdmin
        ownerId
        updatedAt
        __typename
      }
      personId
      role
      updatedAt
      wonGift {
        attribute_1
        attribute_2
        attribute_3
        createdAt
        isSelected
        name
        number
        ownerGameId
        ownerPersonId
        updatedAt
        winnerGameId
        winnerPersonId
        __typename
      }
      __typename
    }
  }
`;
export const getGift = /* GraphQL */ `
  query GetGift($ownerGameId: ID!, $ownerPersonId: ID!) {
    getGift(ownerGameId: $ownerGameId, ownerPersonId: $ownerPersonId) {
      attribute_1
      attribute_2
      attribute_3
      createdAt
      isSelected
      name
      number
      ownerGameId
      ownerGamePerson {
        acceptedInvitation
        createdAt
        gameId
        personId
        role
        updatedAt
        __typename
      }
      ownerPersonId
      updatedAt
      winnerGameId
      winnerGamePerson {
        acceptedInvitation
        createdAt
        gameId
        personId
        role
        updatedAt
        __typename
      }
      winnerPersonId
      __typename
    }
  }
`;
export const getPerson = /* GraphQL */ `
  query GetPerson($ownerId: ID!) {
    getPerson(ownerId: $ownerId) {
      createdAt
      games {
        nextToken
        __typename
      }
      isAdmin
      ownerId
      updatedAt
      __typename
    }
  }
`;
export const listGamePeople = /* GraphQL */ `
  query ListGamePeople(
    $filter: ModelGamePersonFilterInput
    $gameId: ID
    $limit: Int
    $nextToken: String
    $personId: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
  ) {
    listGamePeople(
      filter: $filter
      gameId: $gameId
      limit: $limit
      nextToken: $nextToken
      personId: $personId
      sortDirection: $sortDirection
    ) {
      items {
        acceptedInvitation
        createdAt
        gameId
        personId
        role
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listGamePersonByGameId = /* GraphQL */ `
  query ListGamePersonByGameId(
    $filter: ModelGamePersonFilterInput
    $gameId: ID!
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listGamePersonByGameId(
      filter: $filter
      gameId: $gameId
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        acceptedInvitation
        createdAt
        gameId
        personId
        role
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listGamePersonByPersonId = /* GraphQL */ `
  query ListGamePersonByPersonId(
    $filter: ModelGamePersonFilterInput
    $limit: Int
    $nextToken: String
    $personId: ID!
    $sortDirection: ModelSortDirection
  ) {
    listGamePersonByPersonId(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      personId: $personId
      sortDirection: $sortDirection
    ) {
      items {
        acceptedInvitation
        createdAt
        gameId
        personId
        role
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listGames = /* GraphQL */ `
  query ListGames(
    $filter: ModelGameFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGames(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        createdAt
        description
        id
        joinQrCode
        name
        ownerId
        phase
        secret
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listGiftByOwnerGameId = /* GraphQL */ `
  query ListGiftByOwnerGameId(
    $filter: ModelGiftFilterInput
    $limit: Int
    $nextToken: String
    $ownerGameId: ID!
    $sortDirection: ModelSortDirection
  ) {
    listGiftByOwnerGameId(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      ownerGameId: $ownerGameId
      sortDirection: $sortDirection
    ) {
      items {
        attribute_1
        attribute_2
        attribute_3
        createdAt
        isSelected
        name
        number
        ownerGameId
        ownerPersonId
        updatedAt
        winnerGameId
        winnerPersonId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listGiftByOwnerPersonId = /* GraphQL */ `
  query ListGiftByOwnerPersonId(
    $filter: ModelGiftFilterInput
    $limit: Int
    $nextToken: String
    $ownerPersonId: ID!
    $sortDirection: ModelSortDirection
  ) {
    listGiftByOwnerPersonId(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      ownerPersonId: $ownerPersonId
      sortDirection: $sortDirection
    ) {
      items {
        attribute_1
        attribute_2
        attribute_3
        createdAt
        isSelected
        name
        number
        ownerGameId
        ownerPersonId
        updatedAt
        winnerGameId
        winnerPersonId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listGifts = /* GraphQL */ `
  query ListGifts(
    $filter: ModelGiftFilterInput
    $limit: Int
    $nextToken: String
    $ownerGameId: ID
    $ownerPersonId: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
  ) {
    listGifts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      ownerGameId: $ownerGameId
      ownerPersonId: $ownerPersonId
      sortDirection: $sortDirection
    ) {
      items {
        attribute_1
        attribute_2
        attribute_3
        createdAt
        isSelected
        name
        number
        ownerGameId
        ownerPersonId
        updatedAt
        winnerGameId
        winnerPersonId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listPeople = /* GraphQL */ `
  query ListPeople(
    $filter: ModelPersonFilterInput
    $limit: Int
    $nextToken: String
    $ownerId: ID
    $sortDirection: ModelSortDirection
  ) {
    listPeople(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      ownerId: $ownerId
      sortDirection: $sortDirection
    ) {
      items {
        createdAt
        isAdmin
        ownerId
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
