import Box from '@mui/material/Box';
import {useState} from "react";
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

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
                <Button size='large'
                        sx={value === '/' ? check : unCheck }
                        onClick={() => userHandleChange('/')}
                >가입 승인</Button>
                <Button size='large'
                        sx={value === '/userlist' ? check : unCheck }
                        onClick={() => userHandleChange('/userlist')}
                >정보 관리</Button>
            </ButtonGroup>
        </Box>
    )
}

export default UserHeader