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
      ... usuario,
      lembretes: {}
    }
  },

  LembreteCriado: async (lembrete) => {
    const usuario = baseConsolidada.usuarios[lembrete.usuarioId];
    if (!usuario) return console.error('Usuário não encontrado');

    if (!usuario.lembretes) {
      usuario.lembretes = [];
    }
    baseConsolidada.usuarios[lembrete.usuarioId].lembretes[lembrete.id]= {
      ... lembrete,
      observacoes:[]
    }
    // usuario.lembretes.push({
    //   id: lembrete.id,
    //   texto: lembrete.texto,
    //   observacoes: []
    // });
  },

  LembreteAtualizado: (lembre) => {
    baseConsolidada.usuarios[lembre.usuarioId].lembretes[lembre.id]={
    ...lembre,
    observacoes: baseConsolidada.usuarios[lembre.usuarioId].lembretes[lembre.id].observacoes
    }
  },
  ObservacaoCriada: (observacao) => {
    // const usuario = baseConsolidada.usuarios[observacao.usuarioId];
    // if (!usuario) return console.error('Usuário não encontrado');
    // {}
    // const lembrete = usuario.lembretes.find(l => l.id === observacao.lembreteId);
    // if (!lembrete) return console.error('Lembrete não encontrado');
    // {}
    const user = Object.values(baseConsolidada.usuarios).find(i => i.lembretes[observacao.lembreteId])
    user.lembretes[observacao.lembreteId].observacoes.push(observacao)

  },
   
  
  
  ObservacaoAtualizada: async (observacao) => {
    //atualizar a base consolidada
    const user = Object.values(baseConsolidada.usuarios).find(i => i.lembretes[observacao.lembreteId])
    const observacoes = user.lembretes[observacao.lembreteId].observacoes
    const index = observacoes.findIndex(o => o.id === observacao.id)
    observacoes[index] = observacao
  },
}


//Fazer tratamento de Erro 


  // LembreteAtualizado:  async(lembrete) =>{
  //   // atualizar base lembrete
  //   // lembrete.push(lembrete)
  //   const lembretes = baseConsolidada['lembrete']
  //   indice = lembretes.findIndex(l => l.id == lembrete.id)
  //   lembretes[indice] = lembrete

  // }
  

//endpoint para obtenção da base consolidada (o front end usa)
app.get('/usuarios', (req, res) => {
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
  const resp = await axios.get('http://192.168.1.111:10000/eventos')
  resp.data.forEach((eventoPerdido) => {
    try{
      funcoes[eventoPerdido.tipo](eventoPerdido.dados)
    }
    catch(e){}
  })
})