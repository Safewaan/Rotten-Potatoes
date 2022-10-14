let mysql = require('mysql');
let config = require('./config.js');
const fetch = require('node-fetch');
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const { response } = require('express');
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(path.join(__dirname, "client/build")));

app.post('/api/getMovies', (req, res) => {

	let connection = mysql.createConnection(config);

	let sql =
		`SELECT DISTINCT 
		movies.name, 
		GROUP_CONCAT(DISTINCT movies.id) AS id, 
		ANY_VALUE(movies.year) AS year, 
		GROUP_CONCAT(DISTINCT CONCAT(directors.first_name, " ", directors.last_name)) AS directorName, 
		group_concat(DISTINCT movies_genres.genre) AS genres
		FROM movies

		INNER JOIN movies_directors ON movies_directors.movie_id = movies.id
		INNER JOIN directors ON directors.id = movies_directors.director_id
		INNER JOIN movies_genres ON movies_genres.movie_id = movies.id
		GROUP BY name 
		ORDER BY name;`;
	console.log(sql);

	connection.query(sql, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}

		let string = JSON.stringify(results);

		res.send({ express: string });
	});

	connection.end();
});

app.post('/api/searchMovies', (req, res) => {

	let connection = mysql.createConnection(config);

	let sql =
		`SELECT DISTINCT 
		movies.name, 
		GROUP_CONCAT(DISTINCT CONCAT(directors.first_name, " ", directors.last_name)) AS directorName,
		AVG(Review.reviewScore) AS AverageRating,
		GROUP_CONCAT(DISTINCT CONCAT("Title: ", Review.reviewTitle, " - Content: ", Review.reviewContent, " - Score: ", Review.reviewScore)) AS reviews

		FROM movies
		INNER JOIN movies_directors ON movies_directors.movie_id = movies.id
		INNER JOIN directors ON directors.id = movies_directors.director_id
		LEFT JOIN Review ON Review.movieID = movies.id
        INNER JOIN roles on roles.movie_id = movies.id
        INNER JOIN actors on actors.id = roles.actor_id
		WHERE `;

	let data = [];

	let sqlWhereClause = '';
	let nameFilter = '';
	let actorFilter = '';
	let directorFilter = '';

	if (req.body.name !== '') {
		nameFilter = "name LIKE ?";
		data.push(req.body.name + "%");
	}

	if (req.body.actor !== '') {
		actorFilter = 'CONCAT(actors.first_name, \" \", actors.last_name) LIKE ?';
		data.push(req.body.actor + "%");
	}

	if (req.body.director !== '') {
		directorFilter = "CONCAT(directors.first_name, \" \", directors.last_name) LIKE ?";
		data.push(req.body.director + "%");
	}

	let filters = [nameFilter, actorFilter, directorFilter];

	filters.map(function (filter) {
		if (filter !== '') {
			if (sqlWhereClause !== '') {
				sqlWhereClause += " AND ";
			};
			sqlWhereClause += filter;
		};
	});

	sql += sqlWhereClause + ` GROUP BY name ORDER BY name`;
	console.log(sql);

	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}

		let string = JSON.stringify(results);

		res.send({ express: string });
	});

	connection.end();
});

app.post('/api/searchRecommendations', (req, res) => {

	let connection = mysql.createConnection(config);

	let sql =
		`SELECT DISTINCT 
		movies.name, 
		ANY_VALUE(movies.year) AS year, 
		GROUP_CONCAT(DISTINCT CONCAT(directors.first_name, " ", directors.last_name)) AS directorName, 
		GROUP_CONCAT(DISTINCT movies_genres.genre) AS genre
		FROM movies

		INNER JOIN movies_directors ON movies_directors.movie_id = movies.id
		INNER JOIN directors ON directors.id = movies_directors.director_id
		INNER JOIN movies_genres ON movies_genres.movie_id = movies.id
		WHERE `;

	let data = [];

	if (req.body.director.length > 0) {

		for (let i = 0; i < req.body.director.length; i++) {
			if (i > 0) {
				sql += " OR "
			}
			sql += "CONCAT(directors.first_name, \" \", directors.last_name) = ?";
			data.push(req.body.director[i]);
		}

	} else if (req.body.genre.length > 0) {

		for (let i = 0; i < req.body.genre.length; i++) {
			if (i > 0) {
				sql += " OR "
			}
			sql += "genre LIKE ?";
			data.push(req.body.genre[i]);
		}

	} else if (req.body.year != '') {
		sql += "year = ?";
		data.push(req.body.year);
	}

	sql += ` GROUP BY name ORDER BY name`;
	console.log(sql);

	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}

		let string = JSON.stringify(results);

		res.send({ express: string });
	});

	connection.end();
});

app.post('/api/addReview', (req, res) => {

	let connection = mysql.createConnection(config);

	let sql = "INSERT INTO shchowdh.Review (userID, movieID, reviewTitle, reviewContent, reviewScore) VALUES (?, ?, ?, ?, ?)";
	let data = [req.body.userID, req.body.movieID, req.body.reviewTitle, req.body.reviewContent, req.body.reviewScore];

	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}

		let obj = JSON.parse(results);

		res.send({ express: obj });
	});

	connection.end();
});



app.listen(port, () => console.log("Listening on port ${port}")); //for the dev version
//app.listen(port, '172.31.31.77'); //for the deployed version, specify the IP address of the server
