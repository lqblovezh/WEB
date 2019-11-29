import {
  HTML_TAG,
  LINE_BREAK,
  ENTIRE_IMAGE,
  PARTIAL_IMAGE,
  PAGE_NUMBER,
} from './enum/metaTypes'
import attachProps from './attachProps'
import parseAttrs from './parseAttrs'
import parseChildren from './parseChildren'
import parseElement from './parseElement'

export default function (data, opts) {
  const {
    _elements=[],
  } = data

  let attrs = [], children = []

  _elements.forEach(child => {
    let metadata, pageValue = null
    switch(child['#name']) {
      case 'title':
        break
      case 'table':
        metadata = parseTable(child, {
          ...opts,
          path: opts.path.concat('children', children.length)
        })
        pageValue = '封面'
        break
      default:
        metadata = parseElement(child, {
          ...opts,
          path: opts.path.concat('children', children.length)
        })
    }
    if (metadata) {
      children.push(metadata)
      if (pageValue) {
        metadata = {
          type: PAGE_NUMBER,
          value: pageValue,
        }
        attachProps(metadata, child, {
          ...opts,
          path: opts.path.concat('children', children.length)
        })
        children.push(metadata)
      }
    }
  })

  return {
    type: HTML_TAG,
    tag: 'div',
    attrs: parseAttrs(data, opts).concat(attrs),
    children,
  }
}

function parseTable (table, opts) {
  const {
    imagePath,
  } = opts

  const {[0]: tr} = table.tr || [{}]
  const {[0]: td} = tr.td || [{}]
  const {[0]: mediaobject} = td.mediaobject || [{}]
  const {[0]: imageobject} = mediaobject.imageobject || [{}]
  const {[0]: imagedata} = imageobject.imagedata || [{}]

  const {
    fileref = '',
    // width: _width,
    // depth: _height,
  } = imagedata._attributes

  const _width = 812, _height = 1200

  let width = 'auto', height = 'auto'
  if (_width && _height) {
    height = Math.floor(window.innerHeight * 0.9) +'px'
    width = Math.floor(parseFloat(_width)/parseFloat(_height) * parseInt(height)) +'px'
  }

  const metadata = {
    type: HTML_TAG,
    tag: 'img',
    attrs: [{
      'class': {
        'reader__cover': true,
      },
      'data-role': 'cover',
      src: imagePath + fileref,
      // alt: fileref,
      style: {
        'max-width':'100%',
        height,
        'vertical-align': 'middle',
      },
    }],
  }
  attachProps(metadata, mediaobject, opts)
  return metadata
}
