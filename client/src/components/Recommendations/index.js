import * as React from 'react';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import InputLabel from '@material-ui/core/InputLabel';
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Box from "@material-ui/core/Box";
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import history from '../Navigation/history';

const serverURL = "http://ec2-18-216-101-119.us-east-2.compute.amazonaws.com:3094"
//const serverURL = "";

const Recommendation = () => {

    // Movies State
    const [movies, setMovies] = React.useState([]);

    // Recommended Movies State
    const [RecommendMovies, setRecommendedMovies] = React.useState([]);
    const [filter, setFilter] = React.useState('');

    // States
    const [selectedMovie, setSelectedMovie] = React.useState('');
    const [selectedMovieObj, setSelectedMovieObj] = React.useState({});

    // Error States
    const [movieError, setMovieError] = React.useState(false);
    const [filterError, setFilterError] = React.useState(false);

    // State Handling
    const handleChangeMovie = (event) => {
        setSelectedMovie(event.target.value);

        movies.map((movie) => {
            if (movie.name === event.target.value) {
                setSelectedMovieObj(movie);
            };
        });

        setMovieError(event.target.value === '');
        setRecommendedMovies([]);
    };

    const handleChangeFilter = (event) => {
        setFilter(event.target.value);
        setFilterError(event.target.value === '');
    };

    // Handle Validation
    const retrieveRecommendations = () => {
        if (selectedMovie !== '' && filter !== '') {
            handleSearchRecommendations();
        } else {
            if (selectedMovie === '') {
                setMovieError(true);
            }

            if (filter === '') {
                setFilterError(true);
            };
        };
    };

    // API Calls
    const callApiGetMovies = async () => {
        const url = serverURL + "/api/getMovies";
        console.log(url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        console.log("Found movies: ", body);
        return body;
    };

    // API Calls
    const callApiSearchRecommendations = async () => {
        const url = serverURL + "/api/searchRecommendations";
        console.log(url);

        let directorSearch = '';
        let genreSearch = [];
        let yearSearch = '';

        if (filter === "Director") {
            directorSearch = selectedMovieObj.directorName.split(",");
        };

        if (filter === "Genre") {
            genreSearch = selectedMovieObj.genres.split(",");
        };

        if (filter === "Year") {
            yearSearch = selectedMovieObj.year;
        };

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                director: directorSearch,
                genre: genreSearch,
                year: yearSearch
            })
        });

        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        console.log("Sent review: ", body);
        return body;
    };

    // API Handles
    const handleGetMovies = () => {
        callApiGetMovies()
            .then(res => {
                console.log("callApiGetMovies returned: ", res);
                var parsed = JSON.parse(res.express);
                console.log("callApiGetMovies parsed: ", parsed);
                setMovies(parsed);
            });
    };

    // API Handles
    const handleSearchRecommendations = () => {
        callApiSearchRecommendations()
            .then(res => {
                console.log("callApiSearchMovies returned: ", res);
                var parsed = JSON.parse(res.express);
                console.log("callApiSearchMovies parsed: ", parsed);
                setRecommendedMovies(parsed);
            });
    };

    React.useEffect(() => {
        handleGetMovies();
    }, []);

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
                    Get recommendations for movies based on a chosen movie's director, genre(s), or release year.
                </Typography>

                <Box sx={{ m: 3 }} />

                <MovieSelection
                    selectedMovie={selectedMovie}
                    movieError={movieError}
                    handleChangeMovie={handleChangeMovie}
                    movies={movies}
                ></MovieSelection>

                <Typography
                    variant="h6"
                    gutterBottom
                    component="div">
                    Director: {selectedMovieObj.directorName} <br></br>
                    Genres: {selectedMovieObj.genres} <br></br>
                    Year: {selectedMovieObj.year}
                </Typography>

                <Filters
                    filter={filter}
                    filterError={filterError}
                    handleChangeFilter={handleChangeFilter}
                ></Filters>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => { retrieveRecommendations() }}>Recommend</Button>

                <Box sx={{ m: 3 }} />

                <Typography
                    variant="h4"
                    gutterBottom
                    component="div">
                    Recommendations
                </Typography>

                <ul>
                    {RecommendMovies.map(function (movie) {
                        if (movie.name === selectedMovie) {
                            return null;
                        } else {
                            return (
                                <li>
                                    <Typography
                                        variant="h5"
                                        gutterBottom
                                        component="div">
                                        {movie.name} - Genre: {movie.genre} - Year: {movie.year}
                                    </Typography>
                                </li>
                            )
                        };
                    })}
                </ul>
            </Grid>
        </div >
    )
};

const MovieSelection = (props) => {
    return (
        <FormControl className={"Movie-Title-Input"}>
            <InputLabel id="controlled-open-select-label">Movie:</InputLabel>
            <Select
                id="review-movie"
                value={props.selectedMovie}
                onChange={props.handleChangeMovie}
            >
                {props.movies.map((movie) => {
                    return <MenuItem value={movie.name}>{movie.name}</MenuItem>
                })};

            </Select>
            <FormHelperText>Select a movie.</FormHelperText>
            {props.movieError && <p style={{ color: 'red' }}>Please select a movie.</p>}
            {!props.movieError && <Box sx={{ m: 3 }} />}
        </FormControl>
    )
};

const Filters = (props) => {
    return (
        <FormControl>
            <FormLabel id="recommend-by">Recommend By:</FormLabel>
            <RadioGroup
                name="filters"
                value={props.filter}
                onChange={props.handleChangeFilter}
            >
                <FormControlLabel value="Director" control={<Radio />} label="Director" />
                <FormControlLabel value="Genre" control={<Radio />} label="Genre" />
                <FormControlLabel value="Year" control={<Radio />} label="Year" />
            </RadioGroup>
            {props.filterError && <p style={{ color: 'red' }}>Please select a filter.</p>}
            {!props.filterError && <Box sx={{ m: 3 }} />}
        </FormControl>
    )
};

export default Recommendation;