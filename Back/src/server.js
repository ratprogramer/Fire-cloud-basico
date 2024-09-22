import express from 'express'
import cors from 'cors'
import { bucket } from './config/firebaseAdmin.js'
import multer from 'multer'

const app = express()
app.use(cors())

const upload = multer({
    storage: multer.memoryStorage()
})
app.get('/upload', (req, res)=> {
    res.json({imgs: imgsURL})
})
const imgsURL = []

async function subirImagen(bucket, file) {
    if(!file){
        return 'The image is missing'
    }
    //Creamos un nombre unico para cada archivo, fusionando la fecha actual y el nombre del archivo
    const fileName = `${Date.now()}_${file.originalname}` 
    //Declaramos una referencia que representa el archivo que vamos a subir, aun no almacena nada
    const reference = bucket.file(fileName)
    
    return new Promise((resolve, reject) => {
        //Creamos el canal para escribir los datos que vamos a enviar
        const referenceStream = reference.createWriteStream({
            contentType: file.mimetype
        })
        
        //Manejo de errores
        referenceStream.on('error', (err) => {
            reject(err)
        })
        
        //Manejo para cuando finaliza el proceso
        referenceStream.on('finish', async () => {
            try{
                await reference.makePublic()
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${reference.name}`
                resolve(publicUrl)
            } catch (err){
                reject(err)
            }
        })
        //Terminamos el flujo de escritura y enviamos el buffer a firebase storage
        referenceStream.end(file.buffer)
    })
}



app.post('/upload', upload.single('image'), async (req,res) => {
    try{
        const url = await subirImagen(bucket, req.file)
        imgsURL.push(url)
        res.status(200).json({success: true, result: url})
    } catch(err){
        res.status(500).json({success: false, error: err})
    }
})

app.listen(3001)
