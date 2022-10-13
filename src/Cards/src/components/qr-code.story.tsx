import { QrCode } from "./qr-code";
import { Variant } from '@vitebook/preact';
import { background } from "./qr-code.story.css";

const QrCodeStory = () => <>
    <Variant
        name="Default"
        description="QR Code."
    >
        <QrCode text="1" className={background} />
    </Variant>

    <Variant
        name="Qr Code with border"
        description="Qr Code with border 2.">
        <QrCode text="1" border={2} className={background} />
    </Variant>
</>;

export default QrCodeStory;
