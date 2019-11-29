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
    bisatomic,
  } = _attributes

  let tag = 'div'
  let attrs = [{
    'data-role': 'para',
  }]
  let children = parseChildren(data, opts)

  if (children.length === 0) {
    children = ['&nbsp;']
  }
  return {
    type: HTML_TAG,
    tag,
    attrs: parseAttrs(data, opts).concat(attrs),
    children,
  }
}
