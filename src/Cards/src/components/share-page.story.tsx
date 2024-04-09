import * as O from "fp-ts/Option";

import { BrowserDataAdt, getBrowserData } from "../model/browser-data";

import { SharePage } from "./share-page";
import { VCardDataAdt } from "../model/v-card-url";

// TODO: Stories for different browserData
const staticBrowserData = BrowserDataAdt.of.Loaded(getBrowserData());

const QrCodeCardStory = () => <>
    <h1 style={{ backgroundColor: "white" }}>Loaded</h1>
    <SharePage
        name={O.some("Guybrush Threepwood")}
        downloadUrl={VCardDataAdt.as.Loaded({ url: "" })}
        browserData={staticBrowserData}
        onShareClick={() => { }}

    />

    <h1 style={{ backgroundColor: "white" }}>NotLoaded</h1>
    <SharePage
        name={O.some("Guybrush Threepwood")}
        downloadUrl={VCardDataAdt.as.NotLoaded({ url: "" })}
        browserData={staticBrowserData}
        onShareClick={() => { }}
    />

    <h1 style={{ backgroundColor: "white" }}>Failure</h1>
    <SharePage
        name={O.some("Guybrush Threepwood")}
        downloadUrl={VCardDataAdt.as.Failure({ url: "" })}
        browserData={staticBrowserData}
        onShareClick={() => { }}
    />

    <h1 style={{ backgroundColor: "white" }}>Loading</h1>
    <SharePage
        name={O.some("Guybrush Threepwood")}
        downloadUrl={VCardDataAdt.as.Loading({ url: "" })}
        browserData={staticBrowserData}
        onShareClick={() => { }}
    />
</>;

export default QrCodeCardStory;
