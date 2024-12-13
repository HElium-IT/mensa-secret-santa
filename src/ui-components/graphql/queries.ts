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
  query GetGamePerson($id: ID!) {
    getGamePerson(id: $id) {
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
      id
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
      __typename
    }
  }
`;
export const getGift = /* GraphQL */ `
  query GetGift($id: ID!) {
    getGift(id: $id) {
      attribute_1
      attribute_2
      attribute_3
      createdAt
      id
      name
      number
      ownerGamePersonId
      updatedAt
      winnerGamePersonId
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
    $limit: Int
    $nextToken: String
  ) {
    listGamePeople(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        acceptedInvitation
        createdAt
        gameId
        id
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
        id
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
        id
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
export const listGifts = /* GraphQL */ `
  query ListGifts(
    $filter: ModelGiftFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGifts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        attribute_1
        attribute_2
        attribute_3
        createdAt
        id
        name
        number
        ownerGamePersonId
        updatedAt
        winnerGamePersonId
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
