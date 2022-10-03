export default class Observer {

  #target = null
  #reads = []

  constructor(target) {
    this.#target = target
  }

  render(fun, gets) {
    const {proxy, sets} = this.#observe()
    fun.call(proxy)
    this.#reads.push({fun, gets})
    this.#onWrite([...sets])
  }

  read(fun, record) {
    const observation = this.#observe()
    fun.call(observation.proxy, observation.proxy)
    const gets = [...observation.gets],
      sets = [...observation.sets]

    if (record)
      record.gets = gets
    else if (gets.length)
      this.#reads.push({fun, gets})

    this.#onWrite(sets)
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
    const observer = this
    return function() {
      observer.write(fun, ...arguments)
    }
  }

  write(fun, ...args) {
    const {proxy, sets} = this.#observe()
    fun.call(proxy, proxy, ...args)
    this.#onWrite([...sets])
  }

  #observe() {
    const gets = [], sets = []
    const proxy = new Proxy(this.#target, {

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

}
