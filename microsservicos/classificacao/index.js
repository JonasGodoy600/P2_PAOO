const axios = require('axios')
const express = require('express')
const app = express()
app.use(express.json())
const palavraChave = 'importante'
const ilicito='Maconha'
const { GoogleGenerativeAI } = require('@google/generative-ai');



const genAI =new GoogleGenerativeAI( {apiKey:'AIzaSyActYkZOAIrMAcFN4Z24wZ1QNhXpoj1AI0'});

const funcoes = {

  LembreteCriado: async (lembrete) => {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-pro" })

    // console.log(lembretes.status.lenght>=50)
    lembrete.status = lembrete.texto.length <=50 ? 'importante' : 'comum'
    lembrete.aproprioado = await classificarcomGenAi(lembrete.texto);
      console.log(lembrete)

    await axios.post(
      'http://192.168.68.110:10000/eventos',{
        tipo: 'LembreteClassificado',
        dados: lembrete
      }
    )
  },


  ObservacaoCriada: async (observacao) => {
    
    observacao.aproprioado=await classificarcomGenAi(observacao.texto)||
    console.log(observacao.status.includes(palavraChave))
      console.log(observacao)

    await axios.post(
        'http://192.168.68.110:10000/eventos',{
          tipo: 'ObservacaoClassificada',
          dados: observacao
        }
    )
  }
}

async function classificarcomGenAi(texto){
  try{
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = 'Essa palavra é "apropriado" ou envolve "tema ilicito"? Responda considerando "tema ilicito" como conteudo ofensivo ou ilegal. Para tal responda apenas "apropriado" ou "tema ilicito":\n"' + texto + '"';
    const resultado = await model.generateContent(prompt);
    const response = resultado.response;
    const resposta = response.text().trim().toLowerCase();
    return lembrete.aproprioado.resposta.includes('ilicito') ? 'tema ilicito' : 'apropriado';

  } catch (e){
    console.error("Erro com Genai: ",e);
    return "indefinido";
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
const port = 7000
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