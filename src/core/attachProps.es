import jsonpath from 'jsonpath'
import lang from 'lodash/lang'

import {
  HTML_TAG,
  LINE_BREAK,
  ENTIRE_IMAGE,
  PAGE_NUMBER,
} from './enum/metaTypes'

export default function (metadata, data, opts) {
  const {_attributes = {}, _text} = data

  const {
    locals,
  } = opts

  metadata.path = opts.path
  metadata.pathExp = jsonpath.stringify(metadata.path)

  if (_attributes['xml:id']) {
    metadata.xmlId = _attributes['xml:id']
  }

  if (metadata.type === ENTIRE_IMAGE) {
    locals.comparisons.push(metadata)
    if (appendTo(locals.lastElement, metadata)) {
      return
    }
  }

  if (metadata.type === HTML_TAG) {
    if (_text) {
      metadata.text = _text
    }
    locals.lastElement = metadata
  }
}

function appendTo (target, data) {
  if (target.children) {
    const length = target.children.length
    const lastChild = target.children[length - 1]
    if (lang.isString(lastChild)) {
      return false
    }

    if (appendTo(lastChild, data) === false) {
      data.path = target.path.concat(['children', length])
      data.pathExp = jsonpath.stringify(data.path)
      target.children.push(data)
      return true
    }
  }
  return false
}
