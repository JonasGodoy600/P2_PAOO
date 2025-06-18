const axios = require('axios')
const express = require('express')
const app= express()
app.use(express.json())
let id=0
const usuarios ={

}

//get
app.get('/usuarios', (req,res) =>
{
    res.json(usuarios)
})

app.post('/usuarios', (req, res) =>{
    id=id+1
    const { nome } = req.body
    const { idade } = req.body
    const { email } = req.body
    const { endereco } = req.body
    usuarios[id] = {
        id,
        nome,
        idade,
        email,
        endereco
    }
    axios.post('http://192.168.68.110:10000/eventos',{
        tipo: 'UsuarioCriado',
        dados: usuarios[id]
    })
    res.status(201).json(usuarios[id])
})

    app.post('/eventos', async (req,res) => {
        try{
            const evento = req.body
            console.log(evento)
        }
        catch(e){}
            finally{
                res.end()
            }
    })

    const port = 3000
    app.listen(port,()=>{
        console.log(`Usuario. Porta ${port}.`)
    })



    /*alterações
    barramento:
      try{
        axios.post('http://192.168.68.110:3000/eventos', eventos)
      }
      catch(e){}
    
    
    
    lembretes 





    */