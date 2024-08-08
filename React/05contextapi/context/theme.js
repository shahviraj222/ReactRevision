import { createContext, useContext } from "react";

// here the theme context is your same as UserContext but we are also defining the variables can shareable
export const ThemeContext = createContext()

//now you have to wrap the elemts by simply <ThemeProvider> 
export const ThemeProvider = ThemeContext.Provider

// whenever you want to set the variable use the below function 
export default function useTheme() {
    return useContext(ThemeContext)
}