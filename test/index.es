import {
  observable,
  computed,
  action,
  runInAction,
  toJS,
  autorun,
  useStrict,
  reaction,
} from 'mobx'

// useStrict(true)

// import createStores from '~/stores/createStores'
// import * as services_dev from '~/services.dev'
//
// const stores = createStores({
//   restUrl: 'http://127.0.0.1:4430/reader_api',
//   services: services_dev,
// })
// stores.bookStore.openBook({
//   bookId: 6033,
// })


const dataList = observable([
  {id: 1, name: 'Tom', age: 18, hobbies: ['sing', 'football']},
  {id: 2, name: 'Jim', age: 20, hobbies: ['tennis']},
])

// dataList[1].age = 24
dataList[1].hobbies.push('swim')
