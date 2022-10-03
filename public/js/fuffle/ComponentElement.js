export default class ComponentElement extends HTMLElement {

  static Component

  #component

  constructor() {
    super()
    this.#component = new this.constructor.Component(this)
    this.#component.onConstructed()
  }

  connectedCallback() {
    this.#component.onConnected()
  }

}