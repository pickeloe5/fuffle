import {cloneTemplate} from './Util.js'

const TAG_NAMES = ['fuffle-if', 'fuffle-for']

// For loops:
//  - Root text nodes can be templates
//  - Additional variables need to be exposed past observer (current iteration)
//  - We need to store the relevant observer on the loop to use it
//  - Element source can be raw array instead of template element

class Template {

  static Prefix = {ATTRIBUTE: 'fuffle:', EVENT: 'fuffle-on:'}
  static Attribute = {TEXT: 'fuffle-text', VALUE: 'fuffle-value'}

  #observer = null
  #children = null
  constructor(observer, children) {
    this.#observer = observer
    this.#children = children
  }

  #rootText = false
  withRootText(shallow) {
    shallow = !!shallow
    this.#rootText = {shallow}
    return this
  }

  #iterationDefined = false
  #iteration = null
  withIteration(value) {
    this.#iterationDefined = true
    this.#iteration = value
    return this
  }

  bake() {
    const children = this.#children.map(it => it.cloneNode(true))
    if (this.#rootText)
      this.#bakeTextChildren(children, this.#rootText.shallow)
    for (const child of children)
      this.#bakeNode(child)
    return children
  }

  #bakeNode(node) {
    if (node.nodeType !== Node.ELEMENT_NODE)
      return;

    if (TAG_NAMES.includes(node.tagName.toLowerCase())) {
      node.fuffle = {...node.fuffle,
        parent: this.#observer}
      if (node.hasAttribute('text')) {
        const shallow = node.getAttribute('text') === 'shallow'
        node.removeAttribute('text')
        node.fuffle = {...node.fuffle,
          text: {shallow}}
      }
    }

    for (const attribute of [...node.attributes]) {

      if (attribute.name === Template.Attribute.VALUE) {
        this.#bakeValue(node, attribute.value)

      } else if (attribute.name === Template.Attribute.TEXT) {
        this.#bakeTextChildren([...node.childNodes], attribute.value === 'shallow')

      } else if (attribute.name.startsWith(Template.Prefix.ATTRIBUTE)) {
        this.#bakeAttribute(node, attribute.name, attribute.value)

      } else if (attribute.name.startsWith(Template.Prefix.EVENT)) {
        this.#bakeEvent(node, attribute.name, attribute.value)
      }
    }
  }

  #bakeValue(element, value) {
    element.removeAttribute(Template.Attribute.VALUE)
    element.fuffle = {...element.fuffle, value}
  }

  #bakeEvent(element, name, value) {
    element.removeAttribute(name)
    name = name.substring(Template.Prefix.EVENT.length)

    element.addEventListener(name, function() {
      const liveValue = eval(value)

      if (typeof liveValue !== 'function')
        return liveValue

      liveValue.call(this, ...arguments)
    }.bind(this.#observer.proxy))
  }

  #bakeAttribute(element, name, value) {
    element.removeAttribute(name)
    name = name.substring(Template.Prefix.ATTRIBUTE.length)

    this.#observer.bind(function() {
      element.setAttribute(name, eval(value))
    })
  }

  #bakeTextChildren(children, shallow) {
    for (const child of children) {
      if (child.nodeType === Node.TEXT_NODE)
        this.#bakeTextNode(child)
      else if (!shallow && child.childNodes?.length)
        this.#bakeTextChildren([...child.childNodes])
    }
  }

  #bakeTextNode(node) {
    const value = node.nodeValue
    const it = this.#iteration
    this.#observer.bind(function() {
      node.nodeValue = eval(`\`${value}\``)
    })
  }

}

export default Template
