import ComponentBase from './Component/Base.js'
import TemplateInstance from './Template/Instance.js'

export default class FuffleIf extends ComponentBase {

  static Attribute = {CONDITION: 'data-condition'}

  #element = null
  #template = null
  #children = null

  #parentObserver = null
  #value = false

  constructor(element) {
    super(element)
    this.#element = element
  }

  onDisconnected() {
    this.#template?.stop().withoutParent()
    this.#template = null
  }

  onConnected(parent) {
    this.#parentObserver = parent
    this.#children = [...this.#element.childNodes]
    for (const child of this.#children)
      this.#element.removeChild(child)
    this.#template = new TemplateInstance(this.#children)
    if (this.#value)
      this.#append()
  }

  #append() {
    if (!this.#parentObserver)
      return;
    this.#template
      .withParent(this.#element)
      .start(this.#parentObserver)
  }

  #remove() {
    this.#template
      .stop()
      .withoutParent()
  }

  onAttributeChanged(name, value) {
    if (name !== FuffleIf.Attribute.CONDITION)
      return;

    value = !!value
    if (value === this.#value)
      return;

    this.#value = value
    if (value)
      this.#append()
    else
      this.#remove()
  }
}

export const FuffleIfElement = FuffleIf.defineElement('fuffle-if')
