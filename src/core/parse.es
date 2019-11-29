import {parseString} from 'xml2js'

import parseElement from './parseElement'
import parseChildren from './parseChildren'
import parseAttrs from './parseAttrs'

export default async function (xml, opts) {
  return new Promise((resolve, reject) => {
    // console.log(xml);
    parseString(xml, {
      explicitChildren: true,
      preserveChildrenOrder: true,
      charsAsChildren: true,
      attrkey: '_attributes',
      charkey: '_text',
      childkey: '_elements',
      // explicitCharkey: true,
    }, (err, result) => {
      if (err) {
        reject(err)
      } else {
        const comparisons = []
        const locals = {
          lastElement: null,
          comparisons,
        }
        const metadata = parseElement(result.book, {
          ...opts,
          locals,
        })
        resolve({
          metadata,
          comparisons,
        })
      }
    })
  })
}
