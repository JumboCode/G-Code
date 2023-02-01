import { createTheme } from '@mui/material/styles';

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    primary: true;
    secondary: true;
    text: true;
  }
}

export const theme = createTheme({
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'primary' },
          style: {
            backgroundColor: '#6A5DF9',
            color: '#fff',
            borderRadius: '30px',
            boxShadow: 'none',
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(139.72deg, #6E59F7 22.94%, #9533C4 174.66%)',
              backgroundColor: '#6A5DF9',
              boxShadow: 'none',
            },
            '&:active': {
              boxShadow: 'none',
              backgroundColor: '#4E43CB',
            },
          },
        },
        {
          props: { variant: 'secondary' },
          style: {
            backgroundColor: '#fff',
            color: '#6A5DF9',
            borderRadius: '30px',
            border: '1px solid #6A5DF9',
            boxShadow: 'none',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#F3F4F6',
              boxShadow: 'none',
            },
            '&:active': {
              boxShadow: 'none',
              backgroundColor: '#F0EFFE',
            },
          },
        },
        {
          props: { variant: 'text' },
          style: {
            backgroundColor: '#fff',
            color: '#000',
            borderRadius: '30px',
            boxShadow: 'none',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#F3F4F6',
              boxShadow: 'none',
            },
            '&:active': {
              boxShadow: 'none',
              backgroundColor: '#F3F4F6',
            },
          },
        },
      ],
    },
  },
});