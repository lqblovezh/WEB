import jsonpath from 'jsonpath'

export default function (data, xmlId) {
  const list = jsonpath.query(data, `$..children[?(@.xmlId=="${xmlId}")]`)
  return list[0]
}
