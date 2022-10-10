import Binding from './Binding.js'
import {consumeObserver} from './util.js'

export default class FuffleText extends HTMLElement {

  #child = null

  constructor() {
    super()
    this.#child = document.createTextNode('')
    this.attachShadow({mode: 'closed'})
      .appendChild(this.#child)
  }

  connectedCallback() {
    consumeObserver(this).then(observer => {
      Binding.js(`\`${this.textContent}\``)
        .onRun(value => {this.#child.nodeValue = value})
        .start(observer)
    })
  }

}
customElements.define('fuffle-text', FuffleText)
