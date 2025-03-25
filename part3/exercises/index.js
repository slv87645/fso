const express = require('express')
const morgan = require('morgan')

const app = express()
const requestLogger = morgan(':method :url :status :res[content-length] - :response-time ms :body')

app.use(express.json())
app.use(requestLogger)

morgan.token('body', (request, response) => {
  return JSON.stringify(request.body)
})

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
  const id = Math.floor(Math.random() * 100000000000000000) + 1
  return String(id)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  const nameExists = persons.find(person => person.name === body.name)

  if (nameExists) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number are missing'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  console.log(person)
  persons = persons.concat(person)
  response.json(person)
})

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`Phonebook has info for ${persons.length} people <br> ${date}`)
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
