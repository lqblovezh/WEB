import lang from 'lodash/lang'

import {
  HTML_TAG,
  LINE_BREAK,
  ENTIRE_IMAGE,
  PAGE_NUMBER,
} from './enum/metaTypes'
import {
  NON_INTERSECTING,
  INTERSECTING,
  GREATER_THAN,
  LESS_THAN,
  EQUAL,
} from './enum/compareValues'
import emptyTags from './conf/emptyTags'
import compareTextRange from './compareTextRange'
import comparePathExp from './comparePathExp'

export default function (data, opts = {}) {
  if (opts.start && opts.end) {
    return restructureByRange(data, opts)
  } else if (opts.keyword) {
    return restructureByKeyword(data, opts)
  }
  return data
}

function restructureByKeyword (data, opts = {}) {
  const {
    keyword,
  } = opts

  const startIndex = (data.text || '').indexOf(keyword)
  if (startIndex >= 0) {

    const newData = {
      ...data,
      children: [],
    }

    let index = 0, newChild = null

    let tempIndex = startIndex
    let tempOffset = keyword.length

    if (data.contentType === 'text') {
      let result = splitText(data, tempIndex, tempOffset, opts)
      delete newData.contentType
      newData.pathExp = false
      newData.range = {
        start: {pathExp: data.pathExp},
        end: {pathExp: data.pathExp},
      }
      newData.children = result.children
    } else {
      for (let i = 0, {length} = data.children; i < length; i++) {
        let child = data.children[i]
        if (child.text) {
          index += child.text.length
        }
        if (index < startIndex || tempOffset <= 0) {
          if (child.text && tempIndex > 0) {
            tempIndex -= child.text.length
          }
          newData.children.push(child)
        } else if (child.type === HTML_TAG) {
          if (!newChild) {
            newChild = {
              type: HTML_TAG,
              tag: 'span',
              pathExp: false,
              text: '',
              range: {
                start: {},
                end: {},
              },
              children: [],
            }
          }
          if (!newChild.range.start.pathExp) {
            newChild.range.start.pathExp = child.pathExp
            newData.children.push(newChild)
          }
          newChild.range.end.pathExp = child.pathExp
          newChild.text += child.text
          let result = splitData(child, tempIndex, tempOffset, opts)
          newChild.children = newChild.children.concat(result.children)
          tempIndex = 0
          tempOffset -= result.textLength
        } else {
          newChild = null
          newData.children.push(child)
        }
      }
    }
    console.warn(newData.children);
    return newData
  }
  return data
}

function restructureByRange (data, opts = {}) {
  if (data.type !== HTML_TAG) {
    return data
  }

  const {
    pathExp,
  } = data

  if (!pathExp) {
    return data
  }

  const {
    start,
    end,
  } = opts

  if (comparePathExp(pathExp, end.pathExp) === EQUAL) {
    const {
      children,
    } = splitData(data, end.index, end.offset, opts)
    return {
      ...data,
      children,
    }
  } else if (comparePathExp(pathExp, start.pathExp) === EQUAL) {
    const {
      children,
    } = splitData(data, start.index, start.offset, opts)
    return {
      ...data,
      children,
    }
  } else if (comparePathExp(pathExp, start.pathExp, true) == GREATER_THAN
    && comparePathExp(pathExp, end.pathExp, true) == LESS_THAN) {

    if (emptyTags.indexOf(data.tag) !== -1) {
      if (opts.attrs) {
        data.attrs = (data.attrs || []).concat(opts.attrs)
      }
      return data
    }

    let children = []

    if (data.contentType === 'text') {
      children = children.concat(splitText(data, 0, null, opts).children)
    } else {
      data.children.forEach(child => {
        children.push(restructureByRange(child, opts))
      })
    }

    return {
      ...data,
      children,
    }
  }
  return data
}

function splitData (data, index, offset, opts) {
  if (lang.isNil(index)) {
    index = 0
  }
  if (data.contentType === 'text') {
    return splitText(data, index, offset, opts)
  }

  if (lang.isNil(offset)) {
    const maxOffset = (data.text || '').length - index
    if (offset > maxOffset) {
      offset = maxOffset
    }
  }

  let children = [], textLength = 0

  for(let i = 0, {length} = data.children; i < length; i++) {
    let child = data.children[i]
    if (child.type === HTML_TAG && offset > 0) {
      let result = splitData(child, index, offset, opts)
      children = children.concat(result.children)
      index = 0
      offset -= result.textLength
      textLength += result.textLength
    } else {
      children.push(child)
    }
  }

  return {
    children,
    textLength
  }
}

function splitText(data, index, offset, opts = {}) {
  const {
    pathExp,
    text: originText,
  } = data
  const {
    attrs = [],
  } = opts

  const maxOffset = originText.length - index

  if (lang.isNil(offset) || offset > maxOffset) {
    offset = maxOffset
  }

  const children = []
  let text, textLength = 0
  if (index > 0) {
    text = originText.substr(0, index)
    children.push({
      type: HTML_TAG,
      tag: 'span',
      children: [text],
      pathExp: false,
      text,
      range: {
        start: { pathExp, index: 0},
        end: { pathExp, index: 0, offset: index},
      }
    })
  }

  text = originText.substr(index, offset)
  textLength = text.length
  children.push({
    type: HTML_TAG,
    tag: 'span',
    children: [text],
    pathExp: false,
    attrs,
    text,
    range: {
      start: { pathExp, index },
      end: { pathExp, index, offset},
    }
  })

  if (maxOffset > offset) {
    index += offset
    text = originText.substr(index)
    children.push({
      type: HTML_TAG,
      tag: 'span',
      children: [text],
      pathExp: false,
      text,
      range: {
        start: { pathExp, index},
        end: { pathExp, index, offset: maxOffset - offset},
      }
    })
  }

  return {
    children,
    textLength,
  }
}
