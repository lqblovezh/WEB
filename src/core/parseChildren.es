import parseElement from './parseElement'

export default function (data, opts = {}) {
  const {
    ignoreChildren,
    path,
  } = opts

  if (ignoreChildren === true) {
    return
  }

  let children = []

  if (data._elements) {
    data._elements.forEach((item, i) => {
      const newPath = path.concat(['children', children.length])
      const child = parseElement(item, {
        ...opts,
        path: newPath,
      })
      if (child) {
        children.push(child)
      }
    })

  } else if (data._text) {
    children.push(data._text)
  }

  return children
}
