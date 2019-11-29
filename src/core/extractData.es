import lang from 'lodash/lang'

import comparePathExp from './comparePathExp'
import {
  GREATER_THAN,
  LESS_THAN,
  EQUAL,
  NOT_EQUAL,
} from './enum/compareValues'

export default function extractData (data, opts) {
  if (!opts.metadata) {
    opts = {
      ...opts,
      metadata: data,
    }
  }

  const {
    pathExp,
  } = data

  const {
    metadata,
    start = {pathExp: '$'},
    end = {pathExp: '$'},
  } = opts

  if (comparePathExp(pathExp, start.pathExp) == LESS_THAN
    || comparePathExp(pathExp, end.pathExp) == GREATER_THAN) {
    return
  }

  const {
    children,
    ...others,
  } = data

  const target = {
    ...others,
  }

  if (children) {
    target.children = []

    children.forEach((child, i) => {
      if (lang.isString(child)) {
        let index, offset
        if (comparePathExp(pathExp, end.pathExp) == EQUAL) {
          index = end.index || 0
          offset = end.offset
          target.pathExp = false
        } else if (comparePathExp(pathExp, start.pathExp) == EQUAL) {
          index = start.index || 0
          offset = start.offset
          target.pathExp = false
        }

        if (!target.pathExp) {
          target.range = {
            start: {
              pathExp: others.pathExp,
              index,
            },
            end: {
              pathExp: others.pathExp,
              index,
              offset,
            }
          }
          child = child.substr(index, offset)
        }

        target.children.push(child)
      } else {
        let item = extractData(child, {
          ...opts,
        })
        if (item) {
          target.children.push(item)
          if (item.range) {
            target.pathExp = false

            if (!target.range) {
              target.range = {}
            }

            if (!target.range.start) {
              const firstChild = target.children[0]
              target.range.start = firstChild.range ? firstChild.range.start : {
                pathExp: firstChild.pathExp,
              }
            }
            
            target.range.end = item.range.end
          }
        }
      }
    })
  }
  return target
}
