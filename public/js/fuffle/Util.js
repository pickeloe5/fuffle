export const cloneTemplate = template =>
  [...template.content.cloneNode(true).childNodes]

export const appendTemplate = (parent, template) => {
  for (const child of cloneTemplate(template))
    parent.appendChild(child)
}
