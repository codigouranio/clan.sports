import { Container, Grid, Paper, Typography } from "@mui/material";
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

  console.log([">>>>>", data, loading, error]);

  if (data?.items && data?.items.length) {
    const profile_data = data.items[0];
    return (
      <React.Fragment>
        <Container component="main" maxWidth="md">
          <h1>{profile_data.name}</h1>
          <p>{profile_data.email}</p>
        </Container>
      </React.Fragment>
    );
  }

  console.log(data?.profile && data?.profile[profile_unique_id]);

  const profile = data?.profile ? data?.profile[profile_unique_id] : {};

  return (
    <React.Fragment>
      <Container component="main">
        <Grid container spacing={1} sx={{}}>
          <Grid
            item
            md={2}
            sx={{ border: "5px solid #000", padding: "20px", minHeight: "300px" }}
          >
            <Typography variant="h2">{`${profile?.name} ${profile?.last_name}`}</Typography>
          </Grid>
          <Grid item md={10} alignContent={"flex-end"} >
            <Grid item md={2} alignContent={"center"} sx={{ minHeight: "50px", color: "white", border: "5px solid #000", backgroundColor: "black" }}>
              <Typography variant="h6">{"Name"}</Typography>
            </Grid>
            <Grid item md={2} alignContent={"center"} sx={{ minHeight: "50px", color: "white", border: "5px solid #000", backgroundColor: "black" }}>
              <Typography variant="h6">{"Name"}</Typography>
            </Grid>
            {/* <Grid item alignContent={"center"} sx={{ minHeight: "50px", color: "white", border: "5px solid #000", backgroundColor: "black" }}>
              <Typography variant="h6">{"Name"}</Typography>
            </Grid> */}
            {/* <Grid container md={6}>
              <Grid item md={12} alignContent={"center"} sx={{ minHeight: "50px", color: "white", border: "5px solid #000", backgroundColor: "black" }}>
                <Typography variant="h6">{"Name"}</Typography>
              </Grid>
            </Grid> */}
            {/* <Grid container md={6}>
              <Grid item md={12} sx={{ border: "5px solid #000", padding: "1em" }}>
                <Typography variant="h6">{`${profile?.name}`}</Typography>
              </Grid>
            </Grid> */}
            {/* <Grid container md={6}>
              <Grid item md={12} alignContent={"center"} sx={{ minHeight: "50px", color: "white", border: "5px solid #000", backgroundColor: "black" }}>
                <Typography variant="h6">{"Last Name"}</Typography>
              </Grid>
            </Grid> */}
            {/* <Grid container md={6}>
              <Grid item md={12} sx={{ border: "5px solid #000", padding: "1em" }}>
                <Typography variant="h6">{`${profile?.last_name}`}</Typography>
              </Grid>
            </Grid> */}
          </Grid>
          <Grid item md={12} textAlign="left" sx={{ marginTop: "1em", backgroundColor: "black", color: "white" }}>
            <Typography variant="h3">BIO</Typography>
          </Grid>
          <Grid item md={12} textAlign="left">
            <Typography variant="body1">{profile?.bio}</Typography>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};
