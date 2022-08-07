import Lotion from '../../src/components/Lotion.vue'
import { BlockType } from '../../src/utils/types'
import { deepCopy, moveCaret } from '../utils/helpers'
import { Direction } from '../utils/types'

const page = {
  name: '🧴 Lotion',
  blocks: [
    {
      id: 'f8296d43-7920-4ab8-a869-7d58439534b2',
      type: BlockType.Text,
      details: {
        value: '<p>Text block</p>',
      },
    },
    {
      id: '9274a245-38b8-49fe-b4f4-3476fb23202c',
      type: BlockType.H1,
      details: {
        value: 'H1 Block',
      },
    },
    {
      id: '720f5772-0086-4054-8487-17ca5627123b',
      type: BlockType.Quote,
      details: {
        value: '<p>Quote Block</p>',
      },
    },
  ],
}

before(() => cy.viewport(1000, 800))
let currPage

describe('Testing split function', () => {
  beforeEach(() => {
    currPage = deepCopy(page)
    cy.mount(Lotion, {
      props: {
        page: currPage,
      },
    })
  })

  it('should insert an empty text block when initiated from end of line', () => {
    cy.get('.ProseMirror')
      .eq(0)
      .type('{end}')
      .type('{enter}')
      .then(() => {
        expect(window.getSelection().anchorOffset).to.be.eq(0)
        expect(currPage.blocks[1].type).to.be.eq(BlockType.Text)
        expect(currPage.blocks[1].details.value).to.be.eq('<p></p>')
      })
  })

  it('should split text block into two based on caret position', () => {
    const x = cy.get('.ProseMirror').eq(0).type('{end}')
    moveCaret(x, Direction.left, 2)
    x.type('{enter}').then(() => {
      expect(window.getSelection().anchorOffset).to.be.eq(0)
      expect(window.getSelection().anchorNode?.nodeValue).to.be.eq('ck')
      expect(currPage.blocks[1].type).to.be.eq(BlockType.Text)
    })
  })

  it('should insert a text block containing text after caret position when initiated from heading block', () => {
    const x = cy.get("[data-ph='Heading 1']").eq(0).type('{end}')
    moveCaret(x, Direction.left, 2)
    x.type('{enter}').then(() => {
      expect(window.getSelection().anchorOffset).to.be.eq(0)
      expect(window.getSelection().anchorNode?.nodeValue).to.be.eq('ck')
      expect(currPage.blocks[2].type).to.be.eq(BlockType.Text)
    })
  })
})

describe('Testing merge function', () => {
  beforeEach(() => {
    currPage = deepCopy(page)
    cy.mount(Lotion, {
      props: {
        page: currPage,
      },
    })
  })

  it('should first revert to a text block when initiated from a non-text block', () => {
    cy.get('.ProseMirror')
      .eq(1)
      .type('{home}')
      .type('{backspace}')
      .then(() => {
        expect(window.getSelection().anchorOffset).to.be.eq(0)
        expect(window.getSelection().anchorNode?.nodeValue).to.be.eq('Quote Block')
        expect(currPage.blocks[2].type).to.be.eq(BlockType.Text)
      })
  })

  it('should merge into previous block properly when previous block is header type', () => {
    cy.get('.ProseMirror').eq(1).type('{home}').type('{backspace}')

    // DOM element changed (quote type changed to text), need to re-select
    cy.get('.ProseMirror')
      .eq(1)
      .type('{home}')
      .type('{backspace}')
      .then(() => {
        expect(window.getSelection().anchorOffset).to.be.eq('H1 Block'.length)
        expect(window.getSelection().anchorNode?.nodeValue).to.be.eq('H1 BlockQuote Block')
        expect(currPage.blocks[1].type).to.be.eq(BlockType.H1)
      })
  })
})
