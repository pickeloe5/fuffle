import {pathEquals} from '../util.js'

/**
 * Executes a span of code in the context of an observer.
 * Tracks the reads that occur through that span.
 * Re-executes the code whenever any read properties are later changed.
 *
 * @param {Observer} [observer] - Optionally provide observer on construction.
 */
class BindingBase {

  #dependencies = []
  observer = null

  constructor(observer = null) {
    this.observer = observer
  }

  /** Calls {@link BindingBase#run} and starts listening to observer */
  start(observer = this.observer) {
    this.observer = observer
    this.runTracked()
    observer.addEventListener('write', this.#onWrite)
    return this
  }

  /** Called after {@link BindingBase#stop} */
  onStop() {

  }

  /** Removes any active listeners */
  stop() {
    this.observer?.removeEventListener('write', this.#onWrite)
    this.onStop()
    return this
  }

  /** Called in the context of the observer's proxy */
  run() {

  }
  /** Builder pattern for {@link BindingBase#run} */
  withRun(run) {
    this.run = run
    return this
  }

  /**
   * Called when {@link BindingBase#run} is finished
   *
   * @param {?} value - The value returned from {@link BindingBase#run}
   */
  onRun(value) {

  }
  /** Builder pattern for {@link BindingBase#onRun} */
  withOnRun(onRun) {
    this.onRun = onRun
    return this
  }

  /** Calls {@link BindingBase#run} and tracks dependencies */
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

export default BindingBase
