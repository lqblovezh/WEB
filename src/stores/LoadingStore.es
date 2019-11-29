import {
  observable,
  computed,
  action,
  runInAction,
  toJS,
} from 'mobx'

import delay from 'delay'

export default class LoadingStore {

  @observable openCount = 0

  @computed get visible () {
    return this.openCount > 0
  }

  open = async () => {
    runInAction(() => {
      this.openCount++
    })
    let closed = false
    return await delay(50).then(() => {
      return action(() => {
        if (!closed) {
          this.openCount--
          closed = true
        }
      })
    })
  }
}
