/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateGame = /* GraphQL */ `
  subscription OnCreateGame(
    $creatorId: String
    $filter: ModelSubscriptionGameFilterInput
  ) {
    onCreateGame(creatorId: $creatorId, filter: $filter) {
      createdAt
      creatorId
      description
      id
      joinQrCode
      name
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
export const onCreateGamePerson = /* GraphQL */ `
  subscription OnCreateGamePerson(
    $filter: ModelSubscriptionGamePersonFilterInput
    $personId: String
  ) {
    onCreateGamePerson(filter: $filter, personId: $personId) {
      acceptedInvitation
      createdAt
      game {
        createdAt
        creatorId
        description
        id
        joinQrCode
        name
        phase
        secret
        updatedAt
        __typename
      }
      gameId
      id
      ownedGift {
        attribute_1
        attribute_2
        attribute_3
        createdAt
        name
        number
        ownedGamePersonId
        updatedAt
        winnerGamePersonId
        __typename
      }
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
      wonGift {
        attribute_1
        attribute_2
        attribute_3
        createdAt
        name
        number
        ownedGamePersonId
        updatedAt
        winnerGamePersonId
        __typename
      }
      __typename
    }
  }
`;
export const onCreateGift = /* GraphQL */ `
  subscription OnCreateGift(
    $filter: ModelSubscriptionGiftFilterInput
    $ownedGamePersonId: String
  ) {
    onCreateGift(filter: $filter, ownedGamePersonId: $ownedGamePersonId) {
      attribute_1
      attribute_2
      attribute_3
      createdAt
      name
      number
      ownedGamePerson {
        acceptedInvitation
        createdAt
        gameId
        id
        personId
        role
        updatedAt
        __typename
      }
      ownedGamePersonId
      updatedAt
      winnerGamePerson {
        acceptedInvitation
        createdAt
        gameId
        id
        personId
        role
        updatedAt
        __typename
      }
      winnerGamePersonId
      __typename
    }
  }
`;
export const onCreatePerson = /* GraphQL */ `
  subscription OnCreatePerson(
    $filter: ModelSubscriptionPersonFilterInput
    $ownerLoginId: String
  ) {
    onCreatePerson(filter: $filter, ownerLoginId: $ownerLoginId) {
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
export const onDeleteGame = /* GraphQL */ `
  subscription OnDeleteGame(
    $creatorId: String
    $filter: ModelSubscriptionGameFilterInput
  ) {
    onDeleteGame(creatorId: $creatorId, filter: $filter) {
      createdAt
      creatorId
      description
      id
      joinQrCode
      name
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
export const onDeleteGamePerson = /* GraphQL */ `
  subscription OnDeleteGamePerson(
    $filter: ModelSubscriptionGamePersonFilterInput
    $personId: String
  ) {
    onDeleteGamePerson(filter: $filter, personId: $personId) {
      acceptedInvitation
      createdAt
      game {
        createdAt
        creatorId
        description
        id
        joinQrCode
        name
        phase
        secret
        updatedAt
        __typename
      }
      gameId
      id
      ownedGift {
        attribute_1
        attribute_2
        attribute_3
        createdAt
        name
        number
        ownedGamePersonId
        updatedAt
        winnerGamePersonId
        __typename
      }
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
      wonGift {
        attribute_1
        attribute_2
        attribute_3
        createdAt
        name
        number
        ownedGamePersonId
        updatedAt
        winnerGamePersonId
        __typename
      }
      __typename
    }
  }
`;
export const onDeleteGift = /* GraphQL */ `
  subscription OnDeleteGift(
    $filter: ModelSubscriptionGiftFilterInput
    $ownedGamePersonId: String
  ) {
    onDeleteGift(filter: $filter, ownedGamePersonId: $ownedGamePersonId) {
      attribute_1
      attribute_2
      attribute_3
      createdAt
      name
      number
      ownedGamePerson {
        acceptedInvitation
        createdAt
        gameId
        id
        personId
        role
        updatedAt
        __typename
      }
      ownedGamePersonId
      updatedAt
      winnerGamePerson {
        acceptedInvitation
        createdAt
        gameId
        id
        personId
        role
        updatedAt
        __typename
      }
      winnerGamePersonId
      __typename
    }
  }
`;
export const onDeletePerson = /* GraphQL */ `
  subscription OnDeletePerson(
    $filter: ModelSubscriptionPersonFilterInput
    $ownerLoginId: String
  ) {
    onDeletePerson(filter: $filter, ownerLoginId: $ownerLoginId) {
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
export const onUpdateGame = /* GraphQL */ `
  subscription OnUpdateGame(
    $creatorId: String
    $filter: ModelSubscriptionGameFilterInput
  ) {
    onUpdateGame(creatorId: $creatorId, filter: $filter) {
      createdAt
      creatorId
      description
      id
      joinQrCode
      name
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
export const onUpdateGamePerson = /* GraphQL */ `
  subscription OnUpdateGamePerson(
    $filter: ModelSubscriptionGamePersonFilterInput
    $personId: String
  ) {
    onUpdateGamePerson(filter: $filter, personId: $personId) {
      acceptedInvitation
      createdAt
      game {
        createdAt
        creatorId
        description
        id
        joinQrCode
        name
        phase
        secret
        updatedAt
        __typename
      }
      gameId
      id
      ownedGift {
        attribute_1
        attribute_2
        attribute_3
        createdAt
        name
        number
        ownedGamePersonId
        updatedAt
        winnerGamePersonId
        __typename
      }
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
      wonGift {
        attribute_1
        attribute_2
        attribute_3
        createdAt
        name
        number
        ownedGamePersonId
        updatedAt
        winnerGamePersonId
        __typename
      }
      __typename
    }
  }
`;
export const onUpdateGift = /* GraphQL */ `
  subscription OnUpdateGift(
    $filter: ModelSubscriptionGiftFilterInput
    $ownedGamePersonId: String
  ) {
    onUpdateGift(filter: $filter, ownedGamePersonId: $ownedGamePersonId) {
      attribute_1
      attribute_2
      attribute_3
      createdAt
      name
      number
      ownedGamePerson {
        acceptedInvitation
        createdAt
        gameId
        id
        personId
        role
        updatedAt
        __typename
      }
      ownedGamePersonId
      updatedAt
      winnerGamePerson {
        acceptedInvitation
        createdAt
        gameId
        id
        personId
        role
        updatedAt
        __typename
      }
      winnerGamePersonId
      __typename
    }
  }
`;
export const onUpdatePerson = /* GraphQL */ `
  subscription OnUpdatePerson(
    $filter: ModelSubscriptionPersonFilterInput
    $ownerLoginId: String
  ) {
    onUpdatePerson(filter: $filter, ownerLoginId: $ownerLoginId) {
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
