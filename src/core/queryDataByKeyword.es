import jsonpath from 'jsonpath'

export default function (data, keyword) {
  const list = jsonpath.query(data, `$..children[?(@.text.indexOf(${JSON.stringify(keyword)}) != -1)]`)
  const set = []
  for (let i=0, {length}=list; i<length; i++) {
    let current = list[i]
    let next = list[i+1]
    if (next && next.pathExp.indexOf(current.pathExp) === 0) {
      continue
    }
    set.push(current)
  }
  console.log('搜索结果', keyword, set)
  return set
}
