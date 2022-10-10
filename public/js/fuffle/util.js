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

export const consumeObserver = async node => {
  while (node = node?.parentNode)
    if (node.fuffle?.observer)
      return node.fuffle.observer
  return null
}
