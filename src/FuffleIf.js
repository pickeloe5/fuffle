import {ComponentBase} from './Component.js'
import {TemplateInstance} from './Template.js'

export default class FuffleIf extends ComponentBase {

  static Attribute = {CONDITION: 'data-condition'}

  #parentObserver = null
  #element = null
  #shadow = null
  #template = null

  #value = false

  constructor(element) {
    super(element)
    this.#element = element
    this.#template = new TemplateInstance(
      [...element.childNodes].map(it => it.cloneNode(true)))
    this.#shadow = element.attachShadow({mode: 'open'})
  }

  onDisconnected() {
    this.#template.stop()
  }

  onConnected(parent) {
    this.#parentObserver = parent
    if (this.#value)
      this.#append()
  }

  #append() {
    if (!this.#parentObserver)
      return;
    this.#template
      .withParent(this.#shadow)
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
