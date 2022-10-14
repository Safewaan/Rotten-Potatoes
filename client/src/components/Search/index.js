import * as React from 'react';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from '@material-ui/core/TextField';
import Box from "@material-ui/core/Box";
import Button from '@material-ui/core/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import history from '../Navigation/history';

const serverURL = "http://ec2-18-216-101-119.us-east-2.compute.amazonaws.com:3094"
//const serverURL = ""; 

const Search = () => {

    // Search States
    const [movieTitleSearchTerm, setMovieTitleSearchTerm] = React.useState('');
    const [actorNameSearchTerm, setActorNameSearchTerm] = React.useState('');
    const [directorNameSearchTerm, setDirectorNameSearchTerm] = React.useState('');
    const [showErrorMessage, setErrorMessageState] = React.useState(false);

    // Movies State
    const [movies, setMovies] = React.useState([]);

    // Handle
    const handleChangeMovieTitleSearchTerm = (event) => {
        setMovieTitleSearchTerm(event.target.value);
    };

    const handleChangeActorNameSearchTerm = (event) => {
        setActorNameSearchTerm(event.target.value);
    };

    const handleChangeDirectorNameSearchTerm = (event) => {
        setDirectorNameSearchTerm(event.target.value);
    };

    const handleSearch = () => {

        // No search criteria, display error message
        if (movieTitleSearchTerm === '' && actorNameSearchTerm === '' && directorNameSearchTerm === '') {
            setErrorMessageState(true);
        } else {
            setErrorMessageState(false);
            handleSearchMovies();
        };
    };

    // API Calls
    const callApiSearchMovies = async () => {
        const url = serverURL + "/api/searchMovies";
        console.log(url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: movieTitleSearchTerm,
                actor: actorNameSearchTerm,
                director: directorNameSearchTerm
            })
        });

        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        console.log("Sent review: ", body);
        return body;
    };

    // API Handles
    const handleSearchMovies = () => {
        callApiSearchMovies()
            .then(res => {
                console.log("callApiSearchMovies returned: ", res);
                var parsed = JSON.parse(res.express);
                console.log("callApiSearchMovies parsed: ", parsed);
                setMovies(parsed);
            });
    };

    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Button color="inherit" onClick={() => history.push('/')}>Rotten Potatoes</Button>
                        <Button color="inherit" onClick={() => history.push('/search')}>Search for a Movie</Button>
                        <Button color="inherit" onClick={() => history.push('/reviews')}>Add a Review</Button>
                        <Button color="inherit" onClick={() => history.push('/recommendations')}>Movie Recommendations</Button>
                    </Toolbar>
                </AppBar>
            </Box>

            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"


            >

                <Box sx={{ m: 3 }} />

                <Typography
                    variant="h6"
                    gutterBottom
                    component="div"
                    align = 'center'>
                    Search for a movie by title, actor and director. If the exact title, actor or director is not known, partial entries will return results. More than one search criteria can be used. 
                </Typography>

                <Box sx={{ m: 3 }} />

                <SearchField
                    label="Search by Movie"
                    searchTerm={movieTitleSearchTerm}
                    onChange={handleChangeMovieTitleSearchTerm}
                />

                <SearchField
                    label="Search by Actor"
                    searchTerm={actorNameSearchTerm}
                    onChange={handleChangeActorNameSearchTerm}
                />

                <SearchField
                    label="Search by Director"
                    searchTerm={directorNameSearchTerm}
                    onChange={handleChangeDirectorNameSearchTerm}
                />

                <Box sx={{ m: 3 }} />

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => { handleSearch() }}>Search</Button>

                {showErrorMessage && <p style={{ color: 'red' }}>Please enter at least one search criteria.</p>}
                {!showErrorMessage && <Box sx={{ m: 3 }} />}

                <Typography
                    variant="h4"
                    gutterBottom
                    component="div">
                    Search Results
                </Typography>

                <ul>
                    {movies.map(function (movie) {
                        let reviews = movie.reviews;
                        let reviewsList = [];
                        if (reviews !== null) {
                            reviewsList = reviews.split(",");
                        };

                        return (
                            <li>
                                <Typography
                                    variant="h5"
                                    gutterBottom
                                    component="div">
                                    Movie: {movie.name}
                                </Typography>

                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    component="div">
                                    Director: {movie.directorName} <br></br>
                                    Average User Rating: {movie.AverageRating} <br></br>
                                    User Reviews:
                                </Typography>


                                {reviewsList.map(function (review) {
                                    let reviewComponents = review.split(" - ");
                                    return (
                                        <li>
                                            <Typography
                                                variant="h7"
                                                gutterBottom
                                                component="div">
                                                {reviewComponents[0]} <br></br>
                                                {reviewComponents[1]} <br></br>
                                                {reviewComponents[2]}
                                            </Typography>
                                        </li>
                                    )
                                })}

                            </li>
                        )
                    })}
                </ul>
            </Grid>
        </div>
    )
};

const SearchField = (props) => {
    return (
        <div>
            <TextField
                id="search"
                label={props.label}
                value={props.searchTerm}
                onChange={props.onChange}
                variant="outlined"
                autoComplete="off"
                color="secondary"
            ></TextField>
            <Box sx={{ m: 3 }} />
        </div>
    )
};

export default Search;