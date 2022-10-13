import BindingBase from './Base.js'

/**
 * Extends {@link BindingBase} to execute JS as a string instead of a function.
 * JS is auto-magically re-executed when any of its dependencies are changed.
 *
 * @param {string} [js] - Optionally provide initial JS on construction.
 */
class Binding extends BindingBase {

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

  /**
   * Returns the value for a local variable in a {@link Binding}
   *
   * @callback Binding#GetLocalValue
   * @param {Proxy} target - The target being bound to, see {@link Observer}
   * @param {string} name - Name of the local variable
   * @returns {?} Value of the local variable
   */

  /**
   * Replaces any current locals with those provided
   *
   * @param {Map<string, Binding#GetLocalValue>} locals -
   * A map of local variable names to functions returning their value.
   */
  withLocals(locals = {}) {
    this.state.locals = locals
    return this
  }

  /**
   * Replaces any current JS with that provided, re-executes if live.
   *
   * @param {string} js - The new script to be executed.
   */
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
          js += `const ${name}=state.locals.${name}?.(this, '${name}');`
      return eval(js + state.js)
    }
  }

}

export default Binding
