import comparePathExp from './comparePathExp'
import {
  NON_INTERSECTING,
  INTERSECTING,
  EQUAL,
} from './enum/compareValues'
import ParamsError from './ParamsError'

export default function (textRange1, textRange2) {
  let value
  try {
    value = comparePathExp(textRange1.pathExp, textRange2.pathExp)
  } catch(e) {
    throw new ParamsError('compareTextRange', ...arguments)
  }
  if (value == EQUAL) {
    const index1 = textRange1.index || 0
    const offset1 = textRange1.offset || Infinity
    const index2 = textRange2.index || 0
    const offset2 = textRange2.offset || Infinity

    // console.log('================');
    // console.log(`${index2} <= ${index1} < ${index2 + offset2}`,
    //   index1 >= index2 && index1 < index2 + offset2);
    // console.log(`${index1} <= ${index2} < ${index1 + offset1}`,
    //   index2 >= index1 && index2 < index1 + offset1);
    // console.log('================');
    if (index1 >= index2 && index1 < index2 + offset2
      || index2 >= index1 && index2 < index1 + offset1) {
      return INTERSECTING
    }
  }
  return NON_INTERSECTING
}
