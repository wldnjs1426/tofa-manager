import styled from 'styled-components'
import {useCallback, useState, useEffect} from "react";
import Typography from '@mui/material/Typography';
import UserHeader from './UserHeader';
import Logo from '../../static/images/logo.png';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios'


const Img = styled.img`
    width: 179px;
    height: 40.45px;
`
const Div = styled.div`
    position:absolute;
    top:50%;
    left:50%;
    width: 500px;
    height: 500px;
    border:1px solid lightgray;
    transform: translate(-50%, -50%);
`
const Header = styled.div`
    width:100%;
    height:120px;
    display:flex;
    justify-content:center;
    align-items:center;
`

const Body = styled.div`
    width:100%;
    height:250px;
    display:flex;
    flex-direction: column;
    justify-content:center;
    align-items:center;
`

const Footer = styled.div`
    width:100%;
    height:100px;
    display:flex;
    flex-direction: column;
    justify-content:center;
    align-items:center;
`

const SpanDiv = styled.div`
    width:100%;
    display:flex;
    justify-content:center;
    align-items:center;
    margin-top:40px;
`

const Span = styled.span`
    width:60px;
    height:39px;
    font-size:11px;
    display:flex;
    align-items:center;
`

const buttonTheme = createTheme({
    palette: {
        reject: {
            main: '#BBBBBB',
            contrastText: '#fff',
        },confirm:{
            main: '#008CCF',
            contrastText: '#fff',
        }
    },
});

const Login = () => {
    const [id,setId] = useState()
    const [password,setPassword] = useState()

    const loginCheck = () => {
        axios.post(`http://27.96.134.216:3000/api/admin/login`,{
            "userId":id,
            "password":password
        })
            .then(function (response) {
                alert('로그인 되었습니다.')

                axios.post(`http://27.96.134.216:3000/api/admin/check`,{
                    "userId":id,
                    "password":password
                })
                    .then(function (response) {
                        console.log(response)
                    })
                    .catch(function (error) {
                        alert('존재하지 않는 아이디이거나 비밀번호가 일치하지 않습니다.')
                    });


            })
            .catch(function (error) {
                alert('존재하지 않는 아이디이거나 비밀번호가 일치하지 않습니다.')
            });
    }
console.log(id)
    return (
        <Div>
            <Header>
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
            </Header>
            <Body>
                <SpanDiv>
                    <Span>
                        아이디
                    </Span>
                    <TextField size='small' sx={{width:'250px',height:'39px'}} onChange={(event) => {
                        setId(event.target.value);
                    }}/>
                </SpanDiv>
                <SpanDiv>
                    <Span>
                        비밀번호
                    </Span>
                    <TextField size='small' sx={{width:'250px',height:'39px'}} type="password" autoComplete="current-password" onChange={(event) => {
                        setPassword(event.target.value);
                    }}/>
                </SpanDiv>
            </Body>
            <Footer>
                <ThemeProvider theme={buttonTheme}>
                    <Button variant="contained" color="confirm" onClick={()=>loginCheck()} startIcon={<CheckIcon />} sx={{width: '160px',height:'50px'}}>로그인</Button>
                </ThemeProvider>
            </Footer>
        </Div>
    );
}

export default Login;