import {
    DataGridPremium,
    GridToolbarContainer,
    GridToolbar,
    GridActionsCellItem,
    koKR
} from '@mui/x-data-grid-premium';
import styled from 'styled-components'
import {useCallback, useState, useEffect} from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

import {AppBar, Tabs, Tab, Toolbar, IconButton} from "@material-ui/core";
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputBase from '@mui/material/InputBase';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import UserHeader from './UserHeader';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const Img = styled.img`
    width: 200px;
    height: 90px;
`

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
const ModalDiv = styled.div`
    width:1200px;
    height:771px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color:white;
    border:5px solid black;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`

const ModalHeader = styled.header`
    width:100%;
    height:10%;
    background-color:#3f51b5;
`

const Table = styled.table`
    width: 90%;
    margin:0 auto;
    margin-top:20px;
    border-top:1px solid lightgray;
    border-bottom:1px solid lightgray;
    font-size:14px;
`

const SubjectTd = styled.td`
    width: 100%;
    height: 60px;
    margin-left:10%;
    text-align:right;
    font-weight:400;
    display:flex;
    justify-content:end;
    align-items:center;
    font-weight:400;
`

const AuthorityTd = styled.td`
    width: 100%;
    height:30px;
    margin-left:10%;
    text-align:right;
    font-weight:400;
    display:flex;
    justify-content:end;
    align-items:center;
    font-weight:400;
`
const ContentsTd = styled.td`
`
const MarginDiv = styled.div`
    margin-left:3%;
    width:100%;
    height:100%;
    display:flex;
    align-items:center;
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


function CustomToolbar() {
    return (
        <GridToolbarContainer sx={{height:'30px'}}>
            <div style={{marginLeft:'0.2%'}}>
                <GridToolbar csvOptions={{ disableToolbarButton: true }}/>
            </div>
        </GridToolbarContainer>
    );
}

//데이터그리드 한글화
const theme = createTheme(
    koKR, // x-data-grid translations
)

const btnTheme = createTheme({
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


const UserList = () => {

    const navigate = useNavigate();

    const [cookies, setCookie, removeCookie] = useCookies(['key']);


    //데이터 그리드 유저 체크 확인 state
    const [userId, setUserId] = useState([]);
    //팝업 open state
    const [open, setOpen] = useState(false);
    //row data state값
    const [row, setRow] = useState([]);
    //상세정보 권한 목록 체크박스 값 리스트 state
    const [checkedList, setCheckedList] = useState([]);
    //상세정보 값 저장 state
    const [status, setStatus] = useState(false);
    //수정했을시 row data다시 받기
    const [modify,setModify] = useState(false)

    useEffect(() =>{

        if(!cookies.key){
            alert('로그인이 필요합니다.')
            navigate(`/`);
        }

        axios.post(`http://humetro.tofa.kr:3000/api/admin/info-list`,
            {
                "searchType":"",
                "searchText":"",
                "access_key":cookies.key
            })
            .then(function (response) {
                const data = response.data
                const rows = []
                data.map((item,idx) => {
                    rows.push({
                        id: item.account_id,
                        name: item.username,
                        belong: item.dept,
                        email: item.email,
                        phone: item.phone,
                        authority: item.role_name,
                        authorityList: item.resourceList,
                        authorityCode: item.resourceCodeList,
                        joinDate: item.join_date,
                    })
                })
                setRow(rows)
            })
            .catch(function (error) {
                console.log(error);
            });
        return () =>{
            setRow([])
        }
    },[modify])




    //레이어 팝업
    const handleClose = () => setOpen(false);

    //상세정보와 팝업오픈 및 권한 목록 세팅 함수
    const handleEvent = (
        params
    ) => {
        setStatus(params.row)
        setCheckedList(params.row.authorityCode.split(","))
        setOpen(true);
    };

    //유저 상세정보 권한 목록 체크박스 onchange 함수
    const onCheckedElement = (checked, item) => {
        if (checked) {
            setCheckedList([...checkedList, item]);
        } else if (!checked) {
            setCheckedList(checkedList.filter(el => el !== item));
        }
    };
    //유저 정보 수정 함수
    const userModify = () => {

        const codeList = String(checkedList.join())
        const statusId = String(status.id)

        axios.post(`http://humetro.tofa.kr:3000/api/admin/member-modification`,
            {
                "account_id":statusId,
                "resourceCodeList":codeList,
                "access_key":cookies.key

            })
            .then(function (response) {
                alert('수정이 완료되었습니다.')
                setModify(modify ? false : true)
                handleClose()
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const rejectJoin = () => {
        if(userId.length === 0){
            alert('사용자를 선택해 주세요')
            return
        }

        axios.post(`http://humetro.tofa.kr:3000/api/admin/removal-account`,{
            "account_ids":userId.join(),
            "access_key":cookies.key
        })
            .then(function (response) {
                alert('가입 거절이 완료되었습니다.')
                setModify(modify ? false : true)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const columns = [
        { field: 'id', headerName: 'iD', width: 70, hide:true, hideable: false},
        { field: 'name', headerName: '이름', width: 200, renderCell: (params) => (
                <strong onClick={() => handleEvent(params)} style={{cursor:'pointer'}}>
                    {params.row.name}
                </strong>
            )},
        { field: 'belong', headerName: '소속', width: 100 },
        { field: 'email', headerName: '이메일', width: 250},
        { field: 'phone', headerName: '연락처', width: 150},
        { field: 'authority', headerName: '권한', width: 150},
        { field: 'authorityList', headerName: '권한 목록', width: 300},
        { field: 'authorityCode', headerName: '권한 번호', hide:true, hideable: false },
        { field: 'joinDate', headerName: '가입 일시', type: 'dateTime', width: 300,
            valueGetter: ({ value }) => value && new Date(value)
        },
    ];

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
                           lineHeight: '25px'
                       }}>
                           회원 정보 수정
                       </div>
                        <Table>
                            <tbody>
                            <tr>
                                <SubjectTd>
                                    이름
                                </SubjectTd>
                                <ContentsTd>
                                    <MarginDiv>
                                        <TextField InputProps={{
                                            readOnly: true,
                                        }}  defaultValue={status && status.name} size='small' sx={{width:'450px',height:'39px'}}/>
                                        </MarginDiv>
                                </ContentsTd>
                            </tr>
                            <tr>
                                <SubjectTd>
                                    소속
                                </SubjectTd>
                                <ContentsTd>
                                    <MarginDiv>
                                        <Select
                                        labelId="demo-customized-select-label"
                                        id="demo-customized-select"
                                        sx={{width:'450px', height:'50%'}}
                                        defaultValue={status && status.belong}
                                        size='small'
                                        >
                                            <MenuItem value={'차량'}>차량</MenuItem>
                                            <MenuItem value={'승무'}>승무</MenuItem>
                                            <MenuItem value={'관제'}>관제</MenuItem>
                                            <MenuItem value={'기타'}>기타</MenuItem>
                                        </Select>
                                    </MarginDiv>
                                </ContentsTd>
                            </tr>
                            <tr>
                                <SubjectTd>
                                    사용자 이메일
                                </SubjectTd>
                                <ContentsTd>
                                    <MarginDiv>
                                        <TextField InputProps={{
                                            readOnly: true,
                                        }}  defaultValue={status && status.email} size='small' sx={{width:'450px',height:'39px'}}/>
                                    </MarginDiv>
                                </ContentsTd>
                            </tr>
                            <tr>
                                <SubjectTd>
                                    휴대전화 번호
                                </SubjectTd>
                                <ContentsTd>
                                    <MarginDiv>
                                        <TextField InputProps={{
                                            readOnly: true,
                                        }}  defaultValue={status && status.phone} size='small' sx={{width:'450px',height:'39px'}}/>
                                    </MarginDiv>
                                </ContentsTd>
                            </tr>
                            <tr>
                                <SubjectTd>
                                   권한 선택
                                </SubjectTd>
                                <ContentsTd>
                                    <MarginDiv>
                                        <Select
                                    labelId="demo-customized-select-label"
                                    id="demo-customized-select"
                                    sx={{width:'450px', height:'50%'}}
                                    defaultValue={status && status.authority}
                                    size='small'

                                        >
                                    <MenuItem value={'ROLE_ADMIN'}>ADMIN</MenuItem>
                                    <MenuItem value={'ROLE_MANAGER'}>MANAGER</MenuItem>
                                    <MenuItem value={'ROLE_USER'}>USER</MenuItem>
                                        </Select>
                                    </MarginDiv>
                                </ContentsTd>
                            </tr>
                            <tr>
                                <AuthorityTd>
                                        권한 목록
                                </AuthorityTd>
                                <ContentsTd>
                                    <div style={{marginLeft:'3%',width:'100%',height:'100%'}}>
                                        <FormLabel component="legend" sx={{color:'black',fontWeight:'bold',fontSize:'0.9rem'}}></FormLabel>
                                        <span style={{display:'inline-block',width:'90px', fontWeight:'400'}}>모니터링</span>
                                        <FormControlLabel control={<Checkbox name={'resource'} onChange={e => {
                                            onCheckedElement(e.target.checked, e.target.value);
                                        }} defaultChecked={status && status.authorityCode.includes('23')} size="small" value={23}/>} label="개별 편성" sx={{width:'110px','& .MuiTypography-root': { fontSize: '0.8rem' }}}/>
                                        <FormControlLabel control={<Checkbox name={'resource'} onChange={e => {
                                            onCheckedElement(e.target.checked, e.target.value);
                                        }} defaultChecked={status && status.authorityCode.includes('25')} size="small" value={25}/>} label="운행" sx={{width:'120px','& .MuiTypography-root': { fontSize: '0.8rem' }}}/>
                                        <FormControlLabel control={<Checkbox name={'resource'} onChange={e => {
                                            onCheckedElement(e.target.checked, e.target.value);
                                        }} defaultChecked={status && status.authorityCode.includes('37')} size="small" value={37}/>} label="운행(CAB)" sx={{width:'150px','& .MuiTypography-root': { fontSize: '0.8rem' }}}/>
                                        <FormControlLabel control={<Checkbox name={'resource'} onChange={e => {
                                            onCheckedElement(e.target.checked, e.target.value);
                                        }} defaultChecked={status && status.authorityCode.includes('26')} size="small" value={26}/>} label="퍼포먼스" sx={{width:'120px','& .MuiTypography-root': { fontSize: '0.8rem' }}}/>
                                        <FormLabel component="legend" sx={{color:'black',fontWeight:'bold',fontSize:'0.9rem'}}></FormLabel>
                                        <span style={{display:'inline-block',width:'90px', fontWeight:'400'}}>대시보드 </span>
                                        <FormControlLabel control={<Checkbox name={'resource'} onChange={e => {
                                            onCheckedElement(e.target.checked, e.target.value);
                                        }} defaultChecked={status && status.authorityCode.includes('27')} size="small" value={27}/>} label="고장 투데이" sx={{width:'110px','& .MuiTypography-root': { fontSize: '0.8rem' }}}/>
                                        <FormControlLabel control={<Checkbox name={'resource'} onChange={e => {
                                            onCheckedElement(e.target.checked, e.target.value);
                                        }} defaultChecked={status && status.authorityCode.includes('36')} size="small" value={36}/>} label="고장 통계" sx={{width:'120px','& .MuiTypography-root': { fontSize: '0.8rem' }}}/>
                                        <FormLabel component="legend" sx={{color:'black',fontWeight:'bold',fontSize:'0.9rem'}}></FormLabel>
                                        <span style={{display:'inline-block',width:'90px', fontWeight:'400'}}>고장</span>
                                        <FormControlLabel control={<Checkbox name={'resource'} onChange={e => {
                                            onCheckedElement(e.target.checked, e.target.value);
                                        }} defaultChecked={status && status.authorityCode.includes('29')} size="small" value={29}/>} label="고장 이력" sx={{width:'110px','& .MuiTypography-root': { fontSize: '0.8rem' }}}/>
                                        <FormControlLabel control={<Checkbox name={'resource'} onChange={e => {
                                            onCheckedElement(e.target.checked, e.target.value);
                                        }} defaultChecked={status && status.authorityCode.includes('28')} size="small" value={28}/>} label="고장 분석" sx={{width:'120px','& .MuiTypography-root': { fontSize: '0.8rem' }}}/>
                                        <FormControlLabel control={<Checkbox name={'resource'} onChange={e => {
                                            onCheckedElement(e.target.checked, e.target.value);
                                        }} defaultChecked={status && status.authorityCode.includes('38')} size="small" value={38}/>} label="고장 분석(CAB)" sx={{width:'150px','& .MuiTypography-root': { fontSize: '0.8rem' }}}/>
                                        <FormControlLabel control={<Checkbox name={'resource'} onChange={e => {
                                            onCheckedElement(e.target.checked, e.target.value);
                                        }} defaultChecked={status && status.authorityCode.includes('30')} size="small" value={30}/>} label="트렌트(고장)" sx={{width:'120px','& .MuiTypography-root': { fontSize: '0.8rem' }}}/>
                                        <FormControlLabel control={<Checkbox name={'resource'} onChange={e => {
                                            onCheckedElement(e.target.checked, e.target.value);
                                        }} defaultChecked={status && status.authorityCode.includes('31')} size="small" value={31}/>} label="모델링(고장)" sx={{width:'120px','& .MuiTypography-root': { fontSize: '0.8rem' }}}/>
                                        <FormLabel component="legend" sx={{color:'black',fontWeight:'bold',fontSize:'0.9rem'}}></FormLabel>
                                        <span style={{display:'inline-block',width:'90px', fontWeight:'400'}}>진단</span>
                                        <FormControlLabel control={<Checkbox name={'resource'} onChange={e => {
                                            onCheckedElement(e.target.checked, e.target.value);
                                        }} defaultChecked={status && status.authorityCode.includes('32')} size="small" value={32}/>} label="편성 진단" sx={{width:'110px','& .MuiTypography-root': { fontSize: '0.8rem' }}}/>
                                        <FormControlLabel control={<Checkbox name={'resource'} onChange={e => {
                                            onCheckedElement(e.target.checked, e.target.value);
                                        }} defaultChecked={status && status.authorityCode.includes('33')} size="small" value={33}/>} label="트렌드(진단)" sx={{width:'120px','& .MuiTypography-root': { fontSize: '0.8rem' }}}/>
                                        <FormControlLabel control={<Checkbox name={'resource'} onChange={e => {
                                            onCheckedElement(e.target.checked, e.target.value);
                                        }} defaultChecked={status && status.authorityCode.includes('34')} size="small" value={34}/>} label="모델링(진단)" sx={{width:'150px','& .MuiTypography-root': { fontSize: '0.8rem' }}}/>

                                    </div>
                                </ContentsTd>
                            </tr>
                            </tbody>
                        </Table>
                        <ButtonDiv>
                            <ThemeProvider theme={btnTheme}>
                                <Button variant="contained" color='confirm' startIcon={<CheckIcon />} onClick={()=>userModify()} sx={{width: '160px',height:'50px'}}>수정 완료</Button>
                                <Button variant="contained" color="reject" startIcon={<ClearIcon />} onClick={()=>handleClose()} sx={{width: '160px',height:'50px'}}>목록으로</Button>

                            </ThemeProvider>
                        </ButtonDiv>
                    </ModalDiv>
                </Modal>
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
                                setUserId(newSelectionModel);
                            }}
                            components={{ Toolbar: CustomToolbar }}
                            sx={{fontSize:'13px',borderTop: '3px solid #008CCF',borderBottomColor: '#008CCF',borderLeft:'none',borderRight:'none',}}

                        />

                        <ButtonDiv>
                            <ThemeProvider theme={btnTheme}>
                                <Button variant="contained" color="reject" startIcon={<ClearIcon />} onClick={rejectJoin} sx={{width: '160px',height:'50px'}}>회원 삭제</Button>
                            </ThemeProvider>
                        </ButtonDiv>

                    </ThemeProvider>
                </FaultCodeDiv>
            </GridDiv>


        </div>
    );
}

export default UserList;