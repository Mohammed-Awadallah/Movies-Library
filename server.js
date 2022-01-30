'use strict';

const express = require('express');

const app = express();

const jsonData = require("./Movie Data/data.json");

app.listen(3700, () => {
    console.log('Listen to port 3700');
})

function Movie(title , poster , overview) {

    this.title = title;
    this.poster_path = poster;
    this.overview = overview;
}

app.get('/' , movieGetter);
function movieGetter(req,res) {
 
    let movie1 = new Movie(jsonData.title , jsonData.poster_path , jsonData.overview);

    return res.status(200).json(movie1);

}


app.get('/favorite', favorite);
function favorite(req, res){
    return res.status(200).send("Welcome to favorites");
};


