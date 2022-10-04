import ComponentElement from './ComponentElement.js'
import Observer from './Observer.js'
import NodeBuilder from './NodeBuilder.js'
import {appendTemplate} from './Util.js'

class ComponentBase {

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

class Component extends ComponentBase {

  #observer = new Observer(this)
  $ = null

  constructor(element) {
    super(element)
    this.$ = new NodeBuilder(element)

    if (this.constructor.template)
      appendTemplate(this.$.node, this.constructor.template)
  }

  onConstructed() {
    this.#observer.readOnce(this.bake)
  }

  onConnected() {
    this.#observer.read(this.render)
  }

  bake() {

  }

  render() {

  }

}

export default Component
export { ComponentBase }
