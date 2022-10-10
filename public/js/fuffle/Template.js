import Binding from './Binding.js'

export default class Template {

  static Text = {SHALLOW: 'shallow', DEEP: 'deep'}
  static Attribute = {TEXT: 'fuffle-text'}
  static Prefix = {ATTRIBUTE: 'fuffle:', EVENT: 'fuffle-on:'}

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

  static fromNode(node) {
    return new Template(
      [...node.content.childNodes],
      Template.getTextMode(node))
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
  #children = []

  constructor(children, textMode = false) {
    this.#children = children
    this.#bindChildren(children, textMode)
  }

  join(node) {
    for (const child of this.#children)
      node.appendChild(child)
    return this
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
          if (textMode)
            this.#bindText(child)
          break
        case Node.ELEMENT_NODE:
          this.#bindElement(child, textMode)
          break
      }
    }
  }

  #bindText(node) {
    this.#bindings.push(new BindingText(node))
  }

  #bindElement(element, textMode) {

    for (const name of element.getAttributeNames()) {
      if (name.startsWith(Template.Prefix.ATTRIBUTE))
        this.#bindings.push(new BindingAttribute(element, name))
      else if (name.startsWith(Template.Prefix.EVENT))
        this.#bindings.push(new BindingEvent(element, name))
    }

    this.#bindChildren(element.childNodes,
      Template.getTextMode(element, textMode))
  }

}

class BindingText extends Binding {

  #node = null

  constructor(node) {
    super(`\`${node.nodeValue}\``)
    this.#node = node
  }

  onRun(value) {
    this.#node.nodeValue = value
  }
}

class BindingAttribute extends Binding {

  #node = null
  #name = ''

  constructor(node, prefixedName) {
    super(node.getAttribute(prefixedName))
    node.removeAttribute(prefixedName)
    this.#node = node
    this.#name = prefixedName.substring(Template.Prefix.ATTRIBUTE.length)
  }

  onRun(value) {
    this.#node.setAttribute(this.#name, value)
  }
}

class BindingEvent extends Binding {

  #node = null
  #name = ''
  #listener = null

  constructor(node, prefixedName) {
    super(node.getAttribute(prefixedName))
    node.removeAttribute(prefixedName)
    this.#node = node
    this.#name = prefixedName.substring(Template.Prefix.EVENT.length)
  }

  onRun(value) {
    if (this.#listener)
      this.#node.removeEventListener(this.#name, this.#listener)
    this.#node.addEventListener(this.#name, value)
  }
}
