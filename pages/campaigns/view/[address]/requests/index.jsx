import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Icon, Table } from "semantic-ui-react";
import { getContractSummary } from "..";
import Page from "../../../../../components/layout/Page";
import campaign from "../../../../../ethereum/deployed_contracts/campaign";
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
    const { Header, Row, HeaderCell, Body, Cell } = Table;
    const headers = ["ID", "Description", "Amount", "Recipient", "Approval count", "", ""];
    const router = useRouter();

    // state
    const [requestsCount, setRequestsCount] = useState(0);
    const [requests, setRequests] = useState([]);
    const [summary, setSummary] = useState({});
    const [userAddress, setUserAddress] = useState("");
    const [approveButtonsLoading, setApproveButtonsLoading] = useState([]);

    // hooks
    useEffect(() => {
        (async () => {
            const r = await getTotalRequests();
            if (r) setRequestsCount(parseInt(r));
            const u = await web3.eth.getAccounts();
            setUserAddress(u[0]);
        })();
    }, []);
    useEffect(() => {
        (async () => {
            const s = await getContractSummary(address);
            if (Object.keys(s).length !== 0) setSummary(s);

            if (requestsCount > 0) {
                const r = await getRequests();
                setRequests(r);
                setApproveButtonsLoading(Array(r.length).fill(false));
            } else {
                setRequests([]);
                setApproveButtonsLoading([]);
            }
        })();
    }, [requestsCount]);

    // utils
    const getTotalRequests = async () => {
        const campaign = Campaign(address);
        const res = await campaign.methods.getRequestsCount().call();
        return res;
    };
    const getRequests = async () => {
        const campaign = Campaign(address);
        const res = await Promise.all(
            Array(requestsCount)
                .fill()
                .map((_, i) => campaign.methods.requests(i).call())
        );
        return res;
    };
    const approveRequest = async (index) => {
        const campaign = Campaign(address);
        const n = approveButtonsLoading;
        n[index] = true;
        setApproveButtonsLoading(n);

        try {
            await campaign.methods.approveRequest(index).send({
                from: userAddress,
            });
            toast("You approved a request!");
            const r = requests;
            r[index].approvalCount += 1;
            setRequests(r);
        } catch (err) {
            toast.error(err.message ?? err);
        }

        n[index] = false;
        setApproveButtonsLoading(n);
    };
    const disburse = async (index) => {
        const campaign = Campaign(address);

        try {
            await campaign.methods.finalizeRequest(index).send({
                from: userAddress,
            });
            toast("You disbursed funds from a request!");
            router.reload();
        } catch (err) {
            toast.error(err.message ?? err);
        }
    };

    // jsx
    const RequestRow = ({ request, address, id }) => (
        <Row disabled={request.complete} positiive={request.approvalCount >= summary.contributorsCount / 2 && !request.complete}>
            <Cell>{id}</Cell>
            <Cell>{request.description}</Cell>
            <Cell>{web3.utils.fromWei(request.value, "ether")} ETH</Cell>
            <Cell>{request.recipient}</Cell>
            <Cell>
                {request.approvalCount}/{summary.contributorsCount}
            </Cell>
            <Cell>
                <Button onClick={() => approveRequest(id - 1)} basic color={`green`} loading={approveButtonsLoading[id - 1]}>
                    Approve
                </Button>
            </Cell>
            <Cell>
                {request.complete ? (
                    <span style={{ color: "green", fontWeight: 700 }}>
                        Disbursed! <Icon name={`check`} />
                    </span>
                ) : (
                    <Button onClick={() => disburse(id - 1)} color="green" disabled={request.approvalCount < summary.contributorsCount / 2}>
                        Disburse!
                    </Button>
                )}
            </Cell>
        </Row>
    );

    return (
        <Page>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>Disbursement requests</h3>
                <Link href={`/campaigns/view/${address}/requests/new`}>
                    <a>
                        <Button primary>Add Request</Button>
                    </a>
                </Link>
            </div>
            <div style={{ marginTop: 30 }}>
                <Table>
                    <Header>
                        <Row>
                            {headers.map((header, i) => (
                                <HeaderCell key={i}>{header}</HeaderCell>
                            ))}
                        </Row>
                    </Header>
                    <Body>
                        {requests.map((request, i) => (
                            <RequestRow key={i} request={request} address={address} id={i + 1} />
                        ))}
                    </Body>
                </Table>
            </div>
        </Page>
    );
};

export default View;
