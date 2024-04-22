import { Container, Grid, Typography } from "@mui/material";
import React from "react";
import { useSearchParams } from "react-router-dom";
import useDataFetching from "../../useDataFetching";

export const ProfileView: React.FC<any> = () => {

  const [searchParams] = useSearchParams();
  console.log(searchParams);

  const profile_unique_id = searchParams.get("id") || "unknown";

  const { data, loading, error } = useDataFetching(
    `/api/profile/${profile_unique_id}`
  );

  console.log(data);

  if (data?.items && data?.items.length) {
    const profile_data = data.items.profiles[profile_unique_id];
    return (
      <React.Fragment>
        <Container component="main" maxWidth="md">
          <h1>{profile_data.name}</h1>
          <p>{profile_data.email}</p>
        </Container>
      </React.Fragment>
    );
  }



  const profile = data?.items?.profiles ? data?.items?.profiles[profile_unique_id] : {};

  console.log(profile);

  return (
    <React.Fragment>
      <Container component="main" maxWidth={"md"} fixed sx={{}}>
        <Grid container spacing={1} columnSpacing={2}>
          <Grid item xs={12} sm={4} md={4} sx={{ border: "5px solid gray", padding: "2px", minHeight: "300px", paddingLeft: "0px" }}>
            {/* <Typography variant="h5"></Typography> */}
            <img src={`/api/profileQr/${profile?.unique_id}`} alt="" style={{ margin: "1px", width: "10em", height: "10em" }} />
          </Grid>
          <Grid item xs={12} sm={8} md={8} alignContent={"flex-end"} sx={{ padding: '1em' }}>
            <Grid item xs={12} sm={12} md={12} sx={{ marginLeft: '10px', paddingTop: '2em', paddingBottom: '0.2em' }}>
              <Typography variant="h2">{`${profile?.name} ${profile?.last_name}`}</Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} sx={{ paddingBottom: '1em' }}>
              <Typography variant="subtitle1">{`${profile?.profile_type_name}`}</Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} sx={{ minHeight: "50px", color: "gray", border: "0px solid #000", backgroundColor: "transparent" }}>
              <Typography variant="h6">{`${profile?.street_address}, ${profile?.city}, ${profile?.postal_code}, ${profile?.state_province}, ${profile?.country}`}</Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} textAlign="left" sx={{ marginTop: "1em", marginBottom: "1em", backgroundColor: "gray", color: "white", padding: "0.5em" }}>
              <Typography variant="h5">BIO</Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} textAlign="left">
              <Typography variant="body1">{profile?.bio}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};
