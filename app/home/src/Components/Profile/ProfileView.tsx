import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import { Container, Grid, Paper, Stack, Typography } from "@mui/material";
import * as _ from "lodash";
import React from "react";
import { useSearchParams } from "react-router-dom";
import useDataFetching from "../../useDataFetching";

export const ProfileView: React.FC<any> = () => {

  const [searchParams] = useSearchParams();

  const profile_unique_id = searchParams.get("id") || "unknown";

  const { data, loading, error } = useDataFetching(
    `/api/profile/${profile_unique_id}`
  );

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
  console.log(profile?.bio);
  return (
    <React.Fragment>
      <Container component="main" maxWidth={"md"} fixed sx={{}}>
        <Grid container spacing={1} columnSpacing={2} sx={{ paddingLeft: "1em" }}>
          <Grid item xs={12} sm={12} md={12} alignContent={"flex-end"} sx={{ padding: '1em' }}>
            <Grid item xs={12} sm={12} md={12} sx={{ marginLeft: '10px', paddingTop: '2em', paddingBottom: '0.2em' }}>
              <Typography variant="h2">{`${profile?.name} ${profile?.last_name}`}</Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} sx={{ paddingBottom: '1em' }}>
              <Typography variant="subtitle1">{`${profile?.profile_type_name}`}</Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} sx={{ minHeight: "50px", color: "gray", border: "0px solid #000", backgroundColor: "transparent" }}>
              <Typography variant="h6">{`${profile?.street_address}, ${profile?.city}, ${profile?.postal_code}, ${profile?.state_province}, ${profile?.country}`}</Typography>
            </Grid>
            {
              (profile?.bio) &&
              <React.Fragment>
                <Grid item xs={12} sm={12} md={12} textAlign="left" sx={{ marginTop: "1em", marginBottom: "1em", backgroundColor: "gray", color: "white", padding: "0.5em" }}>
                  <Typography variant="h5">BIO</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12} textAlign="left" sx={{ paddingBottom: "5em" }}>
                  <Typography variant="body1">{profile?.bio}</Typography>
                </Grid>
              </React.Fragment>
            }
          </Grid>
          <Grid item xs={12} sm={5} md={5} sx={{ borderTop: "1px dashed gray" }}>
            <Timeline position="left">
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>Created</TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>Submitted</TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot variant="outlined" />
                </TimelineSeparator>
                <TimelineContent>Approve</TimelineContent>
              </TimelineItem>
            </Timeline>
          </Grid>
          <Grid item alignContent={"middle"} xs={12} sm={7} md={7} sx={{ borderTop: "1px dashed gray", minHeight: "300px", paddingRight: "1em" }}>
            <Grid container spacing={0} sx={{ m: "0px", p: "0px" }}>
              <Grid item xs={12}>
                <Stack>
                  <Paper sx={{ paddingBottom: "0em" }}>
                    <Typography variant="caption" align="center">Scan QR Code</Typography>
                  </Paper>
                  <Paper>
                    <img src={`/api/profileQr/${profile?.unique_id}`} alt="" style={{ margin: "1px", width: "80%", height: "80%" }} />
                  </Paper>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};
