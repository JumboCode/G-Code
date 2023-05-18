import { createTheme } from '@mui/material/styles';

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    primary: true;
    secondary: true;
    text: true;
    profile: true;
  }
}

declare module '@mui/material/Switch' {
  interface SwitchPropsColorOverrides {
    primary: true;
    secondary: true;
    text: true;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    h1: true;
    h3: true;
    h4: true;
    subtitle1: true;
    subtitle2: true;
  }
}

export const theme = createTheme({
  components: {
    MuiSwitch: {
      variants: [
        {
          props: { color: 'primary' },
          style: {
            width: 42,
            height: 26,
            padding: 0,
            '& .MuiSwitch-switchBase': {
              padding: 0,
              margin: 2,
              transitionDuration: '300ms',
              '&.Mui-checked': {
                transform: 'translateX(16px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                  backgroundColor: '#6E59F7',
                  opacity: 1,
                  border: 0,
                },
                '&.Mui-disabled + .MuiSwitch-track': {
                  opacity: 0.5,
                },
              },
              '&.Mui-focusVisible .MuiSwitch-thumb': {
                color: '#33cf4d',
                border: '6px solid #fff',
              },
              '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.7,
              },
            },
            '& .MuiSwitch-thumb': {
              boxSizing: 'border-box',
              width: 22,
              height: 22,
            },
            '& .MuiSwitch-track': {
              borderRadius: 26 / 2,
              backgroundColor: '#E9E9EA',
              opacity: 1,
              // transition: theme.transitions.create(['background-color'], {
              //   duration: 500,
              // }),
            },
          },
        },
      ],
    },
    MuiButton: {
      variants: [
        {
          props: { variant: 'primary' },
          style: {
            fontWeight: 'bold',
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
            fontWeight: 'bold',
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
          props: { variant: 'profile' },
          style: {
            color: '#29395B',
            backgroundColor: '#F1F1F1',
            padding: '5px 15px',
            marginTop: '10px',
            borderRadius: '30px',
            textTransform: 'none'
        }
        },
        {
    props: { variant: 'text' },
    style: {
      fontWeight: 'normal',
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
MuiTypography: {
  variants: [
    {
      props: { variant: 'h1' },
      style: {
        fontSize: '36px',
        fontFamily: '"IBM Plex Sans", sans-serif',
        lineHeight: '42.48px',
        fontWeight: '600',
        color: "#29395B"
      },
    },
    {
      props: { variant: 'h3' },
      style: {
        fontSize: '20px',
        fontFamily: 'Red Hat Display',
        lineHeight: '26px',
        fontWeight: '700',
        color: "#000f25",
        marginBottom: '10px'
      }
    },
    {
      props: { variant: 'h4' },
      style: {
        fontSize: '19px',
        fontFamily: '"IBM Plex Sans", sans-serif',
        lineHeight: '22.99px',
        fontWeight: '500',
        color: "#29395B"
      },
    },
    {
      props: { variant: 'subtitle1' },
      style: {
        fontSize: '16px',
        fontFamily: '"IBM Plex Sans", sans-serif',
        lineHeight: '19.36px',
        fontWeight: '500',
        color: "#949494"
      },
    },
    {
      props: { variant: 'subtitle2' },
      style: {
        fontSize: '14px',
        fontFamily: '"IBM Plex Sans", sans-serif',
        lineHeight: '22.05px',
        fontWeight: '500',
        color: "#949494"
      },
    },
  ]
}
  },
});