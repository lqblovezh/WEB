import parseAttrs from './parseAttrs'
import parseChildren from './parseChildren'
import {
  HTML_TAG,
  LINE_BREAK,
  INLINE_BREAK,
  ENTIRE_IMAGE,
  PAGE_NUMBER,
} from './enum/metaTypes'

export default function (data, opts) {

  const {[0]: emphasis} = data.emphasis || [data]
  const {_attributes={}, _elements=[], _text} = emphasis
  const {
    annotations,
    role,
  } = _attributes

  let tag = 'span', attrs = []

  switch(role) {
    case 'comment1':
    case 'comment2':
      attrs.push({
        'class': {
          ['reader__'+ role]: true,
        }
      })
      break
    case 'comment_r':
      return {
        type: INLINE_BREAK,
      }
    case 'page_num':
      return {
        type: PAGE_NUMBER,
        value: _text.replace('page=', ''),
      }
    case 'return':
      if (isLineBreak(_text, _elements[0])) {
        return {
          type: LINE_BREAK,
        }
      }
      break
  }

  const children = parseChildren(emphasis, opts)
  if (children.length) {
    return {
      type: HTML_TAG,
      tag,
      attrs: parseAttrs(emphasis, opts).concat(attrs),
      children,
    }
  }
}

function isLineBreak (_text, child = {}) {
  if (_text === 'r') {
    return true
  }

  if (child['#name'] === 'emphasis' && child._text === 'r') {
    return true
  }

  return false
}
