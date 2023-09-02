import type { FunctionComponent } from "preact";
import sprite from "../assets/remixicon.symbol.svg";

// Following https://dev.to/askrodney/deno-fresh-svg-sprites-optimized-icons-3dpg
// Generated using https://remixicon.com/
// 1. Add all icons to your bundle
// 2. Download "Fonts" Collection
// 3. Copy remixicon.symbol.svg to src/assets

type IconProps = {
    className?: string;
    size?: number;
};

const makeIcon: (id: string) => FunctionComponent<IconProps> = (id: string) => ({
    className = "",
    size = 1.36
}) => (
    <svg className={className}
        height={`${size}em`}
        width={`${size}em`}
    >
        <use href={`${sprite}#${id}`} fill="currentColor" />
    </svg>
);

export const DownloadIcon = makeIcon("download-2-line");
export const InfoIcon = makeIcon("information-line");
export const ErrorIcon = makeIcon("alert-line");
export const LoaderIcon = makeIcon("loader-2-line");
export const ChevronDownIcon = makeIcon("arrow-down-s-line");
export const ChevronUpIcon = makeIcon("arrow-up-s-line");

export const SmartphoneIcon = makeIcon("smartphone-line");
export const MailIcon = makeIcon("mail-line");
export const WebIcon = makeIcon("global-line");
export const XIcon = makeIcon("twitter-x-line");
export const FacebookIcon = makeIcon("facebook-box-line");
export const YoutubeIcon = makeIcon("youtube-line");
export const InstagramIcon = makeIcon("instagram-line");
export const TwitchIcon = makeIcon("twitch-fill");
export const GithubIcon = makeIcon("github-line");
