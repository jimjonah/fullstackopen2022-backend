const mongo = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://jimjonah:${password}@fullstackopen-cluster0.s2bkd98.mongodb.net/noteApp?retryWrites=true&w=majority`

mongo.set('strictQuery',false)
mongo.connect(url)

const noteSchema = new mongo.Schema({
  content: String,
  important: Boolean,
})

const Note = mongo.model('Note', noteSchema)

// let note = new Note({
//   content: 'HTML is Easy',
//   important: true,
// })
//
// note.save().then(result => {
//   console.log('note saved!')
// })
//
//
//  note = new Note({
//   content: 'CSS is Easy',
//   important: true,
// })
//
// note.save().then(result => {
//   console.log('note saved!')
// })
//
//  note = new Note({
//   content: 'Java is Easy',
//   important: true,
// })
//
// note.save().then(result => {
//   console.log('note saved!')
//   mongo.connection.close()
// })

Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongo.connection.close()
})
