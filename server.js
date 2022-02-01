'use strict';

const express = require('express');
const app = express();
const jsonData = require("./Movie Data/data.json");
const dotenv = require('dotenv');
const axios = require("axios");
const pg = require("pg");
const { Client } = require('pg/lib');
dotenv.config();
const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);
app.use(express.json());
const PORT = process.env.PORT;
const APIKEY = process.env.APIKEY;
app.get('/collection' , getCollection )
app.get('/favorite', favorite);
app.get('/' , movieGetter);
app.get('/trending', trendHandler);
app.get('/searchmovie',movieSearch);
app.post("/addMovie" , addMovieHandler);
app.get("/getMovies" , getMoviesHandler)
app.use(errorHandler);







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
    let arrayMovie=[];
    axios.get(`https://api.themoviedb.org/3/trending/all/day?api_key=${APIKEY}`).then(value => {
         
            value.data.results.forEach(value=>{
            let movieOne = new Movie (value.id,value.title,value.release_date,value.poster_path,value.overview);            
                arrayMovie.push(movieOne)
            })
          
         return res.status(200).json(arrayMovie);
    }).catch(error => {
        errorHandler(error, req,res);
    });
}


function movieGetter(req,res) {
 
    let movie1 = new Movie(jsonData.id , jsonData.title , jsonData.release_date , jsonData.poster_path , jsonData.overview);

    return res.status(200).json(movie1);

}

function favorite(req, res){
    return res.status(200).send("Welcome to favorites");
};


function getCollection(req,res){
    axios.get(`https://api.themoviedb.org/3/collection/97460?api_key=${APIKEY}`).then(value => {
                
            let collectionOne = new Movie (value.data.id,value.data.name,value.data.overview,value.data.poster_path,value.data.backdrop_path);            
         return res.status(200).json(collectionOne);
    }).catch(error => {
        errorHandler(error, req,res);
    
    });
};

function addMovieHandler(req , res){
    let movie = req.body;
    const sql = `INSERT INTO anymovie(title, release_date, poster, overview, comment) VALUES($1, $2, $3, $4, $5) RETURNING *;`
    let value = [movie.title, movie.release_date, movie.poster_path, movie.overview, movie.comment];
    client.query(sql,value).then((data) => {
         
        return res.status(201).json(data.rows);
    })
}
function getMoviesHandler(req , res){
    const sql = `SELECT * FROM anymovie`;
    client.query(sql).then(data => {
        return res.status(200).json(data.rows);
    })
}


client.connect().then(() => {
    app.listen(`${PORT}`, () => {
        console.log(`Listen to port ${PORT}`);
    });
});



