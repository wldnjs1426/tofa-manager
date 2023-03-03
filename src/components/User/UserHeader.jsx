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

const UserHeader = () => {
    const navigate = useNavigate();

    const [value, setValue] = useState(window.location.pathname);

    const userHandleChange = (newValue) => {
        setValue(newValue);
        navigate(`${newValue}`);
    };

    const check = {width:'218px',height:'50px'}
    const unCheck = {width:'218px',height:'50px',background:'#EDEDED',color:'#999999'}
    return (
        <Box sx={{ width: '100%', marginTop:'60px'}}>
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <ThemeProvider theme={buttonTheme}>
                    <Button sx={check}
                            color={value === '/home' ? 'check' : 'unCheck'}
                            onClick={() => userHandleChange('/home')}
                    >가입 승인</Button>
                    <Button sx={check}
                            color={value === '/userlist' ? 'check' : 'unCheck'}
                            onClick={() => userHandleChange('/userlist')}
                    >정보 관리</Button>
                </ThemeProvider>
            </ButtonGroup>
        </Box>
    )
}

export default UserHeader