const axios = require('axios')
const express = require('express')
const app = express()
app.use(express.json())
/*
{
  1: {
    id: 1,
    texto: "Ver um filme",
    observacoes: [
      {
        id: 1001,
        texto: "Entre 04 e 08h",
        lembreteId: 1
      },
      {
        id: 1002,
        texto: "Fazer pipoca",
        lembreteId: 1
      }
    ]
  },
  2: {
    id: 2,
    texto: "Fazer feira"
  }
}
*/
const baseConsolidada = {
  usuarios: {}
}

const funcoes = {
  UsuarioCriado: async (usuario) => {
    baseConsolidada.usuarios[usuario.id] = { 
      id: usuario.id,
      nome: usuario.nome,
      lembretes: []
    }
  },

  LembreteCriado: async (lembrete) => {
    const usuario = baseConsolidada.usuarios[lembrete.usuarioId];
    if (!usuario) return console.error('Usuário não encontrado');

    if (!usuario.lembretes) {
      usuario.lembretes = [];
    }

    usuario.lembretes.push({
      id: lembrete.id,
      texto: lembrete.texto,
      observacoes: []
    });
  },

  ObservacaoCriada: async (observacao) => {
    const usuario = baseConsolidada.usuarios[observacao.usuarioId];
    if (!usuario) return console.error('Usuário não encontrado');

    const lembrete = usuario.lembretes.find(l => l.id === observacao.lembreteId);
    if (!lembrete) return console.error('Lembrete não encontrado');

    lembrete.observacoes = [...(lembrete.observacoes || []), {
      id: observacao.id,
      texto: observacao.texto,
      lembreteId: observacao.lembreteId
    }];
  }
}
  // ObservacaoAtualizada: async (observacao) => {
  //   //atualizar a base consolidada
  //   const observacoes = baseConsolidada[observacao.lembreteId]['observacoes']
  //   const indice = observacoes.findIndex(o => o.id === observacao.id)
  //   observacoes[indice] = observacao
  // },

  // LembreteAtualizado:  async(lembrete) =>{
  //   // atualizar base lembrete
  //   // lembrete.push(lembrete)
  //   const lembretes = baseConsolidada['lembrete']
  //   indice = lembretes.findIndex(l => l.id == lembrete.id)
  //   lembretes[indice] = lembrete

  // }
  

//endpoint para obtenção da base consolidada (o front end usa)
app.get('/usuarios', (req, res) => {
  //devolver a base consolidada como json, use o objeto res
  res.json(baseConsolidada)
})
//endpoint para receber eventos (o barramento usa)
app.post('/eventos', async (req, res) => {
  try{
    const evento = req.body
    console.log(evento)
    await funcoes[evento.tipo](evento.dados)
  }
  catch(e){}
  finally{
    res.end()
  }
})

const port = 6000
app.listen(port, async () => {
  console.log(`Consulta. Porta ${port}.`)
  const resp = await axios.get('http://localhost:10000/eventos')
  resp.data.forEach((eventoPerdido) => {
    try{
      funcoes[eventoPerdido.tipo](eventoPerdido.dados)
    }
    catch(e){}
  })
})