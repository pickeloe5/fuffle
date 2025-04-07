const {$} = Fuffle

const stateWrapper = Fuffle.state([{name: 'a1'}, {name: 'b1'}])
document.body.append(
    stateWrapper.map((itemWrapper) => {
        const node = document.createTextNode('')
        itemWrapper.read('name', name => {
            node.nodeValue = name
        })
        return [node, document.createElement('br')]
    }),
    $.element('button').text('Click here').on('click', () => {
        const index = Math.floor(Math.random() * stateWrapper.length)
        const value = String(Math.trunc(Math.random() * 10000))
        stateWrapper.getChild(index).update('name', value)
        // stateWrapper.update((state: State) => {
        //     state[index].name = value
        // })
        stateWrapper.push({name: Math.trunc(Math.random() * 10000)})
    }).node
)
console.log(stateWrapper.bindings.map(binding => binding.dependencies))