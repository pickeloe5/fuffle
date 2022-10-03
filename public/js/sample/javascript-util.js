import {$, Component} from '/js/fuffle/index.js'

; (class extends Component {

  constructor(element) {
    super(element)

    $(element)
      .withText('Goodbye, world.')

  }
}).defineElement('sample-javascript-util')
