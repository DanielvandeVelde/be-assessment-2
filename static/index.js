/* eslint-env browser */
/* eslint-disable semi */

var remove = document.getElementById('js-remove')

if (remove) {
  remove.addEventListener('click', onremove)
}

function onremove(ev) {
  var node = ev.target
  var id = node.dataset.id

  console.log(node)
  console.log(id)

  fetch('/' + id, {method: 'delete'})
    .then(onresponse)
    .then(onload)

  function onresponse(res) {
    console.log(res)
    return res.json()
  }

  function onload() {
    console.log("onload")
    window.location = '/'
  }

  function onfail() {
    throw new Error('Could not delete!')
  }
}
