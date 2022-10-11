import {Observer, Template, util} from '/js/fuffle/index.js'

customElements.define('fuffle-demo', class extends util.ProviderElement {

  static template = Template.fromNode(
    document.getElementById('demo-template'))

  template = this.constructor.template.bake()

  connectedCallback() {
    setTimeout(() => {
      this.template.withParent(this).start(Observer.dummy)
    }, 0)
  }

  disconnectedCallback() {
    this.template.stop()
  }
})
