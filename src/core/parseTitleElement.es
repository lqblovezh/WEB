import {
  HTML_TAG,
  LINE_BREAK,
  ENTIRE_IMAGE,
  PAGE_NUMBER,
} from './enum/metaTypes'
import parseAttrs from './parseAttrs'
import parseChildren from './parseChildren'

export default function (data, opts) {
  const {_attributes={}, _elements=[], _text} = data
  const {
    annotations,
  } = _attributes
  const {
    path,
  } = opts

  let level = Math.floor((path.length - 3) / 2)
  if (level > 6) {
    level = 6
  }

  let tag = 'div'

  const attrs = [{
    'data-role': 'heading',
    'class': {
      ['reader__h' + level]: true,
    },
    style: {
      'font-weight': 'bold'
    }
  }]

  return {
    type: HTML_TAG,
    tag,
    attrs: parseAttrs(data, opts).concat(attrs),
    children: parseChildren(data, opts),
  }
}
