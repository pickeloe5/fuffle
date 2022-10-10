import {pathEquals} from './util.js'

export default class Binding {

  static js(observer, js) {
    return new BindingJavascript(observer, js)
  }

  #observer = null
  #dependencies = []
  constructor(observer) {
    this.#observer = observer
  }

  start() {
    this.#run()
    this.#observer.addEventListener('write', this.#onWrite)
    return this
  }

  #run() {
    const stopTrackingReads = this.#observer.trackReads()
    const result = this.run.call(this.#observer.proxy)
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

  #onWrite = ({propertyPath}) => {
    if (!this.#dependencies.some(pathEquals(propertyPath)))
      return;

    this.#run()
  }

}

export class BindingJavascript extends Binding {

  constructor(observer, js) {
    super(observer)
    this.run = function() {
      return eval(js)
    }
  }

}
