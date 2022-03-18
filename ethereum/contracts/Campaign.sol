pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public campaigns;

    function createCampaign(uint minContribution) public {
        address campaign = new Campaign(minContribution, msg.sender);
        campaigns.push(campaign);
    }

    function getCampaigns() public view returns (address[]) {
        return campaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        mapping(address => bool) approvers;
        uint approvalCount;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public contributors;
    uint public contributorsCount;

    // modifiers
    modifier ifManager() {
        require(msg.sender == manager);
        _;
    }
    modifier ifContributor() {
        require(contributors[msg.sender]);
        _;
    }

    // utils
    function requireIsApprovable(uint requestIndex) public view {
        require(requests[requestIndex].approvalCount >= (contributorsCount / 2));
    }

    constructor(uint minContribution, address managerAddress) public {
        manager = managerAddress;
        minimumContribution = minContribution;
        contributorsCount = 0;
    }

    // become a backer of this Campaign
    function contribute() public payable {
        require(msg.value >= minimumContribution);

        // allow backers to contribute again without updating the contributorsCount
        if (contributors[msg.sender] == false) {
            contributors[msg.sender] = true;
            contributorsCount++;
        }
    }

    // manager-only: publish a new disbursement request 
    function createRequest(string description, uint value, address recipient) 
        public ifManager {
            Request memory request = Request({
                description: description,
                value: value,
                recipient: recipient,
                complete: false,
                approvalCount: 0
            });

            requests.push(request);
    }

    // enter vote
    function approveRequest(uint requestIndex) public ifContributor {
        Request storage request = requests[requestIndex];
        require(!request.approvers[msg.sender]);

        request.approvers[msg.sender] = true;
        request.approvalCount++;
    }

    // finalize request
    function finalizeRequest(uint requestIndex) public ifManager {
        Request storage request = requests[requestIndex];

        require(!request.complete);
        requireIsApprovable(requestIndex);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    // retrieve summary
    function summary() 
        public view returns(
            uint,
            uint,
            uint,
            uint,
            address
        ) {
        return (
            minimumContribution,
            this.balance,
            requests.length,
            contributorsCount,
            manager
        );
    }

    // retrive number of requests
    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}