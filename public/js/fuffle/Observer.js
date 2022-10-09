import {pathEquals} from './util.js'

export default class Observer extends EventTarget {

  static isArray(proxy) {
    if (!proxy)
      return false
    const {observer} = proxy
    return observer instanceof Observer && Array.isArray(observer.target)
  }

  static dummy = new Observer({array: ['string']})

  target = null
  proxy = null

  #name = null
  #parent = null
  #children = null

  constructor(target, shallow = false) {
    super()
    this.target = target

    if (!shallow) {
      this.#children = {}
      for (const property in target)
        if (typeof target[property] === 'object')
          this.#adopt(property)
    }

    this.proxy = this.#makeProxy()
  }

  withParent(parent, name) {
    this.#parent = parent
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

    const event = new Event('read')
    event.propertyPath = path
    this.dispatchEvent(event)

    this.#parent?.onRead([this.#name, ...path])
  }

  onWrite(path) {
    const event = new Event('write')
    event.propertyPath = path
    this.dispatchEvent(event)

    this.#parent?.onWrite([this.#name, ...path])
  }

  #adopt(property) {
    if (!this.#children)
      return;

    this.#children[property] = new Observer(this.target[property])
      .withParent(this, property)
  }

  #makeProxy() {
    return new Proxy(this.target, {
      get: (target, property, receiver) => {
        if (property === 'observer')
          return this

        let result
        if (this.#children?.hasOwnProperty(property))
          result = this.#children[property].proxy
        else
          result = Reflect.get(target, property, receiver)

        this.onRead([property])

        return result
      },
      set: (target, property, value, receiver) => {
        const result = Reflect.set(target, property, value, receiver)

        if (typeof value === 'object')
          this.#adopt(property)
        else if (this.#children.hasOwnProperty(property))
          delete this.#children[property]

        this.onWrite([property])

        return result
      },
    })
  }

}
