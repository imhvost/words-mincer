function buildLevels () {
  let levels = {}
  let wordLength
  let max
  for (let i = 1; i <= 20; i++) {
    if (i <= 5) wordLength = 5
    if (i > 5 && i <= 10) wordLength = 6
    if (i > 10 && i <= 15) wordLength = 7
    if (i > 15) wordLength = 8
    if (!levels[i]) levels[i] = {}
    levels[i].wordLength = wordLength
    if (!levels[i].sublevels) levels[i].sublevels = {}
    for (let j = 1; j <= 20; j++) {
      for (let k = 2; k <= levels[i].wordLength; k++) {
        if (!levels[i].sublevels[j]) levels[i].sublevels[j] = {}
        if (i <= 5) {
          if (j <= 10) {
            switch (k) {
              case 2: max = 1; break
              case 3: max = 2; break
              case 4: max = 2; break
              case 5: max = 1; break
            }
          }
          if (j > 10) {
            switch (k) {
              case 2: max = 2; break
              case 3: max = 3; break
              case 4: max = 3; break
              case 5: max = 2; break
            }
          }
        }
        if (i > 5 && i <= 10) {
          if (j <= 10) {
            switch (k) {
              case 2: max = 1; break
              case 3: max = 2; break
              case 4: max = 2; break
              case 5: max = 1; break
              case 6: max = 0; break
            }
          }
          if (j > 10) {
            switch (k) {
              case 2: max = 2; break
              case 3: max = 4; break
              case 4: max = 3; break
              case 5: max = 2; break
              case 6: max = 1; break
            }
          }
        }
        if (i > 10 && i <= 15) {
          if (j <= 10) {
            switch (k) {
              case 2: max = 0; break
              case 3: max = 4; break
              case 4: max = 3; break
              case 5: max = 1; break
              case 6: max = 1; break
              case 7: max = 0; break
            }
          }
          if (j > 10) {
            switch (k) {
              case 2: max = 0; break
              case 3: max = 4; break
              case 4: max = 3; break
              case 5: max = 2; break
              case 6: max = 1; break
              case 7: max = 1; break
            }
          }
        }
        if (i > 15) {
          if (j <= 10) {
            switch (k) {
              case 2: max = 0; break
              case 3: max = 4; break
              case 4: max = 3; break
              case 5: max = 2; break
              case 6: max = 1; break
              case 7: max = 1; break
              case 8: max = 0; break
            }
          }
          if (j > 10) {
            switch (k) {
              case 2: max = 0; break
              case 3: max = 5; break
              case 4: max = 4; break
              case 5: max = 3; break
              case 6: max = 2; break
              case 7: max = 1; break
              case 8: max = 1; break
            }
          }
        }
        levels[i].sublevels[j][k] = max
      }
    }
  }
}

function getData (url, type) {
  let f = fetch(url)
  return f.then((response) => {
    if (type === 'json') return response.json()
    if (type === 'text') return response.text()
  }).then((data) => {
    return data
  }).catch((error) => {
    console.log(error)
    return null
  })
}

export default {
  buildLevels: buildLevels,
  getData: getData
}
