import {pathEquals} from './util.js'

export class BindingBase {

  #dependencies = []
  observer = null

  constructor(observer = null) {
    this.observer = observer
  }

  start(observer = this.observer) {
    this.observer = observer
    this.runTracked()
    observer.addEventListener('write', this.#onWrite)
    return this
  }

  stop() {
    this.observer.removeEventListener(this.#onWrite)
    return this
  }

  run() {

  }

  onRun(value) {

  }

  runTracked() {
    const stopTrackingReads = this.observer.trackReads()
    const result = this.run.call(this.observer.proxy)
    this.#dependencies = stopTrackingReads()
    this.onRun(result)
  }

  #onWrite = ({propertyPath}) => {
    if (!this.#dependencies.some(pathEquals(propertyPath)))
      return;

    this.runTracked()
  }

}

export default class Binding extends BindingBase {

  #js = {_:''}

  constructor(js) {
    super()
    if (js)
      this.#js._ = js
    this.run = this.#makeRun()
  }

  #makeRun() {
    const js = this.#js
    return function() {
      return eval(js._)
    }
  }

  withJs(js) {
    this.#js._ = js
    if (this.observer)
      this.runTracked()
    return this
  }

}
