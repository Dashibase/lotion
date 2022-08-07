import './commands'
import '../../src/index.css'
import { OhVueIcon, addIcons } from "oh-vue-icons"
import {
  MdDragindicator,
  HiTrash,
  HiPlus,
  HiSolidSearch,
  BiTextLeft,
  BiTypeH1,
  BiTypeH2,
  BiTypeH3,
  BiHr,
  BiQuote
} from "oh-vue-icons/icons"

import { mount } from 'cypress/vue'
import { MountingOptions } from 'cypress/vue/dist/@vue/test-utils'

addIcons(
  MdDragindicator,
  HiTrash,
  HiPlus,
  HiSolidSearch,
  BiTextLeft,
  BiTypeH1,
  BiTypeH2,
  BiTypeH3,
  BiHr,
  BiQuote
)


declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}

// Custom mount command - sets up icons, returns Vue Test Utils wrapper as alias
Cypress.Commands.add('mount', (component, options?: MountingOptions<any>) => {
  options.global = {
    components: {
      'v-icon': OhVueIcon
    }
  }
  return mount(component, options).then((wrapper) => {
    return cy.wrap(wrapper).as('vue')
  })
})

