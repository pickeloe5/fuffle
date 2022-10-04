import * as Fuffle from '/js/fuffle/index.js'
const {$, FuffleIf} = Fuffle

const CODE_STYLE = {
  display: 'block',
  whiteSpace: 'pre',
  fontFamily: 'monospace',
  backgroundColor: '#0001'
}

class BasicDemo extends Fuffle.ComponentBase {

  constructor(element) {
    super(element)

    Object.assign(element.style, CODE_STYLE)

    element.textContent = BasicDemo.toString()
  }
}
BasicDemo.defineElement('demo-basic')

class UtilDemo extends Fuffle.ComponentBase {

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

  $input = null
  value = 'Observer Demo:'

  bake() {
    this.$input = this.$.query('input')
      .on('keyup', e => {this.value = e.target.value})

    this.$.query('.code')
      .withText(ObserverDemo.toString())
  }

  render() {
    this.$.query('[data-key=output]')
      .withText(this.value)

    this.$input.withValue(this.value)
  }

}
ObserverDemo.defineElement('demo-observer')

class ConditionalDemo extends Fuffle.Component {

  static template = document.getElementById('demo-conditional-template')

  bake() {
    const $output = this.$.query('fuffle-if')

    this.$.query('button')
      .on('click', () => {$output.component.toggle()})

    this.$.query('.code')
      .withText(ConditionalDemo.toString())
  }

}
ConditionalDemo.defineElement('demo-conditional')
