import {pathEquals} from './util.js'

export default class Binding {

  static js(js) {
    return new BindingJavascript(js)
  }

  #dependencies = []

  start(observer) {
    this.#run(observer)
    observer.addEventListener('write',
      this.#onWrite(observer))
    return this
  }

  #run(observer) {
    const stopTrackingReads = observer.trackReads()
    const result = this.run.call(observer.proxy)
    this.#dependencies = stopTrackingReads()
    this.#onRun?.(result)
  }

  run() {

  }

  #onRun = null
  onRun(fun = (result) => {}) {
    this.#onRun = fun
    return this
  }

  #onWrite = observer => ({propertyPath}) => {
    if (!this.#dependencies.some(pathEquals(propertyPath)))
      return;

    this.#run(observer)
  }

}

export class BindingJavascript extends Binding {

  constructor(js) {
    super()
    this.run = function() {
      return eval(js)
    }
  }

}
