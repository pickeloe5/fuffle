import Observer from './Observer.js'
import {BindingBase} from './Binding.js'
import {consumeObserver} from './util.js'
import Template from './Template.js'

export default class FuffleFor extends HTMLElement {

  static Attribute = {ARRAY: 'data-array', NAME: 'data-name'}

  static get observedAttributes() {
    return [FuffleFor.Attribute.ARRAY, FuffleFor.Attribute.NAME]
  }

  #shadow = null

  #template = null
  #templateInstances = []

  #arrayObserver = null
  #iterationName = 'it'

  constructor() {
    super()
    this.fuffle = {...this.fuffle, provider: true}
    this.#shadow = this.attachShadow({mode: 'closed'})
    this.#template = new Template([...this.childNodes])
  }

  #onWrite = ({propertyPath, propertyValue}) => {
    if (propertyPath.length !== 1 ||
        propertyPath[0] !== 'length' ||
        propertyValue === this.#templateInstances.length)
      return;

    for (let i = this.#templateInstances.length; i < propertyValue; i++)
      this.#onCreate(i)
    for (let i = this.#templateInstances.length - 1; i >= propertyValue; i--)
      this.#onDelete()
  }

  #onCreate(index, value = this.#arrayObserver.target[index]) {
    this.#templateInstances.push(this.#template.bake()
      .withLocals(this.#makeLocals(index))
      .withParent(this.#shadow)
      .start(this.#arrayObserver))
  }

  #onDelete() {
    this.#templateInstances.pop().stop().withoutParent()
  }

  connectedCallback() {
    consumeObserver(this).then(observer => {
      this.fuffle = {...this.fuffle, observer}
      observer.addEventListener('write', this.#onWrite)
    })
  }

  disconnectedCallback() {
    this.#arrayObserver?.removeEventListener('write', this.#onWrite)
    for (const instance of this.#templateInstances)
      instance.stop()
  }

  attributeChangedCallback(name, previousValue, value) {
    switch (name) {
      case FuffleFor.Attribute.ARRAY:
        this.#setArray(this.fuffle?.attributes?.[name])
        break
      case FuffleFor.Attribute.NAME:
        this.#setIterationName(value)
        break
    }
  }

  #setArray(value) {
    if (this.#arrayObserver) {
      this.#arrayObserver?.removeEventListener('write', this.#onWrite)
      for (let i = 0; i < this.#arrayObserver.target.length; i++)
        this.#onDelete()
    }

    this.#arrayObserver = Observer.fromArray(value)
    if (!this.#arrayObserver)
      return;

    for (const index in this.#arrayObserver.target)
      this.#onCreate(index)
    this.#arrayObserver.addEventListener('write', this.#onWrite)
  }

  #setIterationName(name) {
    this.#iterationName = name
    for (const i in this.#templateInstances)
      this.#templateInstances[i].withLocals(this.#makeLocals(i))
  }

  #makeLocals(index) {
    return {[this.#iterationName]: () => this.#arrayObserver.proxy[index]}
  }

}
customElements.define('fuffle-for', FuffleFor)
