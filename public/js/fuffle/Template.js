import Binding from './Binding.js'
import {ProviderElement, EventName} from './util.js'

export default class Template {

  static Text = {SHALLOW: 'shallow', DEEP: 'deep'}
  static Attribute = {TEXT: 'data-f-text'}
  static Prefix = {
    ATTRIBUTE: 'data-f:',
    ATTRIBUTE_STRING: 'data-f-s:',
    EVENT: 'data-f-on:'
  }

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

  #children = []
  #textMode = false

  constructor(children, textMode = false) {
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

  #textMode
  #locals = null
  #bindings = []

  #parent = null
  children = []

  constructor(children, textMode) {
    this.children = children
    this.#textMode = textMode
  }

  withParent(parent) {
    this.#parent = parent
    for (const child of this.children)
      parent.appendChild(child)
    return this
  }

  withLocals(locals) {
    this.#locals = locals
    return this
  }

  start(observer) {
    this.#bindChildren(this.children, this.#textMode)
    for (const binding of this.#bindings)
      binding.start(observer)
    return this
  }

  stop() {
    for (const binding of this.#bindings)
      binding.stop()
    return this
  }

  withoutParent() {
    if (this.#parent)
      for (const child of this.children)
        this.#parent.removeChild(child)
    this.#parent = null
    return this
  }

  #bindChildren(children, textMode) {
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

    this.#bindings.push(new BindingText(node, value)
      .withLocals(this.#locals))
  }

  #bindElement(element, textMode) {

    for (const prefixedName of element.getAttributeNames())
      this.#bindAttribute(element, prefixedName)

    if (!element.constructor?.isProvider)
      this.#bindChildren(element.childNodes,
        Template.getTextMode(element, textMode))
  }

  #bindAttribute(element, prefixedName) {
    const [prefix, name] = this.#getAttributePrefix(prefixedName)
    if (!prefix)
      return;

    const value = element.getAttribute(prefixedName)
    if (prefix === Template.Prefix.ATTRIBUTE_STRING)
      element.removeAttribute(prefixedName)

    switch (prefix) {
      case Template.Prefix.ATTRIBUTE:
        this.#bindings.push(new BindingAttribute(element, name, value)
          .withLocals(this.#locals))
        break
      case Template.Prefix.ATTRIBUTE_STRING:
        this.#bindings.push(new BindingAttribute(element, name, value, true)
          .withLocals(this.#locals))
        break
      case Template.Prefix.EVENT:
        this.#bindings.push(new BindingEvent(element, name, value)
          .withLocals(this.#locals))
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
  #isString = false

  constructor(node, name, value, isString = false) {
    super(value)
    this.#node = node
    this.#name = name
    this.#isString = !!isString
  }

  onRun(value) {
    if (this.#isString)
      this.#node.setAttribute(this.#name, value)
    const event = new Event(EventName.ATTRIBUTE_CHANGED)
    event.attributeName = this.#name
    event.attributeValue = value
    this.#node.dispatchEvent(event)
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
