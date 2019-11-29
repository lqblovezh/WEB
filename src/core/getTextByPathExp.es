import jsonpath from 'jsonpath'

export default function (metadata, {pathExp, index, offset}) {
  let {
    tag,
    text,
  } = jsonpath.value(metadata, pathExp)
  if (text && index) {
    text = text.substr(index, offset)

    if(text.length>50){
      text = '...'.padStart(50, text)
    }
  }
  return text || `[${tag}]`
}
