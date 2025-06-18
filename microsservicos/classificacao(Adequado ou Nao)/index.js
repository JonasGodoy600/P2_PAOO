const axios = require('axios')
const express = require('express')
const app = express()
app.use(express.json())



const funcoes = {

  LembreteCriado: async (lembrete) => {
    // console.log(lembretes.status.lenght>=50)
      console.log(lembrete)

    await axios.post(
      'http://192.168.68.110:10000/eventos',{
        tipo: 'LembreteClassificado',
        dados: lembrete
      }
    )
  },


  ObservacaoCriada: async (observacao) => {
    //1. Atualizar o status da observação
    //se o texto incluir a palavraChave, trocar o status para importante
    //caso contrário, trocar o status para comum


    console.log(observacao.status.includes(palavraChave))
      console.log(observacao)
    //emitir um evento do tipo ObservacaoClassificada, direcionado ao barramentpo
    //use a observacao como "dados"
    //emita o evento com a axios
    await axios.post(
        'http://192.168.68.110:10000/eventos',{
          tipo: 'ObservacaoClassificada',
          dados: observacao
        }
    )
  }
}



app.post('/eventos', async (req, res) => {
  try{
    const evento = req.body
    console.log(evento)
    const funcao = funcoes[evento.tipo]
    if (funcao) {
      await funcao(evento.dados)
    }
  }
  catch(e){
    console.error('Erro para processar o evento:', e.message)
  }
  finally{
    res.end()
  }
})
const port = 1000
app.listen(port, async () => {console.log(`Classificação. Porta ${port}`)
  try {
    const resposta = await axios.get('http://192.168.68.110:10000/eventos')
    const eventos = resposta.data
    console.log(`Recuperando ${eventos.length} eventos perdidos`)

    for (let evento of eventos) {
      const funcao = funcoes[evento.tipo]
      if (funcao) {
        await funcao(evento.dados)
      }
    }
  } catch(erro) {
    console.log('Erro ao recuperar eventos:', erro.message)
  }
})