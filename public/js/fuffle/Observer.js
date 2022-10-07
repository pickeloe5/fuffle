class Observer {

  target = null
  #bindings = []
  proxy = null
  #children = {}

  constructor(target) {
    this.target = target
    for (const key in target) {
      if (Array.isArray(target[key]))
        this.#children[key] = new ArrayObserver(target[key])
      // else if (typeof target[key] === 'object')
      //   this.#children[key] = new Observer(target[key])
    }
    this.proxy = this.#observe().proxy
  }

  run(fun, ...args) {
    return fun.call(this.proxy, ...args)
  }

  bind(fun, ...args) {
    this.#bindings.push(this.#runBinding({
      observation: this.#observe(true, true),
      function: fun,
      arguments: args,
      reads: []
    }))
  }

  #runBinding(binding) {
    const {observation: {proxy, reads, writes}} = binding
    writes.length = 0
    binding.function.call(proxy, ...binding.arguments)
    binding.reads = [...reads]
    this.#checkBindings([...writes])
    return binding
  }

  #checkBindings(properties) {
    for (const binding of this.#bindings)
      if (binding.reads.some(it => properties.includes(it)))
        this.#runBinding(binding)
  }

  #onRead({reads}, property) {
    if (reads && !reads.includes(property))
      reads.push(property)
    this.onRead(property)
  }

  onRead(property) {

  }

  #onWrite({writes}, property, value) {
    if (writes) {
      if (!writes.includes(property))
        writes.push(property)
    } else this.#checkBindings([property])
    this.onWrite(property, value)
  }

  onWrite(property, value) {

  }

  #observe(trackReads, trackWrites) {
    const observation = {
      reads: trackReads ? [] : null,
      writes: trackWrites ? [] : null,
      proxy: new Proxy(this.target, {
        get: (target, property, receiver) => {
          if (property === 'observer')
            return this
          let result
          if (property === Symbol.iterator)
            result = target[Symbol.iterator].bind(target)
          else if (this.#children.hasOwnProperty(property))
            result = this.#children[property].proxy
          else
            result = Reflect.get(target, property, receiver)

          this.#onRead(observation, property)

          return result
        },
        set: (target, property, value, receiver) => {
          const result =  Reflect.set(target, property, value, receiver)

          this.#onWrite(observation, property, value)

          return result
        }
      })
    }
    return observation
  }

}

class ArrayObserver extends Observer {

  #renderedLength = 0

  constructor(target) {
    super(target)
    this.#renderedLength = this.target.length
  }

  #onCreate = (value, index) => {}
  onCreate(fun) {
    this.#onCreate = fun
    return this
  }

  #onUpdate = (value, index) => {}
  onUpdate(fun) {
    this.#onUpdate = fun
    return this
  }

  #onDelete = (value, index) => {}
  onDelete(fun) {
    this.#onDelete = fun
    return this
  }

  onWrite(property, value) {
    let index
    if (property === 'length') {
      for (let i = this.#renderedLength; i < value; i++)
        this.#onCreate(this.target[i], i)
      for (let i = this.#renderedLength - 1; i >= value; i--)
        this.#onDelete(this.target[i], i)
      this.#renderedLength = value
    } else if ((index = parseInt(value)) !== NaN) {
      this.#onUpdate(value, index)
    }
  }

}

export default Observer
export {ArrayObserver}
