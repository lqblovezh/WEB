import comparePathExp from './comparePathExp'
import compareTextRange from './compareTextRange'
import ParamsError from './ParamsError'
import {
  GREATER_THAN,
  LESS_THAN,
  EQUAL,
  NOT_EQUAL,
  INTERSECTING,
} from './enum/compareValues'

export default function (position, range) {

  try {
    if (comparePathExp(range.start.pathExp, range.end.pathExp) == EQUAL) {
      return compareTextRange(position, range.end) == INTERSECTING
    }

    return compareTextRange(position, range.start) == INTERSECTING
    || compareTextRange(position, range.end) == INTERSECTING
    || comparePathExp(position.pathExp, range.start.pathExp, true) == GREATER_THAN
    && comparePathExp(position.pathExp, range.end.pathExp, true) == LESS_THAN
  } catch (e) {
    throw new ParamsError('isInRange', ...arguments)
  }
}
