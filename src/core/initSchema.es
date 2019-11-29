import merge from 'merge'

import defaultSchema from './conf/schema'

export default function (schema) {
  if (!schema) {
    return {...defaultSchema}
  } else if (!schema._initialized) {
    return merge.recursive(true, defaultSchema, schema)
  }
  return schema
}
