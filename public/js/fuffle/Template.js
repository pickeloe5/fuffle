import Binding from './Binding.js'

export default class Template {

  static Text = {SHALLOW: 'shallow', DEEP: 'deep'}
  static Attribute = {TEXT: 'data-f-text'}
  static Prefix = {ATTRIBUTE: 'data-f:', EVENT: 'data-f-on:'}

  static fromNode(node) {
    return new Template(
      [...node.content.childNodes],
      Template.getTextMode(node))
  }

  static getTextMode(node, inherited = false) {
    let mode = false

    if (node.hasAttribute(Template.Attribute.TEXT))
      mode = node.getAttribute(Template.Attribute.TEXT)
        === Template.Text.SHALLOW
          ? Template.Text.SHALLOW : Template.Text.DEEP

    if (!mode && inherited !== Template.Text.SHALLOW)
      mode = inherited

    return mode
  }

  #children
  #textMode

  constructor(children, textMode) {
    this.#children = children
    this.#textMode = textMode
  }

  bake() {
    return new TemplateInstance(
      this.#children.map(it => it.cloneNode(true)),
      this.#textMode)
  }

}

export class TemplateInstance {

  #bindings = []
  children = []

  constructor(children, textMode = false) {
    this.children = children
    this.#bindChildren(children, textMode)
  }

  start(observer) {
    for (const binding of this.#bindings)
      binding.start(observer)
    return this
  }

  #bindChildren(children, textMode = false) {
    for (const child of children) {
      switch (child.nodeType) {

        case Node.TEXT_NODE:
          this.#bindText(child, textMode)
          break

        case Node.ELEMENT_NODE:
          this.#bindElement(child, textMode)
          break
      }
    }
  }

  #bindText(node, textMode) {
    if (!textMode)
      return;

    const value = node.nodeValue
    node.nodeValue = ''
    this.#bindings.push(new BindingText(node, value))
  }

  #bindElement(element, textMode) {

    for (const prefixedName of element.getAttributeNames())
      this.#bindAttribute(element, prefixedName)

    this.#bindChildren(element.childNodes,
      Template.getTextMode(element, textMode))
  }

  #bindAttribute(element, prefixedName) {
    const [prefix, name] = this.#getAttributePrefix(prefixedName)
    if (!prefix)
      return;

    const value = element.getAttribute(prefixedName)
    element.removeAttribute(prefixedName)

    switch (prefix) {
      case Template.Prefix.ATTRIBUTE:
        this.#bindings.push(new BindingAttribute(element, name, value))
        break
      case Template.Prefix.EVENT:
        this.#bindings.push(new BindingEvent(element, name, value))
        break
    }
  }

  #getAttributePrefix(name) {
    for (const prefix of Object.values(Template.Prefix))
      if (name.startsWith(prefix))
        return [prefix, name.substring(prefix.length)]
    return ['', name]
  }

}

class BindingText extends Binding {

  #node = null

  constructor(node, value = '') {
    super(`\`${value}\``)
    this.#node = node
  }

  onRun(value) {
    this.#node.nodeValue = value
  }
}

class BindingAttribute extends Binding {

  #node = null
  #name = ''

  constructor(node, name, value) {
    super(value)
    this.#node = node
    this.#name = name
  }

  onRun(value) {
    this.#node.setAttribute(this.#name, value)
  }
}

class BindingEvent extends Binding {

  #node = null
  #name = ''
  #value = null

  constructor(node, name, value) {
    super(value)
    this.#node = node
    this.#name = name
  }

  onRun(value) {
    if (this.#value)
      this.#node.removeEventListener(this.#name, this.#value)
    this.#node.addEventListener(this.#name, value)
    this.#value = value
  }
}
