// Simulate keydown event on element
export function elementKeydown (element: HTMLElement, key: string) {
  return element.dispatchEvent(new KeyboardEvent('keydown', { key }))
}

// Simulate keyup event on element
export function elementKeyup (element: HTMLElement, key: string) {
  return element.dispatchEvent(new KeyboardEvent('keyup', { key }))
}

// Simulate keydown event on document
export function documentKeydown (key: string) {
  return document.dispatchEvent(new KeyboardEvent('keydown', { key }))
}

// Simulate click event on document
export function documentClick () {
  return document.dispatchEvent(new Event('click'))
}
