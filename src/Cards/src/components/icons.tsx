import {
    AlertTriangle,
    Download,
    Globe,
    Info,
    Loader,
    LucideProps,
    Mail,
    Smartphone
} from "lucide-preact";

import type { Endomorphism } from "fp-ts/Endomorphism";
import type { FunctionComponent } from "preact";

const makeIcon: Endomorphism<FunctionComponent<LucideProps>> =
    (Icon) => ({ size = "1.33em", ...rest }) => <Icon {...rest} size={size} />;

export const DownloadIcon = makeIcon(Download);
export const InfoIcon = makeIcon(Info);
export const SmartphoneIcon = makeIcon(Smartphone);
export const MailIcon = makeIcon(Mail);
export const WebIcon = makeIcon(Globe);
export const ErrorIcon = makeIcon(AlertTriangle);
export const LoaderIcon = makeIcon(Loader);
