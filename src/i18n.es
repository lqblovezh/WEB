export default {
  // Error
  E_PARAM_REQUIRED: ({name}) => `参数 ${name} 无效`,
  E_UNINIT_MEMBER: ({name}) => `属性/成员 ${name} 未初始化`,

  // NoFound
  NF_BOOK: () => `该书籍未找到`,
  NF_CHAPTER: () => `该篇章未找到`,
  NF_SECTION: ({xmlId}) => `该章节未找到(${xmlId})`,
  NF_CONTENT: () => `该章节没有内容`,
  NF_TEXT_LAYOUT: ({textLayout}) => `不支持该文本排版类型：${textLayout}`,
  NF_PREV_PAGE: () => `已经是第一页了`,
  NF_NEXT_PAGE: () => `已经是最后一页了`,
  NF_LABEL_MOBILE: () => '阅读时长按文字可添加批注',
  NF_LABEL_DESKTOP: () => '您可以选中一部分内容来添加批注',
  NF_SEARCH_RESULT: () => '没有你要搜索的结果!',
  NF_BOOKMARK: () => '阅读时点击右上角书签按钮即可添加书签',

  TOP_BAR_PAGE_LABEL: () => `本章页码`,
  SEARCH_BAR_PLACEHOLDER: () => `请输入搜索内容`,
  SEARCH_BAR_TOTAL: ({num}) => `共<span >${num}</span>条结果`,

  INDEXING: () => '佐证',

  LABEL: () => '批注',
  LABEL_ADD: () => `添加批注`,
  LABEL_DELETE_CONFIRM: () => '确定删除批注吗?',
  LABEL_CANCEL: ({labeldIds: {length}}) => length > 1 ? `取消批注（${length}个）` : '取消批注',

  BOOKMARK_DELETE_CONFIRM: () => '是否删除书签',

  LAST_CHAPTER: () => '上一章',
  NEXT_CHAPTER: () => '下一章',
  NEXT_PAGE: () => '下一页',
  PREV_PAGE: () => '上一页',

  DARK: () => '暗',
  BRIGHT: () => '亮',

  SAVE: () => `保存`,
  COPY: () => `复制`,
  DELETE: () => '删除',

  SYSTEM: () => '系统',
  ALWAYS: () => '长亮',
  BACK: () => '返回',
  CATALOG: () => '目录',
  SETTING: () => '设置',
  BRIGHTNESS: ({type}) => type > 0 ?'白间':'夜间',
  SHARE: () => '分享',
  BOOKMARK: () => '书签',

  COMPARISON_TITLE: () => `图文对照`,

  OTHER_LABEL:() => `他评`,
  NO_OTHER_LABEL:() => `暂无他评`,
  OTHER_LABEL_TOTAL: ({num}) => `${num}个他评`,
  OTHER_LABEL_LIST: () => '佐证列表',
}
