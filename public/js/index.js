import {Observer} from '/js/fuffle/index.js'

customElements.define('dummy-context', class extends HTMLElement {
  connectedCallback() {
    for (const child of this.childNodes)
      this.#connect(child)
  }
  #connect(node) {
    if (node.childNodes?.length)
      for (const child of node.childNodes)
        this.#connect(child)
  }
})

document.getElementById('push').addEventListener('click', () => {
  Observer.dummy.proxy.array.push('string')
})

document.getElementById('pop').addEventListener('click', () => {
  Observer.dummy.proxy.array.pop()
})
