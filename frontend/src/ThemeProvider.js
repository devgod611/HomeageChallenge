import React, { createContext, useState, useCallback } from 'react'
import { createTheme } from '@material-ui/core/styles'
import MuiThemeProvider from '@material-ui/styles/ThemeProvider'
import orange from '@material-ui/core/colors/orange'
import purple from '@material-ui/core/colors/purple'

function createMyTheme (light) {
  const theme = {
    palette: {
      type: light ? 'light' : 'dark',
      primary: orange,
      secondary: purple
    }
  }

  return createTheme (theme)
}

export const ThemeContext = createContext({})

function ThemeProvider ({ children }) {
  const [theme, setTheme] = useState(createMyTheme(true))

  const setThemeType = useCallback(
    type => {
      setTheme(createMyTheme(type === 'light'))
    },
    [setTheme]
  )

  return (
    <MuiThemeProvider theme={theme}>
      <ThemeContext.Provider value={{ theme, setThemeType }}>{children}</ThemeContext.Provider>
    </MuiThemeProvider>
  )
}

export default ThemeProvider
