const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }


const Person = require('./models/person')

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/', (request, response) => {
    response.send(`<h1>Phonebook - Backend Exercise</h1>`)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, error) => {
    const id = request.params.id
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.get('/info', (request, response, next) => {

    const date = new Date()
    Person.countDocuments({})
        .then(count => {
            response.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`)
        })
        .catch(error => next(error))

})

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    const name = body.name
    const number = body.number

    console.log(name, number)

    if(name === "") {
        return response.status(400).json({
            error: 'name missing'
        })
    } else if (number === "") {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    const nameExists = 
    Person.find({ name: body.name }).then(person => 
        {
        return person.name
        })

    if(nameExists === name) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = new Person({
        name: name,
        number: number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.put('/api/persons/:id', (request, response, next) => {

    const body = request.body

    const person = {
        name:  body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true})
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})