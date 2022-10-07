import ComponentBase from './ComponentBase.js'
import {ArrayObserver} from './Observer.js'
import Template from './Template.js'

class FuffleIf extends ComponentBase {

  static TAG_NAME = 'fuffle-if'
  static Element = FuffleIf.defineElement(FuffleIf.TAG_NAME)

  #element = null
  #shadow = null
  #children = []
  #renderedValue = false

  constructor(element) {
    super(element)
    this.#element = element
    this.#shadow = element.attachShadow({mode: 'closed'})
    this.#children = [...element.childNodes].map(it => it.cloneNode(true))

    if (element.fuffle?.value && element.fuffle.parent) {
      element.fuffle.parent.bind(function(ifComponent) {
        ifComponent.render(eval(element.fuffle.value))
      }, this)
    }
  }

  render(value) {
    value = !!value
    if (value === this.#renderedValue)
      return;

    if (value) {
      for (const child of this.#children)
        this.#shadow.appendChild(child)
    } else for (const child of this.#children)
      this.#shadow.removeChild(child)

    this.#renderedValue = value
  }

}

class FuffleFor extends ComponentBase {

  static TAG_NAME = 'fuffle-for'
  static Element = FuffleFor.defineElement(FuffleFor.TAG_NAME)

  #element = null
  #shadow = null
  #children = []
  #renderedValue = null

  constructor(element) {
    super(element)
    this.#element = element
    this.#shadow = element.attachShadow({mode: 'closed'})

    if (element.fuffle?.value && element.fuffle.parent) {
      element.fuffle.parent.bind(function(forComponent) {
        forComponent.render(eval(element.fuffle.value))
      }, this)
    }
  }

  render(value) {
    while (this.#children.length)
      this.#onDelete()
    for (const child of value)
      this.#onCreate(child)
    this.#renderedValue = value
    value.observer
      .onCreate(this.#onCreate)
      .onUpdate(this.#onUpdate)
      .onDelete(this.#onDelete)
  }

  #onCreate = value => {
    let children = [...this.#element.childNodes]
    if (!this.#element.fuffle?.parent)
      children = children.map(it => it.cloneNode(true))
    else {
      const template = new Template(this.#element.fuffle.parent, children)
        .withIteration(value)
      if (this.#element.fuffle.text)
        template.withRootText(!!this.#element.fuffle.text.shallow)
      children = template.bake()
    }
    this.#children.push(children)
    for (const child of children)
      this.#shadow.appendChild(child)
  }

  #onUpdate = (value, index) => {

  }

  #onDelete = () => {
    for (const child of this.#children.pop())
      this.#shadow.removeChild(child)
  }
}

export {FuffleIf, FuffleFor}
export const TAG_NAMES = [FuffleIf.TAG_NAME, FuffleFor.TAG_NAME]
