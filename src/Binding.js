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

  onStop() {

  }

  stop() {
    this.observer?.removeEventListener('write', this.#onWrite)
    this.onStop()
    return this
  }

  run() {

  }
  withRun(run) {
    this.run = run
    return this
  }

  onRun(value) {

  }
  withOnRun(onRun) {
    this.onRun = onRun
    return this
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

  state = {
    js: '',
    locals: null
  }

  constructor(js) {
    super()
    if (js)
      this.state.js = js
    this.run = this.#makeRun()
  }

  withLocals(locals = {}) {
    this.state.locals = locals
    return this
  }

  withJs(js) {
    this.state.js = js
    if (this.observer)
      this.runTracked()
    return this
  }

  #makeRun() {
    const {state} = this
    return function() {
      let js = ''
      if (state.locals)
        for (const name in state.locals)
          js += `const ${name}=state.locals.${name}?.();`
      return eval(js + state.js)
    }
  }

}
