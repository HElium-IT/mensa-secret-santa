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
      people {
        nextToken
        __typename
      }
      phase
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
        phase
        updatedAt
        __typename
      }
      gameId
      gift {
        attribute_1
        attribute_2
        attribute_3
        createdAt
        gamePersonId
        name
        number
        updatedAt
        __typename
      }
      id
      person {
        createdAt
        isAdmin
        ownerLoginId
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
  query GetGift($gamePersonId: ID!) {
    getGift(gamePersonId: $gamePersonId) {
      attribute_1
      attribute_2
      attribute_3
      createdAt
      gamePerson {
        acceptedInvitation
        createdAt
        gameId
        id
        personId
        role
        updatedAt
        __typename
      }
      gamePersonId
      name
      number
      updatedAt
      __typename
    }
  }
`;
export const getPerson = /* GraphQL */ `
  query GetPerson($ownerLoginId: ID!) {
    getPerson(ownerLoginId: $ownerLoginId) {
      createdAt
      games {
        nextToken
        __typename
      }
      isAdmin
      ownerLoginId
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
        phase
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
    $gamePersonId: ID
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listGifts(
      filter: $filter
      gamePersonId: $gamePersonId
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        attribute_1
        attribute_2
        attribute_3
        createdAt
        gamePersonId
        name
        number
        updatedAt
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
    $ownerLoginId: ID
    $sortDirection: ModelSortDirection
  ) {
    listPeople(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      ownerLoginId: $ownerLoginId
      sortDirection: $sortDirection
    ) {
      items {
        createdAt
        isAdmin
        ownerLoginId
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
