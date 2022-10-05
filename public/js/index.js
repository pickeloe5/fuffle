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

  bake() {
    const forLoop = this.$.query('fuffle-for').component
    forLoop.value.push(null)

    this.$.query('[data-key=push]').on('click', () => {
      forLoop.value.push(null)
    })
    this.$.query('[data-key=pop]').on('click', () => {
      forLoop.value.pop()
    })
    this.$.query('[data-key=update]')?.on('click', () => {

    })

    this.$.query('.code').withText(IterativeDemo.toString())
  }

}
IterativeDemo.defineElement('demo-iterative')
