import express from 'express'
import { getAuth } from 'firebase-admin/auth'
import { app } from '../firebase/server.js'
import apiStore from './store.js'

const apiRoute = express()

apiRoute.get('/', (req, res) => {
    res.send('Express API en linea')
})

apiRoute.get('/status', (req, res) => {
    res.send({status: 'ONLINE'})
})

apiRoute.post('/auth/signinDemo', (req, res) => {
    const duration = 60 * 60 * 1000;
    //const duration = 60 * 60 * 24 * 5 * 1000 
    const sessionCookie = {randomworld: 'panconjamon', duration: duration, date: Date.now(), expiration: Date.now()+duration}

    res.cookie('__sessiondemo', sessionCookie, {
        maxAge: duration,  // 5 días en milisegundos
        httpOnly: true,
        secure: true,
        path: '/'
    });

    res.redirect('/')
})

apiRoute.post('/auth/signin', async (req, res) => {
    console.log('loguin request received')

    const auth = getAuth(app)

    const idToken = req.headers.authorization?.split("Bearer ")[1]

    if (!idToken) {
        return res.status(401).send("ERROR: NO SE DETECTÓ EL TOKEN DE AUTORIZACIÓN EN LA SOLICITUD")
    }

    try {
        await auth.verifyIdToken(idToken)
    } catch (error) {
        return res.status(401).send("EL TOKEN RECIBIDO NO ES VALIDO")
    }
    
    const duration = 60 * 60 * 1000;
 
        const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: duration })
    
    res.cookie('__session', sessionCookie, {
        maxAge: duration,  // 5 días en milisegundos
        httpOnly: true,
        secure: true,
        path: '/'
    });

    res.redirect('/dashboard')
})

apiRoute.get('/auth/getsession', (req, res) => {

    console.log(req.headers.cookie)

    const cookies = req.headers.cookie || ''; // Obtén las cookies del header
    const cookieMap = Object.fromEntries(
        cookies.split('; ').map(cookie => {
            const [key, value] = cookie.split('=');
            return [key, value];
        })
    );

    if (cookieMap.__sessiondemo) {
        try {
            const decodedValue = decodeURIComponent(cookieMap.__sessiondemo);
            const jsonData = JSON.parse(decodedValue.slice(2));
            res.send({status: 'active', data: jsonData}); // Envía el JSON como respuesta
        } catch (error) {
            //console.error('Error al convertir la cookie:', error);
            res.status(200).send({status: 'error', message: 'Ha ocurrido una desgracia', error: error});
        }
    } else {
        res.status(200).send({status: 'inactive', message: 'No existe sesion activa'});
    }


    // Verifica si la cookie existe en la petición
    /* const sessionCookie = req.cookies['__sessiondemo'];

    if (sessionCookie) {
        // La cookie existe
        res.status(200).json({ exists: true, message: "Session cookie found" });
    } else {
        // La cookie no existe
        res.status(200).json({ exists: false, message: "No session cookie found" });
    } */
        //res.status(200).json({ exists: false, message: "No session cookie found" });
});

apiRoute.post('/auth/signout', (req, res) => {
    res.clearCookie('__sessiondemo');
    res.clearCookie('__session');
    res.redirect('/');
})

apiRoute.get('/auth/signout', (req, res) => {
    console.log('logout request received')
    res.clearCookie('__sessiondemo');
    res.clearCookie('__session');
    res.redirect('/');
})

apiRoute.use('/store', apiStore)

export default apiRoute