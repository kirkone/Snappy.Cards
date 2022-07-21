import * as A from "fp-ts/Array";
import * as N from "fp-ts/number";

import type { FunctionalComponent } from "preact";
import { join } from "fp-ts-std/Array";
import { memoize } from "fp-ts-std/Function";
import { pipe } from "fp-ts/function";
import qrCodeGen from "nayuki-qr-code-generator";

export type QrCodeProps = {
    /** text to encode */
    text: string;

    /** error correction level */
    ecc?: qrCodeGen.QrCode.Ecc;

    /** represents the number of blocks as border around qr code */
    border?: number;

    /** css class name, defaults to `""` */
    className?: string;
};

// based on
// https://github.com/nayuki/QR-Code-generator/blob/720f62bddb7226106071d4728c292cb1df519ceb/typescript-javascript/qrcodegen-input-demo.ts#L177

export const QrCode: FunctionalComponent<QrCodeProps> = ({
    text,
    ecc = qrCodeGen.QrCode.Ecc.LOW,
    border = 0,
    className = ""
}) => pipe(
    qrCodeGen.QrCode.encodeText(text, ecc),
    code => <svg xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        viewBox={`0 0 ${code.size + border * 2} ${code.size + border * 2}`}
        className={className}
        stroke="none">
        <path fill="currentColor"
            d={asSvgPath(code, { border })} />
    </svg>
);

type svgPathOptions = {
    border: number;
};

const asSvgPath = (code: qrCodeGen.QrCode, { border }: svgPathOptions) => pipe(
    code.size,
    squareCoordinatesMemoized,
    A.map(
        ({ x, y }) => code.getModule(x, y) ?
            `M${x + border},${y + border}h1v1h-1z` :
            "",
    ),
    join(" ")
);

const squareCoordinates = (n: number) => Array.from(
    { length: n * n },
    (_, i) => ({ x: Math.floor(i / n), y: i % n })
);

const squareCoordinatesMemoized = memoize(N.Eq)(squareCoordinates);
