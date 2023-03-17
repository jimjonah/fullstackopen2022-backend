require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
const Person = require('./models/phonebook');

const cors = require('cors');
app.use(cors());

var morgan = require('morgan');

morgan.token('body-content', function (req, res) {
  return JSON.stringify(req.body);
});

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens['body-content'](req, res),
  ].join(' ');
}));

// let persons = [
//   {
//     "id": 1,
//     "name": "Arto Hellas",
//     "number": "040-123456"
//   },
//   {
//     "id": 2,
//     "name": "Ada Lovelace",
//     "number": "39-44-5323523"
//   },
//   {
//     "id": 3,
//     "name": "Dan Abramov",
//     "number": "12-43-234345"
//   },
//   {
//     "id": 4,
//     "name": "Mary Poppendieck",
//     "number": "39-23-6423122"
//   }
// ];

app.get('/info', (request, response) => {
  Person.countDocuments({}).then(count => {
        let infoStr = `Phonebook has info for ${count} people`;
        response.send(`<p>${infoStr}</p>
                    <p>${new Date()}</p>`);
      }
  );
});

// app.get('/', (request, response) => {
//   response.send('<h1>Hello World!</h1>')
// })

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons);
  });
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById({_id: request.params.id}).then(person => {
    response.json(person);
  })
  .catch(error => next(error))
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end();
  })
  .catch(error => next(error))
});

function generateId() {
  return Math.floor(Math.random() * Date.now()).toString(16);
}

app.post('/api/persons', (request, response, next) => {
  const body = request.body;
  console.log(body);
  if (!body.name) {
    return response.status(400).json({
      error: 'name is missing'
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number is missing'
    });
  }

  Person.find({name: body.name}).then(person => {
    if( person.length === 0){
      console.log('didn\'t find a person so adding');
      const person = new Person({
        name: body.name,
        number: body.number,
        id: generateId(),
      });

      let error = person.validateSync();
      if(typeof error !== 'undefined'){
        console.log('error is', error);
        next(error)
      } else {
        person.save().then(savedPerson => {
          response.json(savedPerson);
        })
        .catch(error => next(error));
      }
    } else {
      // we found a person so do a PUT instead
      console.log('found a person so updating', person[0]);
      const newPerson = new Person({
        name: body.name,
        number: body.number,
        id: person[0].id
      })

      let error = newPerson.validateSync();
      if(typeof error !== 'undefined'){
        console.log('error is', error);
        next(error)
      } else {
        Person.findByIdAndUpdate(person[0]._id,
            newPerson,
            {new: true, runValidators: true, context: 'query'})
        .then(updatedPerson => {
          response.json(updatedPerson);
        })
        .catch(error => next(error));
      }
    }
  });
});


app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;
  console.log(body);
  if (!body.name) {
    return response.status(400).json({
      error: 'name is missing'
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number is missing'
    });
  }

  Person.find({name: body.name}).then(person => {
    if( person.length === 0){
      console.log('didn\'t find a person so adding');
      const person = new Person({
        name: body.name,
        number: body.number,
        id: generateId(),
      });

      // persons = persons.concat(person)
      // response.json(persons)
      person.save().then(savedPerson => {
        response.json(savedPerson);
      });
    } else {
      // we found a person so do a PUT instead
      console.log('found a person so updating', person[0]);
      const newPerson = {
        name: body.name,
        number: body.number,
        id: person[0].id
      }

      Person.findByIdAndUpdate(person[0]._id,
          newPerson,
          {new: true, runValidators: true, context: 'query'})
      .then(updatedPerson => {
        response.json(updatedPerson);
      })
      .catch(error => next(error));
    }

  });
});

/********************************************************   middleware    */
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};

app.use(requestLogger);

app.use(express.static('build'));

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'});
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error);
}

// this has to be the last loaded middleware.
app.use(errorHandler)

/********************************************************** end middleware   */

/*       the actual server           */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
