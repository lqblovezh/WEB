import React, {Component} from 'react'
import {observer, inject, Observer} from 'mobx-react'
import {observable, action, toJS, reaction} from 'mobx'
import BScroll from 'better-scroll'

import i18n from '~/i18n'
import css from './style.css'

@inject('searchStore', 'chapterStore')
@observer
export default class SearchResultBox extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    const {
      searchStore
    } = this.props;
    searchStore.scroll.refresh();
  }

  componentDidMount() {
    const {
      searchStore
    } = this.props;

    searchStore.scroll = new BScroll(`.${css.wrapper}`, {
      click: true,
      pullUpLoad: true,
      observeDOM: false,
      probeType: 1,
    });

    searchStore.scroll.on('pullingUp', () => {
      const {
        pages,
        pageNum,
        currentDate,
      } = searchStore;

      if (!currentDate.length || pages.size * pages.page >= pages.total) {
        return console.log('这是最后一条!');
      }

      searchStore.search({"pagesIndex": pageNum + 1, append: true}).then(() => {
        searchStore.scroll.finishPullUp();
        searchStore.scroll.refresh();
      });
    })
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

  render() {
    const {
      searchStore,
    } = this.props
    const {
      resultList,
      pages,
    } = searchStore

    if (!resultList) {
      return (
        <div className={css.wrapper}>
          <ul></ul>
        </div>
      )
    }
    if (pages.total < 1) {
      return (
        <div className={css.wrapper}>
          <ul></ul>
          <div className={css.noData}>
            <div className={css.noDataContent}>
              <div className={css.noDataImg}></div>
              <div className={css.noDataText}>{i18n.NF_SEARCH_RESULT()}</div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className={css.wrapper}>
        {/*<div className={css.num} dangerouslySetInnerHTML={{__html: i18n.SEARCH_BAR_TOTAL({num: pages.total})}}></div>*/}
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
      </div>
    )
  }
}

const Item = observer(({data, onClickName, onClickContent}) => {
  const {
    chapter_name,
    text,
    keyword,
  } = data;
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
