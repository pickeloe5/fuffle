import {ComponentBase} from './Component.js'

class FuffleIf extends ComponentBase {

  static Attribute = {CONDITION: 'condition'}
  static Element = FuffleIf.defineElement('fuffle-if')

  #element = null
  #shadow = null
  #children = []
  #renderedCondition = false

  constructor(element) {
    super(element)
    this.#element = element
    this.#shadow = element.attachShadow({mode: 'closed'})
    this.#children = [...element.childNodes].map(it => it.cloneNode(true))
    this.#insert()
  }

  #insert() {
    if (this.#renderedCondition)
      return;

    for (const child of this.#children)
      this.#shadow.appendChild(child)

    this.#renderedCondition = true
  }

  #remove() {
    if (!this.#renderedCondition)
      return;

    for (const child of this.#children)
      this.#shadow.removeChild(child)

    this.#renderedCondition = false
  }

  get #conditionValue() {
    return this.#element.getAttribute(
      FuffleIf.Attribute.CONDITION)
  }

  #renderCondition(value = this.conditionValue) {
    if (value === 'false')
      this.#remove()
    else this.#insert()
  }

  toggle() {
    this.#element.setAttribute(
      FuffleIf.Attribute.CONDITION,
      this.#renderedCondition ? 'false' : '')
  }

  onChanged(name, value) {
    if (name === FuffleIf.Attribute.CONDITION)
      this.#renderCondition(value)
  }

}

export {FuffleIf}
