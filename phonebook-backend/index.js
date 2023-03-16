require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
const Person = require('./models/phonebook');

const cors = require('cors');
app.use(cors());

var morgan = require('morgan');

morgan.token('body-content', function (req, res) { return JSON.stringify(req.body)});

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens['body-content'](req,res),
  ].join(' ')
}))

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get('/info', (request, response) => {
  let infoStr = `Phonebook has info for ${persons.length} people`;
  response.send(`<p>${infoStr}</p>
                <p>${new Date()}</p>`
  )
})

// app.get('/', (request, response) => {
//   response.send('<h1>Hello World!</h1>')
// })

app.get('/api/persons', (request, response) => {
  // response.json(persons)
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  // const person = persons.find(person => {
  //   const id = Number(request.params.id)
  //   // console.log(person.id, typeof person.id, id, typeof id, person.id === id)
  //   return person.id === id
  // })
  // console.log(person)
  // if (person) {
  //   response.json(person)
  // } else {
  //   response.statusMessage = "Person not found";
  //   response.status(404).end()
  // }

  Person.findById({_id:request.params.id}).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  //since the id can be a number or a string use the truthy equals to match either
  persons = persons.filter(person => person.id != id)

  response.status(204).end()
})


function generateId() {
  return Math.floor(Math.random() * Date.now()).toString(16);
}

app.post('/api/persons', (request, response) => {
  const body = request.body
 console.log(body)
  if (!body.name ) {
    return response.status(400).json({
      error: 'name is missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number is missing'
    })
  }

  let duplicates = persons.filter(person => person.name === body.name)
  if(duplicates.length > 0){
    // console.log(duplicates)
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person =  Person({
    name: body.name,
    number: body.number,
    id: generateId(),
  });

  persons = persons.concat(person)
  response.json(persons)
})

/*   middleware    */
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

app.use(express.static('build'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

/* end middleware   */

/*       the actual server           */
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
