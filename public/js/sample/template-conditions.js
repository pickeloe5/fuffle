import {Util, Component, ConditionalNode} from '/js/fuffle/index.js'

; (class extends Component {

  static template = document.querySelector(
    'template[data-id="sample-template-conditions"]')

  #output = null
  value = true

  constructor(element) {
    super(element)
    Util.appendTemplate(element, this.constructor.template)

    const $output = element.querySelector('[data-key="output"]')
    const $input = element.querySelector('[data-key="input"]')

    this.#output = new ConditionalNode($output, true)
    $output.parentElement.insertBefore(this.#output.bookmark, $output)
    this.#output.active = this.value

    $input.addEventListener('click', this.#onClickInput)
  }

  #onClickInput = () => {
    this.#output.active = this.value = !this.value
  }
}).defineElement('sample-template-conditions')
