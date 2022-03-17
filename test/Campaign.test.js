const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const compiledCampaignFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');
const { beforeEach } = require('mocha');

const { utils, eth: { getAccounts, Contract, getBalance } } = new Web3(ganache.provider());

let accounts;
let factory;
let campaign;
let campaignAddress;

beforeEach(async () => {
    accounts = await getAccounts();
    // console.log(JSON.parse(compiledCampaignFactory))

    factory = await new Contract(JSON.parse(compiledCampaignFactory.interface))
        .deploy({ data: compiledCampaignFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000' });

    await factory.methods.createCampaign('100').send({ from: accounts[0], gas: '1000000' });
    [campaignAddress] = await factory.methods.getCampaigns().call();

    campaign = await new Contract(JSON.parse(compiledCampaign.interface), campaignAddress);
});

describe('Campaign', () => {
    it('deploys a factory and campaign', () => {
        assert.ok(campaign.options.address);
        assert.ok(factory.options.address);
    });

    it('the manager of the campaign is the msg.sender of the factory.createCampaign method', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(manager, accounts[0]);
    });

    it('allows people to contribute money and marks them as approvers', async () => {
        await campaign.methods.contribute().send({ from: accounts[1], value: '200' });
        const isContributor = await campaign.methods.contributors(accounts[1]).call() === true;
        assert(isContributor);
    });

    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                value: '99'
            });
        } catch (e) {
            assert(e);
        }
    });

    it('manager has the ability to make a disbursement request', async () => {
        const description = 'Need to pay Grubby $3000 for meals for the staff';
        await campaign.methods.createRequest(
            description,
            '400',
            accounts[1]
        ).send({
            from: accounts[0],
            gas: '1000000'
        });
        const request = await campaign.methods.requests(0).call();
        assert.equal(request.description, description);
    });

    it('processes requests', async () => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: utils.toWei('10', 'ether')
        });

        await campaign.methods.createRequest(
            'End-to-end test',
            utils.toWei('5', 'ether'),
            accounts[1]
        ).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.approveRequest(0).send({
            from: accounts[1],
            gas: '1000000'
        });

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let balance = await getBalance(accounts[1]);
        balance = utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);

        assert(balance < 90);
    });
});