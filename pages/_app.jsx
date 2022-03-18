import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "semantic-ui-css/semantic.min.css";

function App({ Component, pageProps }) {
    return (
        <>
            <ToastContainer />
            <Component {...pageProps} />
        </>
    );
}

export default App;
