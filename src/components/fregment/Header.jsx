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
import { green } from '@mui/material/colors';
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

const Header = () => {

    const [cookies, setCookie, removeCookie] = useCookies(['key']);

    const navigate = useNavigate();

    const [value, setValue] = useState(window.location.pathname === '/userlist' || window.location.pathname === '/'  ? '/home' : window.location.pathname);
    const [result, setResult] = useState(false);

    
    const handleChange = (event, newValue) => {

        if(!cookies.key){
            alert('로그인이 필요합니다.')
            return
        }

        setValue(newValue);
        navigate(`${newValue}`);
    };

    if(result){

    }

    const logout = () =>{
        removeCookie('key')
        alert('로그아웃 되었습니다.')
        navigate('/')

    }

    // if (window.location.pathname === "/") return null;


    return(
            <AppBar position="static" color="transparent" sx={{display:'inline', backgroundColor:'white'}}>
                <Box sx={{display:'flex',justifyContent:'space-between', alignItems:'center'}}>
                    <Box sx={{marginLeft:'1%',width:'1500px'}}>
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
                            <Tabs value={value} onChange={handleChange} aria-label="Main Tabs" sx={{marginLeft:'30px'}}>
                                <Tab icon={<PeopleAltIcon sx={value === '/home' ? { color: green[500] } : { color: green[0] }}/>} iconPosition='start' label='사용자 관리' value='/home' sx={{fontWeight:'700'}}/>
                                {/*<div>*/}
                                {/*    <div style={{*/}
                                {/*    width: '0px',*/}
                                {/*    height: '37.24px',*/}
                                {/*    border: '1px solid #BBBBBB',*/}
                                {/*    margin: '0 auto'}}>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                <Tab icon={<LoginIcon sx={value === '/log' ? { color: green[500] } : { color: green[0] }} />} iconPosition="start" label="접속 로그" value='/log' sx={{fontWeight:'700'}}/>
                                {/*<div style={{width:'100px',display:'flex',alignItems:'center'}}>*/}
                                {/*    <div style={{*/}
                                {/*        width: '0px',*/}
                                {/*        height: '37.24px',*/}
                                {/*        border: '1px solid #BBBBBB',*/}
                                {/*        margin: '0 auto'}}>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                <Tab icon={<BarChartIcon sx={value === '/chart' ? { color: green[500] } : { color: green[0] }} />} iconPosition="start" label="접속 통계" value='/chart' sx={{fontWeight:'700'}}/>
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
                            <PermIdentityIcon/>
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