import TemplateInstance from './Instance.js'

/**
 * Factory pattern for {@link TemplateInstance}s
 * @param {Node[]} children - Nodes to be cloned to produce instances.
 * @param {Template#Text} textMode - Optional configuration for text nodes.
 * @see {@link TemplateInstance#Text}
 */
class Template {

  /** Constructs a Template factory from an HTML "template" element. */
  static fromNode(node) {
    return new Template(
      [...node.content.childNodes],
      TemplateInstance.getTextMode(node))
  }

  #children = []
  #textMode = false

  constructor(children, textMode = false) {
    this.#children = children
    this.#textMode = textMode
  }

  /**
   * Produces an instance of this template.
   *
   * @returns {TemplateInstance} The new instance of this template.
   */
  bake() {
    return new TemplateInstance(
      this.#children.map(it => it.cloneNode(true)),
      this.#textMode)
  }

}

export default Template
