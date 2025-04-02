import Fuffle from '/script/Fuffle.js'
const {$} = Fuffle

addEventListener('load', () => {
    const [readState, updateState] = Fuffle.state({
        text: 25,
        // items: [
        //     {name: 'a', counter: 24},
        //     {name: 'b', counter: 25}
        // ]
    })
    new $(document.body).add(
        Fuffle.text(readState.text),
        $.element('button').text('Click here').on('click', () => {
            Fuffle.update(state.text, )
        })
    )
    document.body.appendChild(Fuffle.text(state.text))
    // Fuffle.array(state.items)
    //     .map(item => Fuffle.text(item.name))
    //     .join(document.body)
})