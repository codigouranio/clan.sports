import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { LoadingButton } from '@mui/lab';
import {
    Box, Button, Container, FormControl, Grid,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import { FormikHelpers, useFormik } from "formik";
import React, { useContext, useState } from "react";
import * as Yup from "yup";
import { TrophyItem } from '.';
import useGenerateImage from '../../useGenerateImage';
import useFormPosting from '../../useDataPosting';
import { Storage } from '../../Storage';
import { Link } from 'react-router-dom';
import useDataFetching from '../../useDataFetching';

function srcset(image: string, width: number, height: number, rows = 1, cols = 1) {
    return {
        src: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format`,
        srcSet: `${image}?w=${width * cols}&h=${height * rows
            }&fit=crop&auto=format&dpr=2 2x`,
    };
}

let validationSchema = Yup.object();

export default function TrophyAdd() {

    useDataFetching('/api/trophy/form');

    const { storageState } = useContext(Storage);
    const { generateImage } = useGenerateImage();
    const {
        data: {
            items: { generatedImage },
            added_trophy = { success: false }
        },
        loading = false
    } = storageState;

    const { data } = storageState;

    console.log(data);

    interface IFormValues {
        generateTrophyWords: '',
        name: ''
        description: '',
        profile_id: '',
        asset_type: 'TROPHY',
        asset: File | null
    }

    const initialValues: IFormValues = {
        generateTrophyWords: '',
        name: '',
        description: '',
        profile_id: '',
        asset_type: 'TROPHY',
        asset: null
    };

    const { postData } = useFormPosting("/api/trophies", {
        timeout: 500,
        method: "POST",
        headers: {}
    });

    const onSubmit = async (values: IFormValues, actions: FormikHelpers<IFormValues>) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('profile_id', values.profile_id);
        formData.append('asset_type', values.asset_type);
        formData.append('asset', values.asset as Blob);

        await postData(formData);

        actions.setSubmitting(false);
    }

    const formik = useFormik<IFormValues>({
        initialValues,
        validationSchema,
        onSubmit,
    });

    const handleImageUpload = async () => {
        const res = await generateImage({ "words": formik.values?.generateTrophyWords }, () => ({}));
        formik.setFieldValue("asset", res);
    };

    if (added_trophy.success) {
        return (
            <React.Fragment>
                <Container component="main" maxWidth="md">
                    <Link to="/trophies" style={{ textDecoration: "none", color: "inherit" }} replace>
                        <h1>Congratulations! Trophy Successfully Created!</h1>
                        <h2>View the details of your new {added_trophy.asset_nft_name || "trophy"}</h2>
                        <h2>Go back</h2>
                    </Link>
                </Container>
            </React.Fragment >
        )
    }

    return (
        <React.Fragment>
            {loading && <LinearProgress />}
            <Container component="main" maxWidth="md">
                <Grid
                    container
                    spacing={2}
                    columns={16}
                    component="form"
                    justifyContent="center"
                    onSubmit={formik.handleSubmit}
                >
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
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={16} sm={12}>
                        <FormControl fullWidth>
                            <TextField
                                id="description"
                                name="description"
                                required
                                label="Description"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={16} sm={12}>
                        <FormControl fullWidth>
                            <TextField
                                id="amount"
                                name="amount"
                                required
                                label="Amount"
                                type="number"
                                defaultValue={0}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={16} sm={12}>
                        <FormControl fullWidth>
                            <InputLabel id="profile-select-label">Profile</InputLabel>
                            <Select
                                labelId="profile-select-label"
                                id="profile-select"
                                value={1}
                                label="Profile"
                                required
                            >
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                            <TextField
                                id="profile_id"
                                name="profile_id"
                                required
                                label="Profile"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={16} sm={12}>
                        <FormControl sx={{ minWidth: 120 }} fullWidth>
                            <InputLabel id="profile_type_code-label">Type&ensp;</InputLabel>
                        </FormControl>
                    </Grid>
                    <Grid item xs={16} sm={12}>
                        <input hidden id="asset" name="asset" onChange={formik.handleChange} />
                        <input hidden name="asset_type" onChange={formik.handleChange} />
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
                            onClick={(e) => handleImageUpload(e, formik)}
                        >
                            Generate Trophy
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
                            Create Trophy
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Container>
        </React.Fragment >
    );
}