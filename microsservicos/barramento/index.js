const express = require ('express')
const axios = require('axios')
const app = express()
app.use(express.json())

//declarar uma lista para armazenar eventos perdidos
const eventos = []
app.post('/eventos', async (req, res) => {
  const evento = req.body
  console.log(evento)
  //adicionar o evento da vez à lista de eventos perdidos
  eventos.push(evento)
  try{
  await axios.post('http://192.168.1.111:8000/eventos', evento)
  }
  catch(e){}
  try{
  await axios.post('http://192.168.1.111:4000/eventos', evento)
  }
  catch(e){}
  try{
  await  axios.post('http://192.168.1.111:5000/eventos', evento)
  }
  catch(e){}
    try{
    await axios.post('http://192.168.1.111:6000/eventos', evento)
  }
  catch(e){
  try{
  await axios.post('http://192.168.1.111:7000/eventos', evento)
  }catch (e) {}
  try{
    await axios.post('http://192.168.1.111:3000/eventos', evento)
  }
  catch(e){}

    console.log('Serviço inoperante. Evento armazenado para recuperação')
  }
  res.end()
})

//fazer um endpoint GET /eventos devolvendo a coleção de eventos perdidos
app.get('/eventos', (req, res) => {
  res.json(eventos)
})

//colocar o barramento em execução na porta 10000. mostre um log dizendo que ele subiu nessa porta
const port = 10000
app.listen(port, () => console.log(`Barramento. Porta ${port}.`))