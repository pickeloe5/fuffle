addEventListener('load', () => {
    const stateWrapper = new Fuffle.StateWrapper({text: 'Heyo!'})
    const text = Fuffle.NodeWrapper.text()
    text.bind(stateWrapper.get(state => state.text))
    document.body.appendChild(text.node)

    const button = document.createElement('button')
    button.textContent = 'Click here'
    button.addEventListener('click', () => {
        stateWrapper.set({text: 'What the fuck?'})
    })
    document.body.appendChild(button)
})