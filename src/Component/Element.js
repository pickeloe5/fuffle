import {EventName} from '../util.js'

/** Super implementation for components' custom elements. */
class ComponentElement extends HTMLElement {

  /**
   * Acquires the component from an instance of the element.
   *
   * @param {ComponentElement} element - The element to get a component from.
   * @returns {ComponentBase} The component from the element.
   */
  static getInstance(element) {
    return element.#instance
  }

  /**
   * Acquires the observer for a given DOM node.
   *
   * @param {Node} node - The node to get an observer from
   * @returns {?Observer} The node's observer
   */
  static getObserver(node) {
    const instance = this.getInstance(node)
    if (!instance)
      return null
    const observer = instance.constructor?.getObserver(instance)
    return observer ? observer : null
  }

  /**
   * Acquires the nearest parent observer for a given DOM node.
   *
   * @param {Node} node - The node to start searching from
   * @returns {?Observer} The node's nearest parent observer
   */
  static getParent(node) {
    while (node = node.parentNode)
      if (node instanceof this)
        return this.getObserver(node)
    return null
  }

  static ComponentImpl = null

  static get observedAttributes() {
    if (!this.ComponentImpl.Attribute)
      return []
    return Object.values(this.ComponentImpl.Attribute)
  }

  #instance

  constructor() {
    super()
    this.#instance = new this.constructor.ComponentImpl(this)
    this.addEventListener(EventName.ATTRIBUTE_CHANGED,
      this.#onFuffleAttributeChanged)
  }

  #onFuffleAttributeChanged = ({attributeName, attributeValue}) => {
    this.#instance.onAttributeChanged(attributeName, attributeValue)
  }

  connectedCallback() {
    if (!this.isConnected)
      return;
    setTimeout(() => {
      this.#instance.onConnected(
        ComponentElement.getParent(this)
    )}, 0)
  }

  disconnectedCallback() {
    this.#instance.onDisconnected()
  }

  attributeChangedCallback(name, previousValue, value) {
    this.#instance.onAttributeChanged(name, value)
  }

}
export default ComponentElement
