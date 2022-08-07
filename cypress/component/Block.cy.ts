import BlockComp from '../../src/components/Block.vue'
import { Block, BlockType } from '../../src/utils/types'
import { BOLD, BOLD_ITALIC, ITALIC, REGULAR } from '../data/getCaretPosData'
import { Direction, getPosTestValue } from '../utils/types'
import { v4 as uuidv4 } from 'uuid'
import { moveCaret } from '../utils/helpers'

const TESTS = [REGULAR, BOLD, ITALIC, BOLD_ITALIC]
const TEST_VALUES: getPosTestValue[] = []
for (const arr of TESTS) {
  for (const test of arr) {
    TEST_VALUES.push({ str: `<p>${test.str}</p>`, idx: test.idx, tags: test.tags })
  }
}

describe('getCaretPos and getCaretPosWithoutTags correctly get position of caret', () => {
  for (const testVal of TEST_VALUES) {
    it('should return the correct value', () => {
      const block: Block = {
        id: uuidv4(),
        type: BlockType.Text,
        details: {
          value: testVal.str,
        },
      }
      cy.mount(BlockComp, {
        props: {
          block: block,
        },
      })
      // Move caret to testing position
      const x = cy.get('.ProseMirror').type('{home}')
      moveCaret(x, Direction.right, testVal.idx).then(() => {
        cy.get('@vue').then((wrapper) => {
          // Reference to component
          const component = (wrapper as any).vm
          const pos = component.getCaretPos()
          expect(pos.pos).to.be.eq(testVal.str.indexOf('B') + 1)
          // TODO: Change after we add support for nested tags
          if (testVal.tags.length === 1) {
            expect(pos.tag).to.be.eq(testVal.tags[0])
          }
          const posNoTags = component.getCaretPosWithoutTags()
          expect(posNoTags.pos).to.be.eq(testVal.idx)
        })
      })
    })
  }
})
