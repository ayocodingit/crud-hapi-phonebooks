const Hapi = require('@hapi/hapi')
const Joi = require('@hapi/joi')

require('./database')

const Phonebook = require('./Models/phonebook')

const init = async () => {

    const server = new Hapi.Server({
        port: 3000,
        host: 'localhost'
    })

    server.route({
        method: 'GET',
        path: '/phonebook',
        handler: async (request, h) => {
            const phonebook = await Phonebook.find()
            return h.response(phonebook)
        }
    })

    server.route({
        method: 'POST',
        path: '/phonebook',
        options: {
            validate: {
                payload: Joi.object({
                    name: Joi.string().min(4).required(),
                    email: Joi.string().email(),
                    no_phone: Joi.string().min(9)
                }),
                failAction: (request, h, error) => {
                    return error.isJoi 
                        ? h.response(error.details[0]).takeover().code(422)
                        : h.response(error).takeover()
                }
            }
        },
        handler: async (request, h) => {
            const phonebook = new Phonebook(request.payload)
            await phonebook.save()
            
            return h.response({
                message: 'CREATED'
            })
        }
    })

    server.route({
        method: 'GET',
        path: '/phonebook/{id}',
        handler: async (request, h) => {
            const phonebook = await Phonebook.findById(request.params.id)
            return h.response(phonebook)
        }
    })

    server.route({
        method: ['PUT', 'PATCH'],
        path: '/phonebook/{id}',
        options: {
            validate: {
                payload: Joi.object({
                    name: Joi.string().min(4).required().optional(),
                    email: Joi.string().email().optional(),
                    no_phone: Joi.string().min(9).optional()
                }),
                failAction: (request, h, error) => {
                    return error.isJoi ?
                        h.response(error.details[0]).takeover().code(422) :
                        h.response(error).takeover()
                }
            }
        },
        handler: async (request, h) => {
            await Phonebook.findByIdAndUpdate(request.params.id, request.payload)
            return h.response({
                message: 'UPDATED'
            })
        }
    })

    server.route({
        method: 'DELETE',
        path: '/phonebook/{id}',
        handler: async (request, h) => {
            try {
                const phonebook = await Phonebook.findByIdAndDelete(request.params.id)
                return h.response(phonebook)
            } catch (error) {
                return h.response(error).code(500)
            }
        }
    })

    await server.start()

    console.log(`Server running on ${server.info.uri}`)
}

init()