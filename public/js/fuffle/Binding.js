import {pathEquals} from './util.js'

export class BindingBase {

  #dependencies = []

  start(observer) {
    this.#run(observer)
    observer.addEventListener('write',
      this.#onWrite(observer))
    return this
  }

  run() {

  }

  onRun(value) {

  }

  #run(observer) {
    const stopTrackingReads = observer.trackReads()
    const result = this.run.call(observer.proxy)
    this.#dependencies = stopTrackingReads()
    this.onRun?.(result)
  }

  #onWrite = observer => ({propertyPath}) => {
    if (!this.#dependencies.some(pathEquals(propertyPath)))
      return;

    this.#run(observer)
  }

}

export default class Binding extends BindingBase {

  constructor(js) {
    super()
    this.run = function() {
      return eval(js)
    }
  }

}
