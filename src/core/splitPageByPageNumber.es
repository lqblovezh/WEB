import lang from 'lodash/lang'

import {
  HTML_TAG,
  LINE_BREAK,
  ENTIRE_IMAGE,
  PAGE_NUMBER,
} from './enum/metaTypes'
import extractData from './extractData'

export default function splitPageByPageNumber (data, opts = {}) {
  const {
    pages = [],
    locals = {},
  } = opts

  const {
    pageIndex = 0,
    lastData = data,
  } = locals

  let lastPage = pages[pageIndex]
  if (!lastPage) {
    lastPage = {
      start: {
        pathExp: lastData.pathExp
      },
      end: {
        pathExp: lastData.pathExp
      },
    }
    pages.push(lastPage)
  }

  if (data.type === PAGE_NUMBER) {
    lastPage.end = {
      pathExp: lastData.pathExp
    }
    lastPage.value = lastPage.label = data.value
    locals.pageIndex = pageIndex + 1
    locals.lastData = undefined
  } else {
    if (data.children) {
    for(let i=0; i<data.children.length; i++) {
      let child = data.children[i]
        splitPageByPageNumber(child, {
          ...opts,
          pages,
          locals,
        })
      }
    }
    locals.lastData = data
  }
  return pages.filter(({value}) => !lang.isNil(value))
}
