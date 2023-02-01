import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch'
import { theme } from '../theme.ts'

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <Button variant='primary'>Click Me</Button>
      <Button variant='secondary'>Click Me</Button>
      <Button variant='text'>Click Me</Button>
      <Switch color="primary"/>
    </ThemeProvider>
  );
}
