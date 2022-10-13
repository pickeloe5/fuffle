import Binding from './index.js'

export default class BindingText extends Binding {

  #node = null

  constructor(node, value = '') {
    super(`\`${value}\``)
    this.#node = node
  }

  onRun(value) {
    this.#node.nodeValue = value
  }
}
