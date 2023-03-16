const mongo = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2];

const url =
    `mongodb+srv://jimjonah:${password}@fullstackopen-cluster0.s2bkd98.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongo.set('strictQuery',false);
mongo.connect(url);

const phonebookSchema = new mongo.Schema({
  id: String,
  name: String,
  number: String,
});

function generateId() {
  return Math.floor(Math.random() * Date.now()).toString(16);
}

const Person = mongo.model('Person', phonebookSchema);

if(process.argv.length === 3){
  Person.find({}).then(persons => {
    persons.forEach(person => {
      console.log(person);
    })
    mongo.connection.close();
  })
} else if(process.argv.length === 5){
  let person = new Person({
    id: generateId(),
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then(result => {
    console.log('person saved!', person);
    mongo.connection.close();
  });
} else {
  console.log('wrong number of args. Either: <password> or <password> <name> <phonenumber>');
  mongo.connection.close();
}




