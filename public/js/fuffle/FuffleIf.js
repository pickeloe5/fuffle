export default class FuffleIf extends HTMLElement {

  static Attribute = {CONDITION: 'data-condition'}

  static get observedAttributes() {
    return [FuffleIf.Attribute.CONDITION]
  }

  #shadow = null
  #children = []

  #value = false

  constructor() {
    super()
    this.#shadow = this.attachShadow({mode: 'closed'})
    this.addEventListener('fuffle-attribute-changed', this.#onAttributeChanged)
  }

  connectedCallback() {
    if (!this.isConnected)
      return;

    if (this.#value)
      this.#append()
  }

  #onAttributeChanged = ({attributeName, attributeValue}) => {
    if (attributeName !== FuffleIf.Attribute.CONDITION)
      return;

    const value = !!attributeValue
    if (value === this.#value)
      return;

    this.#value = value
    if (!this.isConnected)
      return;

    if (value)
      this.#append()
    else
      this.#remove()
  }

  #append() {
    if (this.#children)
      this.#remove()

    this.#children = [...this.childNodes].map(it => it.cloneNode(true))

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
customElements.define('fuffle-if', FuffleIf)
