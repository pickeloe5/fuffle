import {ComponentBase} from './Component.js'

export default class FuffleIf extends ComponentBase {

  static Attribute = {CONDITION: 'data-condition'}

  #element = null
  #shadow = null
  #children = []

  #value = false

  constructor(element) {
    super(element)
    this.#element = element
    this.#shadow = element.attachShadow({mode: 'closed'})
  }

  onConnected() {
    if (this.#value)
      this.#append()
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
      this.#append()
    else
      this.#remove()
  }

  #append() {
    if (this.#children)
      this.#remove()

    this.#children = [...this.#element.childNodes]
      .map(it => it.cloneNode(true))

    for (const child of this.#children)
      this.#shadow.appendChild(child)
  }

  #remove() {
    if (!this.#children)
      return;

    for (const child of this.#children)
      this.#shadow.removeChild(child)

    this.#children = null
  }
}

export const FuffleIfElement = FuffleIf.defineElement('fuffle-if')
