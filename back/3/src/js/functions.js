// function buildLevels () {
//   let levels = {}
//   let isBonus = false
//   let wordLength
//   let max
//   for (let i = 1; i <= 20; i++) {
//     if (!levels[i]) levels[i] = {}
//     for (let j = 1; j <= 22; j++) {
//       if (i <= 5 && (j === 11 || j === 22)) {
//         isBonus = true
//         if (j === 11) {
//           wordLength = 9
//         }
//         if (j === 22) {
//           wordLength = 10
//         }
//       } else if (i > 5 && i <= 10 && (j === 11 || j === 22)) {
//         isBonus = true
//         if (j === 11) {
//           wordLength = 11
//         }
//         if (j === 22) {
//           wordLength = 12
//         }
//       } else if (i > 10 && i <= 15 && (j === 11 || j === 22)) {
//         isBonus = true
//         if (j === 11) {
//           wordLength = 13
//         }
//         if (j === 22) {
//           wordLength = 14
//         }
//       } else if (i > 15 && (j === 11 || j === 22)) {
//         isBonus = true
//         if (j === 11) {
//           wordLength = 15
//         }
//         if (j === 22) {
//           wordLength = 16
//         }
//       } else {
//         if (i <= 5) wordLength = 5
//         if (i > 5 && i <= 10) wordLength = 6
//         if (i > 10 && i <= 15) wordLength = 7
//         if (i > 15) wordLength = 8
//         isBonus = false
//       }
//       levels[i][j] = {
//         wordLength: wordLength,
//         isBonus: isBonus,
//         answers: {}
//       }
//     }
//   }
//   for (let i = 1; i <= 20; i++) {
//     for (let j = 1; j <= 22; j++) {
//       if (j === 11 || j === 22) {
//         levels[i][j].answers[levels[i][j].wordLength] = 1
//       } else {
//         for (let k = 2; k <= levels[i][j].wordLength; k++) {
//           if (i <= 5) {
//             if (j < 11) {
//               switch (k) {
//                 case 2: max = 1; break
//                 case 3: max = 2; break
//                 case 4: max = 2; break
//                 case 5: max = 1; break
//               }
//             }
//             if (j > 11) {
//               switch (k) {
//                 case 2: max = 2; break
//                 case 3: max = 3; break
//                 case 4: max = 3; break
//                 case 5: max = 2; break
//               }
//             }
//           }
//           if (i > 5 && i <= 10) {
//             if (j < 11) {
//               switch (k) {
//                 case 2: max = 0; break
//                 case 3: max = 2; break
//                 case 4: max = 2; break
//                 case 5: max = 1; break
//                 case 6: max = 1; break
//               }
//             }
//             if (j > 11) {
//               switch (k) {
//                 case 2: max = 0; break
//                 case 3: max = 4; break
//                 case 4: max = 3; break
//                 case 5: max = 2; break
//                 case 6: max = 2; break
//               }
//             }
//           }
//           if (i > 10 && i <= 15) {
//             if (j < 11) {
//               switch (k) {
//                 case 2: max = 0; break
//                 case 3: max = 0; break
//                 case 4: max = 3; break
//                 case 5: max = 1; break
//                 case 6: max = 1; break
//                 case 7: max = 1; break
//               }
//             }
//             if (j > 11) {
//               switch (k) {
//                 case 2: max = 0; break
//                 case 3: max = 0; break
//                 case 4: max = 4; break
//                 case 5: max = 2; break
//                 case 6: max = 2; break
//                 case 7: max = 2; break
//               }
//             }
//           }
//           if (i > 15) {
//             if (j < 11) {
//               switch (k) {
//                 case 2: max = 0; break
//                 case 3: max = 0; break
//                 case 4: max = 0; break
//                 case 5: max = 2; break
//                 case 6: max = 2; break
//                 case 7: max = 1; break
//                 case 8: max = 1; break
//               }
//             }
//             if (j > 11) {
//               switch (k) {
//                 case 2: max = 0; break
//                 case 3: max = 0; break
//                 case 4: max = 0; break
//                 case 5: max = 4; break
//                 case 6: max = 3; break
//                 case 7: max = 2; break
//                 case 8: max = 2; break
//               }
//             }
//           }
//           levels[i][j].answers[k] = max
//         }
//       }
//     }
//   }
// console.log(JSON.stringify(levels))
// console.log(levels)
// }

function getData (url, type) {
  let f = fetch(url)
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
  let url = 'https://words-mincer.top/src/static/php/functions.php'
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
    // console.log(data)
    return data
  }).catch(() => {
    // console.log(error)
    return null
  })
}

export default {
  // buildLevels: buildLevels,
  getData: getData,
  putData: putData
}
