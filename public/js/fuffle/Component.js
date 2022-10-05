import Observer from './Observer.js'
import NodeBuilder from './NodeBuilder.js'
import Template from './Template.js'
import {cloneTemplate} from './Util.js'
import ComponentBase from './ComponentBase.js'

class Component extends ComponentBase {

  #observer = null
  $ = null

  constructor(element) {
    super(element)
    this.$ = new NodeBuilder(element)
  }

  onConstructed() {
    this.#observer = new Observer(this)
    if (this.constructor.template)
      Template.bake(this.constructor.template, this.#observer, this.$.node)
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
