import {Component, ConditionalNode} from '/js/fuffle/index.js'

; (class extends Component {

  #output = null
  #value = true

  constructor(element) {
    super(element)

    const output = document.createElement('span')
    output.textContent = 'Goodbye, world.'
    this.#output = new ConditionalNode(output)

    const input = document.createElement('button')
    input.textContent = 'Toggle'
    input.addEventListener('click', this.#onClickInput)

    element.appendChild(this.#output.bookmark)
    element.appendChild(input)

    this.#output.active = this.#value
  }

  #onClickInput = () => {
    this.#output.active = this.#value = !this.#value
  }

}).defineElement('demo-conditional-rendering')
