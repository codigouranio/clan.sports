import { Card, CardContent, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { Link } from "react-router-dom";

const CardAdd = ({ itemType = 'unknown', onClick = (ev: any) => ev.preventDefault() }) =>
  <Card sx={{ minWidth: 100, margin: 1, color: '#818181' }}>
    <Link to="add" style={{ textDecoration: "none", color: "inherit" }}>
      <CardContent>
        <Typography variant="h5" component="div">
          Create New<br /> {itemType}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="inherit">
          <AddIcon sx={{ fontSize: '3em' }} />
        </Typography>
      </CardContent>
    </Link>
  </Card>

export default CardAdd;