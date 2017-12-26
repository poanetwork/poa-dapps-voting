# POA Network Governance Dapp

## Supported browsers

* Google Chrome v 59.0.3071.115+

## MetaMask plugin setup

* Connect to POA Network in MetaMask plugin (See [Connect to POA Network via MetaMask](https://github.com/poanetwork/wiki/blob/master/MetaMask-connect.md#connect-to-poa-network-via-metamask))

* Import your voting key to MetaMask Plugin (See [Governance section from wiki](https://github.com/poanetwork/wiki/blob/master/governance.md)).

## Governance Dapp lifecycle

Check [Governance Dapp section from wiki](https://github.com/poanetwork/wiki/blob/master/governance.md)

## Ballots page
You'll see the page with the list of all ballots. Here you can switch to see **ACTIVE** ballots. 
**Search** by ballots' data is available too.

![](./docs/ballots.png)


## New ballot page
Click **NEW BALLOT** button from any page to create a new ballot. 

![](./docs/new_ballot.png)


## Configuration file
It is configured with [POA Network contract](https://github.com/poanetwork/poa-network-consensus-contracts)

Path: `./src/contracts/addresses.js`

```
module.exports = {
 	KEYS_MANAGER_ADDRESS: '0x88a34124bfffa27ef3e052c8dd2908e212643771',
    VOTING_TO_CHANGE_KEYS_ADDRESS: '0x145a3d3bd5db8a0ad863b4949b6088d133726cdb',
    VOTING_TO_CHANGE_MIN_THRESHOLD: '0xad623f870298774765bc5e56ebeafac721028867',
    VOTING_TO_CHANGE_PROXY: '0x6fb85b2030a68a76ab237d2392b09e28e6f03fa9',
    METADATA_ADDRESS: '0xce9ff1123223d13672cce06dd073d3749764daa6',
    POA_ADDRESS: '0x8bf38d4764929064f2d4d3a56520a76ab3df415b',
    BALLOTS_STORAGE_ADDRESS: '0x1e0eaa06d02f965be2dfe0bc9ff52b2d82133461'
}
```

## Building from source

1) `npm i`

2) `npm start`