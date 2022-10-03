class NodeBuilder {

  node = null

  constructor(node) {
    this.node = node
  }

  withText(text) {
    this.node.textContent = text
    return this
  }
}

export default NodeBuilder

export const $ = node =>
  new NodeBuilder(node)
