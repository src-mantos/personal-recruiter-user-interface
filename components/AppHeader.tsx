import React from 'react';
// import { PRlight, PRdark } from "../components/theme";
// import { Grid, Switch, changeTheme, useTheme } from '@nextui-org/react';


// const AppHeader = () => {
//     const { type, isDark } = useTheme();
//     const { theme } = useTheme();

//     const handleChange = () => {
//         console.log(isDark,PRlight,PRdark);
//         const nextTheme = isDark ? PRlight.className : PRdark.className;
//         window.localStorage.setItem('data-theme', nextTheme); // you can use any storage
//         changeTheme(nextTheme);
//         console.log(nextTheme);
//     };
//     return (
//         <Grid.Container key={"PR-Main-Header"}>
//             <Grid xs={3} direction='column'>
//                 <h1>Personal Recruiter</h1>
//                 <span>collecting and utilizing market data to inform your choice.</span>
//             </Grid>
//             <Grid xs>
//                 <p>Primary Search interface</p>
//                 <p>some kind of options interface</p>
//             </Grid>
//             <Grid xs={1} >
//         The current theme is: {type}
//                 <Switch
//                     checked={isDark}
//                     onChange={handleChange}
//                 />
      
//             </Grid>
//         </Grid.Container>
//     );
// };
// export default AppHeader;
