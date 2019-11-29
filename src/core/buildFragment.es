export default function (html) {
  let context
  if (document.implementation) {
    context = document.implementation.createHTMLDocument('')
  } else {
    context = document
  }

  const fragment = context.createDocumentFragment()

  fragment.appendChild(context.createElement('div')).innerHTML = html

  return fragment
}
