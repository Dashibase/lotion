import { v4 as uuidv4 } from "uuid";
import Lotion from "@/components/Lotion.vue";
import { LotionProps } from "@/utils/types";
import { Meta, StoryFn } from "@storybook/vue3";
import { BlockType } from "../utils/types";

export default {
	title: "Lotion/Lotion",
	component: Lotion,
	decorators: [() => ({ template: '<div style="margin: 3em; display: grid; place-items: center;"><story /></div>' })]
} as Meta<LotionProps>;

const page = {
	name: "🧴 Lotion",
	blocks: [
		{
			id: uuidv4(),
			type: BlockType.H1,
			details: {
				value: "Get Started",
			},
		},
		{
			id: uuidv4(),
			type: BlockType.Divider,
			details: {},
		},
		{
			id: uuidv4(),
			type: BlockType.Text,
			details: {
				value:
					"👋 Welcome! This is a private page for you to play around with.",
			},
		},
		{
			id: uuidv4(),
			type: BlockType.Text,
			details: {
				value: "Give these things a try:",
			},
		},
		{
			id: uuidv4(),
			type: BlockType.Text,
			details: {
				value: "1. Hover on the left of each line for quick actions",
			},
		},
		{
			id: uuidv4(),
			type: BlockType.Text,
			details: {
				value: "2. Click on the + button to add a new line",
			},
		},
		{
			id: uuidv4(),
			type: BlockType.Text,
			details: {
				value: "3. Drag the ⋮⋮ button to reorder",
			},
		},
		{
			id: uuidv4(),
			type: BlockType.Text,
			details: {
				value: "4. Click the trash icon to delete this block",
			},
		},
		{
			id: uuidv4(),
			type: BlockType.Text,
			details: {
				value: "5. **Bold** and *italicize* using markdown",
			},
		},
		{
			id: uuidv4(),
			type: BlockType.Text,
			details: {
				value:
					"6. Add headers and dividers with '#', '##' or '---' followed by a space",
			},
		},
		{
			id: uuidv4(),
			type: BlockType.Text,
			details: {
				value:
					"7. Type '/' for a menu to quickly switch blocks and search by typing",
			},
		},
	],
};


const Template: StoryFn<LotionProps> = (args) => ({
	components: { Lotion },
	setup() {
		return { args };
	},
	template: '<Lotion v-bind="args" />',
});

export const Primary = Template.bind({});
Primary.args = {
	page,
	readonly: false,
};
