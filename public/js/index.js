import {Component, Template} from '/js/fuffle/index.js'

class FuffleDemo extends Component {

  static template = Template.fromNode(
    document.getElementById('demo-template'))

  array = [{string: 'a'}]
  editing = null

  create() {
    this.editing = {string: 'a'}
  }

  change(e) {
    this.editing.string = e.target.value
  }

  save() {
    if (!this.array.includes(this.editing))
      this.array.push(this.editing)
    this.editing = null
  }

  edit(item) {
    return () => {this.editing = item}
  }
}

const FuffleDemoElement = FuffleDemo.defineElement('fuffle-demo')
