import fetch , {postJSON} from '~/utils/fetch'
import qs from 'qs'
let useMock = false

export async function get_book ({bookId}, {baseUrl, restUrl}) {
  try {
    if (bookId) {
      return await fetch(`${restUrl}/book_info?id=${bookId}`)
    }
    throw new Error('书籍不存在！')
  } catch (e) {
    if (__DEV__) {
      useMock = bookId ? window.confirm('错误原因：'+ e.message +'\n\n是否使用样例数据？') : true
      if (useMock) {
        return await fetch(`${baseUrl}/mock/getBook`)
      } else {
        throw e
      }
    }
  }
}

//获取他评
export async function other_label (data, {baseUrl, restUrl}) {
  return await postJSON(`${restUrl}/other_note`,data)
}

export async function get_chapter ({
  bookId,
  chapterRid,
}, {baseUrl, restUrl}) {
  if (useMock) {
    return await fetch(`${baseUrl}/mock/getChapter?datafile=${chapterRid}`)
  }
  return await fetch(`${restUrl}/chapter?bid=${bookId}&cids=${chapterRid}&crid=`)
}

export async function search ({
  keyword,
  bookId,
  page,
  size,
},{baseUrl, restUrl}) {
  if (useMock) {
    return await fetch(`${baseUrl}/mock/search?${qs.stringify({keyword})}`)
  }
  return await fetch(`${restUrl}/search`,{
    method: "POST",
    headers : {
      "Content-Type" : 'application/x-www-form-urlencoded'
    },
    body : qs.stringify({
      keyword,
      bookId,
      page,
      size,
    }),
  })
}

export async function add_label ({
  bookId,
  chapterRid,
  userText,
  rangeJSON,
  isOpenLabel,
  selectedText,
}, {baseUrl, restUrl}) {
  return await fetch(`${restUrl}/addNote`,{
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body : qs.stringify({
      bookId,
      chapterId: chapterRid,
      userText,
      protected:isOpenLabel,
      range: rangeJSON,
      selectedText,
    }),
  })

}

export async function modify_label ({id,userText}, {baseUrl, restUrl}) {
  return await fetch(`${restUrl}/upNote`,{
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body : qs.stringify({
      id,
      userText,
    }),
  })
}

export async function remove_label ({id},{baseUrl, restUrl}) {
  return await fetch(`${restUrl}/delNote`,{
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body : qs.stringify({
      id,
    }),
  })
}

export async function add_ingdexing ({
  bookId,
  rangeJSON,
  selectedText,
  chapterRid,
}, settings) {
  window.parent.getIndex({
    chapterId: chapterRid,
    rang: rangeJSON,
    selected: selectedText,
    dataId: bookId
  });
}

export async function add_bookmark ({
  bookId,
  chapterRid,
  text,
  positingJSON,
},{baseUrl, restUrl}) {
  return await fetch(`${restUrl}/addBookmark`,{
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body : qs.stringify({
      bookId,
      chapterId: chapterRid,
      selectedText: text,
      range: positingJSON,
    }),
  })
}

export async function remove_bookmark ({id},{baseUrl, restUrl}) {
  return await fetch(`${restUrl}/delBookmark`,{
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body : qs.stringify({
      id
    }),
  })
}

export async function go_back () {
}