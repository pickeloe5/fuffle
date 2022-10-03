import ComponentElement from './ComponentElement.js'
import Observer from './Observer.js'
import NodeBuilder from './NodeBuilder.js'
import {appendTemplate} from './Util.js'

class ComponentBase {

  static defineElement(tagName) {
    const ComponentImpl = this
    customElements.define(tagName,
      class extends ComponentElement {
        static Component = ComponentImpl
      })
  }

  constructor(element) {

  }

  onConstructed() {

  }

  onConnected() {

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
    this.bake.call(this.#observer.proxy)
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
