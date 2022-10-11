import Observer from './Observer.js'
import {EventName} from './util.js'

export class ComponentBase {

  static isProvider = false

  static defineElement(tagName) {
    const ComponentImpl = this
    const ElementImpl = class extends ComponentElement {
      static ComponentImpl = ComponentImpl
      static isProvider = !!ComponentImpl.isProvider
    }
    customElements.define(tagName, ElementImpl)
    return ElementImpl
  }

  constructor(element) {

  }

  onConnected() {

  }

  onAttributeChanged(name, value) {

  }

  onDisconnected() {

  }

}

export default class Component extends ComponentBase {

  static template = null

  #element = null
  #observer = null
  #template = this.constructor.template?.bake()

  constructor(element) {
    super(element)
    this.#element = element
  }

  onConnected() {
    this.#observer = new Observer(this)
    this.#template?.withParent(this.#element).start(this.#observer)
  }

  onDisconnected() {
    this.#template?.stop()
  }

}

export class ComponentElement extends HTMLElement {

  static ComponentImpl = null
  static isProvider = false

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
    setTimeout(() => {this.#instance.onConnected()}, 0)
  }

  disconnectedCallback() {
    this.#instance.onDisconnected()
  }

  attributeChangedCallback(name, previousValue, value) {
    this.#instance.onAttributeChanged(name, value)
  }

}
