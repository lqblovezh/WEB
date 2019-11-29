export default function (data, opts) {
  const {
    ignoreAttrs,
  } = opts

  if (ignoreAttrs === true) {
    return
  }

  const {
    colspan,
    rowspan,
    role,
    ...others,
  } = data._attributes || {}

  const attrs = []

  if (colspan > 1) {
    attrs.push({
      colspan,
    })
  }
  if (rowspan > 1) {
    attrs.push({
      rowspan,
    })
  }

  if (role) {
    const align = role.match(/\balign\_\w+\b/)
    if (align) {
      attrs.push({
        'class': {
          ['reader__'+align[0]]: true
        }
      })
    }
  }

  return attrs
}
