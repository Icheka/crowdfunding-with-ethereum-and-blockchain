import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, Input } from "semantic-ui-react";
import Page from "../../../../../components/layout/Page";
import Campaign from "../../../../../ethereum/deployed_contracts/campaign";
import web3 from "../../../../../web3";

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
    const [newRequest, setNewRequest] = useState({
        value: 0,
        description: "",
        target: "",
    });
    const [loading, setLoading] = useState(false);

    // utils
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { value, description, target } = newRequest;
        if (value < 0) return toast.error("You cannot enter an amount less than zero!");

        setLoading(true);

        const campaign = Campaign(address);
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.createRequest(description, web3.utils.toWei(value, "ether"), target).send({
                from: accounts[0],
            });
            router.push(`/campaigns/view/${address}/requests`);
        } catch (err) {
            toast.error(err.message ?? err);
        }

        setLoading(false);
    };

    return (
        <Page>
            <h3>Create a disbursement request</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Field>
                    <label>Description</label>
                    <Input value={newRequest.description} onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })} />
                </Form.Field>

                <Form.Field>
                    <label>Amount</label>
                    <Input type={`number`} label={`ETH`} labelPosition={`right`} value={newRequest.value} onChange={(e) => setNewRequest({ ...newRequest, value: e.target.value })} />
                </Form.Field>

                <Form.Field>
                    <label>Disbursement address</label>
                    <Input value={newRequest.target} onChange={(e) => setNewRequest({ ...newRequest, target: e.target.value })} />
                </Form.Field>

                <div style={{ marginTop: 15 }}>
                    <Button type={`submit`} loading={loading} primary>
                        Create!
                    </Button>
                </div>
            </Form>
        </Page>
    );
};

export default View;
