export const pathEquals = pathA => pathB => {
  if (pathB.length !== pathA.length)
    return false

  for (let i in pathA)
    if (pathB[i] !== pathA[i])
      return false

  return true
}

export const provideObserver = (node, observer) => {
  node.fuffle = {...node.fuffle, observer}
}

export const consumeObserver = node => new Promise((resolve, reject) => {
  setTimeout(() => {
    while (node = node?.parentNode)
      if (node.fuffle?.observer)
        resolve(node.fuffle.observer)
    reject(new Error('No context found'))
  }, 0)
})
