require("dotenv").config();
var axios = require('axios');
var moment = require('moment');

//vars for spotify 
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var spotify = new Spotify({
    id: "7b4855e243894a419ee246d8d11015d8",
    secret: "271dbb1ba3b041fab2e453c9930b18ce"
  });

var userSearch = "";
function search(){
    for (i = 3; i < process.argv.length; i++){
        if (i === 3){
            userSearch += `${process.argv[i]}`
        } else {
            userSearch += `+${process.argv[i]}`
        }
    }
}
search ();
if (process.argv[2] === "concert-this"){
    var bandUrl = "https://rest.bandsintown.com/artists/" + userSearch + "/events?app_id=codingbootcamp";
    
    axios.get(bandUrl).then(function(response){
        var time = moment(response.data[0].datetime).format("MM/DD/YYYY");

        console.log("Venue: " + response.data[0].venue.name);
        console.log("Location: " + response.data[0].venue.city + ", " + response.data[0].venue.region + " " + response.data[0].venue.country);
        console.log("Date and Time: " + time);
        // console.log("test: " + response.EventData[0].id);
    })
    console.log("user search: " + userSearch);
} else if (process.argv[2] === "spotify-this-song"){
    var spotifyUrl = "https://api.spotify.com/" + spotify + "/search?query=" + userSearch + "&type=track&offset=0&limit=2";

    spotify.search({ type: 'track', query: userSearch}, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       
      console.log("Artist: " + data.tracks.items[0].album.artists[0].name); 
      console.log("Title: " + data.tracks.items[0].name);
      console.log("Preview: " + data.tracks.items[0].external_urls.spotify);
      console.log("Album: " + data.tracks.items[0].album.name);
      });
    // axios.get(spotifyUrl).then(
        
    //     function(response){
    //         console.log(response.data);
    //     }
    // )

    //https://accounts.spotify.com/api/token?grant_type=authorization_code&code="+code+"&redirect_uri=myurl&client_secret=mysecret&client_id=myid
 
} else if (process.argv[2] === "movie-this"){
    var omdbUrl = "http://www.omdbapi.com/?t=" + userSearch + "&y=&plot=short&apikey=trilogy";
    var omdbDefault = "http://www.omdbapi.com/?t=Mr+Nobody&y=&plot=short&apikey=trilogy";
    
    if (userSearch){
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
    } else {
        axios.get(omdbDefault).then(
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

    }
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