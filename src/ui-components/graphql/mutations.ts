/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createGame = /* GraphQL */ `
  mutation CreateGame(
    $condition: ModelGameConditionInput
    $input: CreateGameInput!
  ) {
    createGame(condition: $condition, input: $input) {
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
export const createGamePerson = /* GraphQL */ `
  mutation CreateGamePerson(
    $condition: ModelGamePersonConditionInput
    $input: CreateGamePersonInput!
  ) {
    createGamePerson(condition: $condition, input: $input) {
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
export const createGift = /* GraphQL */ `
  mutation CreateGift(
    $condition: ModelGiftConditionInput
    $input: CreateGiftInput!
  ) {
    createGift(condition: $condition, input: $input) {
      attribute_1
      attribute_2
      attribute_3
      createdAt
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
export const createPerson = /* GraphQL */ `
  mutation CreatePerson(
    $condition: ModelPersonConditionInput
    $input: CreatePersonInput!
  ) {
    createPerson(condition: $condition, input: $input) {
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
export const deleteGame = /* GraphQL */ `
  mutation DeleteGame(
    $condition: ModelGameConditionInput
    $input: DeleteGameInput!
  ) {
    deleteGame(condition: $condition, input: $input) {
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
export const deleteGamePerson = /* GraphQL */ `
  mutation DeleteGamePerson(
    $condition: ModelGamePersonConditionInput
    $input: DeleteGamePersonInput!
  ) {
    deleteGamePerson(condition: $condition, input: $input) {
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
export const deleteGift = /* GraphQL */ `
  mutation DeleteGift(
    $condition: ModelGiftConditionInput
    $input: DeleteGiftInput!
  ) {
    deleteGift(condition: $condition, input: $input) {
      attribute_1
      attribute_2
      attribute_3
      createdAt
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
export const deletePerson = /* GraphQL */ `
  mutation DeletePerson(
    $condition: ModelPersonConditionInput
    $input: DeletePersonInput!
  ) {
    deletePerson(condition: $condition, input: $input) {
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
export const updateGame = /* GraphQL */ `
  mutation UpdateGame(
    $condition: ModelGameConditionInput
    $input: UpdateGameInput!
  ) {
    updateGame(condition: $condition, input: $input) {
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
export const updateGamePerson = /* GraphQL */ `
  mutation UpdateGamePerson(
    $condition: ModelGamePersonConditionInput
    $input: UpdateGamePersonInput!
  ) {
    updateGamePerson(condition: $condition, input: $input) {
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
export const updateGift = /* GraphQL */ `
  mutation UpdateGift(
    $condition: ModelGiftConditionInput
    $input: UpdateGiftInput!
  ) {
    updateGift(condition: $condition, input: $input) {
      attribute_1
      attribute_2
      attribute_3
      createdAt
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
export const updatePerson = /* GraphQL */ `
  mutation UpdatePerson(
    $condition: ModelPersonConditionInput
    $input: UpdatePersonInput!
  ) {
    updatePerson(condition: $condition, input: $input) {
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
