const express = require('express')
const app = express()
const sqlite = require('sqlite')
const dbConnection = sqlite.open('banco.sqlite', {Promise})
const bodyParser = require('body-parser')

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', async(request, response) => {
    const db = await dbConnection
    const categoriasDB = await db.all('select * from categorias;')
    const vagas = await db.all('select * from vagas;')
    const categorias = categoriasDB.map(cat => {
        return {
            ...cat,
            vagas: vagas.filter(vaga => vaga.categoria === cat.id)
        }
    })
    response.render('home', {
        categorias  
    })
})

app.get('/vaga/:id', async(request, response) => {
    const db = await dbConnection
    const vaga = await db.get('select * from vagas where id =  '+ request.params.id)

    response.render('vaga', {
        vaga
    })
})

app.get('/admin', (request, response) => {
    response.render('admin/home')
})

app.get('/admin/vagas', async(request, response) => {
    const db = await dbConnection
    const vagas = await db.all('select * from vagas;')
    response.render('admin/vagas', {vagas})
})

app.get('/admin/vagas/delete/:id', async(request, response) => {
    const db = await dbConnection
    await db.run('delete from vagas where id = '+ request.params.id) //'limit 1'
    response.redirect('/admin/vagas')
})

app.get('/admin/vagas/nova', async(request, response) => {
    response.render('admin/nova-vaga')
})

app.post('/admin/vagas/nova', async(request, response) => {
    const db = await dbConnection
    const{titulo, descricao, categoria} = request.body
    await db.run(`insert into vagas(categoria, titulo, descricao) values('${categoria}' , '${titulo}', '${descricao}')`)
    response.redirect('/admin/vagas')
})

const init = async() => {
    const db = await dbConnection
    await db.run('create table if not exists categorias(id INTEGER PRIMARY KEY, categoria TEXT);')
    await db.run('create table if not exists vagas(id INTEGER PRIMARY KEY, categoria INTEGER, titulo TEXT, descricao TEXT);')
    // const categoria = 'Marketing team'
    // await db.run(`insert into categorias(categoria) values('${categoria}')`)
    // const vaga = 'Marketing Digital (San Francisco)'
    // const descricao = 'Vaga para marketeiro para tecnologia'
    // await db.run(`insert into vagas(categoria, titulo, descricao) values(2, '${vaga}', '${descricao}')`)
}
init()

app.listen(3000, (err) => {
if(err) {
    console.log('Não foi possivel iniciar o servidor do Jobify')
}
else{
    console.log('Running Jobify Server...')
}})