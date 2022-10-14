import { Footer } from "./footer";
import { VCardDataAdt } from "../app";

const QrCodeCardStory = () => <>
    <p>Loaded</p>
    <Footer downloadUrl={VCardDataAdt.as.Loaded({ url: "" })}></Footer>
    <p>NotLoaded</p>
    <Footer downloadUrl={VCardDataAdt.as.NotLoaded({ url: "" })}></Footer>
    <p>Failure</p>
    <Footer downloadUrl={VCardDataAdt.as.Failure({ url: "" })}></Footer>
    <p>Loading</p>
    <Footer downloadUrl={VCardDataAdt.as.Loading({ url: "" })}></Footer>
</>;

export default QrCodeCardStory;
