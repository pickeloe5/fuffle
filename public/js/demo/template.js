import {Util, Component} from '/js/fuffle/index.js'

; (class extends Component {

  static template = document.querySelector(
    'template[data-id="demo-template"]')

  constructor(element) {
    super(element)

    Util.appendTemplate(element, this.constructor.template)

  }
}).defineElement('demo-template')
