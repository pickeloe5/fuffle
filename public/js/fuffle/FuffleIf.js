import {ComponentBase} from './Component.js'
import {TemplateInstance} from './Template.js'

export default class FuffleIf extends ComponentBase {

  static Attribute = {CONDITION: 'data-condition'}

  #element = null
  #shadow = null
  #template = null

  #value = false

  constructor(element) {
    super(element)
    this.#element = element
    this.#template = new TemplateInstance(
      [...element.childNodes].map(it => it.cloneNode(true)))
    this.#shadow = element.attachShadow({mode: 'closed'})
  }

  onDisconnected() {
    this.#template.stop()
  }

  onConnected(parent) {
    this.#template.start(parent)
    if (this.#value)
      this.#template.withParent(this.#shadow)
  }

  onAttributeChanged(name, value) {
    if (name !== FuffleIf.Attribute.CONDITION)
      return;

    value = !!value
    if (value === this.#value)
      return;

    this.#value = value
    if (!this.#element.isConnected)
      return;

    if (value)
      this.#template.withParent(this.#shadow)
    else
      this.#template.withoutParent()
  }
}

export const FuffleIfElement = FuffleIf.defineElement('fuffle-if')
