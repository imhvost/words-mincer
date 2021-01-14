
function getData (url, type, noCache) {
  let option = {}
  if (noCache) {
    let headers = new Headers()
    headers.append('pragma', 'no-cache')
    headers.append('cache-control', 'no-cache')
    option.headers = headers
  }
  let f = fetch(url, option)
  return f.then((response) => {
    if (type === 'json') return response.json()
    if (type === 'text') return response.text()
  }).then((data) => {
    return data
  }).catch(() => {
    // console.log(error)
    return null
  })
}

function putData (action, data) {
  let url = 'https://words-mincer.top/static/php/functions.php'
  if (location.port === '8080') {
    url = 'http://localhost/work/words/src/static/php/functions.php'
  }
  let body = new FormData()
  body.append('action', action)
  Object.keys(data).forEach((key) => {
    body.append(key, data[key])
  })
  let option = {
    method: 'POST',
    body: body
  }
  let f = fetch(url, option)
  return f.then((response) => {
    return response.text()
  }).then((data) => {
    console.log(data)
    return data
  }).catch(() => {
    // console.log(error)
    return null
  })
}

export default {
  getData: getData,
  putData: putData
}
