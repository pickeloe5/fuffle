import {Component} from '/js/fuffle/index.js'

; (class extends Component {

  constructor(element) {
    super(element)

    element.textContent = 'Goodbye, world.'

  }
}).defineElement('demo-javascript')
