import {Observer, Template} from '/js/fuffle/index.js'

customElements.define('fuffle-demo', class extends HTMLElement {

  static template = Template.fromNode(
    document.getElementById('demo-template'))

  template = this.constructor.template.bake()

  constructor() {
    super()
    this.template.start(Observer.dummy).join(this)
  }
})

document.getElementById('push').addEventListener('click', () => {
  Observer.dummy.proxy.array.push('string')
})

document.getElementById('pop').addEventListener('click', () => {
  Observer.dummy.proxy.array.pop()
})
