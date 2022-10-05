import ComponentElement from './ComponentElement.js'

export default class ComponentBase {

  static defineElement(tagName) {
    const ComponentImpl = this
    const ElementImpl = class extends ComponentElement {
      static Component = ComponentImpl
    }
    customElements.define(tagName, ElementImpl)
    return ElementImpl
  }

  constructor(element) {

  }

  onConstructed() {

  }

  onConnected() {

  }

  onChanged(name, value, previousValue) {

  }

}
