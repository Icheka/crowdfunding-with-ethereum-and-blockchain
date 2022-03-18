import { useEffect, useState, useLayoutEffect } from "react";
import { toast } from "react-toastify";
import { Button, Form, Input } from "semantic-ui-react";
import Campaign from "../../ethereum/deployed_contracts/campaign";
import web3 from "../../web3";

const ContributeForm = ({ address, minimumContribution, onContribute }) => {
    minimumContribution = minimumContribution ?? 0;
    // state
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(0);

    // utils
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (amount < 0) return toast.error("You cannot enter an amount less than zero!");
        if (minimumContribution > 0 && amount < minimumContribution) return toast.error("The minimum contribution for this fund is " + minimumContribution + "!");

        setLoading(true);

        const campaign = Campaign(address);
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(amount, "ether"),
            });
            onContribute && onContribute();
        } catch (err) {
            toast.error(err.message ?? err);
        }

        setLoading(false);
    };

    if (!address) return null;

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Field>
                <label>Amount to contribute</label>
                <Input type={`number`} value={amount} onChange={(e) => setAmount(e.target.value)} label={`ETH`} labelPosition={`right`} />
                <div style={{ marginTop: 15 }}>
                    <Button type={`submit`} loading={loading} primary>
                        Contribute!
                    </Button>
                </div>
            </Form.Field>
        </Form>
    );
};

export default ContributeForm;
