import * as React from 'react';
import {AppBar,  Toolbar, IconButton} from "@material-ui/core";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from '@mui/material/Typography';
import Logo from '../../static/images/logo.png';
import styled, { css } from 'styled-components';
import {useCallback, useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import {AccountCircle} from "@mui/icons-material";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LoginIcon from '@mui/icons-material/Login';
import BarChartIcon from '@mui/icons-material/BarChart';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { green,blue } from '@mui/material/colors';
import { useCookies } from 'react-cookie'; 


const Img = styled.img`
    width: 179px;
    height: 40.45px;
`

const UserDiv = styled.div`
    position:relative;
    right: 150px;
`

const Span = styled.span`
    margin-left:20px;
`

const Header = (prob) => {
    console.log(prob)
    const [cookies, setCookie, removeCookie] = useCookies();

    const navigate = useNavigate();


    const handleChange = (newValue) => {

        // if(!cookies.key){
        //     alert('로그인이 필요합니다.')
        //     return
        // }

        prob.pathSetValue(newValue);
        navigate(`${newValue}`);
    };
    const logout = () =>{
        removeCookie('key')
        removeCookie('name')
        alert('로그아웃 되었습니다.')
        prob.pathSetValue('/');
        navigate('/')
    }

    return(
            <AppBar position="static" color="transparent" sx={{display:'inline', backgroundColor:'white'}}>
                <Box sx={{display:'flex',justifyContent:'space-between', alignItems:'center'}}>
                    <Box sx={{marginLeft:'1%',width:'1500px'}}>
                        <Toolbar disableGutters>
                            <Typography
                                variant="h6"
                                noWrap
                                component="a"
                                href="/home"
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
                            <Tabs value={prob.pathValue} onChange={handleChange} aria-label="Main Tabs" sx={{marginLeft:'30px'}}>
                                <Tab icon={<PeopleAltIcon sx={prob.pathValue === '/home' ? { color: green[500] } : { color: green[0] }}/>} iconPosition='start' onClick={()=> handleChange('/home')} value='/home' label='사용자 관리' sx={{fontWeight:'700'}}/>
                                <Tab icon={<LoginIcon sx={prob.pathValue === '/log' ? { color: green[500] } : { color: green[0] }} />} iconPosition="start" onClick={()=> handleChange('/log')} value='/log' label="접속 로그" sx={{fontWeight:'700'}}/>
                                <Tab icon={<BarChartIcon sx={prob.pathValue === '/chart' ? { color: green[500] } : { color: green[0] }} />} iconPosition="start" onClick={()=> handleChange('/chart')} value='/chart' label="접속 통계" sx={{fontWeight:'700'}}/>
                            </Tabs>
                            </Toolbar>
                    </Box>
                    {cookies.key && <Box sx={{width:'400px',textAlign:'center'}}>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            color="inherit"
                        >
                            <PermIdentityIcon />
                            <span style={{'fontSize':'14px', 'marginLeft': '2px', 'color':'#666666'}}>
                                {cookies.name}
                            </span>
                        </IconButton>
                        <Span>&nbsp;</Span>
                        <IconButton
                            onClick={()=>logout()}
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            color="inherit"
                        >
                            <ExitToAppIcon/>
                            <span style={{'fontSize':'14px', 'marginLeft': '2px','color':'#666666'}}>
                                로그아웃
                            </span>
                        </IconButton>
                    </Box>}

                </Box>
            </AppBar>
    )
}


export default Header;