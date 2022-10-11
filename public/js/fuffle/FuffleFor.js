import Observer from './Observer.js'
import Template from './Template.js'
import {ComponentBase} from './Component.js'

export default class FuffleFor extends ComponentBase {

  static Attribute = {ARRAY: 'data-array', NAME: 'data-name'}
  static isProvider = true

  #observer = null
  #element = null
  #shadow = null

  #template = null
  #children = []
  #iterationName = 'it'

  constructor(element) {
    super(element)
    this.#element = element
    this.#shadow = element.attachShadow({mode: 'closed'})
    this.#template = new Template([...element.childNodes])
  }

  onDisconnected() {
    this.#observer?.removeEventListener('write', this.#onWrite)

    while (this.#children.length)
      this.#onDelete()
  }

  onConnected() {
    this.#createChildren()
  }

  onAttributeChanged(name, value) {
    switch (name) {
      case FuffleFor.Attribute.NAME:
        this.#onChangeIterationName(value)
        break
      case FuffleFor.Attribute.ARRAY:
        this.#onChangeArray(value)
        break
    }
  }

  #onChangeIterationName(name) {
    this.#iterationName = name

    for (const i in this.#children)
      this.#children[i].withLocals(this.#makeLocals(i))
  }

  #onChangeArray(value) {
    this.#observer?.removeEventListener('write', this.#onWrite)
    while (this.#children.length)
      this.#onDelete()

    this.#observer = Observer.fromArray(value)
    if (!this.#observer)
      return;
  }

  #createChildren() {
    if (!this.#observer)
      return;
    for (const index in this.#observer.target)
      this.#onCreate(index)

    this.#observer.addEventListener('write', this.#onWrite)
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

  #onCreate(index, value = this.#observer.target[index]) {
    this.#children.push(this.#template.bake()
      .withLocals(this.#makeLocals(index))
      .withParent(this.#shadow)
      .start(this.#observer))
  }

  #onDelete() {
    this.#children.pop().stop().withoutParent()
  }

  #makeLocals(index) {
    return {[this.#iterationName]: () => this.#observer.proxy[index]}
  }

}
export const FuffleForElement = FuffleFor.defineElement('fuffle-for')
