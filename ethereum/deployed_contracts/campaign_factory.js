import web3 from '../../web3';
import CampaignFactory from '../build/CampaignFactory.json';

const instance = web3.eth ? new web3.eth.Contract(JSON.parse(CampaignFactory.interface), '0x8ba9CcD82656eb7e6133d9528639B69f08a950dd') : undefined;

export default instance;  