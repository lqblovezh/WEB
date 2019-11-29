import lang from 'lodash/lang'

import serialize from './serialize'
import restructureData from './restructureData'
import {
  HTML_TAG,
  LINE_BREAK,
  ENTIRE_IMAGE,
  PAGE_NUMBER,
} from './enum/metaTypes'

export default function (data, opts) {
  const {
    pathExp,
    children = [],
  } = data

  const {
    schema: {
      lineBreakEnabled,
    },
    selection,
    labels,
    otherLabel,
    keyword,
    highlightRanges = [],
    keywordDataList,
  } = opts

  let list = [[]]
  let index = 0

  children.forEach((child, i) => {
    if (lineBreakEnabled && child.type === LINE_BREAK) {
      list[++index] = []
    } else {
      if (child.type === HTML_TAG && child.pathExp) {

        if (keywordDataList && keywordDataList.find(data => data.pathExp === child.pathExp)) {
          child = restructureData(child, {
            keyword,
            attrs: [{
              'class': {
                'reader__keyword': true,
              }
            }]
          })
        }

        labels && labels.forEach(({range, id}) => {
          child = restructureData(child, {
            ...range,
            attrs: [{
              'class': {
                'reader__label': true,
              },
              'data-role': 'label',
              'data-labelid': id,
            }]
          })
        })

        highlightRanges.forEach(({range, attrs}) => {
          child = restructureData(child, {
            ...range,
            attrs,
          })
        })
        
      }
      list[index].push(child)
    }
  })

  list = list.map(children => {
    return children.map((child, i) => {
      return serialize(child, {
        ...opts,
      })
    }).join('')
  })

  if (list.length > 1) {
    return list.map(content => {
      return serialize({
        type: HTML_TAG,
        tag: 'div',
        pathExp,
      }, {
        ...opts,
        content,
      })
    }).join('')
  }

  return list[0]
}
