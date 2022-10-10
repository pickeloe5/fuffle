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

  onRun(fun) {
    this.onRunImpl = fun
    return this
  }

  run() {

  }

  onRunImpl(value) {

  }

  #run(observer) {
    const stopTrackingReads = observer.trackReads()
    const result = this.run.call(observer.proxy)
    this.#dependencies = stopTrackingReads()
    this.onRunImpl?.(result)
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
