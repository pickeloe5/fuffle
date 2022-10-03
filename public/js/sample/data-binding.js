import {Component, Observer} from '/js/fuffle/index.js'

; (class extends Component {

  #observer = new Observer(this)

  $output = null
  $input = null

  value = 'Goodbye, world.'

  constructor(element) {
    super(element)

    this.$output = document.createElement('span')

    this.$input = document.createElement('input')
    this.$input.type = 'text'
    this.$input.addEventListener('keyup',
      this.#observer.makeWriter(this.#onKeyUp))

    this.#observer.read(this.#renderValue)

    element.appendChild(this.$output)
    element.appendChild(this.$input)
  }

  #renderValue() {
    this.$input.value = this.value
    this.$output.textContent = this.value
  }

  #onKeyUp(_, e) {
    this.value = e.target.value
  }

}).defineElement('sample-data-binding')
