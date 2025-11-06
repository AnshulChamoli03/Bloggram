import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { CssBaseline, StyledEngineProvider, ThemeProvider, createTheme } from '@mui/material';

const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#3182ce',
    },
    secondary: {
      main: '#805ad5',
    },
  },
});

export default function UiProvider({ children }) {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

