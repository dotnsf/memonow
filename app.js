//.  app.js
var express = require( 'express' ),
    bodyParser = require( 'body-parser' ),
    cfenv = require( 'cfenv' ),
    CloudantLib = require( 'cloudant' ),
    crypto = require( 'crypto' ),
    fs = require( 'fs' ),
    ejs = require( 'ejs' ),
    session = require( 'express-session' ),
    twitterAPI = require( 'node-twitter-api' ),
    app = express();
var settings = require( './settings' );
var appEnv = cfenv.getAppEnv();

app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );

app.use( express.static( __dirname + '/public' ) );

app.use( session({
  secret: 'dotnsf',
  resave: false,
  saveUninitialized: false,
  cookie:{
    httpOnly: true,
    secure: false
  }
}));

//. Cloudant
var cloudant = CloudantLib( { account: settings.db_username, password: settings.db_password } );
var cloudantDB = cloudant.db.use( settings.db_name );

//. OAuth(Twitter)
var twitter = new twitterAPI({
  consumerKey: settings.twitter_consumer_key,
  consumerSecret: settings.twitter_consumer_secret,
  callback: settings.twitter_callback_url
});
  

app.get( '/', function( req, res ){
  var template = fs.readFileSync( __dirname + '/public/index.ejs', 'utf-8' );
  res.write( ejs.render( template, { settings: settings, user_id: null } ) );
  res.end();
});

app.get( '/resetdb', function( req, res ){
  var template = fs.readFileSync( __dirname + '/public/resetdb.ejs', 'utf-8' );
  res.write( ejs.render( template, { settings: settings } ) );
  res.end();
});


app.get( '/twitter', function( req, res ){
  twitter.getRequestToken( function( err, request_token, request_token_secret, results ){
    if( err ){
      console.log( err );
      res.send( "Not worked." );
    }else{
      req.session.oauth = {};
      req.session.oauth.token = request_token;
      req.session.oauth.token_secret = request_token_secret;

      res.redirect( 'https://twitter.com/oauth/authenticate?oauth_token=' + request_token );
    }
  });
});

app.get( '/twitter/callback', function( req, res, next ){
  if( req.session.oauth ){
    req.session.oauth.verifier = req.query.oauth_verifier;
    twitter.getAccessToken( req.session.oauth.token, req.session.oauth.token_secret, req.session.oauth.verifier, function( err, access_token, access_token_secret, results ){
      if( err ){
        console.log( err );
        res.send( "Something broken." );
      }else{
        req.session.oauth.access_token = access_token;
        req.session.oauth.access_token_secret = access_token_secret;

        //. Verify Credentials
        twitter.verifyCredentials( access_token, access_token_secret, {}, function( error, data, response ){
          if( error ){
            console.log( error );
          }else{
            //console.log( data['screen_name'] );
            //res.redirect( '/' );
            if( data && data['screen_name'] ){
              var template = fs.readFileSync( __dirname + '/public/index.ejs', 'utf-8' );
              res.write( ejs.render( template, { settings: settings, user_id: data['screen_name'] } ) );
              res.end();
            }else{
              res.redirect( '/' );
            }
          }
        });
      }
    });
  }else{
    next( "You are not supposed to be here." );
  }
});


app.get( '/query', function( req, res ){
  var user_id = req.query.user_id;
  if( !user_id ){
    res.status( 401 );
    res.write( JSON.stringify( { status: false, message: 'parameter user_id needed.' }, 2, null ) );
    res.end();
  }else if( !cloudantDB ){
    res.status( 401 );
    res.write( JSON.stringify( { status: false, message: 'cloudantDB not initialized yet.' }, 2, null ) );
    res.end();
  }else{
    cloudantDB.find( { selector: { user_id: user_id } }, function( err, result ){
      if( err ){
        res.status( 401 );
        res.write( JSON.stringify( { status: false, message: err }, 2, null ) );
        res.end();
      }else{
        res.write( JSON.stringify( { status: true, result: result }, 2, null ) );
        res.end();
      }
    });
  }
});


var port = appEnv.port || 3000;
app.listen( port );
console.log( "server starting on " + port + " ..." );
