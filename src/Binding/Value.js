import Binding from './index.js'

export default class BindingValue extends Binding {

  #node = null

  constructor(node, value) {
    super(value)
    this.#node = node
  }

  onRun(value) {
    this.#node.value = value
  }

}
