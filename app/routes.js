module.exports = function(app, passport, multer, db, ObjectId) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    app.get('/categories', function(req, res) {
        db.collection('photos').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('categories.ejs', {
            photos: result
          })
        })
    });


    app.get('/home', function(req, res) {
      const curUser = req.user._id;
        db.collection('photos').find({createdBy:curUser}).toArray((err, result) => {
          if (err) return console.log(err)
          res.render('home.ejs', {
            user : req.user,
            photos: result
          })
        })
        // res.render('home.ejs');
    });
    app.get('/contact', function(req, res) {
        res.render('contact.ejs');
    });
    // Categories SECTION =========================

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
      const curUser = req.user._id
        db.collection('photos').find({createdBy:curUser}).toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile', {
            user : req.user,
            photos: result
          })
        })
    });


    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board routes ===============================================================

    // app.post('/photos', (req, res) => {
    //   console.log("photos" + req)
    //   curUser= req.user._id
    //   userInput = req.body.tags;
    //   tags= userInput.toLowerCase().split(',');
    //   db.collection('photos').save({photo: req.body.photo, caption:req.body.caption, tags:tags, latitude: req.body.latitude, longitude:req.body.longitude, thumbUp: 0, createdBy:curUser}, (err, result) => {
    //     if (err) return console.log(err)
    //     console.log('saved to database')
    //     res.redirect('/profile')
    //   })
    // })

    app.post('/messages', (req, res) => {
    db.collection('messages').save({ContactName: req.body.contactName, ContactEmail: req.body.contactEmail, ContactMsg:req.body.contactMsg,createdBy:req.user._id}, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/contact')
    })
  })

    app.put('/photos', (req, res) => {
      const curUser = req.body.id
      db.collection('photos').findOneAndUpdate({_id: ObjectId(curUser)}, {
        $inc: {
          thumbUp: 1
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    app.delete('/photos', (req, res) => {
      const curUser= req.body.id
      db.collection('photos').findOneAndDelete({_id: ObjectId(curUser)}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

    app.get('/search', function(req, res) {
  let query = req._parsedOriginalUrl.search;
  let searchResult = [];
  if (query === null) {
    res.render('search.ejs', {
      results: []
    });
  }else{
    db.collection('photos').find().toArray((err, result) => {
      if (err) return console.log(err);
      for (let i = 0; i < result.length; i++) {
        if (result[i]['tags'].includes(query.replace('?query=',''))) {
          searchResult.push(result[i])
        }
      }
      res.render('search.ejs', {
        results: searchResult
      })
    })
  }
});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

    var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + ".png")
    }
});

var upload = multer({storage: storage});

app.post('/photos', upload.single('photo'), (req, res, next) => {

    console.log("photos" + req)

    insertDocuments(db, req, 'images/uploads/' + req.file.filename, () => {
        //db.close();
        //res.json({'message': 'File uploaded successfully'});
        res.redirect('/profile')
    });
});
var insertDocuments = function(db, req, filePath, callback) {
  let curUser= req.user._id,
   userInput = req.body.tags,
  tags= userInput.toLowerCase().split(',');
    var collection = db.collection('photos');
    console.log("Photo: ", req.body.photo, filePath);
    collection.save({photo: filePath, caption:req.body.caption, tags:tags, latitude: req.body.latitude, longitude:req.body.longitude, thumbUp: 0, createdBy:curUser},(err, result) => {
      if (err) return console.log(err), res.send(err)
      callback(result)
    })
    // collection.findOne({"_id": uId}, (err, result) => {
    //     //{'imagePath' : filePath }
    //     //assert.equal(err, null);
    //     callback(result);
    // });
}


        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  console.log(req)
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
