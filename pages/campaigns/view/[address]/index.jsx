import { useEffect, useState, useLayoutEffect } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import { Card, Button, Grid } from "semantic-ui-react";
import Page from "../../../../components/layout/Page";
import Campaign from "../../../../ethereum/deployed_contracts/campaign";
import web3 from "../../../../web3";
import ContributeForm from "../../../../components/forms/Contribute";

export const getContractSummary = async (address) => {
    if (!address) return;

    const campaign = Campaign(address);
    const summary = await campaign.methods.summary().call();

    return {
        miminumContribution: summary["0"],
        balance: summary["1"],
        requestsCount: summary["2"],
        contributorsCount: summary["3"],
        manager: summary["4"],
    };
};

export const getServerSideProps = (ctx) => {
    return {
        props: {
            address: ctx.query.address,
        },
    };
};

const View = ({ address }) => {
    // vars
    const router = useRouter();

    // state
    const [summary, setSummary] = useState({});

    // hooks
    useLayoutEffect(() => {
        getSummary();
    }, []);

    // utils
    const getSummary = async () => {
        const summary = await getContractSummary(address);
        if (summary) setSummary(summary);
    };

    // jsx
    const renderCards = () => {
        if (Object.keys(summary).length === 0) return;

        const { miminumContribution, balance, requestsCount, contributorsCount, manager } = summary;
        const toEther = (b) => web3.utils.fromWei(b, "ether");

        const items = [
            {
                header: manager,
                meta: "Address of fund manager",
                description: "The manager is accountable to backers of this fund. The can create disbursement requests and finalize requests that are ratified by a majority of backers",
                style: { overflowWrap: "break-word" },
            },
            {
                header: toEther(miminumContribution) + " ETH",
                meta: "Minimum contribution",
                description: `You must contribute at least ${toEther(miminumContribution)} ETH to become a backer`,
                style: { overflowWrap: "break-word" },
            },
            {
                header: requestsCount,
                meta: "Number of disbursement requests",
                description: "A disbursement request must be ratified by a majority of backers",
                style: { overflowWrap: "break-word" },
            },
            {
                header: contributorsCount,
                meta: "Number of backers",
                description: `This campaign has ${contributorsCount} backer${contributorsCount !== 1 && 's!'}`,
                style: { overflowWrap: "break-word" },
            },
            {
                header: toEther(balance),
                meta: "Fund balance",
                description: `This fund currently has a balance of ${toEther(balance)} ETH`,
                style: { overflowWrap: "break-word" },
            },
        ];

        return <Card.Group items={items} />;
    };

    return (
        <Page>
            <div>
                <h3>Campaign</h3>
                <Grid>
                    <Grid.Column width={10}>
                        {renderCards()}
                        {Object.keys(summary).length !== 0 && (
                            <div style={{ marginTop: 20 }}>
                                <Link href={`/campaigns/view/${address}/requests`}>
                                    <a>
                                        <Button primary>View Disbursement Requests</Button>
                                    </a>
                                </Link>
                            </div>
                        )}
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <h3>Become a backer</h3>
                        <ContributeForm address={address} minimumContribution={summary.minimumContribution} onContribute={getSummary} />
                    </Grid.Column>
                </Grid>
            </div>
        </Page>
    );
};

export default View;
