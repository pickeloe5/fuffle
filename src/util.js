export const pathEquals = pathA => pathB => {
  if (pathB.length !== pathA.length)
    return false

  for (let i in pathA)
    if (pathB[i] !== pathA[i])
      return false

  return true
}

export const EventName = {ATTRIBUTE_CHANGED: 'fuffle-attribute-changed'}
