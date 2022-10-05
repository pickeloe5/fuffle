import {cloneTemplate} from './Util.js'

class Template {

  static Prefix = {ATTRIBUTE: 'fuffle:', EVENT: 'fuffle-on:'}

  static bake(element, observer, parent) {
    new Template(element, observer).bake(parent)
  }

  #element = null
  #observer = null
  constructor(element, observer) {
    this.#element = element
    this.#observer = observer
  }

  bake(parent) {
    const children = cloneTemplate(this.#element)

    for (const child of children) {
      this.#bakeNode(child)
      parent.appendChild(child)
    }
  }

  #bakeNode(node) {
    if (node.nodeType !== Node.ELEMENT_NODE)
      return;

    for (const attribute of [...node.attributes]) {

      if (attribute.name === 'fuffle-text') {
        this.#bakeTextParent(node, attribute.value === 'shallow')

      } else if (attribute.name.startsWith(Template.Prefix.ATTRIBUTE)) {
        this.#bakeAttribute(node, attribute.name, attribute.value)

      } else if (attribute.name.startsWith(Template.Prefix.EVENT)) {
        this.#bakeEvent(node, attribute.name, attribute.value)
      }
    }
  }

  #bakeEvent(element, name, value) {
    element.removeAttribute(name)
    name = name.substring(Template.Prefix.EVENT.length)

    this.#observer.readOnce(function() {
      element.addEventListener(name, eval(value).bind(this))
    })
  }

  #bakeAttribute(element, name, value) {
    element.removeAttribute(name)
    name = name.substring(Template.Prefix.ATTRIBUTE.length)

    this.#observer.read(function() {
      element.setAttribute(name, eval(value))
    })
  }

  #bakeTextParent(parent, shallow) {
    for (const child of parent.childNodes) {
      if (child.nodeType === Node.TEXT_NODE)
        this.#bakeTextNode(child)
      else if (!shallow && child.childNodes?.length)
        this.#bakeTextParent(child)
    }
  }

  #bakeTextNode(node) {
    const value = node.nodeValue

    this.#observer.read(function() {
      node.nodeValue = eval(`\`${value}\``)
    })
  }

}

export default Template
