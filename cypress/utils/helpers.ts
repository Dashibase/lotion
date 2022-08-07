import { Direction } from './types'

export function moveCaret(chainable: Cypress.Chainable, direction: Direction, times: number) {
  for (let i = 0; i < times - 1; i++) {
    chainable.type(`{${direction}}`)
  }
  return chainable.type(`{${direction}}`)
}

export function deepCopy(obj: Object) {
  return JSON.parse(JSON.stringify(obj))
}
