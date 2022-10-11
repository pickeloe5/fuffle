import Observer from './Observer.js'
import Binding from './Binding.js'
import {consumeObserver} from './util.js'
import Template from './Template.js'

export default class FuffleFor extends HTMLElement {

  static Attribute = {ARRAY: 'data-array', NAME: 'data-name'}

  static get observedAttributes() {
    return [FuffleFor.Attribute.ARRAY, FuffleFor.Attribute.NAME]
  }

  #binding = null

  constructor() {
    super()
    this.fuffle = {...this.fuffle, provider: true}
    this.#binding = new BindingArray(
      this.attachShadow({mode: 'closed'}),
      [...this.childNodes])
  }

  connectedCallback() {
    this.#binding.withJs(this.getAttribute(FuffleFor.Attribute.ARRAY))

    consumeObserver(this).then(observer => {
      this.fuffle = {...this.fuffle, observer}
      this.#binding.start(observer)
    })
  }

  disconnectedCallback() {
    this.#binding.stop()
  }

  attributeChangedCallback(name, previousValue, value) {
    switch (name) {
      case FuffleFor.Attribute.ARRAY:
        this.#binding.withJs(value)
        break
      case FuffleFor.Attribute.NAME:
        this.#binding.withName(value)
        break
    }
  }

}
customElements.define('fuffle-for', FuffleFor)

class BindingArray extends Binding {

  #parent = null
  #children = []

  #template = null
  #instances = []

  #value = null
  #length = 0
  #name = 'it'

  constructor(parent, children) {
    super()
    this.#parent = parent
    this.#children = children
    this.#template = new Template(this.#children)
  }

  #makeLocals(index) {
    return {[this.#name]: () => this.#value.proxy[index]}
  }

  withName(name) {
    this.#name = name
    for (const i in this.#instances)
      this.#instances[i].withLocals(this.#makeLocals(i))
    return this
  }

  #onCreate(index, value = this.#value.target[index]) {
    this.#instances.push(this.#template.bake()
      .withLocals(this.#makeLocals(index))
      .withParent(this.#parent)
      .start(this.observer))
  }

  #onDelete() {
    this.#instances.pop().stop().withoutParent()
  }

  #onWrite = ({propertyPath, propertyValue}) => {
    if (propertyPath.length !== 1 ||
        propertyPath[0] !== 'length' ||
        propertyValue === this.#length)
      return;

    for (let i = this.#length; i < propertyValue; i++)
      this.#onCreate(i)
    for (let i = this.#length - 1; i >= propertyValue; i--)
      this.#onDelete()

    this.#length = propertyValue
  }

  onRun(value) {
    if (this.#value) {
      this.#value?.removeEventListener('write', this.#onWrite)
      for (let i = 0; i < this.#value.target.length; i++)
        this.#onDelete()
    }

    this.#value = Observer.fromArray(value)
    if (!this.#value)
      return;

    for (const index in this.#value.target)
      this.#onCreate(index)
    this.#length = this.#value.target.length
    this.#value?.addEventListener('write', this.#onWrite)
  }

}
