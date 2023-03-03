import Box from '@mui/material/Box';
import {useState} from "react";
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const buttonTheme = createTheme({
    palette: {
        check: {
            main: '#008CCF',
            contrastText: '#fff',
        },unCheck:{
            main: '#EDEDED',
            contrastText: '#999999',
        }
    },
});

const ChartHeader = () => {
    const navigate = useNavigate();

    const [value, setValue] = useState(window.location.pathname);

    const userHandleChange = (newValue) => {
        setValue(newValue);
        navigate(`${newValue}`);
    };

    const check = {width:'32%',height:'50px',fontWeight:'700'}
    const unCheck = {height:'50px',fontSize:'12px',background:'#EDEDED',color:'#999999'}
    return (
        <Box sx={{ width: '100%', display:'flex',justifyContent:'space-around' }}>
                <ThemeProvider theme={buttonTheme}>
                    <Button sx={check}
                            variant="contained"
                            color={value === '/chart' ? 'check' : 'unCheck'}
                            onClick={() => userHandleChange('/chart')}
                    >접속사용자 TOP10</Button>
                    <Button sx={check}
                            variant="contained"
                            color={value === '/chartdept' ? 'check' : 'unCheck'}
                            onClick={() => userHandleChange('/chartdept')}
                    >접속부서 TOP10</Button>
                    <Button sx={check}
                            variant="contained"
                            color={value === '/chartmenu' ? 'check' : 'unCheck'}
                            onClick={() => userHandleChange('/chartmenu')}
                    >조회메뉴 TOP10</Button>
                </ThemeProvider>
        </Box>
    )
}

export default ChartHeader