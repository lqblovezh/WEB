import offset from 'global-offset'

export default function(popoverEl, containerEl, beginRect, endRect, vertical){
  const {
    clientWidth: popoverWidth,
    clientHeight: popoverHeight,
  } = popoverEl

  const {
    clientWidth: containerWidth,
    clientHeight: containerHeight,
  } = containerEl

  const {
    top: offsetTop,
  } = offset(containerEl)

  const margin = {
    top: 30,
    bottom: 10,
    left: 20,
    right: 20,
  }
  let left, top

  const topSpacing = beginRect.top - offsetTop - popoverHeight - margin.top
  const rightSpacing = containerWidth - beginRect.right - margin.right
  const bottomSpacing = containerHeight - endRect.bottom - margin.bottom
  const leftSpacing = endRect.left - margin.left
  if (vertical) {
    if (rightSpacing > popoverWidth) {
      left = beginRect.right + margin.right
      top = beginRect.top
    } else if (leftSpacing > popoverWidth) {
      left = endRect.left - popoverWidth - margin.left
      top = endRect.bottom - popoverHeight
    } else {
      left = beginRect.right - popoverWidth
      top = beginRect.top
    }
  } else {
    if (topSpacing > 0) {
      top = beginRect.top - popoverHeight - margin.top
      if (beginRect.width > popoverWidth) {
        left = beginRect.left
      } else {
        left = containerWidth - popoverWidth - margin.right
      }
    } else if (bottomSpacing > popoverHeight) {
      top = endRect.bottom + margin.bottom
      if (endRect.width > popoverWidth) {
        left = endRect.right - popoverWidth - margin.right
      } else {
        left = endRect.left
      }
    } else {
      top = beginRect.top
      left = beginRect.left
    }

  }

  popoverEl.style.top = top +'px'
  popoverEl.style.left = left +'px'
}
