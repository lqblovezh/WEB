import fetch from 'isomorphic-fetch'

export default function _fetch (url, {
  timeout = 1000 * 60,
  ...opts,
} = {}) {
  return Promise.race([fetch(url, {
    credentials: 'include',
    ...opts,
  }).then(response => {
    if (response.status >= 400) {
      throw new Error('服务器忙，请稍后重试！');
    }
    return response.text().then(text => {
      if (/^(\{|\[)/.test(text)) {
        const data = JSON.parse(text)
        if (data.status === false) {
          throw new Error(data.error || '数据异常！')
        }
        return data
      }
      console.warn(text);
      throw new Error('响应格式错误！');
    })
  }), new Promise((resolve, reject) => {
    if (timeout > 0) {
      setTimeout(() => {
        reject(new Error('请求超时，请稍后再试！'))
      }, timeout)
    }
  })])
}

export  function  postJSON (url, data, opts = {}) {
  return _fetch(url, {
    ...opts,
    method: 'POST',
    mode: 'cors',
    headers: {
      ...opts.headers,
      // 'Content-Type': 'application/x-www-form-urlencoded'
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    // body: data,
  }).then(result => {
    if (result.status) {
      return result
    }
    return result;
    // throw new Error(result.msg)
    // console.warn('数据错误')
  })
}

