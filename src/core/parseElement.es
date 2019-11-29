import jsonpath from 'jsonpath'
import lang from 'lodash/lang'

import {
  HTML_TAG,
  LINE_BREAK,
  ENTIRE_IMAGE,
  PAGE_NUMBER,
} from './enum/metaTypes'
import validTags from './conf/validTags'
import attachProps from './attachProps'
import parseAttrs from './parseAttrs'
import parseChildren from './parseChildren'
import parseChapterElement from './parseChapterElement'
import parseTitleElement from './parseTitleElement'
import parseParaElement from './parseParaElement'
import parseEmphasisElement from './parseEmphasisElement'
import parseImageDataElement from './parseImageDataElement'

export default function (data, opts) {
  if (!opts.path) {
    opts = {
      ...opts,
      path: ['$'],
    }
  }


  data = adjust(data)

  let metadata = null

  let tag = data['#name'], attrs = [], children

  switch(tag) {
    case '__text__':
      metadata = {
        type: HTML_TAG,
        tag: 'span',
        children: [data._text],
        contentType: 'text',
      }
      break
    case 'chapter':
      metadata = parseChapterElement(data, opts)
      break
    case 'book':
    case 'part':
    case 'section':
      tag = 'div'
      break
    case 'title':
      metadata = parseTitleElement(data, opts)
      break
    case 'para':
      metadata = parseParaElement(data, opts)
      break
    case 'emphasis':
      metadata = parseEmphasisElement(data, opts)
      break
    // case 'mediaobject':
    case 'inlinemediaobject':
      metadata = parseImageDataElement(data, opts)
      break
  }

  if (!metadata && validTags.indexOf(tag) > -1) {
    metadata = {
      type: HTML_TAG,
      tag,
      attrs: parseAttrs(data, opts).concat(attrs),
      children: children || parseChildren(data, opts),
    }
  }

  if (metadata) {
    attachProps(metadata, data, opts)
  } else {
    console.warn('未解析的标签', data)
  }

  return metadata
}


function adjust (data) {
  if (!data._elements) {
    return data
  }
  const children = []
  let lastComment = null
  for(let child of data._elements) {
    if (child['#name'] === 'emphasis') {
      let emphasis = (child.emphasis || [])[0]
      if (emphasis) {
        let {role} = emphasis._attributes || {}
        if (role === 'comment2') {
          if (lastComment) {
            lastComment.emphasis[0]._elements.push(emphasis._elements[0])
            lastComment.emphasis[0]._text += emphasis._text
            lastComment = null
          } else {
            lastComment = child
            children.push(lastComment)
          }
          data._text += emphasis._text
          continue
        }
        if (role === 'comment_r') {
          if (lastComment) {
            lastComment.emphasis[0]._elements.push(child)
          }
          continue
        }
      }
    }

    children.push(child)
  }
  data._elements = children
  return data
}
