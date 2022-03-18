import Web3 from 'web3';

let w = global.window;
let web3;

if (typeof w !== undefined && typeof w?.ethereum !== undefined) {
    web3 = new Web3(w?.ethereum);
} else {
    const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/639c9e8a9a0643ad83570717480b238a');
    web3 = new Web3(provider);
}


export default web3;