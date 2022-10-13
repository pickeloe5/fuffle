import {Observer, Binding, BindingBase} from './fuffle.js'

export function testBasicBinding() {
  const propertyName = 'property'
  const propertyValueBefore = 'string'
  const propertyValueAfter = 'stringstring'
  const observer = new Observer({[propertyName]: propertyValueBefore})

  let bindingRun = false, bindingRerun = false
  new BindingBase(observer)
    .withRun(function() {
      return this[propertyName]
    })
    .withOnRun(value => {
      if (!bindingRun && !bindingRerun) {

        if (value !== propertyValueBefore)
          throw new Error(`Expected first run to evaluate to initial value`)

        bindingRun = true
      } else if (bindingRun && !bindingRerun) {

        if (value !== propertyValueAfter)
          throw new Error(`Expected second run to evaluate to updated value`)

        bindingRerun = true
      } else {
        throw new Error(`Expected binding to be run only twice`)
      }
    }).start()
  observer.proxy[propertyName] = propertyValueAfter
  if (!bindingRun || !bindingRerun)
    throw new Error(`Expected binding to be run twice`)
}

export function testJsBinding() {

  const properties = {
    names: ['a', 'b', 'c'],
    values: {
      before: ['a', 'c'],
      after: ['aa', 'cc']
    }
  }
  const observer = new Observer({
    [properties.names[0]]: properties.values.before[0],
    [properties.names[1]]: {[properties.names[2]]: properties.values.before[1]}
  })

  let bindingRun = 0
  new Binding(
      `this.${
        properties.names[0]
      } + this.${
        properties.names[1]
      }.${
        properties.names[2]
      }`).withOnRun(value => {
    if (bindingRun === 0) {

      if (value !== properties.values.before[0] + properties.values.before[1])
        throw new Error(`Expected first run to be on initial values`)

      bindingRun++
    } else if (bindingRun === 1) {

      if (value !== properties.values.after[0] + properties.values.before[1])
        throw new Error(`Expected second run to have first property updated`)

      bindingRun++
    } else if (bindingRun === 2) {

      if (value !== properties.values.after[0] + properties.values.after[1])
        throw new Error(`Expected third run to have both properties updated`)

      bindingRun++
    } else {
      throw new Error(`Expected binding to only be run three times`)
    }
  }).start(observer)
  observer.proxy[properties.names[0]] = properties.values.after[0]
  observer.proxy
    [properties.names[1]]
      [properties.names[2]] =
        properties.values.after[1]
  if (bindingRun !== 3)
    throw new Error(`Expected binding to be run three times`)
}

export default function testBinding() {
  testBasicBinding()
  testJsBinding()
}
