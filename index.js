const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require('express')
const app = express()


const newspaper=[
    {
        name:'thetimes',
        address:'https://www.nytimes.com/section/world/asia',
        base:'https://www.nytimes.com',
    },
    {
        name:'guardian',
        address:'https://www.theguardian.com/world/asia',
        base:'',
    },
    {
        name:'telegraph',
        address:'https://www.telegraph.co.uk/asia/',
        base:'https://www.telegraph.co.uk',
    },
    {
        name:'cnn',
        address:'https://www.cnn.com/asia/',
        base:'https://www.cnn.com',
    },
    {
        name:'nbc',
        address:'https://www.nbcnews.com/world/',
        base:'',
    },
    {
        name:'washingtonpost',
        address:'https://www.washingtonpost.com/world/asia-pacific/',
        base:'',
    },
    {
        name:'abc',
        address:'https://abcnews.go.com/International/',
        base:'',
    },
    {
        name:'bbc',
        address:'https://www.bbc.com/news/world/asia',
        base: 'https://www.bbc.com'
    },
    {
        name:'straitstimes',
        address:'https://www.straitstimes.com/asia',
        base: 'https://www.straitstimes.com'
    }
]

//function to remove space
const removeExtraSpace = (s) => s.trim().split(/ +/).join(' ');

//collecting all articles for 3 countries
const articles =[]

//collecting all articles for China
const china_articles=[]

//collecting all articles for Japan
const japan_articles=[]

//collecting all articles for korea
const korea_articles=[]

//collecting all articles for US and china relations
const china_us_articles=[]


//goes through each newspaper and looks at the anchor for keyword: China
newspaper.forEach(newspaper=>{
    //sends request to get the data/html from the adress
    axios.get(newspaper.address)
    .then(response=>{
        //stores into html variable
        const html = response.data
        //cherio loads the html
       const $ = cheerio.load(html)
        //basically a loop that finds all "Chin" in anchor tag
        //usually headers can be chinese or chin
       $('a:contains("China")', html).each(function(){
            const title = removeExtraSpace($(this).text())
            const url = $(this).attr('href')
            //filters out China tabs with anchors
            //pushing objects to articles that contain all 3
            if(title!="China"){
            articles.push({
                title,
                url:  newspaper.base + url,
                source: newspaper.name
            })
            china_articles.push({
                title,
                url:  newspaper.base + url,
                source: newspaper.name
            })
            }
        })
        $('a:contains("US")', html).each(function(){
            const title = removeExtraSpace($(this).text())
            const url = $(this).attr('href')
            if(title.includes("China")){
            china_us_articles.push({
                title,
                url:  newspaper.base + url,
                source: newspaper.name
            })
            }
        })

        //gets japan articles
        $('a:contains("Japan")', html).each(function(){
            const title = $(this).text()
            const url = $(this).attr('href')
            //pushing objects to array
            articles.push({
                title,
                url:  newspaper.base + url,
                source: newspaper.name
            })
            japan_articles.push({
                title,
                url:  newspaper.base + url,
                source: newspaper.name
            })
        })
        //gets Korea articles
        $('a:contains("Korea")', html).each(function(){
            const title = $(this).text()
            const url = $(this).attr('href')
            //pushing objects to array
            articles.push({
                title,
                url:  newspaper.base + url,
                source: newspaper.name
            })
            korea_articles.push({
                title,
                url:  newspaper.base + url,
                source: newspaper.name
            })
        })

    })
})

//if u get the request of /
//then respond
app.get('/', (req, res) =>{
    res.json("Welcome to the china news api")
})

//when path is /news it gets the all articles from around the world
app.get('/news', (req, res) =>{
    res.json(articles)
})



app.get('/china', (req, res) =>{
    res.json(china_articles)
})



app.get('/japan', (req, res) =>{
    res.json(japan_articles)
})

app.get('/korea', (req, res) =>{
    res.json(korea_articles)
})

app.get('/china_us', (req, res) =>{
    res.json(china_us_articles)
})


app.get('/news/disease', (req, res) =>{
    const specificArticles = []
    articles.forEach(articles=>{
        title = articles.title
        title = title.toLowerCase()
        if(title.includes("virus") || title.includes("covid")){
            specificArticles.push({
                title,
                url: articles.url,
                source: articles.source,
                section: "disease"
            })
        }
        //console.log(title)   
    })
    res.json(specificArticles)
})

