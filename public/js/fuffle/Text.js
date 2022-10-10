import Binding from './Binding.js'
import {consumeObserver} from './util.js'
import Template from './Template.js'

export default class FuffleText extends HTMLElement {

  connectedCallback() {
    const template = new Template([...this.childNodes], Template.Text.DEEP)
    consumeObserver(this)
      .then(observer => {template.start(observer)})
  }

}
customElements.define('fuffle-text', FuffleText)
