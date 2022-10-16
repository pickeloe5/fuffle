import Observer from './Observer.js'
import Template from './Template/index.js'
import ComponentBase from './Component/Base.js'

export default class FuffleFor extends ComponentBase {

  static Attribute = {
    ARRAY: 'data-array',
    NAME: 'data-name',
    INDEX_NAME: 'data-index-name'
  }

  #parentObserver = null
  #arrayObserver = null

  #element = null
  #children = null

  #template = null
  #instances = []

  #iterationName = 'it'
  #indexName = 'index'

  constructor(element) {
    super(element)
    this.#element = element
  }

  onDisconnected() {
    this.#arrayObserver?.removeEventListener('write', this.#onWrite)
    this.#deleteInstances()
    this.#parentObserver = null

    if (this.#children)
      for (const child of this.#children)
        this.#element.appendChild(child)
  }

  onConnected(parent) {
    this.#parentObserver = parent
    this.#children = [...this.#element.childNodes]
    this.#template = new Template(this.#children)

    for (const child of this.#children)
      this.#element.removeChild(child)
    this.#createInstances()
  }

  onAttributeChanged(name, value) {
    switch (name) {
      case FuffleFor.Attribute.NAME:
        this.#iterationName = value
        this.#onChangeLocals()
        break
      case FuffleFor.Attribute.INDEX_NAME:
        this.#indexName = value
        this.#onChangeLocals()
        break
      case FuffleFor.Attribute.ARRAY:
        this.#onChangeArray(value)
        break
    }
  }

  #onChangeLocals() {
    for (let i = 0; i < this.#instances.length; i++)
      this.#instances[i]
        .withLocals(this.#makeLocals(i))
  }

  #onChangeArray(value) {
    this.#arrayObserver?.removeEventListener('write', this.#onWrite)
    this.#deleteInstances()
    this.#arrayObserver = Observer.fromArray(value)
    this.#createInstances()
  }

  #createInstances() {
    if (!this.#arrayObserver || !this.#parentObserver)
      return;

    for (let i = 0; i < this.#arrayObserver.target.length; i++)
      this.#onCreate(i)

    this.#arrayObserver.addEventListener('write', this.#onWrite)
  }

  #deleteInstances() {
    while (this.#instances.length)
      this.#onDelete()
  }

  #onWrite = ({propertyPath, propertyValue}) => {
    if (propertyPath.length !== 1 ||
        propertyPath[0] !== 'length' ||
        propertyValue === this.#children.length)
      return;

    for (let i = this.#children.length; i < propertyValue; i++)
      this.#onCreate(i)
    for (let i = this.#children.length - 1; i >= propertyValue; i--)
      this.#onDelete()
  }

  #onCreate(index, value = this.#arrayObserver.target[index]) {
    this.#instances.push(this.#template.bake()
      .withLocals(this.#makeLocals(index))
      .withParent(this.#element)
      .start(this.#parentObserver))
  }

  #onDelete() {
    this.#instances.pop().stop().withoutParent()
  }

  #makeLocals(index) {
    return {
      [this.#iterationName]: () =>
        this.#arrayObserver.proxy[index],
      [this.#indexName]: () =>
        index
    }
  }

}
export const FuffleForElement = FuffleFor.defineElement('fuffle-for')
