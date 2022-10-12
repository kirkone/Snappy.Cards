import * as O from "fp-ts/Option";
import * as R from "fp-ts/Record";
import * as styles from "./card.css";

import type { FunctionComponent, FunctionalComponent } from "preact";
import { constant, pipe } from "fp-ts/function";

import { Glass } from "./glass";

export type CardData = {
    name: O.Option<string>;
    phone: O.Option<string>;
    mail: O.Option<string>;
    web: O.Option<string>;
    sub: O.Option<string>;
    avatar: O.Option<string>;
};

export const Card: FunctionalComponent<{ data: CardData; }> = ({
    data: { avatar, sub, ...details }
}) => (
    <Glass className={styles.container}>
        <div className={styles.card}>

            {pipe(
                avatar,
                O.fold(
                    Empty,
                    (src) => <div className={styles.layoutNarrow}>
                        <div className={styles.avatarCircle}>
                            <img src={src} className={styles.avatar} alt="It's me." />
                        </div>
                    </div>
                )
            )}

            {pipe(
                details,
                O.fromPredicate(R.some(O.isSome)),
                O.fold(
                    Empty,
                    Details
                )
            )}

            <div className={styles.layoutBottom}>
                {pipe(
                    sub,
                    O.fold(
                        Empty,
                        (s) => <span>{s}</span>
                    )
                )}
            </div>

        </div>
    </Glass>
);

const Empty = constant(<></>);

type IconProps = {
    className?: string;
};

const PhoneIcon: FunctionalComponent<IconProps> = ({ className = "" }) => (
    <svg width="24"
        height="24"
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M13 16H11V18H13V16Z" fill="currentColor" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M5 4C5 2.89543 5.89543 2 7 2H17C18.1046 2 19 2.89543 19 4V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V4ZM7 4H17V20H7L7 4Z" fill="currentColor" />
    </svg>
);

const MailIcon: FunctionalComponent<IconProps> = ({ className = "" }) => (
    <svg width="24"
        height="24"
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M3.00977 5.83789C3.00977 5.28561 3.45748 4.83789 4.00977 4.83789H20C20.5523 4.83789 21 5.28561 21 5.83789V17.1621C21 18.2667 20.1046 19.1621 19 19.1621H5C3.89543 19.1621 3 18.2667 3 17.1621V6.16211C3 6.11449 3.00333 6.06765 3.00977 6.0218V5.83789ZM5 8.06165V17.1621H19V8.06199L14.1215 12.9405C12.9499 14.1121 11.0504 14.1121 9.87885 12.9405L5 8.06165ZM6.57232 6.80554H17.428L12.7073 11.5263C12.3168 11.9168 11.6836 11.9168 11.2931 11.5263L6.57232 6.80554Z" fill="currentColor" />
    </svg>
);

const WebIcon: FunctionalComponent<IconProps> = ({ className = "" }) => (
    <svg width="24"
        height="24"
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM14.8055 18.4151C17.1228 17.4003 18.7847 15.1667 18.9806 12.525C18.1577 12.9738 17.12 13.3418 15.9371 13.598C15.7882 15.4676 15.3827 17.1371 14.8055 18.4151ZM9.1945 5.58487C7.24725 6.43766 5.76275 8.15106 5.22208 10.244C5.4537 10.4638 5.84813 10.7341 6.44832 11.0008C6.89715 11.2003 7.42053 11.3798 8.00537 11.5297C8.05853 9.20582 8.50349 7.11489 9.1945 5.58487ZM10.1006 13.9108C10.2573 15.3675 10.5852 16.6202 10.9992 17.5517C11.2932 18.2133 11.5916 18.6248 11.8218 18.8439C11.9037 18.9219 11.9629 18.9634 12 18.9848C12.0371 18.9634 12.0963 18.9219 12.1782 18.8439C12.4084 18.6248 12.7068 18.2133 13.0008 17.5517C13.4148 16.6202 13.7427 15.3675 13.8994 13.9108C13.2871 13.9692 12.6516 14 12 14C11.3484 14 10.7129 13.9692 10.1006 13.9108ZM8.06286 13.598C8.21176 15.4676 8.61729 17.1371 9.1945 18.4151C6.8772 17.4003 5.21525 15.1666 5.01939 12.525C5.84231 12.9738 6.88001 13.3418 8.06286 13.598ZM13.9997 11.8896C13.369 11.9609 12.6993 12 12 12C11.3008 12 10.631 11.9609 10.0003 11.8896C10.0135 9.66408 10.4229 7.74504 10.9992 6.44832C11.2932 5.78673 11.5916 5.37516 11.8218 5.15605C11.9037 5.07812 11.9629 5.03659 12 5.01516C12.0371 5.03659 12.0963 5.07812 12.1782 5.15605C12.4084 5.37516 12.7068 5.78673 13.0008 6.44832C13.5771 7.74504 13.9865 9.66408 13.9997 11.8896ZM15.9946 11.5297C15.9415 9.20582 15.4965 7.11489 14.8055 5.58487C16.7528 6.43766 18.2373 8.15107 18.7779 10.244C18.5463 10.4638 18.1519 10.7341 17.5517 11.0008C17.1029 11.2003 16.5795 11.3798 15.9946 11.5297Z" fill="currentColor" />
    </svg>
);

type DetailProps = Pick<CardData, "mail" | "name" | "phone" | "web">;

const Details: FunctionComponent<DetailProps> = ({
    mail,
    name,
    phone,
    web
}) => (
    <address className={styles.layoutWide}>
        <ul class={styles.detail}>
            {pipe(
                name,
                O.fold(
                    Empty,
                    (n) => <li className={styles.detailLine}>
                        <h3 className={styles.detailHeading}>{n}</h3>
                    </li>
                )
            )}

            {pipe(
                phone,
                O.fold(
                    Empty,
                    (p) => <li className={styles.detailLine}>
                        <PhoneIcon className={styles.detailIcon} />
                        <span>{p}</span>
                    </li>
                )
            )}

            {pipe(
                mail,
                O.fold(
                    Empty,
                    (m) => <li className={styles.detailLine}>
                        <MailIcon className={styles.detailIcon} />
                        <span>{m}</span>
                    </li>
                )
            )}

            {pipe(
                web,
                O.fold(
                    Empty,
                    (w) => <li className={styles.detailLine}>
                        <WebIcon className={styles.detailIcon} />
                        <span>{w}</span>
                    </li>
                )
            )}
        </ul>
    </address>
);