import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { Box, Card, CardActions, CardContent, IconButton, Typography } from "@mui/material";
import { Link } from 'react-router-dom';
import moment from 'moment';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export default function ProfileCard(props: any) {
  console.log(props?.profile_data);
  return (
    <Link to={`/profile?id=${props?.profile_data.unique_id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <Card sx={{ minWidth: 200, margin: 0 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {`Created ${moment(props?.profile_data?.created_at).fromNow()}`}
          </Typography>
          <Typography variant="h5" component="div">
            {`${props?.profile_data?.name} ${props?.profile_data?.last_name}`}
          </Typography>
          {props?.profile_data?.profile_type_name &&
            <Typography sx={{ mb: 0 }} variant="h6" color="text.secondary">
              {`Profile ${props?.profile_data?.profile_type_name}`}
            </Typography>
          }
          {props?.profile_data?.modified_at &&
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {`Created ${moment(props?.profile_data?.modified_at).fromNow()}`}
            </Typography>
          }
        </CardContent>
        <CardActions>
          <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
              {props?.profile_data?.favorite &&
                <FavoriteIcon sx={{ color: 'red' }} />
              }
              {!props?.profile_data?.favorite &&
                <FavoriteIcon />
              }
            </IconButton>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
          </CardActions>
        </CardActions>
      </Card>
    </Link>
  );
}