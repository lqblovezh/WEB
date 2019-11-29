import jsonpath from 'jsonpath'

import {
  GREATER_THAN,
  LESS_THAN,
  EQUAL,
  NOT_EQUAL,
} from './enum/compareValues'
import ParamsError from './ParamsError'

export default function (pathExp1, pathExp2, peer = false) {
  if (pathExp1 === pathExp2) {
    return EQUAL
  }

  if (!pathExp1 || !pathExp2) {
    throw new ParamsError('comparePathExp', ...arguments)
  }
  const p1 = jsonpath.parse(pathExp1)
  const p2 = jsonpath.parse(pathExp2)
  const length = Math.min(p1.length, p2.length)

  for(let i=0; i<length; i++) {
    let e1 = p1[i].expression
    let e2 = p2[i].expression

    if (e1.type === e2.type && e1.type === 'numeric_literal') {
      if (e1.value > e2.value) {
        return GREATER_THAN
      } else if (e1.value < e2.value) {
        return LESS_THAN
      }
    } else if (e1.type !== e2.type || e1.value !== e2.value) {
      return NOT_EQUAL
    }
  }

  if (peer) {
    if (p1.length > p2.length) {
      return GREATER_THAN
    } else if (p1.length < p2.length) {
      return LESS_THAN
    }
  }

  return NOT_EQUAL
}
