import {pathEquals} from './util.js'

class ObserverProxy {
  static instance = new ObserverProxy()
}

/**
 * Watches for operations on an object
 *
 * @param {Object} target
 */
class Observer extends EventTarget {

  static resolve(value) {
    if (!value)
      return null
    if (!(value instanceof ObserverProxy))
      return null
    return value.observer
  }

  static fromArray(value) {
    const observer = Observer.resolve(value)
    return Array.isArray(observer?.target) ? observer : null
  }

  target = null
  proxy = null

  #name = null
  parent = null
  #children = null

  constructor(target, shallow = false) {
    super()
    this.target = target

    if (!shallow) {
      this.#children = {}
      for (const property in target)
        this.#adopt(property)
    }

    this.proxy = this.#makeProxy()
  }

  withParent(parent, name) {
    this.parent = parent
    this.#name = name
    return this
  }

  /**
   * Stops tracking reads and returns those that have been tracked.
   *
   * @callback Observer#StopTrackingReads
   * @returns {string[][]} All properties read since tracking started.
   */

  #reads = null
  /**
   * Starts tracking reads from the target object.
   * @returns {Observer#StopTrackingReads} Stops tracking and returns reads.
  */
  trackReads() {
    if (this.#reads)
      throw new Error('Concurrent modification exception')
    this.#reads = []
    return this.#stopTrackingReads
  }

  #stopTrackingReads = () => {
    const reads = [...this.#reads]
    this.#reads = null
    return reads
  }

  onRead(path) {
    if (this.#reads && !this.#reads.includes(pathEquals(path)))
      this.#reads.push(path)

    this.parent?.onRead([this.#name, ...path])
  }

  /**
   * Fired when a property changes on the target or any of its children.
   *
   * @event Observer#write
   * @type {object}
   * @property {string[]} propertyPath - Path to written property
   * @property {?} propertyValue - Value written to property
   */

  /**
   * Fires write event and bubbles up to parent.
   *
   * @fires Observer#write
   */
  onWrite(path, value) {
    const event = new Event('write')
    event.propertyPath = path
    event.propertyValue = value
    this.dispatchEvent(event)

    this.parent?.onWrite([this.#name, ...path], value)
  }

  #adopt(property, value = this.target[property]) {
    if (!this.#children)
      return;

    if (!value || typeof value !== 'object' || value === this) {
      if (this.#children.hasOwnProperty(property)) {
        this.#children[property].parent = null
        delete this.#children[property]
      }
      return;
    }

    this.#children[property] = new Observer(value)
      .withParent(this, property)
  }

  #makeProxy() {
    return new Proxy(this.target, {
      getPrototypeOf(target) {
        return ObserverProxy.instance
      },
      get: (target, property, receiver) => {
        if (property === 'observer')
          return this

        let result
        if (this.#children?.hasOwnProperty(property))
          result = this.#children[property].proxy
        else
          result = Reflect.get(target, property, receiver)

        if (typeof result === 'function')
          result = result.bind(receiver)

        this.onRead([property])
        return result
      },
      set: (target, property, value, receiver) => {
        const result = Reflect.set(target, property, value, receiver)

        this.#adopt(property, value)
        this.onWrite([property], value)

        return result
      },
    })
  }

}

export default Observer
