/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateGame = /* GraphQL */ `
  subscription OnCreateGame(
    $filter: ModelSubscriptionGameFilterInput
    $owner: String
  ) {
    onCreateGame(filter: $filter, owner: $owner) {
      createdAt
      description
      id
      joinQrCode
      name
      owner
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
export const onCreateGamePerson = /* GraphQL */ `
  subscription OnCreateGamePerson(
    $filter: ModelSubscriptionGamePersonFilterInput
    $owner: String
  ) {
    onCreateGamePerson(filter: $filter, owner: $owner) {
      acceptedInvitation
      createdAt
      game {
        createdAt
        description
        id
        joinQrCode
        name
        owner
        ownerId
        phase
        secret
        updatedAt
        __typename
      }
      gameId
      id
      owner
      person {
        createdAt
        isAdmin
        owner
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
export const onCreateGift = /* GraphQL */ `
  subscription OnCreateGift(
    $filter: ModelSubscriptionGiftFilterInput
    $owner: String
  ) {
    onCreateGift(filter: $filter, owner: $owner) {
      attribute_1
      attribute_2
      attribute_3
      createdAt
      id
      name
      number
      owner
      ownerGamePersonId
      updatedAt
      winnerGamePersonId
      __typename
    }
  }
`;
export const onCreatePerson = /* GraphQL */ `
  subscription OnCreatePerson(
    $filter: ModelSubscriptionPersonFilterInput
    $owner: String
  ) {
    onCreatePerson(filter: $filter, owner: $owner) {
      createdAt
      games {
        nextToken
        __typename
      }
      isAdmin
      owner
      ownerId
      updatedAt
      __typename
    }
  }
`;
export const onDeleteGame = /* GraphQL */ `
  subscription OnDeleteGame(
    $filter: ModelSubscriptionGameFilterInput
    $owner: String
  ) {
    onDeleteGame(filter: $filter, owner: $owner) {
      createdAt
      description
      id
      joinQrCode
      name
      owner
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
export const onDeleteGamePerson = /* GraphQL */ `
  subscription OnDeleteGamePerson(
    $filter: ModelSubscriptionGamePersonFilterInput
    $owner: String
  ) {
    onDeleteGamePerson(filter: $filter, owner: $owner) {
      acceptedInvitation
      createdAt
      game {
        createdAt
        description
        id
        joinQrCode
        name
        owner
        ownerId
        phase
        secret
        updatedAt
        __typename
      }
      gameId
      id
      owner
      person {
        createdAt
        isAdmin
        owner
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
export const onDeleteGift = /* GraphQL */ `
  subscription OnDeleteGift(
    $filter: ModelSubscriptionGiftFilterInput
    $owner: String
  ) {
    onDeleteGift(filter: $filter, owner: $owner) {
      attribute_1
      attribute_2
      attribute_3
      createdAt
      id
      name
      number
      owner
      ownerGamePersonId
      updatedAt
      winnerGamePersonId
      __typename
    }
  }
`;
export const onDeletePerson = /* GraphQL */ `
  subscription OnDeletePerson(
    $filter: ModelSubscriptionPersonFilterInput
    $owner: String
  ) {
    onDeletePerson(filter: $filter, owner: $owner) {
      createdAt
      games {
        nextToken
        __typename
      }
      isAdmin
      owner
      ownerId
      updatedAt
      __typename
    }
  }
`;
export const onUpdateGame = /* GraphQL */ `
  subscription OnUpdateGame(
    $filter: ModelSubscriptionGameFilterInput
    $owner: String
  ) {
    onUpdateGame(filter: $filter, owner: $owner) {
      createdAt
      description
      id
      joinQrCode
      name
      owner
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
export const onUpdateGamePerson = /* GraphQL */ `
  subscription OnUpdateGamePerson(
    $filter: ModelSubscriptionGamePersonFilterInput
    $owner: String
  ) {
    onUpdateGamePerson(filter: $filter, owner: $owner) {
      acceptedInvitation
      createdAt
      game {
        createdAt
        description
        id
        joinQrCode
        name
        owner
        ownerId
        phase
        secret
        updatedAt
        __typename
      }
      gameId
      id
      owner
      person {
        createdAt
        isAdmin
        owner
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
export const onUpdateGift = /* GraphQL */ `
  subscription OnUpdateGift(
    $filter: ModelSubscriptionGiftFilterInput
    $owner: String
  ) {
    onUpdateGift(filter: $filter, owner: $owner) {
      attribute_1
      attribute_2
      attribute_3
      createdAt
      id
      name
      number
      owner
      ownerGamePersonId
      updatedAt
      winnerGamePersonId
      __typename
    }
  }
`;
export const onUpdatePerson = /* GraphQL */ `
  subscription OnUpdatePerson(
    $filter: ModelSubscriptionPersonFilterInput
    $owner: String
  ) {
    onUpdatePerson(filter: $filter, owner: $owner) {
      createdAt
      games {
        nextToken
        __typename
      }
      isAdmin
      owner
      ownerId
      updatedAt
      __typename
    }
  }
`;
