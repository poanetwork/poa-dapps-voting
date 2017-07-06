# Oracles network Governance Dapp

## Supported browsers

* Google Chrome v 59.0.3071.115+

## Oracles plugin setup

* Choose Oracles network in Oracles plugin (See [Choosing of Oralces Network from wiki](https://github.com/oraclesorg/oracles-wiki#choosing-of-oralces-network))

* Import your voting key to Oracles Plugin (See [Governance section from wiki](https://github.com/oraclesorg/oracles-wiki#governance)).

## Governance Dapp lifecycle

Check [Governance Dapp section from wiki](https://github.com/oraclesorg/oracles-wiki#governance)

## Ballots page
You'll see the page with the list of all ballots. Here you can switch to see only your **UNANSWERED** or **EXPIRED** ballots. 
**Search** by ballots' data is available too.

Single ballot page is opened by clicking **VOTE NOW** button.

![](./docs/ballots.png)

## Single ballot page
Here you can vote for or against notary. If total number of votes > 3, notary will be added or deleted from the network depending on votes majority after voting will be finished.

![](./docs/ballot.png)

## New ballot page
Click **NEW BALLOT** button from any page to create a new ballot. 

![](./docs/new_ballot_1.png)

![](./docs/new_ballot_2.png)

## Settings page
You can return to this page from any page by clicking **Settings** button. You can choose your voting key here.

![](./docs/settings.png)

## Configuration file
It is configured with [Oracles network contract](https://github.com/oraclesorg/oracles-contract)

Path: `./assets/javascripts/config.json`

```
{
  "environment": "live",
  "Ethereum": {
    "live": {
      "contractAddress": "Oracles_contract_address"
    }
  }
}
```

## Building from source

1) `npm install`

2) `npm run sass`

3) `npm run coffee`

4) `npm start`
