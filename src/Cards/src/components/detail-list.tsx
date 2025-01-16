import * as styles from "./detail-list.css";

import { ComponentType, FunctionComponent, JSX } from "preact";

import { Simplify } from "type-fest";

export const DetailList: FunctionComponent = ({ children }) => (
    <ul className={styles.detail}>
        {children}
    </ul>
);

type DetailLineProps = Pick<JSX.HTMLAttributes, "className" | "style">;

export const DetailLine: FunctionComponent<DetailLineProps> = ({
    children,
    className = "",
    style,
}) => (
    <li className={`${styles.detailLine} ${className}`} style={style}>
        {children}
    </li>
);

type DetailLinkProps = Simplify<
    & Pick<JSX.AnchorHTMLAttributes, "href" | "target" | "rel" | "download" | "onClick">
    & {
        icon: ComponentType<Pick<JSX.HTMLAttributes, "className">>;
        caption: string,
    }
>;

export const DetailLink: FunctionComponent<DetailLinkProps> = ({
    icon: Icon,
    caption,
    ...linkProps
}) => (
    <a {...linkProps}>
        <Icon className={styles.detailIcon} />
        <span>{caption}</span>
    </a>
);
