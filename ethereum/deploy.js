const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledCampaignFactory = require('./build/CampaignFactory.json');
const path = require('path');
const fs = require('fs');

const provider = new HDWalletProvider(
    'magic income feature door brief icon faith anchor empty lock undo double',
    'https://rinkeby.infura.io/v3/639c9e8a9a0643ad83570717480b238a'
);
const { eth: { getAccounts, Contract } } = new Web3(provider);

(async () => {
    const accounts = await getAccounts();
    console.log('Attempting to deploy from account -', accounts[0]);

    const factory = await new Contract(JSON.parse(compiledCampaignFactory.interface))
        .deploy({ data: compiledCampaignFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000' });
    const { address } = factory.options

    console.log('Factory contract deployed to -', address);
    provider.engine.stop();
    fs.writeFileSync(path.resolve(__dirname, 'address'), address);
})();