import { useEffect, useState } from "react";

import Link from "next/link";

import Page from "../components/layout/Page";

export default (props) => {
    return (
        <Page>
            <div style={{ height: "96vh", border: "1px solid gray", fontSize: 22, color: "teal", padding: '20px 30px', lineHeight: 2.4 }}>
                <div>CrowdCoin allows you to crowdsource the big bucks you need to take your next project off the ground!</div>
                <div>Built with security and flexibility in mind, CrowdCoin connects you with your community of backers using the power of state-of-the-art blockchain technology.</div>
                <div>Click 'Campaigns' to get started!</div>
            </div>
        </Page>
    );
};
