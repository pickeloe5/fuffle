const $ = Fuffle.NodeWrapper

addEventListener('load', () => {
    const stateWrapper = new Fuffle.StateWrapper({text: 'Heyo!'})
    const stateProxy = stateWrapper.proxy
    $.body().add(
        $.text(stateProxy.text),
        $.element('button').text('Click here').on('click', () => {
            stateProxy.text = 'What the fuck?'
        })
    )

    const state = new Fuffle.StateWrapper({
        a: 'a1',
        // b: {c: 'c1'},
        // d: [{e: 'e1'}]
    }).proxy
    $.body().add(
        $.text(state.a),
        // $.text(state.b.c),
        // $.text(state().get(value => value.a + value.b.c)),
        // $.text(state().get(value => value.a)),
        // Need map
        // $.map(state.d, d => $.text(d.e)),
        // $.map(state.d, d => $.text(d().get(value => value.e)))
    )
})