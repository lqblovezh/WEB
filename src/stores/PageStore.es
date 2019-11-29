import {
  observable,
  computed,
  action,
  runInAction,
  toJS,
  reaction
} from 'mobx'

import {loading} from './decorators'

export default class LabelStore {
  constructor(settings) {
  }

  @observable labelFormVisible = false;

  @observable otherLabels = null;


  @action showFormBox () {
    this.labelFormVisible = true;
  }

  @action hideFormBox = () => {
    this.labelFormVisible = false
  }

  



}
