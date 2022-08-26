import { mount } from "@vue/test-utils";
import BlockComponent from "@/components/Block.vue"
import { Block, BlockType } from '@/utils/types'
import { describe, it, expect } from 'vitest' 
import { elementKeyup, elementKeydown, documentKeydown } from '../utils/vitest'

describe('Block.vue', () => {

  it("should return text/HTML when calling getTextContent()/getHtmlContent()", async () => {
    const sampleText = 'Hello, world!'
    const sampleHtml = `<p><strong>${sampleText}</strong></p>`
    const outputHtml = `<strong>${sampleText}</strong>`
    const wrapper = mount(BlockComponent, {
      props: {
        block: {
          type: BlockType.Text,
          details: {
            value: sampleHtml,
          },
        } as Block,
      }
    })
    await new Promise<void>(r => {
      setTimeout(() => {
        expect(wrapper.vm.getTextContent()).toBe(sampleText)
        expect(wrapper.vm.getHtmlContent()).toBe(outputHtml)
        r()
      }, 0)
    })
  })

  it("should move cursor correctly - moveToStart, moveToEnd", async () => {
    const sampleText = 'Hello, world!'
    const wrapper = mount(BlockComponent, {
      props: {
        block: {
          type: BlockType.Text,
          details: {
            value: `<p>${sampleText}</p>`,
          },
        } as Block,
      }
    })
    await new Promise<void>(r => {
      setTimeout(() => {
        wrapper.vm.moveToStart()
        let selection = window.getSelection()
        expect(selection?.getRangeAt(0).startOffset).toBe(0)
        // caretPos should be length of "<p>" i.e. 3
        let caretPos = wrapper.vm.getCaretPos()
        expect(caretPos.pos).toBe('<p>'.length)
        expect(caretPos.tag).toBe(null)
        
        wrapper.vm.moveToEnd()
        selection = window.getSelection()
        expect(selection?.getRangeAt(0).startOffset).toBe(sampleText.length)
        // caretPos should be length of "<p>" + sampleText.length
        caretPos = wrapper.vm.getCaretPos()
        expect(caretPos.pos).toBe('<p>'.length + sampleText.length)
        expect(caretPos.tag).toBe(null)

        const newCaretPos = 5
        wrapper.vm.setCaretPos(newCaretPos)
        caretPos = wrapper.vm.getCaretPos()
        expect(caretPos.pos).toBe('<p>'.length + newCaretPos)
        expect(caretPos.tag).toBe(null)
        r()
      }, 0)
    })
  })

  it("should move cursor correctly - account for HTML tags", async () => {
    const sampleTextA = 'Hello'
    const sampleTextB = ', world!'
    const wrapper = mount(BlockComponent, {
      props: {
        block: {
          type: BlockType.Text,
          details: {
            value: `<p><strong>${sampleTextA}</strong>${sampleTextB}</p>`,
          },
        } as Block,
      }
    })
    await new Promise<void>(r => {
      setTimeout(() => {
        wrapper.vm.moveToStart()
        let selection = window.getSelection()
        expect(selection?.getRangeAt(0).startOffset).toBe(0)
        // caretPos should be length of "<p><strong>" i.e. 11
        let caretPos = wrapper.vm.getCaretPos()
        let caretPosWithoutTags = wrapper.vm.getCaretPosWithoutTags()
        expect(caretPos.pos).toBe('<p><strong>'.length)
        expect(caretPosWithoutTags.pos).toBe(caretPos.pos - '<p><strong>'.length)
        expect(caretPos.tag).toBe(null)
        
        wrapper.vm.moveToEnd()
        selection = window.getSelection()
        expect(selection?.getRangeAt(0).startOffset).toBe(sampleTextB.length)
        // caretPos should be length of full value minus last </p> tag
        caretPos = wrapper.vm.getCaretPos()
        caretPosWithoutTags = wrapper.vm.getCaretPosWithoutTags()
        expect(caretPos.pos).toBe(`<p><strong>${sampleTextA}</strong>${sampleTextB}`.length)
        expect(caretPosWithoutTags.pos).toBe(caretPos.pos - '<p><strong></strong>'.length)
        expect(caretPos.tag).toBe(null)

        // Setting caret in middle of a <strong> element should return <strong> tag
        let newCaretPos = 3
        wrapper.vm.setCaretPos(newCaretPos)
        caretPos = wrapper.vm.getCaretPos()
        caretPosWithoutTags = wrapper.vm.getCaretPosWithoutTags()
        expect(caretPos.pos).toBe('<p><strong>'.length + newCaretPos)
        expect(caretPosWithoutTags.pos).toBe(caretPos.pos - '<p><strong>'.length)
        expect(caretPos.tag).toBe('strong')

        // Setting caret after <strong> element should account for <strong> tag
        newCaretPos = 6
        wrapper.vm.setCaretPos(newCaretPos)
        caretPos = wrapper.vm.getCaretPos()
        caretPosWithoutTags = wrapper.vm.getCaretPosWithoutTags()
        expect(caretPos.pos).toBe(`<p><strong>${sampleTextA}</strong>`.length + newCaretPos - sampleTextA.length)
        expect(caretPosWithoutTags.pos).toBe(caretPos.pos - '<p><strong></strong>'.length)
        expect(caretPos.tag).toBe(null)
        r()
      }, 0)
    })
  })

  it("should emit correct events on arrow navigation", async () => {
    const wrapper = mount(BlockComponent)
    await new Promise<void>(r => {
      setTimeout(async () => {
        wrapper.vm.moveToStart()

        elementKeydown(wrapper.vm.content.$el, 'ArrowUp')
        expect(Object.keys(wrapper.emitted()).length).toBe(1)
        expect(wrapper.emitted().moveToPrevLine).toBeTruthy()

        elementKeydown(wrapper.vm.content.$el, 'ArrowDown')
        expect(Object.keys(wrapper.emitted()).length).toBe(2)
        expect(wrapper.emitted().moveToNextLine).toBeTruthy()

        elementKeydown(wrapper.vm.content.$el, 'ArrowLeft')
        expect(Object.keys(wrapper.emitted()).length).toBe(3)
        expect(wrapper.emitted().moveToPrevChar).toBeTruthy()

        elementKeydown(wrapper.vm.content.$el, 'ArrowRight')
        expect(Object.keys(wrapper.emitted()).length).toBe(4)
        expect(wrapper.emitted().moveToNextChar).toBeTruthy()
        r()
      }, 100)
    })
  })

  it("should emit correct events on backspace / enter", async () => {
    const wrapper = mount(BlockComponent)
    await new Promise<void>(r => {
      setTimeout(async () => {
        wrapper.vm.moveToStart()

        elementKeydown(wrapper.vm.content.$el, 'Backspace')
        expect(Object.keys(wrapper.emitted()).length).toBe(1)
        expect(wrapper.emitted().merge).toBeTruthy()

        elementKeydown(wrapper.vm.content.$el, 'Enter')
        expect(Object.keys(wrapper.emitted()).length).toBe(2)
        expect(wrapper.emitted().split).toBeTruthy()
        r()
      }, 100)
    })
  })

  it("should change to H1 on #", async () => {
    const wrapper = mount(BlockComponent, {
      props: {
        block: {
          type: BlockType.Text,
          details: {
            value: '<p># Test</p>',
          },
        } as Block,
      },
    })
    await new Promise<void>(r => {
      setTimeout(async () => {
        wrapper.vm.moveToEnd()
        elementKeyup(wrapper.vm.content.$el, ' ')
        expect(wrapper.emitted().setBlockType[0]).toEqual(['H1'])
        r()
      }, 100)
    })
  })

  it("should change to H2 on ##", async () => {
    const wrapper = mount(BlockComponent, {
      props: {
        block: {
          type: BlockType.Text,
          details: {
            value: '<p>## Test</p>',
          },
        } as Block,
      },
    })
    await new Promise<void>(r => {
      setTimeout(async () => {
        wrapper.vm.moveToEnd()
        elementKeyup(wrapper.vm.content.$el, ' ')
        expect(wrapper.emitted().setBlockType[0]).toEqual(['H2'])
        r()
      }, 100)
    })
  })

  it("should change to H3 on ###", async () => {
    const wrapper = mount(BlockComponent, {
      props: {
        block: {
          type: BlockType.Text,
          details: {
            value: '<p>### Test</p>',
          },
        } as Block,
      },
    })
    await new Promise<void>(r => {
      setTimeout(async () => {
        wrapper.vm.moveToEnd()
        elementKeyup(wrapper.vm.content.$el, ' ')
        expect(wrapper.emitted().setBlockType[0]).toEqual(['H3'])
        r()
      }, 100)
    })
  })

  it("should change to Quote on >", async () => {
    const wrapper = mount(BlockComponent, {
      props: {
        block: {
          type: BlockType.Text,
          details: {
            value: '<p>> Test</p>',
          },
        } as Block,
      },
    })
    await new Promise<void>(r => {
      setTimeout(async () => {
        wrapper.vm.moveToEnd()
        elementKeyup(wrapper.vm.content.$el, ' ')
        expect(wrapper.emitted().setBlockType[0]).toEqual(['QUOTE'])
        r()
      }, 100)
    })
  })

  it("should change to Divider on ---", async () => {
    const wrapper = mount(BlockComponent, {
      props: {
        block: {
          type: BlockType.H1,
          details: {
            value: '--- ',
          },
        } as Block,
      },
    })
    await new Promise<void>(r => {
      setTimeout(async () => {
        wrapper.vm.moveToStart()
        elementKeyup(wrapper.vm.content.$el, ' ')
        expect(wrapper.emitted().setBlockType[0]).toEqual(['DIVIDER'])
        r()
      }, 100)
    })
  })

  it("should render default blockType and content without props", async () => {
    const wrapper = mount(BlockComponent)
    await new Promise<void>(r => {
      setTimeout(() => {
        expect(wrapper.vm.block.type).toBe(BlockType.Text)
        expect(wrapper.vm.getTextContent()).toBe('Hello World')
        expect(wrapper.vm.getHtmlContent()).toBe('Hello World')
        r()
      }, 0)
    })
  })

  it("should render BlockType.Divider without content", async () => {
    const wrapper = mount(BlockComponent, {
      props: {
        block: {
          type: BlockType.Divider,
          details: {},
        } as Block,
      },
    })
    await new Promise<void>(r => {
      setTimeout(() => {
        expect(wrapper.vm.block.type).toBe(BlockType.Divider)
        expect(wrapper.vm.getTextContent()).toBe('')
        expect(wrapper.vm.getHtmlContent()).toBe('')
        r()
      }, 0)
    })
  })
})
