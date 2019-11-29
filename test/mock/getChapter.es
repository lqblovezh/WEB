import fs from 'fs'
import path from 'path'
import xmljs from 'xml-js'

export default function(req) {
  const {datafile} = req.query
  let content = fs.readFileSync(path.resolve(__dirname, `../public/data/${datafile}`)).toString()
  if (/\.xml/i.test(datafile)) {
    content = xmljs.xml2json(content, {
      trim: true,
    })
    content = xmljs.json2xml(content)
  }
  return {
    chapter: {
      content,
    },
    _settings: {
      'guji.xml': {
        imagePath: '/Images/',
      },
      'cover.xml': {
        imagePath: '/Images/',
      },
    }[datafile],
    status: true,
  }
}
