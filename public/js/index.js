import * as Fuffle from '/js/fuffle/index.js'
const {$} = Fuffle

const CODE_STYLE = {
  display: 'block',
  whiteSpace: 'pre',
  fontFamily: 'monospace',
  backgroundColor: '#0001'
}

class BasicDemo extends Fuffle.Component {

  constructor(element) {
    super(element)

    Object.assign(element.style, CODE_STYLE)

    element.textContent = BasicDemo.toString()
  }
}
BasicDemo.defineElement('demo-basic')

class UtilDemo extends Fuffle.Component {

  static template = document.getElementById('demo-util-template')

  constructor(element) {
    super(element)

    Fuffle.Util.appendTemplate(element, UtilDemo.template)

    $(element)
      .query('.code')
      .withText(UtilDemo.toString())
  }
}
UtilDemo.defineElement('demo-util')

class ObserverDemo extends Fuffle.Component {

  static template = document.getElementById('demo-observer-template')

  #observer = new Fuffle.Observer(this)

  $output = null
  $input = null

  value = 'Observer Demo:'

  constructor(element) {
    super(element)
    Fuffle.Util.appendTemplate(element, ObserverDemo.template)

    const $element = $(element)
    this.$output = $element.query('[data-key=output]')
    this.$input = $element.query('input')
    $element.query('.code').withText(ObserverDemo.toString())

    this.#observer.read(this.#renderValue)
    this.$input.on('keyup', this.#observer.proxy.updateValue)
  }

  #renderValue() {
    const {value} = this
    this.$output.withText(value)
    this.$input.withValue(value)
  }

  updateValue(e) {
    this.value = e.target.value
  }

}
ObserverDemo.defineElement('demo-observer')
