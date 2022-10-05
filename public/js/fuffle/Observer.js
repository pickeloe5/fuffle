export default class Observer {

  #target = null
  #proxy = null
  #reads = []
  #arrays = {}

  constructor(target = {}) {
    this.#target = target

    for (const key in target)
      if (Array.isArray(target[key]))
        this.#arrays[key] = new ArrayObserver(target[key])

    this.#proxy = this.#makeProxy(false).proxy
  }

  #write(properties) {
    for (const read of this.#reads) {
      if (!read.properties.some(name =>
        properties.includes(name)))
          continue
      const {reads} = this.#run(read.function, ...read.arguments)
      read.properties = reads
    }
  }

  #run(fun, ...args) {
    const {proxy, reads} = this.#makeProxy()
    const result = fun.call(proxy, ...args)
    return {result, reads}
  }

  read(fun, ...args) {
    const {result, reads} = this.#run(fun, ...args)
    this.#reads.push({
      function: fun,
      arguments,
      properties: reads
    })
    return result
  }

  readOnce(fun, ...args) {
    return fun.call(this.#proxy, ...args)
  }

  #makeProxy(trackReads = true, trackWrites) {
    const reads = [], writes = []
    const proxy = new Proxy(this.#target, {
      get: (target, property, receiver) => {

        let result
        if (this.#arrays.hasOwnProperty(property))
          result = this.#arrays[property].proxy
        else
          result = Reflect.get(target, property, receiver)

        if (typeof result === 'function' && target.hasOwnProperty(property))
          result = result.bind(receiver)
        if (trackReads) {
          if (!reads.includes(property))
            reads.push(property)
        }
        return result
      },
      set: (target, property, value, receiver) => {
        const result = Reflect.set(target, property, value, receiver)

        if (Array.isArray(value))
          this.#arrays[property] = new ArrayObserver(value)

        if (trackWrites) {
          if (!writes.includes(property))
            writes.push(property)
        } else {
          this.#write([property])
        }
        return result
      }
    })
    return {proxy, reads, writes}
  }

}

export class ArrayObserver {

  value = []
  #length = 0
  proxy = null

  constructor(value = []) {
    this.value = [...value]
    this.value.observer = this
    this.#length = this.value.length
    this.proxy = this.#makeProxy()
  }

  #onPush = (value, index) => {}
  onPush(fun) {
    this.#onPush = fun
    return this
  }

  #onPop = (value, index) => {}
  onPop(fun) {
    this.#onPop = fun
    return this
  }

  #onSet = (value, index) => {}
  onSet(fun) {
    this.#onSet = fun
    return this
  }

  withValue(value) {
    this.proxy.push(...value)
    return this
  }

  #onSetLength(length) {
    for (let i = this.#length; i < length; i++)
      this.#onPush?.(this.value[i], i)

    for (let i = this.#length - 1; i >= length; i--)
      this.#onPop?.(this.value[i], i)

    this.#length = length
  }

  #makeProxy() {
    return new Proxy(this.value, {
      set: (target, property, value, receiver) => {
        const result = Reflect.set(target, property, value, receiver)
        let index

        if (property === 'length')
          this.#onSetLength(value)
        else if ((index = parseInt(property)) !== NaN)
          this.#onSet?.(value, index)

        return result
      }
    })
  }

}
