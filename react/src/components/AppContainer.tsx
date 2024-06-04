import { Container, styled } from "@mui/material";

export const AppContainer = styled(Container)(({ theme }) => ({
    textAlign: 'center',
    padding: theme.spacing(2),
    width: '300px',
  }));
  