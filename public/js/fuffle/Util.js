export const cloneTemplate = template =>
  [...template.content.cloneNode(true).childNodes]

export const appendTemplate = (parent, template) => {
  for (const child of cloneTemplate(template))
    parent.appendChild(child)
}

// There's utility in a function that fulfills interpolation in templates
// E.g. <span>${this.value}</span> wraps `this.value` in an Observer#read
// E.g. <button onclick='${this.onClickButton}'> wraps onclick in Observer#write
