import React from 'react';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import history from '../Navigation/history';

const Landing = () => {
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

                <Box sx={{ m: 3 }}></Box>

                <Typography
                    variant="h6"
                    gutterBottom
                    component="div"
                    align = 'center'>
                    Welcome to Rotten Potatoes! This website is a review-aggregation website for movies. <br></br>
                    Search for, add a review for, and look for recommendations based on your favourite movies.
                </Typography>

            </Grid>
        </div>
    )
};

export default Landing;