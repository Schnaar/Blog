const express =require('express')
const Article=require('./../models/article')
const article = require('./../models/article')
const router = express.Router()
router.get('/new',(req,res)=>{
    res.render('articles/new')
})
router.get('/edit/:id',async (req,res)=>{
    const article= await Article.findById(req.params.id)
    res.render('articles/edit',{article:article})
})
router.get('/:slug', async (req,res)=>{//uses slug for prettier url
    const article= await Article.findOne({slug: req.params.slug})//finds the article
    if (article==null) res.redirect('/')//if not there ir redirects to home
    res.render('articles/show',{article: article})//renders the article and passes the article to it

})
router.post('/', async (req,res,next)=>{
    req.article=new Article()  
   next()//tells it to move on to saveArticleAndRedirect

},saveArticleAndRedirect('new')
)

router.delete('/:id',async (req,res)=>{
    await Article.findByIdAndDelete(req.params.id)//deletes using id
    res.redirect('/')

})
module.exports=router

router.put('/:id',async (req,res,next)=>{
    req.article= await article.findById(req.params.id)//uses id from route to find article you wan to edit which can then be edited in saveArticleAndRedirect
   next()//tells it to move on to saveArticleAndRedirect

},saveArticleAndRedirect('edit')
)

function saveArticleAndRedirect(path){//shared functionality between edit and create
    return async (req,res)=> {
        let article= req.article
            article.title=req.body.title,
            article.description=req.body.description,
            article.markdown=req.body.markdown
        
        try{
             article= await article.save()
             res.redirect(`/articles/${article.slug}`)//redirects to home if save succesful
        }catch (e){
            console.log(e)
            res.render('articles/${path}',{article:article})//redirects to same page if error
            
        }

    }
}