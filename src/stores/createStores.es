import i18n from '~/i18n'
import ChapterStore from './ChapterStore'
import LoadingStore from './LoadingStore'
import SettingStore from './SettingStore'
import BookStore from './BookStore'
import ToolStore from './ToolStore'
import SearchStore from './SearchStore'
import LabelStore from './LabelStore'
import OtherLabelStore from './OtherLabelStore'
import LayoutStore from './LayoutStore'
import TextToolStore from './TextToolStore'
import PopoverStore from './PopoverStore'
import BookmarkStore from './BookmarkStore'

const stores = {
  loadingStore: LoadingStore,
  bookStore : BookStore,
  chapterStore: ChapterStore,
  settingStore: SettingStore,
  toolStore : ToolStore,
  searchStore : SearchStore,
  labelStore : LabelStore,
  otherLabelStore : OtherLabelStore,
  layoutStore: LayoutStore,
  textToolStore: TextToolStore,
  popoverStore: PopoverStore,
  bookmarkStore: BookmarkStore
}
export default function (settings, services) {
    const _stores = {}
    for(let key in stores) {
      let Store = stores[key]
      _stores[key] = new Store(settings)
      _stores[key].stores = _stores
      _stores[key].settings = settings
      _stores[key].services = services
    }
    return _stores
}
