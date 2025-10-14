import { Abi } from "viem";

export const BEACON_FACTORY_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "identityModuleImplementation",
        type: "address",
      },
      {
        internalType: "address",
        name: "forwarderAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "identityModule",
        type: "address",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "salt",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "signingDid",
            type: "string",
          },
          {
            internalType: "bytes",
            name: "accountPublicKey",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "accountPrivateKey",
            type: "bytes",
          },
          {
            internalType: "address",
            name: "agentAddress",
            type: "address",
          },
        ],
        indexed: false,
        internalType: "struct IIdentityModule.IdentityInput",
        name: "identity",
        type: "tuple",
      },
    ],
    name: "NewIdentityModule",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "forwarderAddress",
        type: "address",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "salt",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "signingDid",
            type: "string",
          },
          {
            internalType: "bytes",
            name: "accountPublicKey",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "accountPrivateKey",
            type: "bytes",
          },
          {
            internalType: "address",
            name: "agentAddress",
            type: "address",
          },
        ],
        internalType: "struct IIdentityModule.IdentityInput",
        name: "identity",
        type: "tuple",
      },
    ],
    name: "createNewIdentityModule",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "identityModuleAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "identityModuleBeacon",
    outputs: [
      {
        internalType: "contract UpgradeableBeacon",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "forwarder",
        type: "address",
      },
    ],
    name: "isTrustedForwarder",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "forwarderAddress",
        type: "address",
      },
    ],
    name: "setForwarderAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "trustedForwarder",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
    ],
    name: "updateIdentityModuleImplementation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as Abi;
