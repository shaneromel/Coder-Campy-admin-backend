var mongo = require('mongodb');
var assert = require('assert');
var admin = require("firebase-admin");
var express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
var Join = require('mongo-join').Join;

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'codercampy-438d0',
    clientEmail: 'firebase-adminsdk-m2bfv@codercampy-438d0.iam.gserviceaccount.com',
    privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDmlyrx0aewCMJ2\nDoHGc479DPyj3aI6yFQQJD8VLKFrHQXPUW7BDc/0GHNeKvae3/bFRC9cPdj2A0FA\n35cO/Ms/VkcUnCHQKXs5lZSc7bdqiDsFsMiCO6GgQSo8Y8XsNkNwaB0STxUNgVdj\n4UzqXdZP5VozfR8AcENPIm8dHhsTrJPOFTQNDMKMljeKlPbifpi1EavfkGM0JwMT\nHDD7V9cOCkHTbZwW11nKSDMGHQU1Utzjyj7Q/6YDKhn2XTHpQTydPBsqEPU2xB2L\nsRgq5LDU1yz1VwTNG1ReKX18WmQkVIhwsAiehTZ3qsAvfOe+TNBNUTBpzht/CqME\n/dp03lmlAgMBAAECggEAHSbGx9gCvFM7LFwkpW9WCCFEbj32hLpvQDQo4ncoOAet\nBJrtpsvlep09to21bHvxcVpvp1htTZq3POmXag5k7o6sgUtEzhF0ceD6bwVxfu8W\nkR9alfZOdllOquBNNRHeID+VT0t+pJyxrN+ejvGKhsK+zswWZ4KJy98VT4fPEgMt\npLvT8OK/tRk6ZC62MFbpHEEv/9OQSh28n2dWtlO3cFvtiJaooODHuzZSZOqy+05n\nWsUfT4Z/s3w53mkp286RNrRlcP8F85ZGYDaCFvZr5zAXp62xQmiPI2EeTk+sJgR/\nvm8cTLRLpUbpIL8cA4vO1T+G3o2t3+bWJXTUyGDmCQKBgQDzduKlFSxfH3PNj4Vx\ndRR2l2G+o4h2rljQ5cmg8W9giZpUtmkrhS8ZZ79Ar4UOUa3eOpKkyy5hSEIA4KNc\nmeuZ2qVDRVFqJbc20XsYeeym21Nqvpmvl82+gcsNuQdazSTmgFRYZJ/aGADSjTkY\nc7KBDqFw38lddZdYjQhdKDac+QKBgQDydpdN/YRupag4JQB6S3JSpu2dcHKshOCw\nYHHlzKt8FZvzrcEg+0ksklU8LYLu/KEathZIeEk5XCrCAGW6PnFzigTQQ9a57Zxc\n97+aSLXELAyI5ZkBkD4IzeiF42mznXmgOeKXPi4dkB5HV5eDStMWwNuK+op09cD/\no6xItjipDQKBgHVYw/0Vq4Fdw488sfDxoZ9Xb8FXSRsLBbwKRZjRRgGd0Ukrcp2L\nYBw6qTAgaV1xeQA38x6C4CP7k/SgUZz8g1Zw0F8QNiGXdCtz5ITzn2D9LcOxgpnj\n7UL5hElk+WqGnlaLXBwOxA12rE7PyslCWrNhveaNtpzZZM1FjNZ533jhAoGBAK6O\nblO5prQ6EyeIjBV/Z6jVgNAN+qD1cQXKCXXVqcfFjucaOqZSAtZR64dNhKwluJ6Q\nZO57msvu7OGKg7JX7jmuLdT6YgataBsOSiT7H9FBnSyZj1Qu0lpoU3TAyoKDZuLR\nia41F+I0tXfLOctN/TauVeByi2e03eOtpAUdGyGpAoGBALtW/G7UfdLYE+YuskD0\nA9XtuB/cprweruM5J63P4ru4gJhafK7W+QAKYdH36V7a8v4ZDfcTozBI+kMOwSsh\nJ8O2y3TZI34NhFRxGhV3o4h0mhaT8RtV2pe2poXsiAsTEfMsgqRTgB5dcRqWXduw\n471qi8IRv6DPUcEfsDCAJGiA\n-----END PRIVATE KEY-----\n'
	}),
  databaseURL: 'https://codercampy-438d0.firebaseio.com'
});

var url="mongodb+srv://admin:admin@codercampy0-3bji8.mongodb.net/test?retryWrites=true";

mongo.MongoClient.connect(url, function(err, client){

     assert.equal(null, err);
     var db=client.db("CoderCampy");

     app.post("/generate-token", function(req,res){
         var uid=req.body.uid;
         admin.auth().createCustomToken(uid).then(customToken=>{
             res.send({code:"success",token:customToken});
         }).catch(err=>{
             res.send({code:"error",message:err.message});
         })
     });

     app.get("/students", function(req,res){
        findAllStudents(db, function(response){
            res.send(response);
        })
     })

     app.post("/student", function(req,res){
        createStudent(db, req.body, function(response){
            res.send(response);
        })
     });

     app.delete("/student/:uid", function(req,res){
        deleteStudent(db, req.params.uid, function(response){
            res.send(response);
        })
     });

     app.get("/instructors", function(req,res){
        findAllInstructors(db, function(response){
            res.send(response);
        })
     })

     app.post("/instructor", function(req,res){
        addInstructor(db, req.body, function(response){
            res.send(response);
        })
     });

     app.delete("/instructor/:uid", function(req,res){
        deleteInstructor(db,req.params.uid, function(response){
            res.send(response);
        });
     });

     app.get("/languages", function(req, res){
        findAllLanguages(db, function(response){
            res.send(response);
        })
     });

     app.post("/language", function(req,res){
        addLanguage(db, req.body, function(response){
            res.send(response);
        })
     })

     app.post("/edit-language/:id", function(req,res){
        editLanguage(db, req.body, req.params.id, function(response){
            res.send(response);
        })
     })

     app.delete("/language/:id", function(req,res){
        deleteLanguage(db, req.params.id, function(response){
            res.send(response);
        });
     });

     app.get("/categories", function(req,res){
        findAllCategories(db, function(response){
            res.send(response);
        })
     });

     app.post("/category", function(req,res){
        addCategory(db, req.body, function(response){
            res.send(response);
        })
     });

     app.delete("/category/:id", function(req,res){
        deleteCategory(db, req.params.id, function(response){
            res.send(response);
        })
     });

     app.post("/edit-category/:id", function(req,res){
        editCategory(db, req.params.id, req.body, function(response){
            res.send(response);
        })
     })

});

