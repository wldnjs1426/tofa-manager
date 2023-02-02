import styled from 'styled-components'
import {useCallback, useState, useEffect} from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import {Button} from "@material-ui/core";
import { useNavigate } from 'react-router-dom';
import {
    DataGridPremium,
    GridToolbarContainer,
    GridToolbar,
    koKR
} from '@mui/x-data-grid-premium';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useDemoData } from '@mui/x-data-grid-generator';
import axios from 'axios';
import Modal from '@mui/material/Modal';

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
    width:100%;
    height:50px;
    display:flex;
    flex-direction: column;
    justify-content: center;
    font-weight:bold;
`
const SeachDiv = styled.div`
    width:100%;
    height: 150px;
    display:flex;
    justify-content:space-around;
    align-items:center;
    border-radius:10px;
    
    border:1px solid lightgray;
    margin-bottom:2%
`
const DateDiv = styled.div`
    width:20%;
    height:100px;
    display:flex;
    justify-content:space-around;
    align-items:center;
`
const ModalDiv = styled.div`
    width:50%;
    height:70%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color:white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`

const theme = createTheme(
    koKR, // x-data-grid translations
)

function CustomToolbar() {
    return (
        <GridToolbarContainer sx={{height:'30px'}}>
            <div style={{marginLeft:'0.2%'}}>
            <GridToolbar />
            </div>
        </GridToolbarContainer>
    );
}

const dateFormater = (date) => {
    let dateFormat2 = date.getFullYear() +
        '-' + ( (date.getMonth()+1) < 9 ? "0" + (date.getMonth()+1) : (date.getMonth()+1) )+
        '-' + ( (date.getDate()) < 9 ? "0" + (date.getDate()) : (date.getDate()) );
    return dateFormat2;
}

//Log 컴포넌트
const Log = () => {

    //유저아이디 체크
    const [userCheck, setUserCheck] = useState([]);
    //검색조건 시작날짜와 종료날짜
    const [startDate, setStartDate] = useState(dateFormater(new Date()));
    const [endDate, setEndDate] = useState(dateFormater(new Date()));
    //팝업open
    const [open, setOpen] = useState(false);
    //접속로그 row데이터
    const [row, setRow] = useState([]);
    //메뉴접속로그 row데이터
    const [menuRow, setMenuRow] = useState([]);
    //레이어팝업close
    const handleClose = () => setOpen(false);



    useEffect(() => {
        axios.post(`http://27.96.134.216:3000/log/user-log-list`, {
            "startDate": startDate,
            "endDate": endDate
        })
            .then(function (response) {
                const data = response.data.list
                const rows = []
                data.map((item, idx) => {
                    rows.push({
                        id: idx,
                        name: item.username,
                        dept: item.dept,
                        loginTime: item.login_time,
                        loginIp: item.login_ip,
                        email: item.email,
                        accountId:item.account_id
                    })
                })
                setRow(rows)
            })
            .catch(function (error) {
                console.log(error);
            });
    },[startDate,endDate]);

    //접속로그컬럼 정의
    const columns = [
        { field: 'id', headerName: '순번', width: 70},
        { field: 'name', headerName: '이름', width: 400,renderCell: (params) => [
                <strong key={params.id} onClick={() => handleEvent(params)} style={{cursor:'pointer'}}>
                    {params.row.name}
                </strong>
            ] },
        { field: 'email', headerName: '이메일', width: 400 },
        { field: 'dept', headerName: '소속', width: 400 },
        { field: 'loginIp', headerName: 'IP', width: 400},
        { field: 'loginTime', headerName: '로그인시간', width: 400},
        { field: 'accountId', headerName: '아이디', hide:true, hideable: false }
    ];

    //메뉴접속로그컬럼 정의
    const menuColumns = [
        { field: 'id', headerName: '순번', width: 70},
        { field: 'name', headerName: '접속메뉴', width: 400 },
        { field: 'date', headerName: '접속시간', width: 400 }
    ];

    //메뉴접속로그컬럼 API 불러오기
    const menuLog = (param) =>{
        const date = param.row.loginTime.substr(0,10)
        const accountId = param.row.accountId
        axios.post(`http://27.96.134.216:3000/log/menu-log-list`, {
            "startDate": date,
            "endDate": date,
            "account_id": accountId
        }).then(function (response) {
            const data = response.data.list
            const rows = []
            data.map((item, idx) => {
                rows.push({
                    id: idx,
                    name: item.name,
                    date: item.menu_time
                })
            })
            setMenuRow(rows)
        })
            .catch(function (error) {
                console.log(error);
            });
    }

    const handleEvent = (
        params // GridRowParams
    ) => {
        menuLog(params);
        setOpen(true);
    };
    return (
        <div>
            <GridDiv>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <ModalDiv>
                        <ThemeProvider theme={theme}>
                            <DataGridPremium
                                onRowClick={handleEvent}
                                rows={menuRow}
                                columns={menuColumns}
                                pageSize={10}
                                rowsPerPageOptions={[10]}
                                checkboxSelection
                                onSelectionModelChange={(newSelectionModel) => {
                                    setUserCheck(newSelectionModel);
                                }}
                                components={{ Toolbar: CustomToolbar }}
                            />

                        </ThemeProvider>
                    </ModalDiv>
                </Modal>

                <FaultCodeDiv>
                    <SubjectDiv>
                        접속 로그
                    </SubjectDiv>

                    <SeachDiv>
                        <DateDiv>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                                <DatePicker
                                    label="시작 날짜"
                                    renderInput={(params) => <TextField {...params} />}
                                    value={startDate}
                                    onChange={(newValue) => {
                                        const date = new Date(newValue.$d)
                                        const dateFormat = date.getFullYear() +
                                            '-' + ( (date.getMonth()+1) < 9 ? "0" + (date.getMonth()+1) : (date.getMonth()+1) )+
                                            '-' + ( (date.getDate()) <= 9 ? "0" + (date.getDate()) : (date.getDate()) );
                                        setStartDate(dateFormat);
                                    }}
                                />
                            </LocalizationProvider>
                            <div style={{width:'50px',textAlign:'center'}}>
                                ~
                            </div>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                                <DatePicker
                                    label="종료 날짜"
                                    renderInput={(params) => <TextField {...params} />}
                                    value={endDate}
                                    onChange={(newValue) => {
                                        const date = new Date(newValue.$d)
                                        const dateFormat = date.getFullYear() +
                                            '-' + ( (date.getMonth()+1) < 9 ? "0" + (date.getMonth()+1) : (date.getMonth()+1) )+
                                            '-' + ( (date.getDate()) <= 9 ? "0" + (date.getDate()) : (date.getDate()) );
                                        setEndDate(dateFormat);
                                    }}
                                />
                            </LocalizationProvider>
                        </DateDiv>

                    </SeachDiv>
                    총 {row.length}개의 검색이 완료되었습니다.
                    <ThemeProvider theme={theme}>
                        <DataGridPremium
                            rows={row}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            checkboxSelection
                            onSelectionModelChange={(newSelectionModel) => {
                                setUserCheck(newSelectionModel);
                            }}
                            components={{ Toolbar: CustomToolbar }}
                        />

                    </ThemeProvider>
                </FaultCodeDiv>
            </GridDiv>


        </div>
    );
}

export default Log;