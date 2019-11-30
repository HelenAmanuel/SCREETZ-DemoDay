module.exports = function(app, passport, multer, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });
    app.get('/categories', function(req, res) {
        res.render('categories.ejs');
    });
    app.get('/home', function(req, res) {
      const curUser = req.user._id
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

    app.post('/photos', (req, res) => {
      console.log("hahahaphotos" + req)
      curUser= req.user._id
      userInput = req.body.tags;
      tags= userInput.toLowerCase().split(',');
      db.collection('photos').save({photo: req.body.photo, caption:req.body.caption, tags:tags, latitude: req.body.latitude, longitude:req.body.longitude, thumbUp: 0, createdBy:curUser}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })

    app.put('/photos', (req, res) => {
      curUser= req.user._id
      db.collection('photos').findOneAndUpdate({photo: req.body.photo, caption:req.body.caption, tags:tags, latitude: req.body.latitude, longitude:req.body.longitude}, {
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
      db.collection('photos').findOneAndDelete({photo: req.body.photo, caption:req.body.caption, tags:tags, latitude: req.body.latitude, longitude:req.body.longitude}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

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

    insertDocuments(db, req, 'images/uploads/' + req.file.filename, () => {
        //db.close();
        //res.json({'message': 'File uploaded successfully'});
        res.redirect('/profile')
    });
});
var insertDocuments = function(db, req, filePath, callback) {
    var collection = db.collection('photos');
    collection.save({photo:req.body.photo},(err, result) => {
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
//
// <!DOCTYPE html>
// <html lang="zxx">
// <head>
// 	<title>Welcome Home | SCREETZ</title>
// 	<meta charset="UTF-8">
// 	<meta name="description" content="Photographer html template">
// 	<meta name="keywords" content="photographer, html">
// 	<meta name="viewport" content="width=device-width, initial-scale=1.0">
//
// 	<!-- Favicon -->
// 	<link href="img/favicon.ico" rel="shortcut icon"/>
//
// 	<!-- Google font -->
// 	<link href="https://fonts.googleapis.com/css?family=Poppins:300,300i,400,400i,500,500i,600,600i,700,700i&display=swap" rel="stylesheet">
//
// 	<!-- Stylesheets -->
// 	<link rel="stylesheet" href="css/bootstrap.min.css"/>
// 	<link rel="stylesheet" href="css/font-awesome.min.css"/>
// 	<link rel="stylesheet" href="css/magnific-popup.css"/>
// 	<link rel="stylesheet" href="css/slicknav.min.css"/>
// 	<link rel="stylesheet" href="css/owl.carousel.min.css"/>
// 	<!-- Main Stylesheets -->
// 	<link rel="stylesheet" href="style.css"/>
//
//
// 	<!--[if lt IE 9]>
// 		<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
// 		<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
// 	<![endif]-->
//
// </head>
// <body>
// 	<!-- Page Preloder -->
// 	<div id="preloder">
// 		<div class="loader"></div>
// 	</div>
//
// 	<!-- Header section  -->
// 	<header class="header-section">
// 		<a href="profile" class="site-logo"><img  class= "logo" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.dribbble.com%2Fusers%2F182238%2Fscreenshots%2F2423343%2Fswirl-rainbow.jpg&f=1&nofb=1" alt="logo"></a>
// 		<div class="header-controls">
// 			<button class="nav-switch-btn"><i class="fa fa-bars"></i></button>
// 			<button class="search-btn"><i class="fa fa-search"></i></button>
// 		</div>
// 		<ul class="main-menu">
// 			<li><a href="/home">Home</a></li>
// 			<li><a href="/contact">About</a></li>
// 			<!-- <li>
// 				<a href="#">Portfolio</a>
// 				<ul class="sub-menu">
// 					<li><a href="portfolio.html">Portfolio 1</a></li>
// 					<li><a href="portfolio-1.html">Portfolio 2</a></li>
// 					<li><a href="portfolio-2.html">Portfolio 3</a></li>
// 				</ul>
// 			</li> -->
// 			<li><a href="/categories">Categories</a></li>
// 			<li><a href="/contact">Contact</a></li>
// 			<li class="search-mobile">
// 				<button class="search-btn"><i class="fa fa-search"></i></button>
// 			</li>
// 		</ul>
// 	</header>
// 	<div class="clearfix"></div>
// 	<!-- Header section end  -->
//
// 	<!-- Contact section  -->
// 	<section class="elements-section">
// 		<div class="container">
// 			<!-- element -->
// 			<div class="element">
// 				<h3 class="el-title">Upload Photo</h3>
//
// 				<form action="/photos" method="POST">
// 					<input id="photo" placeholder="Photo" type="file" name="photo">
// 					<input id="caption" type="text" placeholder="Caption" name="caption">
// 					<input id="tags" type="text" placeholder="Tags" name="tags">
// 					<input id="latitude" type="text" placeholder="Latitude" name="latitude">
// 					<input id="longitude" type="text" placeholder="Longitude" name="longitude">
// 					<button onclick="getLocation()" type="button" name="geolocation">Get Location</button>
//
// 					<script>
// 					var latitudeField = document.getElementById("latitude");
// 					var longitudeField = document.getElementById("longitude");
//
// 					function getLocation() {
// 					  if (navigator.geolocation) {
// 					    navigator.geolocation.getCurrentPosition(showPosition);
// 					  } else {
// 					   alert("Geolocation is not supported by this browser.");
// 					  }
// 					}
//
// 					function showPosition(position) {
// 					  latitudeField.value = position.coords.latitude;
// 						longitudeField.value = position.coords.longitude;
// 						console.log("Latitude Field is" + latitudeField.value)
// 					}
// 					</script>
//
//
// 					<br>
// 					<input value="Upload" class="site-btn mr-3 mb-3" type="submit">
// 				</form>
//
// 				<!-- <button class="site-btn sb-line mr-3 mb-3">send message</button>
// 				<button class="site-btn sb-line sb-light-bg">send message</button> -->
// 			</div>
// 			<!-- element -->
// 			<div class="element">
// 				<h3 class="el-title">My Photos</h3>
// 				<div class="row">
// 					<div class="col-xl-6">
// 						<!-- Accordions -->
// 						<div id="accordion" class="accordion-area">
// 							<div class="panel">
// 								<div class="panel-header" id="headingOne">
// 									<button class="panel-link" data-toggle="collapse" data-target="#collapse1" aria-expanded="false" aria-controls="collapse1">Photos</button>
// 								</div>
// 								<div id="collapse1" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
// 									<div class="panel-body">
// 										<p>Photos will go here</p>
// 									</div>
// 								</div>
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
//
//
// </div>
// </div>
//
// <div class="col-sm-6">
// <ul class="photos">
// <% for(var i=0; i<photos.length; i++) {%>
// <li class="message">
// <img src="<%= photos[i].photo %>"><br>
// <span id="caption"><%= photos[i].caption %></span><br>
// <span id="tags"><%= photos[i].tags %></span>
// <span id="thumb"><%= photos[i].thumbUp %></span>
// <span class="thumbsUp">👍🏾</span>
// <span class="trash">🗑️</span>
// </li>
// <% } %>
// </ul>
//
// </div>
// 			<!-- element -->
// 			<div class="element">
// 				<h3 class="el-title">Loaders</h3>
// 				<div class="row">
// 					<div class="col-lg-3 col-sm-6">
// 						<div class="circle-progress" data-cptitle="Passion" data-cpid="id-1" data-cpvalue="100" data-cpcolor="#304a5f"></div>
// 					</div>
// 					<div class="col-lg-3 col-sm-6">
// 						<div class="circle-progress" data-cptitle="Models" data-cpid="id-2" data-cpvalue="75" data-cpcolor="#304a5f"></div>
// 					</div>
// 					<div class="col-lg-3 col-sm-6">
// 						<div class="circle-progress" data-cptitle="Studio" data-cpid="id-3" data-cpvalue="25" data-cpcolor="#304a5f"></div>
// 					</div>
// 					<div class="col-lg-3 col-sm-6">
// 						<div class="circle-progress" data-cptitle="Nature" data-cpid="id-4" data-cpvalue="50" data-cpcolor="#304a5f"></div>
// 					</div>
// 				</div>
// 			</div>
// 			<!-- element -->
// 			<div class="element">
// 				<h3 class="el-title">Milestones</h3>
// 				<div class="row">
// 					<div class="col-lg-3 col-sm-6">
// 						<div class="milestone">
// 							<h2>1k</h2>
// 							<p>IG Followers</p>
// 						</div>
// 					</div>
// 					<div class="col-lg-3 col-sm-6">
// 						<div class="milestone">
// 							<h2>36</h2>
// 							<p>Pictures Taken</p>
// 						</div>
// 					</div>
// 					<div class="col-lg-3 col-sm-6">
// 						<div class="milestone">
// 							<h2>10</h2>
// 							<p>Cities</p>
// 						</div>
// 					</div>
// 					<div class="col-lg-3 col-sm-6">
// 						<div class="milestone">
// 							<h2>19</h2>
// 							<p>Installation Photos</p>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
//
// 	<!-- Footer section   -->
// 	<footer class="footer-section">
// 		<div class="container-fluid">
// 			<div class="row">
// 				<div class="col-md-6 order-1 order-md-2">
// 					<div class="footer-social-links">
// 						<a href=""><i class="fa fa-pinterest"></i></a>
// 						<a href=""><i class="fa fa-twitter"></i></a>
// 						<a href=""><i class="fa fa-instagram"></i></a>
// 						<!-- <a href=""><i class="fa fa-behance"></i></a> -->
// 					</div>
// 				</div>
// 				<div class="col-md-6 order-2 order-md-1">
// 					<div class="copyright"><!-- Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. -->
// Copyright &copy;<script>document.write(new Date().getFullYear());</script> All rights reserved | This template is made with <i class="fa fa-heart-o" aria-hidden="true"></i> by <a href="https://colorlib.com" target="_blank">Colorlib</a>
// <!-- Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. -->
// </div>
// 				</div>
// 			</div>
// 		</div>
// 	</footer>
// 	<!-- Footer section end  -->
//
// 	<!-- Search model -->
// 	<div class="search-model">
// 		<div class="h-100 d-flex align-items-center justify-content-center">
// 			<div class="search-close-switch">+</div>
// 			<form class="search-model-form">
// 				<input type="text" id="search-input" placeholder="Search here.....">
// 			</form>
// 		</div>
// 	</div>
// 	<!-- Search model end -->
//
// 	<!--====== Javascripts & Jquery ======-->
// 	<script src="main.js"></script>
// 	<script src="js/jquery-3.2.1.min.js"></script>
// 	<script src="js/bootstrap.min.js"></script>
// 	<script src="js/jquery.slicknav.min.js"></script>
// 	<script src="js/owl.carousel.min.js"></script>
// 	<script src="js/jquery.magnific-popup.min.js"></script>
// 	<script src="js/circle-progress.min.js"></script>
// 	<script src="js/mixitup.min.js"></script>
// 	<script src="js/instafeed.min.js"></script>
// 	<script src="js/masonry.pkgd.min.js"></script>
// 	<script src="js/main.js"></script>
//
// 	</body>
// </html>
