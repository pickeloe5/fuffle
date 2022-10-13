import testObserver from './observer.js'
import testBinding from './binding.js'
import testTemplate from './template.js'

; (async function() {
  testObserver()
  testBinding()
  await testTemplate()
})()
