import './jquery.js'
import {Component} from '/js/fuffle/index.js'

; (class extends Component {

  constructor(element) {
    super(element)

    $(element)
      .text('Goodbye, world.')

  }
}).defineElement('sample-javascript-jquery')
