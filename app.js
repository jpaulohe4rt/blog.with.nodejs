//Carregando modulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require("./routes/admin")
const path = require("path")
const mongoose = require('mongoose')
const session = require("express-session")
const flash = require("connect-flash")


// Configurações
    //Sessão
        app.use(session({
            secret: "cursonode",
            resave: false,
            saveUninitialized: true,
            cookie: { secure:true }
        }))
        app.use(flash())
    // Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            next()
        })
    
    //Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    // Handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars');
    // Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect("mongodb://localhost/blogapp", {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            console.log("Conectado com o mongo")
        }).catch((err) => {
            console.log("Servidor não conectado " + err)
        })
    //Public
    app.use(express.static('public'));


// Rotas
    app.use('/admin', admin)
// Outros
const PORT = 8081
app.listen(PORT, () => {
    console.log("Servidor rodando! ")
})