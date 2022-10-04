export default class ComponentElement extends HTMLElement {

  static Component

  static get observedAttributes() {
    if (!this.Component.Attribute)
      return []
    return Object.values(this.Component.Attribute)
  }

  #component = null
  fuffleComponent = null

  constructor() {
    super()
    this.fuffleComponent = this.#component =
      new this.constructor.Component(this)
    this.#component.onConstructed()
  }

  connectedCallback() {
    this.#component.onConnected()
  }

  attributeChangedCallback(name, previousValue, value) {
    this.#component.onChanged(name, value, previousValue)
  }

}
