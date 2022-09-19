const router = require('express').Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
const flash = require('connect-flash');

router.get('/', (req, res) => {
    res.render("admin/index")
})

router.get('/posts', (req, res) => {
    res.send("Página de posts")
})

router.get("/categorias", (req, res) => {
    Categoria.find().lean().sort({date: 'desc'}).then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect("/admin")
    })
})

router.post("/categorias/nova", (req, res) => {

    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({texto: "Nome Inválido"})
    }
    
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({texto: "Slug inválido"})
    }
    
    if(req.body.nome.length < 2) {
        erros.push({texto: "Nome da categoria é muito pequeno" })
    }

    if(erros.length > 0) {
        res.render('admin/addcategoria', {erros: erros});
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(() => {
            req.flash('success_msg', 'Categoria criada com sucesso');
            res.redirect('/admin/categorias');
        }).catch(err => {
            req.flash('error_msg', 'Houve um erro ao salvar a categoria, tente novamente');
            res.redirect('/admin');
        })
    }

})

router.get("/categorias/edit/:id", (req, res) => {
    Categoria.findOne({_id: req.params.id}).lean().then((categoria) => {
        res.render("admin/editcategorias", {categoria: categoria})
    }).catch((err) => {
        req.flash("error_msg", "Está categoria não existe")
        res.redirect("/admin/categorias")
    })
    
})

router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategoria")
})

router.post('/categorias/edit', (req, res) => {

    Categoria.findOne({_id: req.body.id.toString() }).then((categoria) => {

        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flash("sucess_msg", "Categoria editada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar a categoria")
            res.redirect("/admin/categorias")
        })

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar a categoria")
        res.redirect("/admin/categorias")
    })

})

module.exports = router