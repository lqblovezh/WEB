import fs from 'fs'
import path from 'path'
import URL from 'url'
import express from 'express'
import proxy from 'http-proxy-middleware'
import bodyParser from 'body-parser'
import request from 'request'
import ip from 'ip'
import moment from 'moment'
import clc from 'cli-color'
import boxen from 'boxen'
import merge from 'merge'

import webpackCnf from '../webpack.config'
import fetch from '../src/utils/fetch'

const app = express()
const ssl = false
const port = 4430
const forwardedHost = `${ip.address()}:${port}`

app.use('/favicon.ico', (req, res) => {
  res.writeHead(404)
  res.end()
})

app.use(logger({exclude: /\.(png|jpg|jpeg|gif|svg|ttf|woff|woff2)$/i}))

app.use(express.static(path.join(__dirname, 'public'), {
  index: false,
  setHeaders: (res, path, stat) => {
  }
}))

app.use('/test', require('./form').default)

app.all('/mock/:action', (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*')
  const {pathname} = URL.parse(req.url)
  try {
    res.json(require(path.join(__dirname, pathname)).default(req))
  } catch (e) {
    res.json({
      status: false,
      error: '样例数据不存在！'
    })
  }
})

app.use([
  '/reader/',
  '/m/reader/',
  '/pc/reader/',
], proxy({
  target: `http://127.0.0.1:${webpackCnf.devServer.port}`,//3201
  changeOrigin: true,
  onProxyRes: (proxyRes, req, res) => {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*'
  },
  pathRewrite: {
    '/reader/': '/',
    '/m/reader/': '/',
    '/pc/reader/': '/',
  }
}))

let cookie = null
app.use((req, res, next) => {
  const isNodeFetch = /node\-fetch/.test(req.headers['user-agent'])
  if (!cookie && !isNodeFetch) {
    cookie = req.headers.cookie
  } else if (cookie && isNodeFetch) {
    req.headers.cookie = cookie
  }
  next()
})

app.use('/json', bodyParser.json(), postJSON())

app.use(modifyResponse((data, req) => {
  // console.log(req.url, data.toString())
  return data
}), proxy({
  // target: 'http://127.0.0.1:8082',
  // target: 'http://webwk.kf.gli.cn',
  // target : 'http://skqs.gli.cn',
  target: 'http://hsshome.kf.gli.cn',
  // target : 'http://hssuser.kf.gli.cn',
  changeOrigin: true,
  onProxyRes: (proxyRes, req, res) => {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*'
  },
  pathRewrite: {}
}))

// app.use(forward())

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))

app.listen(port, listening)

function listening() {
  let address = `${ssl
    ? 'https'
    : 'http'}://${forwardedHost}`
  address = boxen(address, {
    padding: 1,
    margin: {
      top: 1,
      bottom: 1
    }
  })
  address = clc.greenBright(address)
  console.log(address)
}

function logger({exclude} = {}) {
  return (req, res, next) => {
    const {method, url} = req

    if (exclude && exclude.test(url)) {
      return next()
    }

    let time = Date.now()

    const prefix = `[${moment().format('HH:mm:ss')}] ${clc.bold(method)} ${url}`

    console.log(`${prefix} ${clc.blackBright('[pending...]')}`)

    res.once('finish', () => {
      time = Date.now() - time
      const {statusCode, statusMessage} = res
      const prefix = `[${moment().format('HH:mm:ss')}] ${clc.bold(method)} ${url}`
      if (statusCode >= 400) {
        console.error(`${prefix} ${clc.redBright(`[${statusCode} ${statusMessage} ${time}ms]`)}`)
      } else if (statusCode > 200) {
        console.log(`${prefix} ${clc.yellowBright(`[${statusCode} ${statusMessage} ${time}ms]`)}`)
      } else {
        console.log(`${prefix} ${clc.greenBright(`[${time}ms]`)}`)
      }
    })

    next()
  }
}

function forward(opts = {}) {
  return (req, res, next) => {
    let {url, method, headers} = req
    if (/^http(s)?\:\/\//i.test(url)) {
      req.pipe(request({
        ...opts,
        url,
        method,
        headers
      }).on('error', next)).pipe(res)
    } else {
      next()
    }
  }
}

function postJSON(){
  return (req, res, next) => {
    bodyParser.urlencoded({ extended: false })(req, res, () => {
      const body = JSON.stringify(merge(true, req.params, req.query, req.body))
      const headers = merge(true, req.headers, {
        'content-type': 'application/json',
      })
      delete headers['content-length']
      request({
        url: `${req.protocol}://${headers.host}${req.path}`,
        method: 'POST',
        headers,
        body
      }).on('error', next).pipe(res)
    })
  }
}

function modifyResponse (modify) {
  return (req, res, next) => {
    const _write = res.write
    res.write = (data) => {
      _write.call(res, modify(data, req, res))
    }
    next()
  }
}
