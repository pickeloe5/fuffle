import {Observer, util} from './fuffle.js'


export function testBasicObserver() {

  const propertyName = 'property'
  const propertyValue = 'value'
  const observer = new Observer({[propertyName]: propertyValue + propertyValue})

  let writeEventFired = false
  observer.addEventListener('write', ({propertyPath}) => {

    if (writeEventFired || !util.pathEquals([propertyName])(propertyPath))
      throw new Error(`Expected single write event for: ${propertyName}`)

    writeEventFired = true
  })
  observer.proxy[propertyName] = propertyValue
  if (!writeEventFired)
    throw new Error(`Expected a write event to be fired`)

  const stopTrackingReads = observer.trackReads()
  if (observer.proxy[propertyName] !== propertyValue)
    throw new Error(`Expected property value to be maintained through proxy`)
  const reads = stopTrackingReads()

  if (reads.length !== 1 || !util.pathEquals([propertyName])(reads[0]))
    throw new Error(`Expected single property to be read: ${propertyName}`)

}

export function testArrayObserver() {

  const value = 'string'
  const observer = new Observer([value])

  let writeIndexEventFired = false, writeLengthEventFired = false
  observer.addEventListener('write', ({propertyPath}) => {
    if (!writeIndexEventFired) {

      if (!util.pathEquals(['1'])(propertyPath))
        throw new Error(`Expected to write index first`)

      writeIndexEventFired = true

    } else if (!writeLengthEventFired) {

      if (!util.pathEquals(['length'])(propertyPath))
        throw new Error(`Expected to write length first`)

      writeLengthEventFired = true

    } else {
      throw new Error(`Expected to only write index and length`)
    }
  })
  observer.proxy.push(value)
  if (!writeIndexEventFired || !writeLengthEventFired)
    throw new Error(`Expected writes to both index and length`)

  const stopTrackingReads = observer.trackReads()
  if (observer.proxy[1] !== value)
    throw new Error(`Expected index value to be maintained through proxy`)
  const reads = stopTrackingReads()

  if (reads.length !== 1 || !util.pathEquals(['1'])(reads[0]))
    throw new Error(`Expected single index to be read`)

}

export function testDeepObserver() {

  const propertyNameA = 'a'
  const propertyNameB = 'b'
  const propertyNameC = 'c'
  const propertyValue = 'string'
  const observer = new Observer(
    {[propertyNameA]:
      {[propertyNameB]:
        {[propertyNameC]:
          propertyValue + propertyValue}}})

  let writeEventAFired = false,
    writeEventBFired = false,
    writeEventCFired = false

  observer.addEventListener(
      'write', ({propertyPath}) => {
    if (!writeEventAFired && writeEventBFired && writeEventCFired) {

      if (!util.pathEquals(
        [propertyNameA, propertyNameB, propertyNameC]
      )(propertyPath))
        throw new Error(`Expected to write property name: ${propertyNameA}`)

      writeEventAFired = true

    } else {
      throw new Error(`Expected only one write to property: ${propertyNameA}`)
    }
  })
  observer.proxy[propertyNameA].observer.addEventListener(
      'write', ({propertyPath}) => {
    if (!writeEventAFired && !writeEventBFired && writeEventCFired) {

      if (!util.pathEquals([propertyNameB, propertyNameC])(propertyPath))
        throw new Error(`Expected to write property name: ${propertyNameB}`)

      writeEventBFired = true

    } else {
      throw new Error(`Expected only one write to property: ${propertyNameB}`)
    }
  })
  observer.proxy[propertyNameA][propertyNameB].observer.addEventListener(
      'write', ({propertyPath}) => {
    if (!writeEventAFired && !writeEventBFired && !writeEventCFired) {

      if (!util.pathEquals([propertyNameC])(propertyPath))
        throw new Error(`Expected to write property name: ${propertyNameC}`)

      writeEventCFired = true

    } else {
      throw new Error(`Expected only one write to property: ${propertyNameC}`)
    }
  })
  observer.proxy[propertyNameA][propertyNameB][propertyNameC] = propertyValue
  if (!writeEventAFired || !writeEventBFired || !writeEventCFired)
    throw new Error(`Expected one write event for each nested object`)

  const stopTrackingReads = observer.trackReads()

  if (observer.proxy
    [propertyNameA][propertyNameB][propertyNameC]
  !== propertyValue)
    throw new Error(`Expected property value to be maintained through proxy`)

  const reads = stopTrackingReads()

  if (reads.length !== 3)
    throw new Error(`Expected three reads to be tracked`)
  if (!util.pathEquals([propertyNameA])(reads[0]))
    throw new Error(`Expected to read property A first`)
  if (!util.pathEquals([propertyNameA, propertyNameB])(reads[1]))
    throw new Error(`Expected to read property B first`)
  if (!util.pathEquals([propertyNameA, propertyNameB, propertyNameC])(reads[2]))
    throw new Error(`Expected to read property C first`)

}

export default function testObserver() {
  testBasicObserver()
  testArrayObserver()
  testDeepObserver()
}
