import React, { Component } from 'react'
import {observer, inject, Observer} from 'mobx-react'

import i18n from '~/i18n'
import SearchBar from '~/components/desktop/SearchBar'
import SearchResultBox from '~/components/desktop/SearchResultBox'
import css from './style.css'

@inject('settingStore', 'toolStore', 'bookStore', 'chapterStore','searchStore','bookmarkStore')
@observer
export default class TopBar extends Component {

    clickCatalogHandler = () => {
      this.props.toolStore.toggle('catalog')
    }

    clickSettingHandler = () => {
      this.props.toolStore.toggle('setting')
    }
    

    clickComparisonHandler = () => {
      this.props.toolStore.toggle('comparison')
    }
    clickLabelHandler = () => {
      this.props.toolStore.toggle('label')
    }
    clickBookmarkHandler = () => {
      this.props.toolStore.toggle('bookmark')
    }

    render() {

        const {
          settingStore,
          chapterStore,
          bookStore,
          toolStore,
          searchStore,
          bookmarkStore,
        } = this.props;

        const {
          chapterRid,
          validComparisons,
          settings: {
            labelEnabled,
            otherLabelEnabled,
          }
        } = chapterStore

        return (
            <div className={css.wrapper} data-page={chapterStore.pageIndex}>
                <div className={css.indexBtn} onClick={this.clickCatalogHandler}></div>
                <div className={css.bookmarkBtn} onClick={this.clickBookmarkHandler}></div>
                <div className={css.settingBtn} onClick={this.clickSettingHandler}></div>
                {
                  labelEnabled && <div className={css.labelBtn} onClick={this.clickLabelHandler}></div>
                }
                {
                  validComparisons.length > 0 && <div className={css.comparisonsBtn}
                    onClick={this.clickComparisonHandler}></div>
                }
                <div className={css.title}>{bookStore.bookName}</div>
                {
                  bookStore.contentType !== 'image' && <SearchBar />
                }
                {
                  chapterStore.pages && chapterStore.pages.length > 0 && (
                    <div className={css.page}>
                      {i18n.TOP_BAR_PAGE_LABEL()}
                      <select value={chapterStore.pageIndex || 0}
                          onChange={evt => chapterStore.goPage(parseInt(evt.target.value))}
                        >
                        {
                          chapterStore.pages.map(({label}, i) => (
                            <option key={`${chapterRid} ${i}`} value={i}>{label || i+1}</option>
                          ))
                        }
                      </select>
                    </div>
                  )
                }
                {
                  <span className={css.addBookmarkBtn} onClick={bookmarkStore.addBookmark}></span>
                }
                {
                  searchStore.resultList && <SearchResultBox />
                }
            </div>
        )
    }
}
