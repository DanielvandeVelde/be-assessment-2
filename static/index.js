/* eslint-env browser */
/* eslint-disable semi */

var remove = document.getElementById('js-remove')

if (remove) {
  remove.addEventListener('click', onremove)
}

function onremove(event) {
  var id = this.dataset.id
  fetch('/' + id, {method: 'delete'})
    .then(onresponse)

  function onresponse(res) {
    return res.json().then(onload, onfail)
  }

  function onload() {
    window.location = '/'
  }

  function onfail() {
    throw new Error('Could not delete!')
  }
}
