import { useState } from "react";
import { toast } from "react-toastify";

import { Button, Form, Input } from "semantic-ui-react";
import campaignFactory from "../../ethereum/deployed_contracts/campaign_factory";
import web3 from "../../web3";

const {
    utils,
    eth: { getAccounts },
} = web3;

const CreateCampaignForm = ({ onCreate }) => {
    // state
    const [minimumContribution, setMinimumContribution] = useState(0);
    const [loading, setLoading] = useState(false);

    // utils
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (minimumContribution < 0) return toast.error(`You cannot enter a negative value!`);

        setLoading(true);

        try {
            const inWei = utils.toWei(String(minimumContribution), "ether");
            const accounts = await getAccounts();

            await campaignFactory.methods.createCampaign(inWei).send({
                from: accounts[0],
            });
            toast(`Campaign created successfully!`);
            onCreate && onCreate();
        } catch (err) {
            toast.error(err.message ?? err);
        }

        setLoading(false);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Field>
                <label>Minimum contribution</label>
                <Input label={`ETH`} labelPosition={`right`} type={`number`} value={minimumContribution} onChange={(e) => setMinimumContribution(e.target.value)} />

                <div style={{ marginTop: 15 }}>
                    <Button primary type={`submit`} loading={loading}>
                        Create!
                    </Button>
                </div>
            </Form.Field>
        </Form>
    );
};

export default CreateCampaignForm;
