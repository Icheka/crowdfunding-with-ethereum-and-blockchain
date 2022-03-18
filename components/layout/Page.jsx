import Header from "./Header";
import { Container } from "semantic-ui-react";

const Page = ({ children }) => {
    return (
        <Container>
            <header style={{ marginTop: 10, marginBottom: 20 }}>
                <Header />
            </header>
            <div>{children}</div>
        </Container>
    );
};

export default Page;
