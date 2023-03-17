import * as styles from "./flip.css";

import type { FunctionComponent, VNode } from "preact";

type FlipProps = {
    front: VNode,
    back: VNode,
};

export const Flip: FunctionComponent<FlipProps> = ({ front, back }) => (
    <div class={styles.card} style={{ padding: 10 }}>
        <div class={`${styles.cardFace} ${styles.cardFaceFront}`}>
            {front}
        </div>
        <div class={`${styles.cardFace} ${styles.cardFaceBack}`}>
            {back}
        </div>
    </div>
);
