import ComponentElement from '../Component/Element.js'
import BindingAttribute from '../Binding/Attribute.js'
import BindingEvent from '../Binding/Event.js'
import BindingText from '../Binding/Text.js'
import BindingValue from '../Binding/Value.js'

/**
 * Provides the context of an observer to an array of DOM nodes.
 * Creates and manages bindings for text, attributes, events, and node values.
 *
 * @param {Node[]} children - The array of DOM nodes to be managed.
 */
class TemplateInstance {

  static getTextMode(node, inherited = false) {
    let mode = false

    if (node.hasAttribute(TemplateInstance.Attribute.TEXT))
      mode = node.getAttribute(TemplateInstance.Attribute.TEXT)
        === TemplateInstance.Text.SHALLOW
          ? TemplateInstance.Text.SHALLOW : TemplateInstance.Text.DEEP

    if (!mode && inherited !== TemplateInstance.Text.SHALLOW)
      mode = inherited

    return mode
  }

  /**
   * If falsey, no text nodes will be treated as templates.
   * If "shallow", only direct children, and the opposite is true for "deep."
   * @enum {string}
   */
  static Text = {SHALLOW: 'shallow', DEEP: 'deep'}

  static Attribute = {TEXT: 'data-f-text', VALUE: 'data-f-value'}
  static Prefix = {
    ATTRIBUTE: 'data-f:',
    ATTRIBUTE_STRING: 'data-f-s:',
    EVENT: 'data-f-on:'
  }

  #textMode
  #locals = null
  #bindings = []

  #parent = null
  children = []

  constructor(children, textMode) {
    this.children = children
    this.#textMode = textMode
  }

  /**
   * Appends all children to the given parent node.
   *
   * @param {Node} parent - The parent node for children to be appended to.
   * @returns {TemplateInstance} - this
   * @see Binding#withLocals
   */
  withParent(parent) {
    this.#parent = parent
    for (const child of this.children)
      parent.appendChild(child)
    return this
  }

  /**
   * Replaces any current local variables with those provided.
   *
   * @returns {TemplateInstance} - this
   * @see Binding#withLocals
   */
  withLocals(locals) {
    this.#locals = locals
    return this
  }

  /**
   * Creates and starts bindings for all children
   *
   * @returns {TemplateInstance} - this
   */
  start(observer) {
    this.#bindChildren(this.children, this.#textMode)
    for (const binding of this.#bindings)
      binding.start(observer)
    return this
  }

  /**
   * Stops all bindings created for children
   *
   * @returns {TemplateInstance} - this
   */
  stop() {
    for (const binding of this.#bindings)
      binding.stop()
    return this
  }

  /**
   * Removes the children of this template from their parent
   *
   * @returns {TemplateInstance} - this
   */
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

    if (!(element instanceof ComponentElement))
      this.#bindChildren(element.childNodes,
        TemplateInstance.getTextMode(element, textMode))
  }

  #bindAttribute(element, prefixedName) {
    if (prefixedName === TemplateInstance.Attribute.VALUE) {
      this.#bindings.push(new BindingValue(element,
        element.getAttribute(prefixedName)))
      return;
    }

    const [prefix, name] = this.#getAttributePrefix(prefixedName)
    if (!prefix)
      return;

    const value = element.getAttribute(prefixedName)
    if (prefix === TemplateInstance.Prefix.ATTRIBUTE_STRING)
      element.removeAttribute(prefixedName)

    switch (prefix) {
      case TemplateInstance.Prefix.ATTRIBUTE:
        this.#bindings.push(new BindingAttribute(element, name, value)
          .withLocals(this.#locals))
        break
      case TemplateInstance.Prefix.ATTRIBUTE_STRING:
        this.#bindings.push(new BindingAttribute(element, name, value, true)
          .withLocals(this.#locals))
        break
      case TemplateInstance.Prefix.EVENT:
        this.#bindings.push(new BindingEvent(element, name, value)
          .withLocals(this.#locals))
        break
    }
  }

  #getAttributePrefix(name) {
    for (const prefix of Object.values(TemplateInstance.Prefix))
      if (name.startsWith(prefix))
        return [prefix, name.substring(prefix.length)]
    return ['', name]
  }

}

export default TemplateInstance
