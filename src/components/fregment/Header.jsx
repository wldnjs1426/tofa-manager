import * as React from 'react';
import {AppBar, Tabs, Tab, Toolbar, IconButton} from "@material-ui/core";
import Typography from '@mui/material/Typography';
import Logo from '../../images/logo.png';
import styled, { css } from 'styled-components';
import {useCallback, useState} from "react";
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import {AccountCircle} from "@mui/icons-material";


const Img = styled.img`
    width: 200px;
    height: 90px;
`

const UserDiv = styled.div`
    position:relative;
    right: 150px;
`


const Header = () => {

    const navigate = useNavigate();

    const [value, setValue] = useState(window.location.pathname);

    
    const handleChange = (event, newValue) => {
        setValue(newValue);
        navigate(`${newValue}`);
    };

    return(
            <AppBar position="static" sx={{display:'inline'}}>
                <Box sx={{display:'flex',justifyContent:'space-between', alignItems:'center'}}>
                    <Box sx={{marginLeft:'1%'}}>
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none'
                            }}
                        >
                            <Img src={Logo} alt="BigCo Inc. logo"/>
                        </Typography>
                        <Tabs value={value} onChange={handleChange} aria-label="Main Tabs">
                            <Tab label="사용자 관리" value='/'/>
                            <Tab label="접속 로그" value='/log'/>
                            <Tab label="접속 통계" value='/chart'/>
                        </Tabs>
                    </Toolbar>
                    </Box>
                    <Box sx={{marginRight:'1%'}}>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            color="inherit"
                        >
                            <span style={{'fontSize':'17px'}}>
                                Logout
                            </span>

                        </IconButton>
                    </Box>
                </Box>
            </AppBar>
    )
}


export default Header;