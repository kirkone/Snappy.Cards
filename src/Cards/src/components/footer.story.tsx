import { Footer } from "./footer";
import { VCardDataAdt } from "../model/v-card-url";

const QrCodeCardStory = () => <>
    <h1 style={{ backgroundColor: "white" }}>Loaded</h1>
    <Footer downloadUrl={VCardDataAdt.as.Loaded({ url: "" })}></Footer>

    <h1 style={{ backgroundColor: "white" }}>NotLoaded</h1>
    <Footer downloadUrl={VCardDataAdt.as.NotLoaded({ url: "" })}></Footer>

    <h1 style={{ backgroundColor: "white" }}>Failure</h1>
    <Footer downloadUrl={VCardDataAdt.as.Failure({ url: "" })}></Footer>

    <h1 style={{ backgroundColor: "white" }}>Loading</h1>
    <Footer downloadUrl={VCardDataAdt.as.Loading({ url: "" })}></Footer>
</>;

export default QrCodeCardStory;
