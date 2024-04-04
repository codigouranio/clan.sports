import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import { Autocomplete, Box, Button, Container, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { FormikHelpers, useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import { countries } from "../countryList";

export default function ProfileAdd() {

  interface IFormValues {
    name: string;
    last_name: string;
    profile_type_code: number;
    bio: string;
  }

  const initialValues: IFormValues = {
    profile_type_code: 10,
    name: '',
    last_name: '',
    bio: ''
  };

  // const validate = (values: IFormValues) => {

  // }
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Name is too short!')
      .max(32, 'Name is too long!')
      .required('Name is required!'),
    last_name: Yup.string()
      .min(3, 'Last Name is too short!')
      .max(32, 'Last Name is too long!')
      .required('Last Name is required!'),
    bio: Yup.string()
      .min(3, 'Bio is too short!'),
    street_address: Yup.string()
      .min(3, 'Street address is too short')
      .max(32, 'Street address is too long'),
    city: Yup.string()
      .min(3, 'City is too short')
      .max(32, 'City is too long'),
    // state_province: Yup.string()
    //   .min(3, 'StateProvince is too short')
    //   .max(32, 'StateProvince is too long'),
    // postal_code: Yup.string()
    //   .min(3, 'Postal Code is too short')
    //   .max(32, 'Postal Code is too long'),
    // country: Yup.string(),
    // profile_type_code: Yup.number()
    //   .required('Profile type is required')
  });

  // const onSubmit = async (values: IFormValues, actions: any) => {
  //   console.log(actions);
  //   await new Promise((r) => setTimeout(r, 500));
  //   alert(JSON.stringify(values, null, 2));
  // };

  const onSubmit = async (values: IFormValues, actions: FormikHelpers<IFormValues>) => {
    alert(JSON.stringify(values, null, 2));
  }

  const formik = useFormik<IFormValues>({
    initialValues,
    validationSchema,
    onSubmit
  });

  return (
    <React.Fragment>
      <Container component="main" maxWidth="md">
        {/* <Box component="form" noValidate sx={{ mt: 3 }}> */}
        <Grid container spacing={2} columns={16}>
          <Grid item xs={4}>
            <Timeline position="left">
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
            <h2>Create a new Profile</h2>
            {/* <Box sx={{ mt: 3 }}> */}
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
                    <MenuItem value={10}>Coach</MenuItem>
                    <MenuItem value={20}>Player</MenuItem>
                    <MenuItem value={30}>Organization</MenuItem>
                    <MenuItem value={40}>Club</MenuItem>
                    <MenuItem value={50}>Academy</MenuItem>
                  </Select>
                  {
                    formik.touched.profile_type_code &&
                    <FormHelperText>{formik.errors.profile_type_code}</FormHelperText>
                  }
                </FormControl>
              </Grid>
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
              {/* <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormControlLabel
                    control={<Checkbox value="allowExtraEmails" name="allowExtraEmails" onChange={formik.handleChange} color="primary" />}
                    label="I want to receive inspiration, marketing promotions and updates via email."
                  />
                </FormControl>
              </Grid> */}
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
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={10} sm={4}>
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
              <Grid item xs={14} sm={8}>
                <FormControl fullWidth>
                  <Autocomplete
                    sx={{ width: "auto" }}
                    options={countries}
                    autoHighlight
                    getOptionLabel={(option) => option.label}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
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
                          autoComplete: 'new-password', // disable autocomplete and autofill
                        }}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create
            </Button>
            {/* </Box> */}
          </Grid>
        </Grid>
        {/* </Box> */}

      </Container>
    </React.Fragment >
  )
}