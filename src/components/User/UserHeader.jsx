import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {useState} from "react";
import { useNavigate } from 'react-router-dom';

const UserHeader = () => {
    const navigate = useNavigate();

    const [value, setValue] = useState(window.location.pathname);

    const userHandleChange = (event, newValue) => {
        setValue(newValue);
        navigate(`${newValue}`);
    };
    return (
        <Box sx={{ width: '100%'}}>
            <Tabs value={value} onChange={userHandleChange} centered>
                <Tab label="가입 승인" value='/' sx={{fontWeight:'bold'}}/>
                <Tab label="정보 관리" value='/userlist' sx={{fontWeight:'bold'}}/>
            </Tabs>
        </Box>
    )
}

export default UserHeader