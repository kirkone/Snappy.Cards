import { Meta, StoryObj } from "../utils/storybook";
import { QrCode } from './qr-code';

const meta = {
    title: 'Components/QrCode',
    component: QrCode,
    args: {
        text: "1"
    },
    decorators: [
        (Story) => (
            <div style={{ height: "300px", width: "300px" }}>
                <Story />
            </div>
        )
    ]
} satisfies Meta<typeof QrCode>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
};

export const WithBorder: Story = {
    args: {
        border: 2
    },
};
