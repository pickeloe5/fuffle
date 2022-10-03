export default class Observer {

  #target = null
  #reads = []
  proxy = null

  constructor(target) {
    this.#target = target
    this.proxy = this.#makeFrontProxy()
  }

  read(fun, record) {
    const observation = this.#makeBackProxy()
    const result = fun.call(observation.proxy, observation.proxy)
    const gets = [...observation.gets],
      sets = [...observation.sets]

    if (record)
      record.gets = gets
    else if (gets.length)
      this.#reads.push({fun, gets})

    this.#onWrite(sets)
    return result
  }

  render(fun, gets) {
    const {proxy, sets} = this.#makeBackProxy()
    const result = fun.call(proxy)
    this.#reads.push({fun, gets})
    this.#onWrite([...sets])
    return result
  }

  reread(records = this.#reads) {
    for (const it of records)
      this.read(it.fun, it)
  }

  write(fun, ...args) {
    const {proxy, sets} = this.#makeBackProxy()
    const result = fun.call(proxy, proxy, ...args)
    this.#onWrite([...sets])
    return result
  }

  makeWriter(fun) {
    return function() {
      return this.write(fun, ...arguments)
    }.bind(this)
  }

  #onWrite(sets) {
    if (!this.#reads.length)
      return;

    this.reread(this.#reads.filter(record => {
      if (!record.gets)
        return true
      if (!sets.length)
        return false
      return record.gets.some(name =>
        sets.includes(name))
    }))
  }

  #makeBackProxy() {
    const gets = [], sets = []
    const front = this.proxy
    const proxy = new Proxy(this.#target, {

      get(target, property, receiver) {
        if (!gets.includes(property))
          gets.push(property)
        let result = Reflect.get(target, property, receiver)
        if (typeof result === 'function')
          result = result.bind(front)
        return result
      },

      set(target, property, value, receiver) {
        if (!sets.includes(property))
          sets.push(property)
        return Reflect.set(target, property, value, receiver)
      }
    })
    return {proxy, gets, sets}
  }

  #makeFrontProxy() {
    return new Proxy(this.#target, {

      get: (target, property, receiver) => {
        let result = Reflect.get(target, property, receiver)
        if (typeof result === 'function')
          result = result.bind(receiver)
        return result
      },

      set: (target, property, value, receiver) => {
        const result = Reflect.set(target, property, value, receiver)
        this.#onWrite([property])
        return result
      }
    })
  }
}
