'use strict';

const express = require('express');
const app = express();
const jsonData = require("./Movie Data/data.json");
const dotenv = require('dotenv');
const axios = require("axios");
dotenv.config();
const PORT = process.env.PORT;
const APIKEY = process.env.APIKEY;
app.get('/reviews' , reviews )
app.get('/favorite', favorite);
app.get('/' , movieGetter);
app.get('/trending', trendHandler);
app.get('/searchmovie',movieSearch);
app.use(errorHandler);

app.listen(`${PORT}`, () => {
    console.log(`Listen to port ${PORT}`);
})




function Movie(id,title,release_date,poster_path,overview){
    this.id=id;
    this.title =title,
    this.release_date=release_date;
    this.poster_path = poster_path,
    this.overview =overview 
};

function errorHandler(error, req, res){
    const err = {
        status : 500,
        message : error
    }

    res.status(500).send(err);
};

function movieSearch(req, res){
    
    let searchq = req.query.search;
    let x =[];
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&query=${searchq}`).then(value => {
        
        value.data.results.forEach(movies => {
            let movie1 = new Movie(movies.id , movies.title,movies.release_date ,movies.poster_path,movies.overview);
            x.push(movie1);
        })

        return res.status(200).json(x);
    }).catch(error => {
        errorHandler(error, req,res);
    })
}

function trendHandler(req,res){
    axios.get(`https://api.themoviedb.org/3/movie/634649?api_key=${APIKEY}`).then(value => {
       
            let movieOne = new Movie(value.data.id,value.data.title,value.data.release_date,value.data.poster_path,value.data.overview);            
         return res.status(200).json(movieOne);
    }).catch(error => {
        errorHandler(error, req,res);
    
    });
};


function movieGetter(req,res) {
 
    let movie1 = new Movie(jsonData.title , jsonData.poster_path , jsonData.overview);

    return res.status(200).json(movie1);

}

function favorite(req, res){
    return res.status(200).send("Welcome to favorites");
};

function reviews(error , req , res){
    let myArr = [];
    axios.get(`https://api.themoviedb.org/3/review/5207b24a760ee3630823a626?api_key=${APIKEY}`).then(x => {
          x.data.results.forEach(element => {
              myArr.push(element);
          });
          return res.status(200).json(myArr);
    })

}



