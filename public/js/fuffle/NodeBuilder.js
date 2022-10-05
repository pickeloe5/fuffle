class NodeBuilder {

  static resolve(...children) {
    if (children.length !== 1)
      return children.map(child =>
        NodeBuilder.resolve(child))
    const [child] = children
    if (child instanceof NodeBuilder)
      return child.node
    if (Array.isArray(child))
      return NodeBuilder.resolve(...child)
    return child
  }

  node = null

  get parent() {
    const {parentNode} = this.node
    if (!parentNode)
      return null
    return new NodeBuilder(parentNode)
  }

  get children() {
    return [...this.node.childNodes]
      .map(it => new NodeBuilder(it))
  }

  get attributes() {
    return this.node.attributes
  }

  get component() {
    return this.node.fuffleComponent
  }

  constructor(node) {
    this.node = node
  }

  getAttribute(name) {
    return this.node.getAttribute(name)
  }

  on(eventName, handler) {
    this.node.addEventListener(eventName, handler)
    return this
  }

  query(selector) {
    const child = this.node.querySelector(selector)
    return !child ? null : new NodeBuilder(child)
  }

  withSibling(child) {
    this.node.parentNode?.insertBefore(
      NodeBuilder.resolve(child), this.node)
    return this
  }

  withAttribute(name, value) {
    this.node.setAttribute(name, value)
    return this
  }

  withChild(...children) {
    children = NodeBuilder.resolve(children)
    if (this.node.append)
      this.node.append(...children)
    else {
      for (const child of children)
        this.node.appendChild(child)
    }
    return this
  }

  withText(text) {
    this.node.textContent = text
    return this
  }

  withType(type) {
    this.node.type = type
    return this
  }

  withValue(value) {
    this.node.value = value
    return this
  }

  withStyle(style) {
    Object.assign(this.node.style, style)
    return this
  }

  shadow() {
    return new NodeBuilder(this.node.attachShadow({mode: 'closed'}))
  }

  remove() {
    this.node.parentNode?.removeChild(this.node)
    return this
  }
}

const $ = node =>
  new NodeBuilder(node)

$.create = tag =>
  new NodeBuilder(document.createElement(tag))

$.br = () =>
  new NodeBuilder(document.createElement('br'))

$.comment = () =>
  new NodeBuilder(new Comment())

export default NodeBuilder
export { $ }
