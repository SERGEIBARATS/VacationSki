var mongoose = require("mongoose");
var Skiground = require("./models/skiground");
var Comment   = require("./models/comment");

var data = [
    {
        name: "ski Rest", 
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyJoQ8ohkkwXD7LxO9Mdzspts37j-crqz3ZhKm7aKOARoULt19",
        description: "blah blah blah"
    },
    {
        name: "Skiing in Austria", 
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmkHAFzgCV5Sp8ifSZszVNK16d2X4qYq-VLRMNHhP38UYlEJkc1g",
        description: "blah blah blah"
    },
    {
        name: "Ski resorts", 
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIpMruIJf64cjrnghJkza7yJueVwxuSYdhMk7t81DUJlstfMUlfQ",
        description: "blah blah blah"
    }
]
function seedDB(){
    Skiground.remove({}, function(err){
    if(err){
        console.log(err);
    }
    console.log("removed skigrounds!");
    });
          data.forEach(function(seed){
            Skiground.create(seed, function(err, skiground){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a skiground");
                    
                      Comment.create(
                        {
                            text: "This place is great, but I wish there was internet",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                skiground.comments.push(comment);
                                skiground.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
}

module.exports = seedDB;

