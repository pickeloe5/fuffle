import Binding from './index.js'
import {EventName} from '../util.js'

export default class BindingAttribute extends Binding {

  #node = null
  #name = ''
  #isString = false

  constructor(node, name, value, isString = false) {
    super(value)
    this.#node = node
    this.#name = name
    this.#isString = !!isString
  }

  onRun(value) {
    if (this.#isString)
      this.#node.setAttribute(this.#name, value)
    const event = new Event(EventName.ATTRIBUTE_CHANGED)
    event.attributeName = this.#name
    event.attributeValue = value
    this.#node.dispatchEvent(event)
  }
}
