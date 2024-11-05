import express from 'express'

const api = express()

api.get('/', (req, res) => {
    res.send('Express API en linea')
})

export default api