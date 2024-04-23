import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  IconButton,
  Typography
} from "@mui/material";
import { Link } from "react-router-dom";
import moment from "moment";
import useFormPosting from "../../useDataPosting";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

export default function ProfileCard(props: any) {

  const { postData } = useFormPosting('/api/profile/favorite');

  const setFavorite = async (ev: any, profile_id: string, favorite = false) => {
    ev.preventDefault();
    postData({ profile_id, favorite });
  };

  return (
    <Link
      to={`/profile?id=${props?.profile_data.unique_id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Card sx={{ minWidth: 200, margin: 0, position: "relative", overflow: "hidden" }}>
        {props?.loading && (
          <Box sx={{
            position: "absolute",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <CircularProgress sx={{}} />
          </Box>
        )}
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom hidden>
            {`Created ${moment(props?.profile_data?.created_at).fromNow()}`}
          </Typography>
          <Typography variant="h5" component="div">
            {`${props?.profile_data?.name} ${props?.profile_data?.last_name}`}
          </Typography>
          {props?.profile_data?.profile_type_name && (
            <Typography sx={{ mb: 0 }} variant="h6" color="text.secondary">
              {`Profile ${props?.profile_data?.profile_type_name}`}
            </Typography>
          )}
          {props?.profile_data?.created_at && (
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {`Created ${moment(props?.profile_data?.created_at).fromNow()}`}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
              {props?.profile_data?.favorite && (
                <FavoriteIcon
                  sx={{ color: "red" }}
                  onClick={(ev) =>
                    setFavorite(ev, props?.profile_data?.unique_id, false)
                  }
                />
              )}
              {!props?.profile_data?.favorite && (
                <FavoriteIcon
                  onClick={(ev) =>
                    setFavorite(ev, props?.profile_data?.unique_id, true)
                  }
                />
              )}
            </IconButton>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
            <IconButton aria-label="edit">
              <EditIcon />
            </IconButton>
          </CardActions>
        </CardActions>
      </Card>
    </Link >
  );
}
