import * as theme from "../src/theme/variables.css";

import type { ComponentChildren } from 'preact';

type AppProps = {
    Component: ComponentChildren;
};

function App({ Component }: AppProps) {
    return <div className={theme.defaultTheme}>
        <Component />
    </div>;
}

App.displayName = 'VitebookApp';

export default App;
