// Article scraper for Chosun TV

const fetch = require('node-fetch');
const cheerio = require('cheerio');

const url = "https://nsearch.chosun.com/search/total.search?cs_search=writtersinarticle&writer=";
const contentUrl = "https://news.chosun.com/site/data/html_dir/";


function getArticleContent(articleID){
    return fetch(`${contentUrl}${articleID}`).then(response=>response.text())
        .then(
            body=>{
                const $ =cheerio.load(body);
                //console.log(body);
                let content="";
                const $title = $('.news_title_text h1');
                const journalist = $('.news_title_author ul li a').text();
                const title = $title.text().trim();
                $('div.par').each(function(index, element){
                    const $element = $(element)
                    //console.log($element.text())
                    content += $element.text();
                })
                //console.log(content+"\n");
                content.trim();
                return {
                    title,
                    journalist,
                    content
                }
                });

}

function searchByJournalist(journalist){
    return fetch(`${url}${journalist}`)
        .then(response => response.text())
        .then(
            body=> {
                const $ = cheerio.load(body);
                const articles = [];

                //const totalArticleNumber = ChosunStringToNumber($('.count_box').text());
                //console.log(totalArticleNumber);

                $('.search_news').each(  function (index, element) {
                    const $element = $(element);
                    const $title = $element.find('dt a');
                    const $image = $element.find('dd a img');
                    const $date = $element.find('dd span.date');
                    const $articleID = $title.attr('href').match(/site\/data\/html_dir\/(.*)\/*/)[1];

                    const article = {
                        journalist: decodeURI(journalist),
                        title: $title.text().replace(/ /gi, "").trim(),
                        content: $title.attr('href'),
                        articleID: $articleID,
                        image: $image.attr('src'),
                        date: $date.text().trim()
                    }
                    /*
                    console.log($title.text().replace(/ /gi, ""));
                    console.log($image.attr('src'))
                    */
                    articles.push(article);

                });

                return articles
            })

}
/*
function getArticleNum(){
    searchByJournalist(urlencode(journalistName))
        .then(
            body=>{
                const $= cheerio.load(body);
                const totalArticleNumber = ChosunStringToNumber($('.count_box').text());
                return (totalArticleNumber);

            }
        )
}
*/

function ChosunStringToNumber(data){
    // data : 0,000건 0~0중
    data.replace(/ /gi, "");
    let number= data.split("\n")[0];
    number = number.replace("건","");
    number = number.replace(",","");

    return parseInt(number);
}


module.exports = {
    searchByJournalist,
    getArticleContent
};



/*
const name = '김은중';

console.log(utf8.encode(name));

console.log(utf8.encode('%EA%B9%80%EC%9D%80%EC%A4%91%20%EA%B8%B0%EC%9E%90'));

const st = querystring.decode('%EC%9D%B4%EB%AF%BC%EC%84%9D');
console.log(Object.keys(st)[0]);

const kms = querystring.encode('이민성');
console.log(Object.keys(kms)[0]);

*/