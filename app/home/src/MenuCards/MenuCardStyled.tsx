import { Card } from "@mui/material";
import { styled } from '@mui/material/styles';

export const MenuCardStyled = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  fontSize: '70px',
  marginLeft: '0.2em',
  marginRight: '0.2em',
  marginBlock: 'auto',
  marginTop: '0.2em',
  marginBottom: '0.2em',
  boxShadow: theme.shadows[3],
  maxHeight: 'auto',
  minHeight: '350px',
  minWidth: '220px',
  maxWidth: 'auto',
  // border: '0px solid #919491',
  color: theme.palette.text.secondary,
}));