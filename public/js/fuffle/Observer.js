import {pathEquals} from './util.js'

class ObserverProxy {
  static instance = new ObserverProxy()
}

export default class Observer extends EventTarget {

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

  static dummy = new Observer({
    name: 'item',
    array: ['string'],
    push() {this.array.push('string')},
    pop() {this.array.pop()},
    update() {
      const index = Math.trunc(Math.random() * this.array.length)
      this.array[index] += '.'
    }
  })

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

  #reads = null
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

        if (typeof result === 'function' && target.hasOwnProperty(property))
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
