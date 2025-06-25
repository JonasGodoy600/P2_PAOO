const axios = require('axios')
const express = require('express')
const app = express()
app.use(express.json())
const palavraChave = 'importante'
const ilicito='Maconha'
const { GoogleGenerativeAI } = require('@google/generative-ai');



const genAI =new GoogleGenerativeAI("AIzaSyBzlzSHNcQF91j1i-RDukm6n9hR-QI5IZ0");

async function classificarcomGenAi(texto) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
    const prompt = 'Essa palavra é "apropriado" ou envolve "tema ilicito"? Responda considerando "tema ilicito" como conteudo ofensivo ou ilegal. Para tal responda apenas "apropriado" ou "tema ilicito":\n"' + texto + '"';
    const resultado = await model.generateContent(prompt);
    const response = resultado.response;
    const resposta = response.text().trim().toLowerCase();
    return resposta.includes('ilicito') ? 'tema ilicito' : 'apropriado';
  } catch (e) {
    console.error("Erro com Genai: ", e);
    return "indefinido";
  }
}
const funcoes = {

  LembreteCriado: async (lembrete) => {
  // console.log(lembretes.status.lenght>=50)
    lembrete.status = lembrete.texto.length <=50 ? 'importante' : 'comum'
    lembrete.apropriado = await classificarcomGenAi(lembrete.texto);

      console.log('Lembrete Classificado', lembrete)

    await axios.post(
      'http://192.168.1.111:10000/eventos',{
        tipo: 'LembreteClassificado',
        dados: lembrete
      }
    )
  },


  ObservacaoCriada: async (observacao) => {
    observacao.status = observacao.text.includes(palavraChave) ? 'importante':'comum'
    observacao.apropriado=await classificarcomGenAi(observacao.texto)||
    console.log(observacao.status.includes(palavraChave))
      console.log('Observacao Classificada',observacao)

    await axios.post(
        'http://192.168.1.111:10000/eventos',{
          tipo: 'ObservacaoClassificada',
          dados: observacao
        }
    )
  }
}


app.post('/eventos', async (req, res) => {
  try{
    const evento = req.body
    console.log('Evento chegou',evento)
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
const port = 7000
app.listen(port, async () => {console.log(`Classificação. Porta ${port}`)
  try {
    const resposta = await axios.get('http://192.168.0.227:10000/eventos')
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