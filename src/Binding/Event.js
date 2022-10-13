import Binding from './index.js'

export default class BindingEvent extends Binding {

  #node = null
  #name = ''
  #value = null

  constructor(node, name, value) {
    super(value)
    this.#node = node
    this.#name = name
  }

  onStop() {
    if (this.#value)
      this.#node.removeEventListener(this.#name, this.#value)
  }

  onRun(value) {
    this.onStop()
    this.#node.addEventListener(this.#name, value)
    this.#value = value
  }
}
