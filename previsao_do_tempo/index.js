const axios = require('axios')

const protocol = 'https'
const baseURL = 'api.openweathermap.org/data/2.5/forecast'
const appid = ''
const q = 'Itu'
const units = 'metric'
const lang = 'pt_br'
const cnt = 2

const url = `${protocol}://${baseURL}?appid=${appid}&q=${q}&units=${units}&lang=${lang}&cnt=${cnt}`


axios.get(url)
.then(function(res){
    console.log(res)
    console.log('++++++++++++++++++++++++++++++++')
    return res.data
})
.then((res) => {
    console.log(res)
    console.log('++++++++++++++++++++++++++++++++')
    return res
})
.then(res => {
    console.log(`cnt: ${res.cnt}`)
    console.log('++++++++++++++++++++++++++++++++')
    return res
})
.then(res => {
    console.log(`Temp max do primeiro dia: ${res['list'][0].main.temp_max}`)    
})
.catch((err) => {console.log(`Erro: ${err}`)})