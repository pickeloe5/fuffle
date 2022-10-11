import {Observer, Template} from '/js/fuffle/index.js'

customElements.define('fuffle-demo', class extends HTMLElement {

  static template = Template.fromNode(
    document.getElementById('demo-template'))

  template = this.constructor.template.bake()

  constructor() {
    super()
    this.fuffle = {...this.fuffle, observer: Observer.dummy}
    this.template.start(Observer.dummy)
    for (const child of this.template.children)
      this.appendChild(child)
  }
})

document.getElementById('push').addEventListener('click', () => {
  Observer.dummy.proxy.array.push('string')
})

document.getElementById('pop').addEventListener('click', () => {
  Observer.dummy.proxy.array.pop()
})
