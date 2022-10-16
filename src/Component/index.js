import Observer from '../Observer.js'
import Template from '../Template/index.js'
import ComponentBase from './Base.js'

/**
 * Extends {@link ComponentBase} to provide an observer and consume a template.
 */
class Component extends ComponentBase {

  /**
   * Acquires the observer for a given instance of this component.
   *
   * @param {Component} instance - The instance to get an observer from
   * @returns {Observer} This component's observer
   */
  static getObserver(instance) {
    return instance.#observer
  }

  /**
   * If a template exists at this variable, it will automatically be used.
   *
   * @type {Template}
   */
  static template = null

  #element = null
  #observer = null
  #template = this.constructor.template?.bake()
  #children = null

  constructor(element) {
    super(element)
    this.#element = element
  }

  onConnected() {
    this.#observer = new Observer(this)
    if (!this.#template) {
      this.#children = [...this.#element.childNodes]
      for (const child of this.#children)
        this.#element.removeChild(child)
      this.#template = new Template(this.#children).bake()
    }
    this.#template.withParent(this.#element).start(this.#observer)
  }

  onDisconnected() {
    this.#template?.stop().withoutParent()
    if (this.#children) {
      for (const child of this.#children)
        this.#element.appendChild(child)
      this.#children = null
    }
  }

}
export default Component
