import ComponentElement from './Element.js'

/**
 * Super class for objects to be attached to custom DOM elements.
 *
 * @param {HTMLElement} element - The custom element being controlled.
 */
class ComponentBase {

  /**
   * Acquires the component instance controlling an instance of an element.
   *
   * @param {HTMLElement} element - An element to get a component from.
   * @returns {?ComponentBase} The respective component for the given element.
   */
  static fromElement(element) {
    if (!(element instanceof ComponentElement))
      return null
    return ComponentElement.getInstance(element)
  }

  /**
   * Acquires the observer, if one is present, for a given component.
   *
   * @param {ComponentBase} instance - The instance to get an observer from
   * @returns {?Observer} This component's observer, or null.
   */
  static getObserver(instance) {
    return null
  }

  /**
   * Defines a custom element for this component by the given name.
   *
   * @param {string} tagName - The tag name for the resulting custom element
   * @returns {?} The resulting implementation of HTMLElement as a class
   */
  static defineElement(tagName) {
    const ComponentImpl = this
    const ElementImpl = class extends ComponentElement {
      static ComponentImpl = ComponentImpl
    }
    customElements.define(tagName, ElementImpl)
    return ElementImpl
  }

  constructor(element) {

  }

  /**
   * Called when this component is connected to the document.
   *
   * @param {Observer} parent - The nearest parent observer, if one is present.
   */
  onConnected(parent) {

  }

  /**
   * Called when any attribute changes on the instance of the element.
   *
   * @param {string} name - Attribute name
   * @param {?} value - Attribute value; always string for unbound attributes.
   */
  onAttributeChanged(name, value) {

  }

  /** Called when this component is disconnected from the document. */
  onDisconnected() {

  }

}
export default ComponentBase
