import {
    Box, Container, Grid, IconButton, ImageList,
    ImageListItem, ImageListItemBar, LinearProgress,
    TextField
} from "@mui/material";
import React from "react";
import StarBorderIcon from '@mui/icons-material/StarBorder';

function srcset(image: string, width: number, height: number, rows = 1, cols = 1) {
    return {
        src: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format`,
        srcSet: `${image}?w=${width * cols}&h=${height * rows
            }&fit=crop&auto=format&dpr=2 2x`,
    };
}

export default function TrophyAdd() {

    const itemData = [
        {
            img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
            title: 'Breakfast',
            author: '@bkristastucchio',
            featured: true,
        },
        {
            img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
            title: 'Burger',
            author: '@rollelflex_graphy726',
        },
        {
            img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
            title: 'Camera',
            author: '@helloimnik',
        },
        {
            img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
            title: 'Coffee',
            author: '@nolanissac',
        },
        {
            img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
            title: 'Hats',
            author: '@hjrc33',
        },
        {
            img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
            title: 'Honey',
            author: '@arwinneil',
            featured: true,
        },
        {
            img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
            title: 'Basketball',
            author: '@tjdragotta',
        },
        {
            img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
            title: 'Fern',
            author: '@katie_wasserman',
        },
        {
            img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
            title: 'Mushrooms',
            author: '@silverdalex',
        },
        {
            img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
            title: 'Tomato basil',
            author: '@shelleypauls',
        },
        {
            img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
            title: 'Sea star',
            author: '@peterlaster',
        },
        {
            img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
            title: 'Bike',
            author: '@southside_customs',
        },
    ];

    return (
        <React.Fragment>
            <Container component="main" maxWidth="md">
                <Grid container spacing={2} columns={16}>
                    <Grid item xs={16} component="form">
                        <Box sx={{ width: "100%", height: "1em" }}>

                        </Box>
                        <h2>Create a new Trophy</h2>
                    </Grid>
                    <Grid item
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        xs={16}
                        sx={{ justifyContent: "center" }}
                    >
                        <h2>Test</h2>
                        <TextField
                            id="outlined-basic"
                            label="add words to generate the trophy"
                            variant="outlined" sx={{ width: '30em' }}
                        />
                        <ImageList
                            sx={{
                                width: 'auto',
                                height: '300px',
                                // Promote the list into its own layer in Chrome. This costs memory, but helps keeping high FPS.
                                transform: 'translateZ(0)',
                            }}
                            rowHeight={200}
                            gap={1}
                        >
                            {itemData.map((item) => {
                                const cols = item.featured ? 2 : 1;
                                const rows = item.featured ? 2 : 1;

                                return (
                                    <ImageListItem key={item.img} cols={cols} rows={rows}>
                                        <img
                                            {...srcset(item.img, 250, 200, rows, cols)}
                                            alt={item.title}
                                            loading="lazy"
                                        />
                                        <ImageListItemBar
                                            sx={{
                                                background:
                                                    'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                                    'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                                            }}
                                            title={item.title}
                                            position="top"
                                            actionIcon={
                                                <IconButton
                                                    sx={{ color: 'white' }}
                                                    aria-label={`star ${item.title}`}
                                                >
                                                    <StarBorderIcon />
                                                </IconButton>
                                            }
                                            actionPosition="left"
                                        />
                                    </ImageListItem>
                                );
                            })}
                        </ImageList>
                    </Grid>
                </Grid>
            </Container>
        </React.Fragment>
    );
}