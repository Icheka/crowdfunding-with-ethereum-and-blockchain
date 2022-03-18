import { useEffect, useState } from "react";

import Link from "next/link";

import { Card, Button } from "semantic-ui-react";

import Page from "../../components/layout/Page";
import CreateCampaignForm from "../../components/forms/CreateCampaign";
import { useRouter } from "next/router";

export default (props) => {
    // vars
    const router = useRouter();

    return (
        <Page>
            <div>
                <h3>New Campaign</h3>
                <CreateCampaignForm onCreate={() => router.push("/campaigns")} />
            </div>
        </Page>
    );
};
