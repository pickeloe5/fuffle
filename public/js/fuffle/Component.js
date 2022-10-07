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
    const children = this.constructor.template?.content?.childNodes
    if (children)
      this.$.withChild(...new Template(this.#observer, [...children]).bake())
    this.#observer.run(this.bake)
    this.#observer.bind(this.render)
  }

  bake() {

  }

  render() {

  }

}

export default Component
export { ComponentBase }
