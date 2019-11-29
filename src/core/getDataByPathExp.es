import jsonpath from 'jsonpath'

export default function(metadata, pathExp) {
  return jsonpath.value(metadata, pathExp)
}
