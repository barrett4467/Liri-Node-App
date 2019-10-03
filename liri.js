require("dotenv").config(); //this literally reads the env folder and helps authorize spotify
var axios = require('axios'); //api call program
var moment = require('moment'); //this is so we can specify the concert date format
var inquirer = require('inquirer'); //asks the questions 
var fs = require("fs"); //this helps us read the .txt file for do-what-it-says and allows the push to log

//vars for spotify 
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var spotify = new Spotify({
    id: "7b4855e243894a419ee246d8d11015d8",
    secret: "271dbb1ba3b041fab2e453c9930b18ce"
  });

// band function 
function callBands (search){
    if (search){
        var bandUrl = "https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp";
        
        axios.get(bandUrl).then(function(response){
            var time = moment(response.data[0].datetime).format("MM/DD/YYYY");
            console.log("============================");
            console.log("Venue: " + response.data[0].venue.name);
            console.log("Location: " + response.data[0].venue.city + ", " + response.data[0].venue.region + " " + response.data[0].venue.country);
            console.log("Date and Time: " + time);
            console.log("============================");
            // console.log("test: " + response.EventData[0].id);
            
            setTimeout(tryAgain, 2000);
        }).catch(function(){
            console.log("We were unable to find any results...");
            setTimeout(tryAgain, 1000);
        })

    } else {
        console.log("Hmmm that doesn't seem to be valid. Please try again!");
        setTimeout(playGame, 0500);
    }
}

//spotify function
function callSpotify(search) {
    if (search){

        spotify.search({ type: 'track', query: search}, function(err, data) {
            if (err) {
                console.log("We were unable to find any results...");
                setTimeout(tryAgain, 1000);
                return
            }
            console.log("============================");
            console.log("Artist: " + data.tracks.items[0].album.artists[0].name); 
            console.log("Title: " + data.tracks.items[0].name);
            console.log("Preview: " + data.tracks.items[0].external_urls.spotify);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("============================");
            setTimeout(tryAgain, 1000);
        })

    } else {
        //this just sets a default song if nothing is chosen 
        // Eventually I'll set to "The Sign" by Ace of Base 
        spotify.search({type: 'track', query: 'I Want it That Way'}, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            console.log("\n");
            console.log("You didn't input anything...Have fun with this!");
            console.log("============================");
            console.log("Artist: " + data.tracks.items[0].album.artists[0].name); 
            console.log("Title: " + data.tracks.items[0].name);
            console.log("Preview: " + data.tracks.items[0].external_urls.spotify);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("============================");
            
            setTimeout(tryAgain, 1000);
        });
    }
}

//omdb function
function callOmdb (search){
    var omdbUrl = "http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy";
    var omdbDefault = "http://www.omdbapi.com/?t=Mr+Nobody&y=&plot=short&apikey=trilogy";
    
    if (search){
        axios.get(omdbUrl).then(
            function(response){
                console.log("============================");
                console.log("Title: " + response.data.Title);
                console.log("Year Released: " + response.data.Year);
                console.log("IMD rating: " + response.data.Ratings[0].Value);
                console.log("Rotten Tomatoes rating: " + response.data.Ratings[1].Value);
                console.log("Language: " + response.data.Language);
                console.log("Plot: " + response.data.Plot);
                console.log("Actors: " + response.data.Actors);
                console.log("============================");
                setTimeout(tryAgain, 1000);
            }
        ).catch(function(){
            console.log("We were unable to find any results...");
            setTimeout(tryAgain, 1000);
            return
        })
    } else {
        axios.get(omdbDefault).then(
            function(response){
                console.log("\n");
                console.log("You didn't input anything...Seriously why are you here?");
                console.log("============================");
                console.log("Title: " + response.data.Title);
                console.log("Year Released: " + response.data.Year);
                console.log("IMD rating: " + response.data.Ratings[0].Value);
                console.log("Rotten Tomatoes rating: " + response.data.Ratings[1].Value);
                console.log("Language: " + response.data.Language);
                console.log("\n");
                console.log("Plot: " + response.data.Plot);
                console.log("Actors: " + response.data.Actors);
                console.log("============================");
                setTimeout(tryAgain, 1000);
            }
        )

    }
}


//We'll push the inputs to this in a second 
var userSearch = "";


function tryAgain (){
    inquirer.prompt([
        {
            type: "list",
            message: "Try Again??",
            choices: ["Yes", "No"],
            name: "again"
        }
    ]).then(function(answer){
        if (answer.again === "Yes"){
            playGame();
        } else {
            console.log("Thanks for playing!!");
        }
        var text = "Try again: " + answer.again + " ";
        //this changes the log.txt file 
        fs.appendFile("log.txt", text, function(error) {
            if (error){
                console.log(err);
            }
        })

    })
}

//just a wrapper for the inquirer portion of app 
function playGame (){
    inquirer.prompt ([
        {
            type: "list",
            message: "What would you like to search for?",
            choices: ["Concert", "Song", "Movie", "Surprise Me!"],
            name: "options"
        }
    ]).then(function(answer){
        var text = "\nOption Chosen: " + answer.options + " ";
        //this changes the log.txt file 
        fs.appendFile("log.txt", text, function(error) {
            if (error){
                console.log(err);
            }
        })
        
        if (answer.options === "Concert"){
            inquirer.prompt ([
                {
                    message: "Enter Artist Name",
                    name: "artist"
                }
            ]).then(function(answer){
                var text = "Artist Searched for: " + answer.artist + " ";

                //this is where the userSearch is pushed to array 
                userSearch = answer.artist;    
                callBands(userSearch);

                //this changes the log.txt file 
                fs.appendFile("log.txt", text, function(error) {
                    if (error){
                        console.log(err);
                    }
                })
            })
        
        } else if (answer.options === "Song"){
            inquirer.prompt ([
                {
                    message: "Enter Song Title",
                    name: "song"
                }
            ]).then(function(answer){
                userSearch = answer.song; 
                callSpotify(userSearch);

                var text = "Song searched for: " + answer.song + " ";
                //this changes the log.txt file 
                fs.appendFile("log.txt", text, function(error) {
                    if (error){
                        console.log(err);
                    }
                })
            })
        
        } else if (answer.options === "Movie"){
            inquirer.prompt ([
                {
                    message: "Enter Movie Title",
                    name: "movie"
                }
            ]).then(function(answer){
                userSearch = answer.movie; 
                callOmdb(userSearch);

                var text = "Movie Searched for: " + answer.movie + " ";
                //this changes the log.txt file 
                fs.appendFile("log.txt", text, function(error) {
                    if (error){
                        console.log(err);
                    }
                })
            })
        
        } else if (answer.options === "Surprise Me!"){
            fs.readFile("random.txt", "utf8", function(error, data) {
        
                if (error) {
                  return console.log(error);
                }
                //this stores the data from random in a handy-dandy array for later use
                var dataArr = data.split(", ");
        
                //were going to randomize this a bit so its not as much data at once 
                function decider (){
                    if (Math.floor(Math.random()* 3 + 1) === 1){
                        callSpotify(dataArr[1]);
        
                    }else if (Math.floor(Math.random()* 3 + 1) === 2){
                        callOmdb(dataArr[3]);
        
                    } else {
                        callBands(dataArr[5]);
        
                    }
                    setTimeout(playAgain, 3000);
                }
                decider();      
              
              });
        
        }
    })
}

playGame();