import merge from 'merge'
import urlParse from 'url-parse'

import history from './history'

export default function (query) {
  const {
    pathname,
    search,
  } = location
  const url = urlParse(pathname+search, {}, true)
  merge(url.query, query)
  history.push(url.toString())
}
