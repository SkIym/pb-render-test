const mongoose = require('mongoose')
require('dotenv').config()
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI


console.log('connecting to', url)

mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            minLength: 3,
            required: true
        },
        number: {
            type: String,
            minLength: 8,
            validate: {
                validator: (n) => {
                    return /^\d{2,3}-\d{6,}$/.test(n)
                },
                message: props => `${props.value} is not a valid phone number! Must be in the format: 12(3)-4567890`
            },
            required: true
        }
    }
)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)