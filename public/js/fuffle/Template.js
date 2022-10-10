import Binding, {BindingJavascript} from './Binding.js'

class TextBinding extends BindingJavascript {

  #node = null

  constructor(node) {
    super(`\`${node.nodeValue}\``)
    this.#node = node
  }

  onRunImpl(value) {
    this.#node.nodeValue = value
  }

}

export default class Template {

  static Text = {SHALLOW: 'shallow', DEEP: 'deep'}

  #text = false
  #bindings = []

  constructor(children, text = false) {
    this.#text = text
    this.#bindChildren(children)
  }

  start(observer) {
    for (const binding of this.#bindings)
      binding.start(observer)
  }

  #bindChildren(children) {
    for (const child of children)
      this.#bindChild(child)
  }

  #bindChild(child) {
    switch (child.nodeType) {
      case Node.TEXT_NODE:
        this.#bindings.push(new TextBinding(child))
        break
      case Node.ELEMENT_NODE:
        this.#bindChildren(child.childNodes)
        break
    }
  }

}
