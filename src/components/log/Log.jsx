import styled from 'styled-components'
import {useCallback, useState, useEffect} from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import Button from '@mui/material/Button';
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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CloseIcon from '@mui/icons-material/Close';


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
    margin-top:30px;
    width:100%;
    height:50px;
    display:flex;
    flex-direction: column;
    justify-content: center;
    font-weight:bold;
`
const SeachDiv = styled.div`
    width:600px;
    height: 100px;
    display:flex;
    justify-content:space-around;
    align-items:center;
    border:1px solid lightgray;
    margin-bottom:2%
`
const DateDiv = styled.div`
    width:100%;
    height:80px;
    display:flex;
    justify-content:space-around;
    align-items:center;
`
const ModalDiv = styled.div`
    width:674px;
    height:615px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color:white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border:5px solid black;
`
const FaultCodeDivv = styled.div`
    width:98%;
    height:450px;
`

const CloseDiv = styled.div`
    width:40px;
    height:40px;
    display:flex;
    justify-content:center;
    align-items:center;
    position:absolute;
    border:1px solid lightgray;
    border-radius:5px;
    top:15px;
    right:15px;
    cursor:pointer;
`

const theme = createTheme(
    koKR, // x-data-grid translations
)

function CustomToolbar() {
    return (
        <GridToolbarContainer sx={{height:'30px'}}>
            <div style={{marginLeft:'0.2%'}}>
            <GridToolbar csvOptions={{ disableToolbarButton: true }}/>
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


const buttonTheme = createTheme({
    palette: {
        confirm:{
            main: '#008CCF',
            contrastText: '#fff',
        }
    },
});

//Log 컴포넌트
const Log = () => {

    //유저아이디 체크
    const [userCheck, setUserCheck] = useState([]);
    //검색조건 시작날짜와 종료날짜
    const [startDate, setStartDate] = useState(dateFormater(new Date()));
    const [endDate, setEndDate] = useState(dateFormater(new Date()));
    //클릭 유저 데이터
    const [userData, setUserData] = useState();
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
                        logOutTime: item.logout_time,
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
        { field: 'id', headerName: '순번', width: 40},
        { field: 'name', headerName: '이름', width: 100,renderCell: (params) => [
                <strong key={params.id} onClick={() => handleEvent(params)} style={{cursor:'pointer'}}>
                    {params.row.name}
                </strong>
            ] },
        { field: 'email', headerName: '이메일', width: 200 },
        { field: 'dept', headerName: '소속', width: 150 },
        { field: 'loginIp', headerName: 'IP', width: 300},
        { field: 'loginTime', headerName: '로그인시간', width: 300},
        { field: 'logOutTime', headerName: '로그아웃시간', width: 300},
        { field: 'accountId', headerName: '아이디', hide:true, hideable: false }
    ];

    //메뉴접속로그컬럼 정의
    const menuColumns = [
        { field: 'id', headerName: '순번', width: 100},
        { field: 'name', headerName: '접속메뉴', width: 200 },
        { field: 'date', headerName: '접속시간', width: 200 }
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

    const handleEvent = (params) => {
        setUserData(params)
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
                        <CloseDiv>
                            <CloseIcon onClick={()=>handleClose()} sx={{width:'24px',height:'24px'}}/>
                        </CloseDiv>
                        <div style={{
                            width:'90%',
                            margin:'0 auto',
                            fontWeight: '700',
                            fontSize: '25px',
                            lineHeight: '25px',
                            marginBottom:'3%',

                        }}>
                            접속로그
                        </div>
                        <div style={{
                            width:'90%',
                            margin:'0 auto',
                            lineHeight:'50px',
                            borderTop: '1px solid gray',
                            borderBottom: '1px solid gray',
                        }}>
                            <span style={{fontWeight:'bold', display:'inline-block', width:'60px', fontSize:'15px'}}> { userData ? userData.row.name : ''} </span>
                            <span style={{color:'gray', fontSize:'16px', display:'inline-block', width:'20px',}}> | </span>
                            <span style={{color:'gray', fontSize:'14px',}}> {userData ? userData.row.dept : ''} </span>

                            {/*<ThemeProvider theme={theme}>*/}
                            {/*    <DataGridPremium*/}
                            {/*        onRowClick={handleEvent}*/}
                            {/*        rows={menuRow}*/}
                            {/*        columns={menuColumns}*/}
                            {/*        pageSize={10}*/}
                            {/*        rowsPerPageOptions={[10]}*/}
                            {/*        onSelectionModelChange={(newSelectionModel) => {*/}
                            {/*            setUserCheck(newSelectionModel);*/}
                            {/*        }}*/}
                            {/*        sx={{borderTop: '1px solid gray',borderBottomColor: 'gray',borderLeft:'none',borderRight:'none',}}*/}

                            {/*    />*/}

                            {/*</ThemeProvider>*/}
                        </div>

                        <TableContainer component={Paper} sx={{height:'70%'}}>
                            <Table stickyHeader aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center" sx={{color:'gray'}}>번호</TableCell>
                                        <TableCell align="center" sx={{color:'gray'}}>접속메뉴</TableCell>
                                        <TableCell align="center" sx={{color:'gray'}}>접속시간</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {menuRow.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="center" sx={{color:'gray'}}>{row.id}</TableCell>
                                            <TableCell align="center" >{row.name}</TableCell>
                                            <TableCell align="center" sx={{color:'gray'}}>{row.date}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </ModalDiv>
                </Modal>

                <FaultCodeDiv>
                    <SubjectDiv>
                        접속 로그
                    </SubjectDiv>

                    <SeachDiv>
                        <DateDiv>
                            <div style={{'marginLeft':'15px','font-weight': '400','width':'102px','fontSize':'14px', 'color':'#333333'}}>
                                접속일자 <br/>
                                상세검색
                            </div>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                                <DatePicker
                                    label="시작 날짜"
                                    renderInput={(params) => <TextField {...params} sx={{
                                        '& .MuiInputBase-input': { fontSize:'14px'},
                                        '& .MuiSvgIcon-root' : {width:'20px',height:'20px'}
                                    }}/>}
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
                                    renderInput={(params) => <TextField  {...params} sx={{
                                        '& .MuiInputBase-input': { fontSize:'14px'},
                                        '& .MuiSvgIcon-root' : {width:'20px',height:'20px'},
                                        marginRight:'15px'

                                    }}/>}
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
                        {/*<ThemeProvider theme={buttonTheme}>*/}
                        {/*    <Button variant="contained" color="confirm" startIcon={<CheckIcon />} sx={{width: '100px',height:'50px'}}>검색</Button>*/}
                        {/*</ThemeProvider>*/}
                    </SeachDiv>
                    <div style={{'width': '409px', 'height': '14px','font-weight': '400', 'font-size': '14px', 'color':'#666666','marginBottom':'20px'}}>
                        총 {row.length}개의 목록이 검색되었습니다.
                    </div>
                    <FaultCodeDivv>
                        <ThemeProvider theme={theme}>
                            <DataGridPremium
                                rows={row}
                                columns={columns}
                                pageSize={10}
                                rowsPerPageOptions={[10]}
                                initialState={{
                                    sorting: {
                                        sortModel: [{ field: 'loginTime', sort: 'desc' }],
                                    },
                                }}
                                checkboxSelection
                                onSelectionModelChange={(newSelectionModel) => {
                                    setUserCheck(newSelectionModel);
                                }}
                                components={{ Toolbar: CustomToolbar }}
                                sx={{
                                    fontSize:'13px',borderTop: '3px solid #008CCF',borderBottomColor: '#008CCF',borderLeft:'none',borderRight:'none',borderRadius:'0px'}}

                            />

                        </ThemeProvider>
                    </FaultCodeDivv>
                </FaultCodeDiv>
            </GridDiv>


        </div>
    );
}

export default Log;