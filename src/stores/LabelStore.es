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
  constructor(props) {
  }

  @observable labelFormVisible = false;

  @observable otherLabels = null;


  @action showFormBox () {
    this.labelFormVisible = true;
  }

  @action hideFormBox = () => {
    this.labelFormVisible = false
  }

  


  @loading
  addLabel = async ({userText,isOpenLabel}) => {
    const {
      bookStore,
      textToolStore,
      chapterStore,
    } = this.stores
    let res = await this.services.add_label({
      bookId: bookStore.bookId,
      chapterRid: chapterStore.chapterRid,
      userText: userText,
      isOpenLabel: isOpenLabel,
      rangeJSON: JSON.stringify(textToolStore.range),
      selectedText: textToolStore.selectedText,
    }, this.settings);
    if (res.status) {
       bookStore.addLable(res.data)
       await chapterStore.renderText()
    }
    this.hideFormBox();
  }

  modifyLabel = async () => {
  }

  removeLabels  = async (labels) => {
    const {
      textToolStore,
      chapterStore,
      bookStore,
    } = this.stores

    const ids = labels ? labels.map(({id}) => id) : textToolStore.labeldIds

    for (let id of ids) {

      let res = await this.services.remove_label({id}, this.settings);
      if(res.status){
        bookStore.removeLable(id)
      }
    }
    textToolStore.close()
    await chapterStore.renderText()
  }

}
