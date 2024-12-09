/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateGame = /* GraphQL */ `
  subscription OnCreateGame($filter: ModelSubscriptionGameFilterInput) {
    onCreateGame(filter: $filter) {
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
      secret
      updatedAt
      __typename
    }
  }
`;
export const onCreateGamePerson = /* GraphQL */ `
  subscription OnCreateGamePerson(
    $filter: ModelSubscriptionGamePersonFilterInput
  ) {
    onCreateGamePerson(filter: $filter) {
      acceptedInvitation
      createdAt
      game {
        createdAt
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
        id
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
        id
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
  subscription OnCreateGift($filter: ModelSubscriptionGiftFilterInput) {
    onCreateGift(filter: $filter) {
      attribute_1
      attribute_2
      attribute_3
      createdAt
      id
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
  subscription OnCreatePerson($filter: ModelSubscriptionPersonFilterInput) {
    onCreatePerson(filter: $filter) {
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
  subscription OnDeleteGame($filter: ModelSubscriptionGameFilterInput) {
    onDeleteGame(filter: $filter) {
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
      secret
      updatedAt
      __typename
    }
  }
`;
export const onDeleteGamePerson = /* GraphQL */ `
  subscription OnDeleteGamePerson(
    $filter: ModelSubscriptionGamePersonFilterInput
  ) {
    onDeleteGamePerson(filter: $filter) {
      acceptedInvitation
      createdAt
      game {
        createdAt
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
        id
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
        id
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
  subscription OnDeleteGift($filter: ModelSubscriptionGiftFilterInput) {
    onDeleteGift(filter: $filter) {
      attribute_1
      attribute_2
      attribute_3
      createdAt
      id
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
  subscription OnDeletePerson($filter: ModelSubscriptionPersonFilterInput) {
    onDeletePerson(filter: $filter) {
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
  subscription OnUpdateGame($filter: ModelSubscriptionGameFilterInput) {
    onUpdateGame(filter: $filter) {
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
      secret
      updatedAt
      __typename
    }
  }
`;
export const onUpdateGamePerson = /* GraphQL */ `
  subscription OnUpdateGamePerson(
    $filter: ModelSubscriptionGamePersonFilterInput
  ) {
    onUpdateGamePerson(filter: $filter) {
      acceptedInvitation
      createdAt
      game {
        createdAt
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
        id
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
        id
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
  subscription OnUpdateGift($filter: ModelSubscriptionGiftFilterInput) {
    onUpdateGift(filter: $filter) {
      attribute_1
      attribute_2
      attribute_3
      createdAt
      id
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
  subscription OnUpdatePerson($filter: ModelSubscriptionPersonFilterInput) {
    onUpdatePerson(filter: $filter) {
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
