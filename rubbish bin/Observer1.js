const pathEquals = pathA => pathB => {
  if (pathB.length !== pathA.length)
    return false

  for (let i in pathA)
    if (pathB[i] !== pathA[i])
      return false

  return true
}

export default class Observer extends EventTarget {

  static dummy = new Observer({array: ['string']})

  static pathIncluded(path, array) {
    return array.some(p => {
      if (p.length !== path.length)
        return false

      for (let i in path)
        if (p[i] !== path[i])
          return false

      return true
    })
  }

  target = null
  proxy = null
  #trackingReads = false
  #reads = []

  constructor(target) {
    super()
    this.target = target
    this.proxy = this.#makeProxy()
  }

  onWrite(fun) {
    const handler = ({property}) => fun(property)
    this.addEventListener('write', handler)
    return () => {this.removeEventListener('write', handler)}
  }

  #fire(name, data) {
    const event = new Event(name)
    if (data)
      Object.assign(event, data)
    this.dispatchEvent(event)
  }

  call(fun, ...args) {
    if (this.#trackingReads)
      throw new Error('Concurrent modification exception')

    this.#reads.length = 0
    this.#trackingReads = true
    const result = fun.call(this.proxy, ...args)
    this.#trackingReads = false
    return {result, reads: [...this.#reads]}
  }

  #onRead(path) {
    if (this.#trackingReads && !this.#reads.some(pathEquals(path)))
      this.#reads.push(path)
  }

  #makeProxy(target = this.target, path = []) {
    const children = {}

    for (const property in target)
      if (typeof target[property] === 'object')
        children[property] = this.#makeProxy(
          target[property], [...path, property])

    return new Proxy(target, {
      get: (target, property, receiver) => {
        let result
        if (children.hasOwnProperty(property))
          result = children[property]
        else
          result = Reflect.get(target, property, receiver)

        this.#onRead([...path, property])

        return result
      },
      set: (target, property, value, receiver) => {
        const result = Reflect.set(target, property, value, receiver)
        if (typeof value === 'object')
          children[property] = this.#makeProxy(value, [...path, property])
        else if (children.hasOwnProperty(property))
          delete children[property]

        this.#fire('write', {property: [...path, property]})

        return result
      }
    })
  }

}

// Observer.dummy.onWrite(path => {console.log('dummy write', path)})
