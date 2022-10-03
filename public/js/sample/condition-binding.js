import {Component, Observer, ConditionalNode} from '/js/fuffle/index.js'

; (class extends Component {

  #observer = new Observer(this)
  output = null
  value = true

  constructor(element) {
    super(element)

    const output = document.createElement('span')
    output.textContent = 'Goodbye, world.'
    this.output = new ConditionalNode(output)

    const input = document.createElement('button')
    input.textContent = 'Toggle'
    input.addEventListener('click',
      this.#observer.makeWriter(this.#onClickInput))

    element.appendChild(this.output.bookmark)
    element.appendChild(input)

    this.#observer.read(this.#renderValue)
  }

  #renderValue() {
    this.output.active = this.value
  }

  #onClickInput() {
    this.value = !this.value
  }

}).defineElement('sample-condition-binding')
