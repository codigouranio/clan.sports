import { Typography } from "@mui/material";

export default function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="left"
      {...props}
    >
      {'Copyright © '}
      CLANSPORTS.club
      {' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}