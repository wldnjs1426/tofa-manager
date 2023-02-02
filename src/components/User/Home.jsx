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
import {Button} from "@material-ui/core";
import UserHeader from './UserHeader';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'


const GridDiv = styled.div`
    display: flex;
    justify-content: space-around;
    width: 100%;
`
const FaultCodeDiv = styled.div`
    width:98%;
    height:800px;
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
    { field: 'id', headerName: 'ID', width: 70},
    { field: 'name', headerName: '이름', width: 130 },
    { field: 'belong', headerName: '소속', width: 200 },
    { field: 'email', headerName: '이메일', width: 400},
    { field: 'phone', headerName: '연락처', width: 200},
    { field: 'authority', headerName: '권한', width: 200},
    { field: 'authorityList', headerName: '권한 목록', width: 900},
    { field: 'joinDate', headerName: '가입 일시', type: 'dateTime', width: 300,
        valueGetter: ({ value }) => value && new Date(value)
    }
];

const CustomToolbar = () => {
    return (
        <GridToolbarContainer sx={{height:'30px'}}>
            <div style={{marginLeft:'0.2%'}}>
                <GridToolbar />
            </div>
        </GridToolbarContainer>
    );
}

const theme = createTheme(
    koKR, // x-data-grid translations
)

const Home = () => {

    //유저아이디 체크
    const [userCheck, setUserCheck] = useState([]);
    const [row, setRow] = useState([]);
    const [modify,setModify] = useState(false)

    useEffect(() =>{
        axios.post(`http://27.96.134.216:3000/api/admin/wait-list`,{
            "startDate":"",
            "endDate":""
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
        axios.post(`http://27.96.134.216:3000/api/admin/approval-join`,{
            "account_ids":userCheck.join()
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
        console.log(userCheck.join())
        axios.post(`http://27.96.134.216:3000/api/admin/removal-account`,{
            "account_ids":userCheck.join()
        })
            .then(function (response) {
                alert('가입 거절이 완료되었습니다.')
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
                            }} gc
                            components={{ Toolbar: CustomToolbar }}
                            sx={{borderTop: '3px solid #1976d2',borderBottomColor: '#1976d2',borderLeft:'none',borderRight:'none',}}
                        />
                        <ButtonDiv>
                            <Button variant="outlined" startIcon={<CheckIcon />} onClick={confirmJoin} disabled={userCheck.length === 0 ? true : false}>가입 승인</Button>
                            <Button variant="outlined" startIcon={<ClearIcon />} onClick={rejectJoin} disabled={userCheck.length === 0 ? true : false}>가입 거절</Button>
                        </ButtonDiv>

                    </ThemeProvider>
                </FaultCodeDiv>
            </GridDiv>


        </div>
    );
}

export default Home;