import { Dimmer, Loader, Segment } from "semantic-ui-react";

const Spinner = () => (
    <div>
        <Segment>
            <Dimmer active>
                <Loader indeterminate active size={"large"}></Loader>
            </Dimmer>
        </Segment>
        <Loader indeterminate>Please, wait...</Loader>
    </div>
);

export default Spinner;
