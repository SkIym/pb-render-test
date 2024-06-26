const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


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
    response.send(`<h1>Phonebook - Backend Exercise</h1>`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json([person])
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.get('/info', (request, response) => {
    const numberOfPersons = persons.length
    const date = new Date()
    response.send(`<p>Phonebook has infor for ${numberOfPersons} people</p><p>${date}</p>`)
})

const generateId = () => {
    const randomId = Math.floor(Math.random() * 1000)
    return String(randomId)
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    const id = generateId()

    const name = body.name
    const number = body.number

    if(!name) {
        return response.status(400).json({
            error: 'name missing'
        })
    } else if (!number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    const nameExists = persons.find(person => person.name === name)

    if(nameExists) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: id,
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})