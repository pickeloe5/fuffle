import {Observer, Template} from '/js/fuffle/index.js'

customElements.define('fuffle-demo', class extends HTMLElement {

  static template = Template.fromNode(
    document.getElementById('demo-template'))

  template = this.constructor.template.bake()

  constructor() {
    super()
    this.fuffle = {...this.fuffle, observer: Observer.dummy, provider: true}
  }

  connectedCallback() {
    setTimeout(() => {
      this.template.withParent(this).start(Observer.dummy)
    }, 0)
  }

  disconnectedCallback() {
    this.template.stop().withoutParent()
  }
})
