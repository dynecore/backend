import express from 'express'

const apiRoute = express()

apiRoute.get('/', (req, res) => {
    res.send('Express API en linea')
})

apiRoute.get('/status', (req, res) => {
    res.send({status: 'ONLINE'})
})

export default apiRoute