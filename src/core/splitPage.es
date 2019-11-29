import jsonpath from 'jsonpath'
import lang from 'lodash/lang'

import {
  HTML_TAG,
  LINE_BREAK,
  ENTIRE_IMAGE,
  PAGE_NUMBER,
} from './enum/metaTypes'
import emptyTags from './conf/emptyTags'
import serialize from './serialize'
import extractData from './extractData'
import initSchema from './initSchema'

export default async function splitPage (node, opts) {
  opts.schema = initSchema(opts.schema)

  const {
    maxWidth,
    maxHeight,
    metadata,
    schema: {
      writingMode,
    },
  } = opts

  const pages = []

  const rows = getRows(node)
  const pathExps = []
  const vertical = /^v/i.test(writingMode)
  const maxDistance = vertical ? maxWidth : maxHeight
  const clientWidthOrHeight = vertical ? 'clientWidth' : 'clientHeight'

  let index = 0, length = rows.length
  let distance = 0
  let item = null

  while(index < length) {
    let row = rows[index]
    let pathExp = row.getAttribute('data-pathexp')
    pathExps[index] = pathExp

    if (!item || !item.start) {
      item = {
        start: {
          pathExp,
        }
      }
    }

    let sideLength = row[clientWidthOrHeight]

    if (distance + sideLength > maxDistance) {
      distance = maxDistance - distance

      let position = await computePosition(row, {
        ...opts,
        isOverflow: () => row[clientWidthOrHeight] > distance,
        start: item.start,
      })

      distance = 0

      if (!position) {
        if (emptyTags.indexOf(row.tagName.toLowerCase()) != -1) {
          position = {
            pathExp,
          }
        } else if (index > 0) {
          position = {
            pathExp: pathExps[index-1]
          }
        }
      }

      if (position) {
        item.end = position
        pages.push(item)
        item = position.offset > 0 ? {
          start: {
            pathExp: position.pathExp,
            index: position.index + position.offset,
          }
        } : null
        let data = jsonpath.value(metadata, pathExp)
        let residualData = extractData(data, {
          ...opts,
          start: item ? item.start : undefined,
        })

        if (residualData.children) {
          row.innerHTML = serialize({
            type: HTML_TAG,
            tag: 'div',
            children: residualData.children,
            pathExp: false,
          }, {
            ...opts,
            metadata,
          })
        } else {
          index++
        }
      } else {
        item.end = {
          pathExp,
        }
        pages.push(item)
        item = null
        index++
      }

      continue
    } else if (index + 1 === length) {
      item.end = {
        pathExp,
      }
      pages.push(item)
      node.parentNode.innerHTML = ''
    } else {
      distance += sideLength
      // row.style.color = '#ddd'
      // row.style.display = 'none'
    }
    index++
  }

  // console.info(pages)
  return pages
}

function getRows (node) {
  let list = []
  let length = node.children ? node.children.length : 0
  for(let i=0; i<length; i++) {
    let child = node.children[i]
    let role = child.getAttribute('data-role')
    if (/^(cover|para|heading)$/.test(role)) {
      list.push(child)
    } else {
      let rows = getRows(child)
      if (rows.length) {
        list = list.concat(rows)
      }
    }
  }
  return list
}

async function computePosition (node, opts) {
  if (!node) {
    return
  }

  const {
    metadata,
    isOverflow,
    start = {},
  } = opts

  const pathExp = node.getAttribute('data-pathexp')
  const data = jsonpath.value(metadata, pathExp)

  if (isTextData(data)) {
    let text = data.children[0]
    let index = 0
    if (start.pathExp === pathExp) {
      index = (start.index || 0) + (start.offset || 0)
      text = text.substr(index)
    }
    const offset = await computeTextOffset(node, text, opts)
    if (offset > 0) {
      return {
        pathExp,
        index,
        offset,
      }
    } else if (offset === 0) {
      return
    } else {
      throw new Error(`${pathExp} 处文字未溢出！`)
    }
  } else if (/^(div|span)$/.test(data.tag)) {
    const {
      children = [],
    } = extractData(data, {
      ...opts,
      start,
    })

    for (let i=0, {length}=children; i<length; i++) {
      node.innerHTML = serialize({
        type: HTML_TAG,
        tag: 'div',
        children: children.slice(0, i+1),
        pathExp: false,
      }, {
        ...opts,
        metadata,
      })

      if (isOverflow()) {
        let container = node.querySelector(`*[data-pathexp="${children[i].pathExp}"]`)
        let position = await computePosition(container, opts)
        if (!position && i > 0) {
          position = {
            pathExp: children[i-1].pathExp,
          }
        }
        return position
      }
    }

    throw new Error(`${pathExp} 容器未溢出！`)
  }
}

async function computeTextOffset (span, text, opts) {
  let maxLength = text.length
  let length = maxLength
  let index = Math.floor(length/2)
  let cache = {}

  while (true) {
    span.innerHTML = text.substr(0, index)
    await delay()

    cache[index] = opts.isOverflow()

    if (cache[index] === false && index + 1 <= maxLength) {
      if (!lang.isBoolean(cache[index+1])) {
        span.innerHTML = text.substr(0, index+1)
        cache[index+1] = opts.isOverflow()
      }
      if (cache[index+1] === true) {
        break
      }
    }

    if (index === 0) {
      break
    } else if (index + 1 > maxLength) {
      index = -1
      break
    }

    if (cache[index]) {
      length = index
      index = Math.floor(index / 2)
    } else {
      index = index + Math.floor((length - index) / 2)
    }
  }

  return index
}

function isTextData(data) {
  if (data.tag === 'span') {
    if(data.children && lang.isString(data.children[0])) {
      return true
    }
  }
  return false
}

function delay() {
  return new Promise(resolve => setTimeout(resolve, 0))
}
