import React, {Component} from 'react'
import {observer, inject, Observer} from 'mobx-react'
import classnames from 'classnames'

import i18n from '~/i18n'

import css from './style.css'

@inject('searchStore', 'chapterStore')
@observer
export default class SearchResultBox extends Component {
  constructor(props) {
    super(props)
  }

  clickNameHandler = ({
    chapter_id,
    chapter_pid,
  }) => {
    const {
      chapterStore,
    } = this.props

    chapterStore.openChapter({
      chapterRid: chapter_pid || chapter_id,
    })
  }

  clickContentHandler = ({
    chapter_id,
    chapter_pid,
    xml_id,
    keyword,
  }) => {
    const {
      chapterStore,
    } = this.props

    chapterStore.openChapter({
      chapterRid: chapter_pid || chapter_id,
      xmlId: xml_id,
      keyword,
    })
  }

  pageHandler = (is) => {
    const {
      searchStore
    } = this.props
    const {
      pages,
      keyword
    } = searchStore

    let index = null

    if (is) {
      index = pages.page - 1
      if (index < 1) {
        return
      }
    } else {
      index = pages.page + 1
      if (index >= pages.total) {
        return
      }
    }
    searchStore.search({"pagesIndex": index})
  }

  render() {
    const {
      searchStore,
    } = this.props
    const {
      resultList,
      pages,
    } = searchStore

    if (pages.total < 1) {
      return (
        <div className={css.wrapper}>
          <div className={css.num}>
            {i18n.NF_SEARCH_RESULT()}
          </div>
        </div>
      )
    }

    return (
      <div className={css.wrapper}>
        <div className={css.num} dangerouslySetInnerHTML={{__html: i18n.SEARCH_BAR_TOTAL({num: pages.total})}}>
        </div>
        <ul>
          {
            resultList && resultList.map((data, i) => (
              <Item data={data} key={pages.page + "-" + i}
                    onClickName={this.clickNameHandler}
                    onClickContent={this.clickContentHandler}
              />
            ))
          }
        </ul>
        {

        }
        <div className={css.btn}>
          <a href='javascript:void(0)' onClick={() => this.pageHandler(true)}>{i18n.PREV_PAGE()}</a>
          <span>{pages.page}</span> / <span>{pages.count_page}</span>
          <a href='javascript:void(0)' onClick={() => this.pageHandler(false)}>{i18n.NEXT_PAGE()}</a>
        </div>
      </div>
    )
  }
}

const Item = observer(({data, onClickName, onClickContent}) => {
  const {
    chapter_name,
    text,
    keyword,
  } = data

  const name = chapter_name.replace(keyword, (value) => {
    return `<span class="${css.highlight}">${value}</span>`
  })
  const content = text.replace(keyword, (value) => {
    return `<span class="${css.highlight}">${value}</span>`
  })
  return (
    <li>
      <span className={css.name}
            title={chapter_name}
            onClick={() => onClickName(data)}
            dangerouslySetInnerHTML={{__html: name}}
      ></span>
      <pre className={css.content}
           title={text}
           onClick={() => onClickContent(data)}
           dangerouslySetInnerHTML={{__html: content}}
      ></pre>
    </li>
  )
})
