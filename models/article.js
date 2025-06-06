const mongoose= require("mongoose")
const marked= require("marked")
const slugify=require("slugify")
const createDomPurify=require("dompurify")
const {JSDOM}=require("jsdom")
const dompurify=createDomPurify(new JSDOM().window)
const articleSchema= new mongoose.Schema({//creates the model
    title:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    markdown:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    slug:{
        type:String,
        required: true,
        unique: true

    },
    sanatizedHTML:{
        type: String,
        required:true
    }

})
articleSchema.pre("validate", function(next){
    if (this.title){
        this.slug=slugify(this.title,{lower: true, strict: true})//creates slug for url from title, removes any characters that can't be in URL

    }
    if (this.markdown){
        this.sanatizedHTML=dompurify.sanitize(marked.parse((this.markdown)))//creates sanatized html so JavaScript can't be run
    }
    next()
})
module.exports=mongoose.model('Article',articleSchema)