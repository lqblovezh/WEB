import {
  observable,
  computed,
  action,
  runInAction,
  toJS,
  reaction
} from 'mobx'

import {loading} from './decorators'
import {wrapPage} from '~/utils/pageUtil'

export default class OtherLabelStore {


  componentDidMount = () => {
  }

  @observable otherLabels = null;

  @observable pages = null;


  @computed get otherLabelsList() {
    return this.otherLabels || []
  }

  @action setOtherLabels = (otherLabels) => {
    this.otherLabels = otherLabels;
  }

  @action setPages = (pages) => {
    this.otherLabels = otherLabels;
  }

  getOtherLabels = async({bookId, pageNumber = 1, size = 2, append = false}) => {
    const {bookStore} = this.stores;
    const {page, data} = await this.services.other_label({
      id: bookId || bookStore.bookId,
      page: pageNumber,
      size,
    }, this.settings);
    // this.setOtherLabels(res.data);
    wrapPage(page)
    runInAction(() => {
      if (append) {
        if (pageNumber === 1) {
          this.otherLabels = [].concat(data);
        } else {
          this.otherLabels = (this.otherLabels || []).concat(data);
        }
      } else {
        this.otherLabels = data
      }
      this.pages = page;
      this.currentDate = data;
      this.pageNum = page.pageNumber >= page.countPage ? page.countPage : page.pageNumber
    })
  }

}
