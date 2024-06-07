import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import {
    Box, Card, CardActionArea, CardActions, CardContent,
    Container, IconButton, Rating, Typography
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

export default function TrophyCard(props: any) {
    return (
        <React.Fragment>
            <Card sx={{ minWidth: 200, padding: '1em', margin: 0, position: "relative", overflow: "hidden" }}>
                <CardActionArea>
                    <CardContent>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            {props.trophy_data.name}
                        </Typography>
                        <Typography variant="h5" component="div">
                            {props.trophy_data.description}
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                minHeight: 'auto',
                                alignItems: "center",
                                flexGrow: 1,
                            }}
                        >
                            <Container maxWidth="sm">
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: "center"
                                    }}
                                >
                                    <Link
                                        to={`/trophy?id=${props?.trophy_data.unique_id}`}
                                        style={{ textDecoration: "none", color: "inherit" }}
                                    >
                                        <div style={{ width: '150px', height: '150px' }}>
                                            <img
                                                src={props.trophy_data._links.thumbnail}
                                                alt={props.trophy_data.name}
                                                style={{
                                                    width: 'auto',
                                                    display: props?.trophy_data?.display || 'block'
                                                }}
                                            />
                                        </div>
                                    </Link>
                                </Box>
                            </Container>
                        </Box>
                    </CardContent>
                </CardActionArea>
                <CardActions disableSpacing>
                    <Rating name="read-only" value={1} size="small" />
                    <IconButton aria-label="share">
                        <ShareIcon />
                    </IconButton>
                </CardActions>
            </Card>
        </React.Fragment>
    );
}