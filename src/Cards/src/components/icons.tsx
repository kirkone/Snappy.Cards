import {
    AlertTriangle,
    ChevronDown,
    ChevronUp,
    Download,
    Facebook,
    Github,
    Globe,
    Info,
    Instagram,
    Loader,
    LucideProps,
    Mail,
    Smartphone,
    Twitch,
    Twitter,
    Youtube,
} from "lucide-preact";

import type { Endomorphism } from "fp-ts/Endomorphism";
import type { FunctionComponent } from "preact";

export type SnappyIcon = FunctionComponent<LucideProps>;

const makeIcon: Endomorphism<SnappyIcon> =
    (Icon) => ({ size = "1.33em", ...rest }) => <Icon {...rest} size={size} />;

export const DownloadIcon = makeIcon(Download);
export const InfoIcon = makeIcon(Info);
export const ErrorIcon = makeIcon(AlertTriangle);
export const LoaderIcon = makeIcon(Loader);
export const ChevronDownIcon = makeIcon(ChevronDown);
export const ChevronUpIcon = makeIcon(ChevronUp);

export const SmartphoneIcon = makeIcon(Smartphone);
export const MailIcon = makeIcon(Mail);
export const WebIcon = makeIcon(Globe);
export const TwitterIcon = makeIcon(Twitter);
export const FacebookIcon = makeIcon(Facebook);
export const YoutubeIcon = makeIcon(Youtube);
export const InstagramIcon = makeIcon(Instagram);
export const TwitchIcon = makeIcon(Twitch);
export const GithubIcon = makeIcon(Github);