var editCategory=function(db, id, data, callback){
    var collection=db.collection("categories");

    collection.findOneAndUpdate({_id:mongo.ObjectId(id)}, data, function(err){
        if(err){
            callback({code:"error",message:err.message});
        }else{
            callback({code:"success"});
        }
    })
}

var deleteCategory=function(db, id, callback){
    var collection=db.collection("categories");

    collection.deleteOne({_id:mongo.ObjectId(id)}, function(err){
        if(err){
            callback({code:"error",message:err.message});
        }else{
            callback({code:"success"});
        }
    })
}

var addCategory=function(db, data, callback){
    var collection=db.collection("categories");

    collection.insertOne(data, function(err){
        if(err){
            callback({code:"error",message:err.message});
        }else{
            callback({code:"success"})
        }
    })
}

var findAllCategories=function(db, callback){
    var collection=db.collection("categories");

    collection.find({}).toArray(function(err, docs){
        if(err){
            callback({code:"error", message:err.message});
        }else{
            callback({code:"success", data:docs});
        }
    })
}

var deleteLanguage=function(db, id, callback){
    var collection=db.collection("languages");

    collection.deleteOne({_id:mongo.ObjectId(id)}, function(err){
        if(err){
            callback({code:"error", message:err.message});
        }else{
            callback({code:"success"});
        }
    })
}

var editLanguage=function(db, data,id, callback){
    var collection=db.collection("languages");

    collection.findOneAndUpdate({_id:mongo.ObjectId(id)},data, function(err){
        if(err){
            callback({code:"error", message:err.message});
        }else{
            callback({code:"success"});
        }
    })
}

var addLanguage=function(db,data, callback){
    var collection=db.collection("languages");

    collection.insertOne(data, function(err){
        if(err){
            callback({code:"error", message:err.message})
        }else{
            callback({code:"success"});
        }
    })
}

var findAllLanguages=function(db, callback){
    var collection=db.collection("languages");

    collection.find({}).toArray(function(err, docs){
        if(err){
            callback({code:"error", message:err.message});
        }else{
            callback({code:"success", data:docs});
        }
    })
}

var deleteInstructor=function(db,uid,callback){
    var collection=db.collection("instructors");

    admin.firestore().doc("instructors/"+uid).delete().then(()=>{
        collection.deleteOne({uid:uid}, function(err){
            if(err){
                callback({code:"error",message:err.message});
            }else{
                callback({code:"success"});
            }
        })
    }).catch(err=>{
        callback({code:"error",message:err.message});
    })
}

var addInstructor=function(db, data, callback){
    var collection=db.collection("instructors");

    admin.firestore().collection("instructors").add({email:data.email, password:data.password}).then(function(docRef){
        data.uid=docRef.id;
        data.bio="-";
        delete data.password;
        collection.insertOne(data, function(err){
            if(err){
                callback({code:"error", message:err.message});
            }else{
                callback({code:"success"});
            }
        })
    }).catch(err=>{
        callback({code:"error", message:err.message});
    })
}

var findAllInstructors=function(db,callback){
    var collection=db.collection("instructors");

    collection.find({}).toArray(function(err, docs){
        if(err){
            callback({code:"error", message:err.message});
        }else{
            callback({code:"success", data:docs});
        }
    })
}

var deleteStudent=function(db, uid, callback){
    var collection=db.collection("users");

    admin.auth().deleteUser(uid)
    .then(function() {
        collection.deleteOne({uid:uid}, function(err){
            if(err){
                callback({code:"error",message:err.message})
            }else{
                callback({code:"success"});
            }
        })
    })
    .catch(function(error) {
        callback({code:"error", message:error.message});
    });
}

var createStudent=function(db,data, callback){
    var collection=db.collection("users");

    admin.auth().createUser({
        email: data.email,
        password:data.password,
        displayName:data.name,
        photoURL:"https://x1.xingassets.com/assets/frontend_minified/img/users/nobody_m.original.jpg"
      })
        .then(function(userRecord) {
          var student={
              email:data.email,
              name:data.name,
              uid:userRecord.uid,
              provider:"EMAIL_AND_PASSWORD",
              image:"https://x1.xingassets.com/assets/frontend_minified/img/users/nobody_m.original.jpg"
          }
          collection.insertOne(student, function(err){
              if(err){
                  callback({code:"error",message:err.message});
              }else{
                  callback({code:"success"});
              }
          })
        })
        .catch(function(error) {
          callback({code:"error",message:error.message});
        });
    
}

var findAllStudents=function(db, callback){
    var collection=db.collection("users");

    collection.find({}).toArray(function(err,docs){
        if(err){
            callback({code:"error",message:err.message})
        }else{
            callback({code:"success", data:docs});
        }
    })
}

app.listen(3000);