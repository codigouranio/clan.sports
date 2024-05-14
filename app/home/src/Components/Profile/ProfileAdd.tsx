import { LoadingButton } from "@mui/lab";
import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import {
  Autocomplete, Box, Container, FormControl, FormHelperText,
  Grid, InputLabel, LinearProgress, MenuItem, Select, TextField
} from "@mui/material";
import { FormikHelpers, useFormik } from "formik";
import _ from "lodash";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import useDataFetching from "../../useDataFetching";
import useFormPosting from "../../useDataPosting";
import { countries } from "../countryList";

export default function ProfileAdd() {

  const [profileSchemaType, setProfileSchemaType] = useState(1);

  const form = useDataFetching('/api/profile/form');

  const { state, postData } = useFormPosting("/api/profiles", {
    timeout: 500,
    method: "POST",
    headers: { "Content-Type": "application/json" }
  });
  const { data, loading, error } = state;
  const { added_profile = { success: false } } = data

  interface IFormValues {
    name: string;
    last_name?: string;
    profile_type_code: number;
    bio: string;
    profile_schema_type?: number;
  }

  const initialValues: IFormValues = {
    profile_type_code: 10,
    name: "",
    last_name: "",
    bio: "",
    profile_schema_type: 1
  };

  const validation_1 = {
    name: Yup.string()
      .min(3, "Name is too short!")
      .max(32, "Name is too long!")
      .required("Name is required!"),
    bio: Yup.string()
      .min(3, "Bio is too short!"),
    street_address: Yup.string()
      .min(3, "Street address is too short")
      .max(32, "Street address is too long"),
    city: Yup.string()
      .min(3, "City is too short")
      .max(32, "City is too long")
  };

  const validation_2 = {
    last_name: Yup.string()
      .min(3, "Last name is too short!")
      .max(32, "Last name is too long!")
      .required("Last name is required!")
  };

  let validationSchema = Yup.object();

  if (profileSchemaType === 2) {
    validationSchema.shape({ ...validation_1, ...validation_2 });
  }

  if (profileSchemaType === 1) {
    validationSchema.shape(validation_1);
  }

  const onSubmit = async (values: IFormValues, actions: FormikHelpers<IFormValues>) => {
    await postData(JSON.stringify(values));
  }

  const formik = useFormik<IFormValues>({
    initialValues,
    validationSchema,
    onSubmit,
  });

  if (added_profile.success) {
    return (
      <React.Fragment>
        <Container component="main" maxWidth="md">
          <Link to="/profiles" style={{ textDecoration: "none", color: "inherit" }}>
            <h1>Congratulations! Profile Successfully Created!</h1>
            <h2>View the details of your new {added_profile.profile_type_name || "profile"}</h2>
            <h2>Go back</h2>
          </Link>
        </Container>
      </React.Fragment >
    )
  }

  return (
    <React.Fragment>
      <Container component="main" maxWidth="md">
        <Grid container spacing={2} columns={16}>
          <Grid item xs={4}>
            <Timeline position="right">
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>Create</TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot variant="outlined" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>Submit</TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot variant="outlined" />
                </TimelineSeparator>
                <TimelineContent>Approve</TimelineContent>
              </TimelineItem>
            </Timeline>
          </Grid>
          <Grid item xs={12} component="form" onSubmit={formik.handleSubmit}>
            <input type="hidden" value="1" name="profile_schema_type" />
            <Box sx={{ width: "100%", height: "1em" }}>
              {loading && <LinearProgress />}
            </Box>
            <h2>Create a new Profile</h2>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl error={!!formik.errors.profile_type_code} sx={{ minWidth: 120 }} fullWidth>
                  <InputLabel id="profile_type_code-label">Type&ensp;</InputLabel>
                  <Select
                    sx={{ fontSize: "xx-large", color: "purple" }}
                    labelId="profile_type_code-label"
                    id="profile_type_code"
                    name="profile_type_code"
                    label="&ensp;&ensp;"
                    defaultValue={10}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.profile_type_code && Boolean(formik.errors.profile_type_code)}
                    autoFocus
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {_.map(data?.form?.profile_types, (profile_type: any) => (
                      <MenuItem
                        key={profile_type.code}
                        value={profile_type.code}
                        onClick={() => setProfileSchemaType(profile_type.schema_type)}>
                        {profile_type.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {
                    formik.touched.profile_type_code &&
                    <FormHelperText>{formik.errors.profile_type_code}</FormHelperText>
                  }
                </FormControl>
              </Grid>
              {
                (profileSchemaType === 1) && (
                  <React.Fragment>
                    <Grid item xs={8} sm={6}>
                      <FormControl fullWidth>
                        <TextField
                          id="name"
                          name="name"
                          required
                          label="First Name"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.name && Boolean(formik.errors.name)}
                          helperText={formik.touched.name && formik.errors.name}
                          autoComplete="given-name"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <TextField
                          required
                          fullWidth
                          id="last_name"
                          name="last_name"
                          label="Last Name"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                          helperText={formik.touched.last_name && formik.errors.last_name}
                          autoComplete="family-name"
                        />
                      </FormControl>
                    </Grid>
                  </React.Fragment>
                )
              }
              {
                (profileSchemaType === 2) && (
                  <Grid item xs={8} sm={12}>
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
                )
              }
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField
                    id="bio"
                    name="bio"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.bio && Boolean(formik.errors.bio)}
                    label="Bio&ensp;"
                    multiline
                    fullWidth
                    rows={3}
                    defaultValue=""
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField
                    required
                    fullWidth
                    id="street_address"
                    name="street_address"
                    onChange={formik.handleChange}
                    label="Street Address"
                    autoComplete="street-address"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <TextField
                    required
                    id="postal_code"
                    name="postal_code"
                    onChange={formik.handleChange}
                    label="Postal Code"
                    autoComplete="postal-code"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={8}>
                <FormControl fullWidth>
                  <TextField
                    required
                    id="city"
                    name="city"
                    onChange={formik.handleChange}
                    label="City"
                    autoComplete="address-level2"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Autocomplete
                    sx={{ width: "auto" }}
                    options={countries}
                    autoHighlight
                    getOptionLabel={(option) => option.label}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ "& > img": { mr: 2, flexShrink: 0 } }} {...props}>
                        <img
                          loading="lazy"
                          width="20"
                          srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                          src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                          alt=""
                        />
                        {option.label} ({option.code}) +{option.phone}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id="country"
                        name="country"
                        onChange={formik.handleChange}
                        label="Choose a country"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "new-password", // disable autocomplete and autofill
                        }}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    required
                    id="state_province"
                    name="state_province"
                    onChange={formik.handleChange}
                    label="State/Province/Region"
                    autoComplete="address-level1"
                  />
                </FormControl>
              </Grid>
            </Grid>

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
  )
}