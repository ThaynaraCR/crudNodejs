const express=require('express');
const bodyParser=require('body-parser');
const mysql=require('mysql');
const handlebars=require('express-handlebars');
const app=express();
const urlencodeParser=bodyParser.urlencoded({extended:false});
const sql=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    port:3306
});

sql.query("use crudnodejs");


//Template engine
app.engine("handlebars",handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/img', express.static('img'));



//Routes and Templates
app.get("/", function (req,res) {res.render('index');});
app.get("/inserir", function (req,res) {res.render("inserir");})
app.get("/selecionar/:id?", function (req,res) {
    if(!req.params.id) {
        sql.query("select * from mercado", function (err, results, fields){
            res.render('selecionar', {data:results});
        });
    }else{
        sql.query("select * from mercado where id=?",[req.params.id], function (err, results, fields){
            res.render('selecionar', {data:results});
        });
    }
});


app.post("/controllerForm", urlencodeParser, function(req,res){
  sql.query("insert into mercado values(?,?,?)", [req.body.id, req.body.produto, req.body.preco]);
  res.render('controllerForm',{produto:req.body.produto});
});

app.get('/excluir/:id', function(req,res){
    sql.query("delete from mercado where id=?",[req.params.id]);
    res.render('excluir');
})

app.get("/alterar/:id", function(req,res){
    sql.query("select * from mercado where id=?", [req.params.id], function (err,results,fields) {
        res.render('alterar',{id:req.params.id, produto:results[0].produto,preco:results[0].preco});
    });

});

app.post("/alterar/:id",urlencodeParser,function (req,res){
    sql.query("update mercado set produto=?, preco=? where id=?",[req.body.produto,req.body.preco,req.body.id]);
    res.render('controllerAlterar',{produto:req.body.produto});
});

//Start Server
app.listen(3000,function (req,res) {
 console.log('servidor está funcionando');
});

