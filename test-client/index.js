const {$} = Fuffle

addEventListener('load', () => {
    const stateWrapper = Fuffle.state({a: {b: 'b1'}})
    new $(document.body).add(
        stateWrapper.text2((state, cursor) =>
            cursor.resolve(state.a.b)
        ),
        $button('Click here', () => {
            stateWrapper.getChild('a').update('b', 'b2')
        })
    )
    /*const stateWrapper = Fuffle.state([{name: 'a1'}, {name: 'b1'}])
    const state = stateWrapper.writeProxy
    new $(document.body).add(
        button('Update', () => {
            const index = Math.floor(Math.random() * stateWrapper.length)
            const value = String(Math.trunc(Math.random() * 10000))
            stateWrapper.getChild(index).update('name', value)
            // stateWrapper.update((state: State) => {
            //     state[index].name = value
            // })
            state[index].name = value
        }),
        button('Push', () => {
            const value = Math.trunc(Math.random() * 10000)
            stateWrapper.push({name: value})
        }),
        button('Pop', () => {
            stateWrapper.pop()
        }),
        $.element('br'),
        stateWrapper.map(item => [
            item.text('name'),
            $.element('br')
        ])
    )*/
})

function $button(text, onClick) {
    return $.element('button').text(text).on('click', onClick)
}