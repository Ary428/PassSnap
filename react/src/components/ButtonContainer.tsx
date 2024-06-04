import { Box, styled } from "@mui/material";

export const ButtonContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(2),
  }));