require("dotenv").config();
var axios = require('axios');
var moment = require('moment');

//vars for spotify 
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

var userSearch = "";

function grabInput (){
    for (var i = 3;  i < process.argv.length; i++){
        if (i === 3){
            userSearch += `${process.argv[i]}`
        } else {
            userSearch += `+${process.argv[i]}`
        }
       
    }
    console.log(userSearch);
}

grabInput();
// //spotify section

if (process.argv[2] === "concert-this"){
    console.log("concert");
    grabInput();
    console.log("user search: " + userSearch);
} else if (process.argv[2] === "spotify-this-song"){
    var spotifyUrl = "https://api.spotify.com/v1/search?query=" + userSearch + "&type=track&offset=0&limit=20";

    axios.get(spotifyUrl).then(
        function(response){
            console.log(response.tracks);
        }
    )
} else if (process.argv[2] === "movie-this"){
    var omdbUrl = "http://www.omdbapi.com/?t=" + userSearch + "&y=&plot=short&apikey=trilogy";
    axios.get(omdbUrl).then(
        function(response){
            console.log("Title: " + response.data.Title);
            console.log("Year Released: " + response.data.Year);
            console.log("IMD rating: " + response.data.Ratings[0].Value);
            // console.log(response.data.Ratings[1]);
            console.log("Rotten Tomatoes rating: " + response.data.Ratings[1].Value);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
        }
    )
} else if (process.argv[2] === "do-what-it-says"){

}

// {"Title":"My Girl",
// "Year":"1991",
// "Rated":"PG",
// "Released":"27 Nov 1991",
// "Runtime":"102 min",
// "Genre":"Comedy, Drama, Family, Romance","Director":"Howard Zieff",
// "Writer":"Laurice Elehwany",
// "Actors":"Dan Aykroyd, Jamie Lee Curtis, Macaulay Culkin, Anna Chlumsky",
// "Plot":"A young girl, on the threshold of her teen years, finds her life turning upside down, when she is accompanied by an unlikely friend.","Language":"English",
// "Country":"USA",
// "Awards":"2 wins & 5 nominations.","Poster":"https://m.media-amazon.com/images/M/MV5BYWM2ZDliNjItZTcxOC00NTY2LWE1ODctNzRhNGM3YWIyYjBiXkEyXkFqcGdeQXVyNTIzOTk5ODM@._V1_SX300.jpg",
// "Ratings":[{"Source":"Internet Movie Database","Value":"6.9/10"},{"Source":"Rotten Tomatoes","Value":"56%"},{"Source":"Metacritic","Value":"56/100"}],"Metascore":"56","imdbRating":"6.9","imdbVotes":"66,878","imdbID":"tt0102492","Type":"movie","DVD":"26 May 1998","BoxOffice":"N/A","Production":"Sony Pictures Home Entertainment","Website":"N/A","Response":"True"}