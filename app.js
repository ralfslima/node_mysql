// const {realizarConexao} = require('./conexao');
const express = require('express');

const fileUpload = require('express-fileupload');
const { engine } = require ('express-handlebars');

const fs = require("fs");
const path = require('path');

const mysql = require('mysql2');
// Conexão
let con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'12345678',
    database:'projeto'
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });



const app = express();
app.use(fileUpload());


app.use('/imagens', express.static(path.join(__dirname, 'imagens')));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');


app.post('/cadastrar', function(req, res){
    const { image } = req.files;

    // If no image submitted, exit
    if (!image) return res.sendStatus(400);

    // Move the uploaded image to our upload folder
    image.mv(__dirname + '/imagens/' + image.name);

    var sql =  `INSERT INTO produtos (produto, valor, imagem) VALUES ('${req.body.produto}', ${req.body.valor}, '${image.name}')`;

    

        con.query(sql, function(erro, resultado){
            if (erro){
                res.redirect('/');
            }
            res.redirect('/okCadastrar');
        
    })
})

app.get('/', function(req, res){

    var sql =  `SELECT * FROM produtos`;



    con.query(sql, function(erro, resultado){
        if (erro){
            res.render('inicio', {falhaListarProdutos:true});
        } else{
            res.render('inicio', {produtos:resultado});
        }    
    })

})

app.get('/:acao', function(req, res){

    var sql =  `SELECT * FROM produtos`;

    console.log(req.params)

    con.query(sql, function(erro, resultado){
        if (erro){
            res.render('inicio', {falhaListarProdutos:true});
        } else{
            if(req.params.acao === 'okCadastrar'){
                res.render('inicio', {produtos:resultado, cadastrarOk:true});
            }else  if(req.params.acao === 'okRemover'){
                res.render('inicio', {produtos:resultado, removerOk:true});
            }else{
                res.render('inicio', {produtos:resultado});
            }
        }    
    })

})

app.get('/remover/:codigo', function(req, res){
   

    var sql1 =  `SELECT imagem FROM produtos WHERE codigo = ${req.params.codigo}`;
    var sql2 =  `DELETE FROM produtos WHERE codigo = ${req.params.codigo}`;

    con.query(sql1, function(erro1, resultado1){
        
        // Remover imagem
        fs.unlink(__dirname+'/imagens/'+resultado1[0].imagem, (erro) => {
            console.log("Falha ao remover a imagem, o arquivo não existe.");
        });        

    })

    con.query(sql2, function(erro2, resultado2){
        
       res.redirect('/okRemover');      

    })
        

        

})

app.listen(8080);