import ComponentBase from './ComponentBase.js'
import {ArrayObserver} from './Observer.js'

class FuffleIf extends ComponentBase {

  static Attribute = {VALUE: 'data-value'}
  static Element = FuffleIf.defineElement('fuffle-if')

  #element = null
  #shadow = null
  #children = []
  #renderedValue = false

  constructor(element) {
    super(element)
    this.#element = element
    this.#shadow = element.attachShadow({mode: 'closed'})
    this.#children = [...element.childNodes].map(it => it.cloneNode(true))
    this.#render()
  }

  #insert() {
    if (this.#renderedValue)
      return;

    for (const child of this.#children)
      this.#shadow.appendChild(child)

    this.#renderedValue = true
  }

  #remove() {
    if (!this.#renderedValue)
      return;

    for (const child of this.#children)
      this.#shadow.removeChild(child)

    this.#renderedValue = false
  }

  get #value() {
    return this.#element.getAttribute(
      FuffleIf.Attribute.VALUE)
  }

  #render(value = this.value) {
    if (value === 'false')
      this.#remove()
    else this.#insert()
  }

  toggle() {
    this.#element.setAttribute(
      FuffleIf.Attribute.VALUE,
      this.#renderedValue ? 'false' : '')
  }

  onChanged(name, value) {
    if (name === FuffleIf.Attribute.VALUE)
      this.#render(value)
  }

}

class FuffleFor extends ComponentBase {

  static TAG_NAME = 'fuffle-for'
  static Element = FuffleFor.defineElement(FuffleFor.TAG_NAME)

  #observer = null
  #element = null
  #shadow = null
  #children = []

  constructor(element) {
    super(element)
    this.#element = element
    this.#shadow = element.attachShadow({mode: 'closed'})

    this.#observer =
      element.fuffle?.bindings?.value ||
      new ArrayObserver()

    for (const value of this.#observer.value)
      this.#insert(value)

    this.#observer.onPush(this.#insert)
      .onPop(this.#remove)
      .onSet(this.#update)
  }

  #insert = value => {
    const children = [...this.#element.childNodes].map(it => it.cloneNode(true))
    // fire event to update children
    this.#children.push(children)
    for (const child of children)
      this.#shadow.appendChild(child)
  }

  #remove = () => {
    for (const child of this.#children.pop())
      this.#shadow.removeChild(child)
  }

  #update = (value, index) => {
    // fire event to update children
  }

}

export {FuffleIf, FuffleFor}
