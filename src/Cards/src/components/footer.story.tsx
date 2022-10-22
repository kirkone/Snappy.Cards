import * as O from "fp-ts/Option";

import { Footer } from "./footer";
import { VCardDataAdt } from "../model/v-card-url";

const QrCodeCardStory = () => <>
    <h1 style={{ backgroundColor: "white" }}>Loaded</h1>
    <Footer
        name={O.some("Guybrush Threepwood")}
        downloadUrl={VCardDataAdt.as.Loaded({ url: "" })}
    />

    <h1 style={{ backgroundColor: "white" }}>NotLoaded</h1>
    <Footer
        name={O.some("Guybrush Threepwood")}
        downloadUrl={VCardDataAdt.as.NotLoaded({ url: "" })}
    />

    <h1 style={{ backgroundColor: "white" }}>Failure</h1>
    <Footer
        name={O.some("Guybrush Threepwood")}
        downloadUrl={VCardDataAdt.as.Failure({ url: "" })}
    />

    <h1 style={{ backgroundColor: "white" }}>Loading</h1>
    <Footer
        name={O.some("Guybrush Threepwood")}
        downloadUrl={VCardDataAdt.as.Loading({ url: "" })}
    />
</>;

export default QrCodeCardStory;
