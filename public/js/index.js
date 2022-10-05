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

  value = 'Observer Demo:'

  onKeyUp(e) {
    this.value = e.target.value
  }

}
ObserverDemo.defineElement('demo-observer')

class ConditionalDemo extends Fuffle.Component {

  static template = document.getElementById('demo-conditional-template')

  value = true

  onClickToggle() {
    this.value = !this.value
  }

}
ConditionalDemo.defineElement('demo-conditional')

class IterativeDemo extends Fuffle.Component {

  static template = document.getElementById('demo-iterative-template')

  value = ['Iterative Demo:']

  onClickPush() {
    this.value.push('Iterative Demo:')
  }

  onClickPop() {
    this.value.pop()
  }

}
IterativeDemo.defineElement('demo-iterative')
