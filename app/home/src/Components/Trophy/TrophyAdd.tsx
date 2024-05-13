import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import {
    Box, Button, Container, FormControl, Grid, IconButton, ImageList,
    ImageListItem, ImageListItemBar,
    TextField
} from "@mui/material";
import { FormikHelpers, useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import { TrophyItem } from '.';
import useGenerateImage from '../../useGenerateImage';
import { LoadingButton } from '@mui/lab';

function srcset(image: string, width: number, height: number, rows = 1, cols = 1) {
    return {
        src: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format`,
        srcSet: `${image}?w=${width * cols}&h=${height * rows
            }&fit=crop&auto=format&dpr=2 2x`,
    };
}

let validationSchema = Yup.object();

export default function TrophyAdd() {

    // const [imageSrc, setImageSrc] = useState('');
    const { state, generateImage } = useGenerateImage();
    const { data: { items: { generatedImage } } } = state;
    const { loading } = state;

    const handleImageUpload = async (e, words) => {
        await generateImage(words, () => ({}));
    };

    interface IFormValues {
        generateTrophyWords: '',
        name: ''
    }

    const initialValues: IFormValues = {
        generateTrophyWords: '',
        name: ''
    };

    const onSubmit = async (values: IFormValues, actions: FormikHelpers<IFormValues>) => {
        console.log(values);
    }

    const formik = useFormik<IFormValues>({
        initialValues,
        validationSchema,
        onSubmit,
    });

    // const formik = useFormik<IFormValues>({
    //     initialValues: {
    //         generateTrophyWords: ''
    //     },
    //     onSubmit: (values: IFormValues, formikHelpers: FormikHelpers<IFormValues>) => {
    //         console.log(values);
    //         formikHelpers.setSubmitting(false);
    //     }
    // });

    // console.log(formik);

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
                <Grid container spacing={2} columns={16} component="form" justifyContent="center">
                    <Grid item xs={16} sm={12}>
                        <Box sx={{ width: "100%", height: "1em" }}></Box>
                        <h2>Create a new Trophy</h2>
                    </Grid>
                    <Grid item xs={16} sm={12}>
                        <FormControl fullWidth>
                            <TextField
                                id="name"
                                name="name"
                                required
                                label="Name"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                                autoComplete="given-name"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={16} sm={12}>
                        <Box sx={{ width: "100%", height: "1em" }}></Box>
                        <h3>Generate a Trophy providing a list of words as description</h3>
                    </Grid>
                    <Grid item xs={16} sm={12} display="flex" justifyContent="center" alignItems="center">
                        <TextField
                            id="generateTrophyWords"
                            name="generateTrophyWords"
                            label="add words to generate the trophy"
                            variant="outlined" sx={{ width: '25em', marginRight: '1em' }}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <Button variant="contained" startIcon={<EmojiEventsIcon />}
                            onClick={(e) => handleImageUpload(e, { "words": formik.values?.generateTrophyWords })}
                        >
                            Generate
                        </Button>
                    </Grid>
                    <Grid item xs={16} sm={12} display="flex" justifyContent="center" alignItems="center">
                        <TrophyItem
                            src={generatedImage?.url}
                            alt="Trophy"
                            loading={loading}
                        />
                    </Grid>
                    <Grid item xs={16} sm={12}>
                        <LoadingButton
                            type="submit"
                            fullWidth
                            loading={loading}
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Create
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Container>
        </React.Fragment >
    );
}