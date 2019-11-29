import comparePathExp from '~/core/comparePathExp'
import compareTextRange from '~/core/compareTextRange'
import isInRange from '~/core/isInRange'
import {
  GREATER_THAN,
  LESS_THAN,
  EQUAL,
  NOT_EQUAL,
  INTERSECTING,
} from '~/core/enum/compareValues'

export default function () {
  const selectionRange = window.getSelection()
  const text = selectionRange.toString()

  if (text) {
    const lableNodes = document.querySelectorAll("*[data-labelid]")
    const labelIds = {}
    const rects = selectionRange.getRangeAt(0).getClientRects()

    const beginRect = rects[0]
    const endRect = rects[rects.length - 1] || beginRect

    let {
      anchorNode,
      focusNode,
      anchorOffset,
      focusOffset,
    } = selectionRange

    if (!anchorNode.tagName) {
      anchorNode = anchorNode.parentElement
    }

    if (!focusNode.tagName) {
      focusNode = focusNode.parentElement
    }

    let beginData = {
      pathExp: anchorNode.getAttribute('data-pathexp'),
    }
    let endData = {
      pathExp: focusNode.getAttribute('data-pathexp'),
    }

    if (!beginData.pathExp) {
      let rangeJSON = anchorNode.getAttribute('data-range')
      beginData = rangeJSON && JSON.parse(rangeJSON).end || null
    }
    if (!endData.pathExp) {
      let rangeJSON = focusNode.getAttribute('data-range')
      endData = rangeJSON && JSON.parse(rangeJSON).end || null
    }

    if (!beginData || !endData) {
      console.warn('元素路径不存在', anchorNode, focusNode)
      window.getSelection().removeAllRanges()
      return null
    }

    const range = {
      start: {},
      end: {},
    }

    const beginDataIndex = (beginData.index || 0) + anchorOffset
    const endDataIndex = (endData.index || 0)  + focusOffset
    const value = comparePathExp(beginData.pathExp, endData.pathExp, true)
    if (value == LESS_THAN) {
      range.start.pathExp = beginData.pathExp
      range.start.index = beginDataIndex
      range.end.pathExp = endData.pathExp
      range.end.index = 0
      range.end.offset = endDataIndex
    } else if (value == GREATER_THAN) {
      range.start.pathExp = endData.pathExp
      range.start.index = endDataIndex
      range.end.pathExp = beginData.pathExp
      range.end.index = 0
      range.end.offset = beginDataIndex
    } else {
      range.end.pathExp = range.start.pathExp = endData.pathExp
      if (beginDataIndex > endDataIndex) {
        range.end.index = range.start.index = endDataIndex
        range.end.offset = beginDataIndex - endDataIndex
      } else {
        range.end.index = range.start.index = beginDataIndex
        range.end.offset = endDataIndex - beginDataIndex
      }
    }

    for(var i =0 , len = lableNodes.length; i< len ; i++){
      let labelId  = lableNodes[i].getAttribute('data-labelid')
      if (labelIds[labelId]) {
        continue
      }

      let pathExp = lableNodes[i].getAttribute('data-pathexp')
      let rangeJSON = lableNodes[i].getAttribute('data-range')

      let position = null
      if(pathExp){
        position = {pathExp}
      } else if (rangeJSON) {
        position = JSON.parse(rangeJSON).end
      }

      if (position && isInRange(position, range)) {
        labelIds[labelId] = true
      }
    }

    let tempNode = anchorNode, xmlId = null
    while (!xmlId && tempNode) {
      xmlId = tempNode.getAttribute('data-xmlid')
      tempNode = tempNode.parentElement
    }

    return {
      range,
      selectedText: text,
      labelIds: Object.keys(labelIds),
      anchorNode,
      focusNode,
      beginRect,
      endRect,
      xmlId,
    }
  }
  return null
}
