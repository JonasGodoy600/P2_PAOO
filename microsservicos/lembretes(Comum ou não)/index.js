const axios = require('axios')
const express = require('express')
const {v4: uuidv4} = require('uuid')
const app = express()
const [GoogleGenerativeA]= require('@GoogleGenerativeAI')
app.use(express.json())

const genAI =new GoogleGenerativeAI(process.env.AIzaSyC5SSpGEl9bfeMyMiQlFsRvJa7fKonAY34);

const lembreteDoUsuario = {}

const funcoes ={
  LembreteClassificado: async (lembretes) => {
    const lembrete = lembreteDoUsuario[lembretes.usuarioId]
    const lembreteAtualizar = lembrete.find( o => o.id === lembretes.id)
    lembreteAtualizar.status = lembretes.status
    lembreteAtualizar.aproprioado = lembrete 
    await axios.post('http://192.168.68.110:10000/eventos', {
      tipo: 'LembreteAtualizado',
      dados: lembretes
    })
  }

}



//POST /lembretes () => {} (endpoint)
app.post('/usuarios/:id/lembretes', (req, res) => {
  const idObs = uuidv4()
  const { texto } = req.body
  const status = "aguarde"
  // texto.length>=50 ? 'importante' : 'comum'
  const aproprioado = "aguarde"
  const lembretesDoUsuario = lembreteDoUsuario[req.params.id] || []
  
  const lembretes = {
    id: idObs,
    usuarioId: req.params.id,
    texto,
    status,
    aproprioado

  }
  lembretesDoUsuario.push(lembretes)
  axios.post('http://192.168.68.110:10000/eventos', {
    tipo: 'LembreteCriado',
    dados: lembretes
  })
  lembreteDoUsuario[req.params.id] = lembretesDoUsuario
  res.status(201).json(lembretesDoUsuario)
})

//GET /lembretes () => {} (endpoint)
app.get('/usuarios/:id/lembretes', function(req, res){
  res.json(lembreteDoUsuario[req.params.id] || [])
})

//definir o endpoint da figura
//ele deve exibir o evento e encerra o tratamento da requisição com res.end
app.post('/eventos', async (req, res) => {
  try{
    const evento = req.body
    console.log(evento)
    funcoes[evento.tipo](evento.dados)
  }
  catch(e){}
  finally{
    res.end()
  }
})

//localhost:porta
const port = 4000
app.listen(port, () => {
  console.log(`Lembretes. Porta ${port}.`)
})
