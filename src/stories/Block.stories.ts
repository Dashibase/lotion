import BlockComponent from "@/components/Block.vue";
import { BlockComponentProps, BlockType } from "@/utils/types";
import { Meta, StoryFn } from "@storybook/vue3";
import { v4 as uuidv4 } from "uuid";

export default {
	title: "Lotion/Blocks",
	component: BlockComponent,
	decorators: [() => ({ template: '<div style="margin: 3em; display: grid; place-items: center; height: 100vh;"><story /></div>' })]
} as Meta<BlockComponentProps>;

const Template: StoryFn<BlockComponentProps> = (args) => ({
	components: { BlockComponent },
	setup() {
		return { args };
	},
	template: '<BlockComponent v-bind="args" />',
});

export const TextBlock = Template.bind({});
TextBlock.args = {
	block: {
		id: uuidv4(),
		type: BlockType.Text,
		details: {
			value: "Hello World",
		},
	},
	readonly: false,
	blockTypes: [BlockType.Text],
};
export const Heading1Block = Template.bind({});
Heading1Block.args = {
	block: {
		id: uuidv4(),
		type: BlockType.H1,
		details: {
			value: "Hello World",
		},
	},
	readonly: false,
	blockTypes: [BlockType.Text],
};
export const Heading2Block = Template.bind({});
Heading2Block.args = {
	block: {
		id: uuidv4(),
		type: BlockType.H2,
		details: {
			value: "Hello World",
		},
	},
	readonly: false,
	blockTypes: [BlockType.Text],
};
export const Heading3Block = Template.bind({});
Heading3Block.args = {
	block: {
		id: uuidv4(),
		type: BlockType.H3,
		details: {
			value: "Hello World",
		},
	},
	readonly: false,
	blockTypes: [BlockType.Text],
};
export const DividerBlock = Template.bind({});
DividerBlock.args = {
	block: {
		id: uuidv4(),
		type: BlockType.Divider,
		details: {
		},
	},
	readonly: false,
	blockTypes: [BlockType.Text],
};

export const QuoteBlock = Template.bind({});
QuoteBlock.args = {
	block: {
		id: uuidv4(),
		type: BlockType.Quote,
		details: {
			value: "Hello World",
		},
	},
	readonly: false,
	blockTypes: [BlockType.Text],
};
