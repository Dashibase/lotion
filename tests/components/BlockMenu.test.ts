import { mount } from '@vue/test-utils'
import { documentKeydown, documentClick } from '../utils/vitest'
import { describe, it, expect } from 'vitest' 
import BlockMenu from '@/components/BlockMenu.vue'

describe('BlockMenu.vue', () => {

  it("should open/close according to click events", async () => {
    const wrapper = mount(BlockMenu, {
      props: {
        blockTypes: ['TEXT', 'QUOTE'],
      }
    })
    const handle = wrapper.find('.handle')
    const menu = wrapper.get('.block-menu')

    // Menu should first be closed
    expect(wrapper.vm.open).toBe(false)
    expect(menu.wrapperElement._style['display']).toBe('none')
    // TODO - debug and replace with isVisible test method
    // expect(wrapper.find('.block-menu').isVisible()).toBe(false)
    
    // Menu should open upon clicking on handle
    await handle.trigger('click')
    expect(wrapper.vm.open).toBe(true)
    expect(menu.wrapperElement._style['display']).toBe('')

    // Menu should close upon clicking on handle again
    await handle.trigger('click')
    expect(wrapper.vm.open).toBe(false)

    // Menu should not close upon clicking inside of menu
    await handle.trigger('click')
    expect(wrapper.vm.open).toBe(true)
    await menu.trigger('click')
    expect(wrapper.vm.open).toBe(true)

    // Menu should close upon clicking outside of menu
    documentClick()
    expect(wrapper.vm.open).toBe(false)
  })

  it("should respond to keyboard navigation", async () => {
    const wrapper = mount(BlockMenu, {
      props: {
        blockTypes: ['TEXT', 'QUOTE'],
      }
    })
    const handle = wrapper.find('.handle')
    const menu = wrapper.get('.block-menu')
    await handle.trigger('click')
    expect(wrapper.vm.open).toBe(true)
    expect(wrapper.vm.active).toBe(0)

    documentKeydown('ArrowDown')
    expect(wrapper.vm.active).toBe(1)

    documentKeydown('ArrowUp')
    expect(wrapper.vm.active).toBe(0)
    
    documentKeydown('Enter')
    expect(wrapper.vm.open).toBe(false)

    await handle.trigger('click')
    expect(wrapper.vm.open).toBe(true)
    documentKeydown('Escape')
    expect(wrapper.vm.open).toBe(false)

    await handle.trigger('click')
    expect(wrapper.vm.open).toBe(true)
    documentKeydown('ArrowLeft')
    expect(wrapper.vm.open).toBe(false)

    await handle.trigger('click')
    expect(wrapper.vm.open).toBe(true)
    documentKeydown('ArrowRight')
    expect(wrapper.vm.open).toBe(false)

    await handle.trigger('click')
    expect(wrapper.vm.open).toBe(true)
    documentKeydown('Backspace')
    expect(wrapper.vm.open).toBe(false)
  })

  it('should support search', async () => {
    const wrapper = mount(BlockMenu, {
      props: {
        blockTypes: ['TEXT', 'QUOTE'],
      }
    })
    const handle = wrapper.find('.handle')
    await handle.trigger('click')
    expect(wrapper.vm.open).toBe(true)
    expect(wrapper.vm.active).toBe(0)

    // Search for QUOTE
    expect(wrapper.vm.options.length).toBe(2)
    documentKeydown('q')
    expect(wrapper.vm.searchTerm).toBe('q')
    expect(wrapper.vm.options.length).toBe(1)
    expect(wrapper.vm.options[0].blockType).toBe('QUOTE')

    // Hitting Enter closes menu and resets search term
    documentKeydown('Enter')
    expect(wrapper.vm.open).toBe(false)
    expect(wrapper.vm.searchTerm).toBe('')
  })

  it('should emit setBlockType', async () => {
    const wrapper = mount(BlockMenu, {
      props: {
        blockTypes: ['TEXT', 'QUOTE'],
      }
    })
    wrapper.vm.setBlockType('TEXT')
    expect(wrapper.emitted().setBlockType[0]).toEqual(['TEXT', 0, false])
  })
})
