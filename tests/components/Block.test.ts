import { mount } from "@vue/test-utils";
import BlockComponent from "@/components/Block.vue"
import { Block, BlockType } from '@/utils/types'

describe('Block.vue', () => {

  it("should render default content without props", async () => {
    const wrapper = mount(BlockComponent, {
      props: {
      },
    })
    await new Promise<void>(r => {
      setTimeout(() => {
        expect(wrapper.vm.getTextContent()).toBe('Hello World')
        r()
      }, 0)
    })
  })

  it("should render BlockType.Divider without content", async () => {
    const wrapper = mount(BlockComponent, {
      props: {
        block: {
          type: BlockType.Divider,
        } as Block,
      },
    })
    await new Promise<void>(r => {
      setTimeout(() => {
        expect(wrapper.vm.getTextContent()).toBe('')
        r()
      }, 0)
    })
  })
})