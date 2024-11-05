import express from 'express'
import api from './src/routes/api.js'

const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('express activo en /, soy api?')
})

app.use('/api', api)

app.listen(port, () => {
    console.log('server started')
})