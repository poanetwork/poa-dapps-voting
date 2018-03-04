import { messages } from "../messages";
import { addressesURL, wrongRepoAlert } from "./helpers";
import swal from 'sweetalert2';
        const local = { 
            "VOTING_TO_CHANGE_KEYS_ADDRESS": "0x5226f8863d1dfd4cf1b0c8809adddcbfb3f29c88",
            "VOTING_TO_CHANGE_MIN_THRESHOLD_ADDRESS": "0x41a29980232cee85889c0da454a2113c750b2e91",
            "VOTING_TO_CHANGE_PROXY_ADDRESS": "0x275a09b284a740401c3082bc7a29b0b5c0214ae0",
            "BALLOTS_STORAGE_ADDRESS": "0xf219940f88b4cfb3cfcf5aa96a41ee48ee232cee",
            "METADATA_ADDRESS": "0xb8891bb04889a1b88ad06bd8ee594b80b424f46e",
            "POA_ADDRESS": "0x8bf38d4764929064f2d4d3a56520a76ab3df415b",
        };
    
// const local = {
//     VOTING_TO_CHANGE_KEYS_ADDRESS: '0xecdbe3937cf6ff27f70480855cfe03254f915b48',
//     VOTING_TO_CHANGE_MIN_THRESHOLD_ADDRESS: '0x5ae30d4c8892292e0d8164f87a2e12dff9dc99e1',
//     VOTING_TO_CHANGE_PROXY_ADDRESS: '0x6c221df3695ac13a7f9366568ec069c353d273b8',
//     BALLOTS_STORAGE_ADDRESS: '0x5d6573e62e3688e40c1fc36e01b155fb0006f432',
//     METADATA_ADDRESS: '0x93eba9d9de66133fcde35775e9da593edd59a4e3',
//     POA_ADDRESS: '0xf472e0e43570b9afaab67089615080cf7c20018d',
// }

let SOKOL_ADDRESSES = {};
let CORE_ADDRESSES = {};

async function getContractsAddresses(branch) {
    let addr = addressesURL(branch);
    let response;
    try {
        response = await fetch(addr);
    } catch(e) {
        return wrongRepoAlert(addr);
    }

    let contracts = response.json();

    switch (branch) {
        case 'core':
            CORE_ADDRESSES = contracts;
            break;
        case 'sokol':
            SOKOL_ADDRESSES = local;
            break;
        default:
            CORE_ADDRESSES = contracts;
            break;
    }
}

function getAddresses(netId) {
    switch (netId) {
        case '77':
            return SOKOL_ADDRESSES
        case '99':
            return CORE_ADDRESSES
        default:
            return CORE_ADDRESSES
    }
}

module.exports = {
    getContractsAddresses: getContractsAddresses,
    networkAddresses: getAddresses
}


