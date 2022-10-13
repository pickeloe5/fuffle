import {Template, Observer, Component, ComponentElement} from './fuffle.js'

export function testBasicTemplate() {

  const style = 'color:red;', text = 'string'
  let eventHandled = false
  const observer = new Observer({style, text, onEvent() {
    if (eventHandled)
      throw new Error(`Expected event to be handled once`)
    eventHandled = true
  }})

  new Template(
      [...document.getElementById('test-template-1').content.childNodes])
    .bake()
    .withParent(document.body)
    .start(observer)

  const span = document.querySelectorAll('[data-test-1]')
  if (span.length !== 1)
    throw new Error(`Expected template to append single span`)
  if (span[0].getAttribute('style') !== style)
    throw new Error(`Expected template to bind attribute properly`)
  if (span[0].textContent !== text)
    throw new Error(`Expected template to bind text properly`)

  span[0].dispatchEvent(new Event('test-1'))
  if (!eventHandled)
    throw new Error(`Expected event to be handled`)
}

class TestBuiltinsComponent extends Component {
  static template = Template.fromNode(
    document.getElementById('test-template-2'))
  condition = true
  array = [{id: 'a', text: 'a'}, {id: 'b', text: 'b'}]
}

const defer = () => new Promise(_ => {setTimeout(_, 0)})

export async function testBuiltinsTemplate() {

  TestBuiltinsComponent.defineElement('test-element-2')
  await defer() // test component has nested components
  await defer() // we defer once for parent and once for children

  const element = document.querySelector('test-element-2')
  const component = ComponentElement.getObserver(element).proxy

  const ifChild = element
    .querySelector('fuffle-if').shadowRoot
    .querySelectorAll('[data-test-2-1]')
  if (ifChild.length !== 1)
    throw new Error(`Expected if child to initially be rendered`)
  component.condition = false
  if (ifChild[0].isConnected)
    throw new Error(`Expected if child to be removed when condition changes`)

  const forParent = element.querySelector('fuffle-for').shadowRoot
  const forChildren = forParent.querySelectorAll('[data-test-2-2]')
  if (forChildren.length !== component.array.length)
    throw new Error(`Expected one child of fuffle-for each item in array`)
  for (const it of component.array)
    if (forParent.querySelector(`[data-test-2-2='${it.id}']`)
      .textContent !== it.text)
        throw new Error(`Expected children of fuffle-for to have proper text`)


}

export default async function testTemplate() {
  testBasicTemplate()
  await testBuiltinsTemplate()
}
