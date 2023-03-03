import {
    DataGridPremium,
    GridToolbarContainer,
    GridToolbar,
    koKR
} from '@mui/x-data-grid-premium';
import styled from 'styled-components'
import {useCallback, useState, useEffect} from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import Button from '@mui/material/Button';
import UserHeader from './UserHeader';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import API  from '../../static/js/API'



const GridDiv = styled.div`
    display: flex;
    justify-content: space-around;
    width: 100%;
`
const FaultCodeDiv = styled.div`
    width:98%;
    height:450px;
`
const SubjectDiv = styled.div`
    width:10%;
    height:50px;
    display:flex;
    flex-direction: column;
    justify-content: center;
`
const ButtonDiv = styled.div`
    display:flex;
    justify-content: space-around;
    align-items:center;
    width:30%;
    height:100px;
    margin:0 auto;
`
const columns = [
    { field: 'id', headerName: 'ID', hide:true, hideable: false},
    { field: 'name', headerName: '이름', width:200 },
    { field: 'belong', headerName: '소속', width: 100 },
    { field: 'email', headerName: '이메일', width: 250},
    { field: 'phone', headerName: '연락처', width: 150},
    { field: 'authority', headerName: '권한', width: 150},
    { field: 'authorityList', headerName: '권한 목록', width: 300},
    { field: 'joinDate', headerName: '가입 일시', type: 'dateTime', width: 300,
        valueGetter: ({ value }) => value && new Date(value)
    }
];

const CustomToolbar = () => {
    return (
        <GridToolbarContainer sx={{height:'30px'}}>
            <div style={{marginLeft:'0.2%'}}>
                <GridToolbar csvOptions={{ disableToolbarButton: true }}/>
            </div>
        </GridToolbarContainer>
    );
}

const theme = createTheme(
    koKR, // x-data-grid translations
)

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

const Home = () => {

    const [cookies, setCookie, removeCookie] = useCookies(['key']);

    const navigate = useNavigate();
    //유저아이디 체크
    const [userCheck, setUserCheck] = useState([]);
    const [row, setRow] = useState([]);
    const [modify,setModify] = useState(false)


    useEffect(() =>{

        if(!cookies.key){
            alert('로그인이 필요합니다.')
            navigate(`/`);
        }

        axios.post(`${API}/api/admin/wait-list`,{
            "startDate":"",
            "endDate":"",
            "access_key":cookies.key
        })
            .then(function (response) {
                const data = response.data
                const rows = []
                data.map((item,idx) => {
                    if(item.allowance){
                        rows.push({
                            id: item.account_id,
                            name: item.username,
                            belong: item.dept,
                            email: item.email,
                            phone: item.phone,
                            authority: item.role_name,
                            authorityList: item.resourceList,
                            joinDate: item.join_date,
                        })
                    }
                })
                setRow(rows)
            })
            .catch(function (error) {
                console.log(error);
            });

    },[modify])

    //가입승인함수
    const confirmJoin = () => {
        if(userCheck.length === 0){
            alert('사용자를 선택해 주세요')
            return
        }
        axios.post(`${API}/api/admin/approval-join`,{
            "account_ids":userCheck.join(),
            "access_key":cookies.key
        })
            .then(function (response) {
                alert('가입 승인이 완료되었습니다.')
                setModify(modify ? false : true)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const rejectJoin = () => {
        if(userCheck.length === 0){
            alert('사용자를 선택해 주세요')
            return
        }

        axios.post(`${API}/api/admin/removal-account`,{
            "account_ids":userCheck.join(),
            "access_key":cookies.key
        })
            .then(function (response) {
                alert('선택하신 회원이 삭제 되었습니다.')
                setModify(modify ? false : true)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (

        <div>
            <GridDiv>
                <FaultCodeDiv>
                    <ThemeProvider theme={theme}>
                        <UserHeader/>
                        {/*총 {row.length}개의 검색이 완료되었습니다.*/}

                        <DataGridPremium
                            rows={row}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            checkboxSelection
                            onSelectionModelChange={(newSelectionModel) => {
                                setUserCheck(
                                    newSelectionModel
                                );
                            }}
                            components={{ Toolbar: CustomToolbar }}
                            sx={{fontSize:'13px',borderTop: '3px solid #008CCF',borderBottomColor: '#008CCF',borderLeft:'none',borderRight:'none',borderRadius:'0px'}}
                        />
                        <ButtonDiv>
                            <ThemeProvider theme={buttonTheme}>
                                <Button variant="contained" color="confirm" startIcon={<CheckIcon />} onClick={confirmJoin} sx={{width: '160px',height:'50px'}}>가입 승인</Button>
                                <Button variant="contained" color="reject" startIcon={<ClearIcon />} onClick={rejectJoin} sx={{width: '160px',height:'50px'}}>가입 거절</Button>
                            </ThemeProvider>
                        </ButtonDiv>

                    </ThemeProvider>
                </FaultCodeDiv>
            </GridDiv>


        </div>
    );
}

export default Home;