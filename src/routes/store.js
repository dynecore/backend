import express from 'express'
import { app } from '../firebase/server.js'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'


const apiStore = express()

const auth = getAuth(app)


apiStore.get('/tenant/add', (req, res) => {
    res.send('api ok')
})

apiStore.post('/tenant/add', async (req, res) => {

    const idToken = req.headers.authorization?.split("Bearer ")[1]

    if (!idToken) {
        return res.status(401).send("ERROR: NO SE DETECTÓ EL TOKEN DE AUTORIZACIÓN EN LA SOLICITUD")
    }

    const decodedToken = await auth.verifyIdToken(idToken)

    const uid = decodedToken.uid;

    try {
        const { nombre, edad, nacionalidad, cedula, facebook, whatsapp, correo } = req.body;
        
        // Validación básica de los datos recibidos
        if (!nombre || !edad || !nacionalidad || !cedula || !correo) {
            return res.status(400).json({ error: 'Faltan datos obligatorios.' });
        }

        const db = getFirestore()
        const collectionRef = db.collection('tenants');

        await collectionRef.add({
            nombre,
            edad,
            nacionalidad,
            facebook: facebook || null,
            whatsapp: whatsapp || null,
            correo,
            createdBy: uid, // Registrar el UID del usuario que creó el registro
            createdAt: new Date(), // Fecha de creación
          });
          res.status(201).json({ message: 'Usuario agregado con éxito.' });
    } catch (error) {
        return res.status(500).json({ error: 'ERROR: NO SE PUDO PROCESAR LA SOLICITUD. '+ error });
    }
})

export default apiStore