import { Abi } from 'viem';

export const IDENTITY_MODULE_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'InvalidInitialization',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotInitializing',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'identityAddress',
        type: 'address',
      },
    ],
    name: 'AddIdentity',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'identity',
        type: 'address',
      },
    ],
    name: 'AddIdentityGuardians',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'payment',
        type: 'uint256',
      },
    ],
    name: 'ExecutionFailure',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'payment',
        type: 'uint256',
      },
    ],
    name: 'ExecutionSuccess',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint64',
        name: 'version',
        type: 'uint64',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'identity',
        type: 'address',
      },
    ],
    name: 'RemoveIdentityGuardian',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'identityAddress',
        type: 'address',
      },
    ],
    name: 'RemoveKeyStoreContract',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'identityAddress',
        type: 'address',
      },
    ],
    name: 'UpdateIdentity',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'identityAddress',
        type: 'address',
      },
    ],
    name: 'UpdateIdentityAccountKey',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'agent',
        type: 'address',
      },
    ],
    name: 'UpdateIdentityAgent',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'identityAddress',
        type: 'address',
      },
    ],
    name: 'UpdateIdentitySaltSigningDid',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'identityAddress',
        type: 'address',
      },
    ],
    name: 'UpdateKeyStoreContract',
    type: 'event',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes',
            name: 'encryptedShard',
            type: 'bytes',
          },
          {
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
          {
            internalType: 'enum IIdentityModule.GuardianType',
            name: 'guardianType',
            type: 'uint8',
          },
        ],
        internalType: 'struct IIdentityModule.Guardian[]',
        name: 'orgGuardians',
        type: 'tuple[]',
      },
    ],
    name: 'addIdentityGuardians',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: 'safeTxGas',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'baseGas',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'gasPrice',
        type: 'uint256',
      },
      {
        internalType: 'address payable',
        name: 'refundReceiver',
        type: 'address',
      },
    ],
    name: 'execTransaction',
    outputs: [
      {
        internalType: 'bool',
        name: 'success',
        type: 'bool',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getIdentityModuleDetail',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'salt',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'signingDid',
            type: 'string',
          },
          {
            internalType: 'bytes',
            name: 'accountPublicKey',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'accountPrivateKey',
            type: 'bytes',
          },
          {
            internalType: 'address',
            name: 'agentAddress',
            type: 'address',
          },
          {
            components: [
              {
                internalType: 'bytes',
                name: 'encryptedShard',
                type: 'bytes',
              },
              {
                internalType: 'address',
                name: 'account',
                type: 'address',
              },
              {
                internalType: 'enum IIdentityModule.GuardianType',
                name: 'guardianType',
                type: 'uint8',
              },
            ],
            internalType: 'struct IIdentityModule.Guardian[]',
            name: 'guardians',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct IIdentityModule.IdentityOutput',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'contractAddress',
        type: 'address[]',
      },
    ],
    name: 'getIdentityModuleKeyStoreDetails',
    outputs: [
      {
        internalType: 'bytes[]',
        name: '',
        type: 'bytes[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getIdentityModulePublicDetails',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'salt',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'signingDid',
            type: 'string',
          },
          {
            internalType: 'bytes',
            name: 'accountPublicKey',
            type: 'bytes',
          },
          {
            internalType: 'address',
            name: 'agentAddress',
            type: 'address',
          },
        ],
        internalType: 'struct IIdentityModule.IdentityPublicDetails',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getKeyStoreAddresses',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'forwarderAddress',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'salt',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'signingDid',
            type: 'string',
          },
          {
            internalType: 'bytes',
            name: 'accountPublicKey',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'accountPrivateKey',
            type: 'bytes',
          },
          {
            internalType: 'address',
            name: 'agentAddress',
            type: 'address',
          },
        ],
        internalType: 'struct IIdentityModule.IdentityInput',
        name: 'identity',
        type: 'tuple',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'forwarder',
        type: 'address',
      },
    ],
    name: 'isTrustedForwarder',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'keyStoreCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'guardianEncryptedShard',
        type: 'bytes',
      },
    ],
    name: 'removeIdentityGuardian',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'contractAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'prevContractAddresss',
        type: 'address',
      },
    ],
    name: 'removeKeyStoreContract',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'forwarderAddress',
        type: 'address',
      },
    ],
    name: 'setForwarderAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'trustedForwarder',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'salt',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'signingDid',
            type: 'string',
          },
          {
            internalType: 'bytes',
            name: 'accountPublicKey',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'accountPrivateKey',
            type: 'bytes',
          },
          {
            internalType: 'address',
            name: 'agentAddress',
            type: 'address',
          },
        ],
        internalType: 'struct IIdentityModule.IdentityInput',
        name: 'identity',
        type: 'tuple',
      },
    ],
    name: 'updateIdentity',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'accountPublicKey',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: 'accountPrivateKey',
        type: 'bytes',
      },
    ],
    name: 'updateIdentityAccountKey',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'agentAddress',
        type: 'address',
      },
    ],
    name: 'updateIdentityAgent',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'salt',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'signingDid',
        type: 'string',
      },
    ],
    name: 'updateIdentitySaltSigningDid',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'ipfsHash',
        type: 'bytes',
      },
      {
        internalType: 'address',
        name: 'contractAddress',
        type: 'address',
      },
    ],
    name: 'updateKeyStoreContract',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as Abi;
