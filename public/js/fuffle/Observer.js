export default class Observer {

  #target = null

  #proxy = null
  #reads = []

  constructor(target) {
    this.#target = target
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
    const traps = {
      set: (target, property, value, receiver) => {
        const result = Reflect.set(target, property, value, receiver)
        if (trackWrites) {
          if (!writes.includes(property))
            writes.push(property)
        } else {
          this.#write([property])
        }
        return result
      }
    }
    if (trackReads) traps.get = (target, property, receiver) => {
      const result = Reflect.get(target, property, receiver)
      if (!reads.includes(property))
        reads.push(property)
      return result
    }
    const proxy = new Proxy(this.#target, traps)
    return {proxy, reads, writes}
  }

}

export class ArrayObserver {

  #value = []
  #length = 0
  proxy = null

  constructor(value = []) {
    this.#value = value
    this.#length = value.length
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

  #makeProxy() {
    return new Proxy(this.#value, {
      set: (target, property, value, receiver) => {
        const result = Reflect.set(target, property, value, receiver)
        let index
        if (property === 'length') {
          for (let i = this.#length; i < value; i++)
            this.#onPush?.(this.#value[i], i)
          for (let i = this.#length - 1; i >= value; i--)
            this.#onPop?.(this.#value[i], i)
          this.#length = value
        } else if ((index = parseInt(property)) !== NaN) {
          this.#onSet?.(value, index)
        }
        return result
      }
    })
  }

}
