import {
  HTML_TAG,
  LINE_BREAK,
  ENTIRE_IMAGE,
  PARTIAL_IMAGE,
  PAGE_NUMBER,
} from './enum/metaTypes'

export default function (data, opts) {
  const {
    imagePath,
  } = opts

  const {
    fileref = '',
    width,
    depth,
    annotations,
  } = asSingle(data, opts)._attributes || {}

  const type = ({
    '[dz1]in': PARTIAL_IMAGE,
    '[gwdz]in': ENTIRE_IMAGE,
  })[annotations]

  if (type) {
    return {
      type,
      image: {
        url: imagePath + fileref,
        vertical: depth > width,
        // width,
        // height: depth,
      }
    }
  }

  return {
    type: HTML_TAG,
    tag: 'img',
    attrs: [{
      src: imagePath + fileref,
      // alt: fileref,
      style: {
        height: '1em',
        'vertical-align': 'middle',
      },
    }],
  }

}

function asSingle (data, opts) {
  const {[0]: imageobject} = data.imageobject || [{}]
  const {[0]: imagedata} = imageobject.imagedata || [{}]
  return imagedata
}

function asMultiple (data, opts) {
  const list = []
  const {imageobject = []} = data
  imageobject.forEach((imagedata = []) => {
    imagedata.forEach(data => list.push(data))
  })
  return list
}
