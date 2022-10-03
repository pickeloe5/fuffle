import {Util, Component, Observer} from '/js/fuffle/index.js'

; (class extends Component {

  static template = document.querySelector(
    'template[data-id="demo-template-binding"]')

  #observer = new Observer(this)

  $output = null
  $input = null

  value = 'Goodbye, world.'

  constructor(element) {
    super(element)
    Util.appendTemplate(element, this.constructor.template)

    this.$output = element.querySelector('[data-key="output"]')
    this.$input = element.querySelector('[data-key="input"]')

    this.#observer.read(this.#renderValue)

    this.$input.addEventListener('keyup',
      this.#observer.makeWriter(this.#onKeyUp))
  }

  #renderValue() {
    this.$output.textContent = this.value
    this.$input.value = this.value
  }

  #onKeyUp(_, e) {
    this.value = e.target.value
  }

}).defineElement('demo-template-binding')
