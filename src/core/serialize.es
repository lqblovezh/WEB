import xss from 'xss'
import lang from 'lodash/lang'

import {
  HTML_TAG,
  LINE_BREAK,
  INLINE_BREAK,
  PARTIAL_IMAGE,
  PAGE_NUMBER,
} from './enum/metaTypes'
import validTags from './conf/validTags'
import emptyTags from './conf/emptyTags'
import initSchema from './initSchema'
import serializeAttrs from './serializeAttrs'
import serializeChildren from './serializeChildren'

export default function serialize (data, opts = {}) {
  if (!data) {
    return ''
  }

  if (lang.isString(data)) {
    return data
  }

  opts.schema = initSchema(opts.schema)

  if (!opts.metadata) {
    data = lang.cloneDeep(data)
    opts = {
      ...opts,
      metadata: data,
    }
  }


  let {
    content,
    text,
    schema,
  } = opts

  const {
    type,
    tag,
    path,
    pathExp,
  } = data

  const {
    lineBreakEnabled,
    writingMode,
  } = schema

  switch(type) {
    case PARTIAL_IMAGE:
      if (writingMode === 'vrl' && lineBreakEnabled) {        
        return serialize({
          type: HTML_TAG,
          tag: 'button',
          attrs: [{
            'class': {
              'reader__comparisonBtn': true,
            }
          }],
          path,
          pathExp,
        }, {
          ...opts,
          content: '',
        })
      }
    case INLINE_BREAK:
      if (lineBreakEnabled) {
        return serialize({
          type: HTML_TAG,
          tag: 'br',
          pathExp,
        }, opts)
      }
    default:
      if (validTags.indexOf(tag) === -1) {
        return ''
      }
  }

  if (emptyTags.indexOf(tag) > -1) {
    return `<${tag} ${serializeAttrs(data, opts)} />`
  } else {
    if (text) {
      content = xss(text)
    } else {
      content = content || serializeChildren(data, opts)
    }
    return `<${tag} ${serializeAttrs(data, opts)}>${content}</${tag}>`
  }
}
