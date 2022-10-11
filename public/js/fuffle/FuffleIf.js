import Binding from './Binding.js'
import Observer from './Observer.js'
import {consumeObserver} from './util.js'

export default class FuffleIf extends HTMLElement {

  static Attribute = {CONDITION: 'data-condition'}

  static get observedAttributes() {
    return [FuffleIf.Attribute.CONDITION]
  }

  #binding = null
  #shadow = null

  constructor() {
    super()
    this.#shadow = this.attachShadow({mode: 'closed'})
    this.#binding = new BindingCondition(this.#shadow,
      [...this.childNodes].map(it => it.cloneNode(true)))
  }

  connectedCallback() {
    this.#binding.withJs(this.getAttribute(FuffleIf.Attribute.CONDITION))

    consumeObserver(this).then(observer => {
      this.#binding.start(observer)})
  }

  disconnectedCallback() {
    this.#binding.stop()
  }

  attributeChangedCallback(name, previousValue, value) {
    if (name !== FuffleIf.Attribute.CONDITION)
      return;
    this.#binding?.withJs(value)
  }
}
customElements.define('fuffle-if', FuffleIf)

class BindingCondition extends Binding {

  #parent = null
  #children = []
  #value = false

  constructor(parent, children, js) {
    super(js)
    this.#parent = parent
    this.#children = children
  }

  onRun(value) {
    value = !!value
    if (value === this.#value)
      return;

    if (value) {
      for (const child of this.#children)
        this.#parent.appendChild(child)
    } else {
      for (const child of this.#children)
        this.#parent.removeChild(child)
    }

    this.#value = value
  }
}
