export default class Observer {

  #target = null
  #reads = []
  proxy = null

  constructor(target) {
    this.#target = target
    this.proxy = this.#makeFrontProxy()
  }

  render(fun, gets) {
    const {proxy, sets} = this.#makeBackProxy()
    const result = fun.call(proxy)
    this.#reads.push({fun, gets})
    this.#onWrite([...sets])
    return result
  }

  read(fun, record, target) {
    const observation = this.#makeBackProxy(target)
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

  reread(records = this.#reads) {
    for (const it of records)
      this.read(it.fun, it)
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

  makeWriter(fun) {
    return function() {
      return this.write(fun, ...arguments)
    }.bind(this)
  }

  write(fun, ...args) {
    const {proxy, sets} = this.#makeBackProxy()
    const result = fun.call(proxy, proxy, ...args)
    this.#onWrite([...sets])
    return result
  }

  #makeBackProxy(target = this.#target) {
    const gets = [], sets = []
    const proxy = new Proxy(target, {

      get(target, property, receiver) {
        if (!gets.includes(property))
          gets.push(property)
        return Reflect.get(target, property, receiver)
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
