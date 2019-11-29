import xmlEscape from 'xml-escape'
import merge from 'merge'
import styleAttr from 'style-attr'
import classnames from 'classnames'

export default function (data, opts) {
  const {
    attrs = [],
    pathExp,
    range,
    xmlId,
  } = data

  const {
    metadata,
  } = opts


  const map = {}

  attrs.forEach(attr => {
    for (let key in attr) {
      if (/^(style|class)$/.test(key)) {
        map[key] = merge(true, map[key], attr[key])
      } else {
        map[key] = attr[key]
      }
    }
  })

  const list = []

  for(let key in map) {
    let value = map[key]
    switch (key) {
      case 'style':
        value = styleAttr.stringify(value)
        break
      case 'class':
        value = classnames(value)
        break
    }

    list.push(`${key}="${xmlEscape('' + value)}"`)
  }

  if (pathExp !== false) {
    list.push(`data-pathexp="${xmlEscape(pathExp)}"`)
  }
  if (range) {
    list.push(`data-range="${xmlEscape(JSON.stringify(range))}"`)
  }
  if (xmlId) {
    list.push(`data-xmlid="${xmlEscape(xmlId)}"`)
  }

  return list.join(' ')
}
