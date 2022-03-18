import { useEffect, useState } from "react";

import Link from "next/link";

import { Card, Button } from "semantic-ui-react";

import campaignFactory from "../../ethereum/deployed_contracts/campaign_factory";
import Page from "../../components/layout/Page";

export default (props) => {
    // state
    const [campaigns, setCampaigns] = useState([]);

    // hooks
    useEffect(() => {
        (async () => {
            const c = await getCampaigns();
            Array.isArray(c) && setCampaigns(c);
        })();
    }, []);

    // utils
    const getCampaigns = async () => {
        const campaigns = await campaignFactory?.methods?.getCampaigns()?.call();
        console.log("campaigns =>", campaigns);

        return campaigns;
    };

    // jsx
    const renderCampaigns = () => {
        const items = campaigns.map((campaign) => ({
            header: campaign,
            description: (
                <Link href={`/campaigns/view/${campaign}`}>
                    <a>View Campaign</a>
                </Link>
            ),
            fluid: true,
        }));

        return <Card.Group items={items} />;
    };

    return (
        <Page>
            <div>
                <h3>Open Campaigns</h3>

                <Link href={`/campaigns/new`}>
                    <a>
                        <Button floated="right" content="Create Campaign" icon="add circle" labelPosition="left" primary />
                    </a>
                </Link>
                {renderCampaigns()}
            </div>
        </Page>
    );
};
