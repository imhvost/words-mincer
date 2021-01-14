import Task from './task.js'

onmessage = function (e) {
  let data = {}
  let task = Task.getTask(e.data.task[0], e.data.task[1])
  data.task = task
  let answersAll = {}
  for (let index = e.data.answersAll[0]; index <= e.data.answersAll[1]; index++) {
    let words = e.data.answersAll[2][index]
    let answers = Task.getAnswersAll(words, task)
    answersAll[index] = answers
  }
  data.answersAll = answersAll
  postMessage(data)
}
