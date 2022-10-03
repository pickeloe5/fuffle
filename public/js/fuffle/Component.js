import ComponentElement from './ComponentElement.js'

export default class Component {

  static defineElement(tagName) {
    const ComponentImpl = this
    customElements.define(tagName,
      class extends ComponentElement {
        static Component = ComponentImpl
      })
  }

  constructor(element) {

  }

}
