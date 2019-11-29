import {
  observable,
  computed,
  action,
  reaction,
  runInAction,
  toJS,
} from 'mobx'

export default class SearchStore {
  constructor(settings) {
  }

  @observable resultList = null
  @observable pages = null
  keyword = null
  pageNum = 0
  currentDate = null

  @action clearData() {
    this.resultList = null
    this.pages = null
  }

  search = async({pagesIndex, append = false}) => {
    const {
      bookStore
    } = this.stores

    const {
      data = [],
      page,
    } = await this.services.search({
      keyword: this.keyword,
      bookId: bookStore.bookId,
      page: pagesIndex,
      size: 10,
    }, this.settings);

    runInAction(() => {
      if (append) {
        if(pagesIndex === 1){
          this.resultList = [].concat(data);
        }else{
          this.resultList = (this.resultList || []).concat(data);
        }
      } else {
        this.resultList = data
      }
      this.pages = page;
      this.currentDate = data;
      this.pageNum = page.page>page.count_page?page.count_page:page.page
    });

    return data;
  }
}
