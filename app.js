const express = require('express');

const chosun = require('./chosun.js');
const urlencode = require('urlencode');

const app = express();

const port = process.env.PORT || 3000;

app.listen(port, () =>{
    console.log(`Listening on ${port}`);
});


app.get('/', (req, res)=>{
    res.json({
        message:'Scraping is Fun!'
    });
});

// /chosun/이민석
app.get('/chosun/:journalist', (req, res)=>{
    chosun
        .searchByJournalist(urlencode(req.params.journalist))
        .then(articles=>{
            res.json(articles);
        });
})
// /chosun/?id=2020/04/02/2020040202934.html
app.get('/chosun', (req,res)=>{
    chosun.getArticleContent(req.query.id)
        .then(article=>{
            res.json(article)

        })
})