app.get('/news/conflict', (req, res) =>{
    const specificArticles = []
    articles.forEach(articles=>{
        title = articles.title
        title = title.toLowerCase()
        if(title.includes("war") || title.includes("tensions") || title.includes("missle") || title.includes("attack")){
            specificArticles.push({
                title,
                url: articles.url,
                source: articles.source,
                section: "conflict"
            })
        }
        //console.log(title)   
    })
    res.json(specificArticles)
})


//parses for all 3 countries from newspaperId
app.get('/news/:newspaperId', async(req,res) =>{
    //fetches data based on the newpaperId inputted
    const newspaperId = req.params.newspaperId
    //filters from newspaper containing all 3 countries by id
    //takes the base and address
    const newspaperAddress = newspaper.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspaper.filter(newspaper => newspaper.name == newspaperId)[0].base

    //axios sends req to get the adress
    //corresponding to the newspaperId
    axios.get(newspaperAddress)
    .then(response=>{
        const html = response.data
        //object named $ that loaded the response.data <- axios
        const $ = cheerio.load(html)
        //array that holds specific articles
        const specificArticles = []

        //$ object parses and looks for "China"
        $('a:contains("China")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')
            specificArticles.push({
                title,
                url: newspaperBase + url,
                source: newspaperId
            })
        })
        //we can copy the above code and parse to look for "Japan if needed"
        $('a:contains("Japan")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')
            specificArticles.push({
                title,
                url: newspaperBase + url,
                source: newspaperId
            })
        })
        //looks for korea also
        $('a:contains("Korea")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')
            specificArticles.push({
                title,
                url: newspaperBase + url,
                source: newspaperId
            })
        })
        res.json(specificArticles)
    }).catch(err => console.log(err))

})


app.get('/china/:newspaperId', async(req,res) =>{
    //fetches data based on the newpaperId inputted
    const newspaperId = req.params.newspaperId
    const newspaperAddress = newspaper.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspaper.filter(newspaper => newspaper.name == newspaperId)[0].base

    //axios sends req to get the adress
    //corresponding to the newspaperId
    axios.get(newspaperAddress)
    .then(response=>{
        const html = response.data
        //object named $ that loaded the response.data <- axios
        const $ = cheerio.load(html)
        //array that holds specific articles
        const specificArticles = []

        //$ object parses and looks for "China"
        $('a:contains("China")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')
            specificArticles.push({
                title,
                url: newspaperBase + url,
                source: newspaperId
            })
        })
        res.json(specificArticles)
    }).catch(err => console.log(err))

})

//does not work

app.get('/korea/:newspaperId', async(req,res) =>{
    //fetches data based on the newpaperId inputted
    const newspaperId = req.params.newspaperId
    const newspaperAddress = newspaper.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspaper.filter(newspaper => newspaper.name == newspaperId)[0].base

    //axios sends req to get the adress
    //corresponding to the newspaperId
    axios.get(newspaperAddress)
    .then(response=>{
        const html = response.data
        //object named $ that loaded the response.data <- axios
        const $ = cheerio.load(html)
        //array that holds specific articles
        const specificArticles = []

        //$ object parses and looks for "China"
        $('a:contains("Korea")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')
            specificArticles.push({
                title,
                url: newspaperBase + url,
                source: newspaperId
            })
        })
        res.json(specificArticles)
    }).catch(err => console.log(err))

})

app.get('/japan/:newspaperId', async(req,res) =>{
    //fetches data based on the newpaperId inputted
    const newspaperId = req.params.newspaperId
    const newspaperAddress = newspaper.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspaper.filter(newspaper => newspaper.name == newspaperId)[0].base

    //axios sends req to get the adress
    //corresponding to the newspaperId
    axios.get(newspaperAddress)
    .then(response=>{
        const html = response.data
        //object named $ that loaded the response.data <- axios
        const $ = cheerio.load(html)
        //array that holds specific articles
        const specificArticles = []

        //$ object parses and looks for "China"
        $('a:contains("Korea")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')
            specificArticles.push({
                title,
                url: newspaperBase + url,
                source: newspaperId
            })
        })
        res.json(specificArticles)
    }).catch(err => console.log(err))

})



app.listen(PORT, ()=> console.log(` server running on PORT ${PORT}`))
