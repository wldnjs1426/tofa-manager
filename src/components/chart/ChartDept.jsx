import styled from 'styled-components'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {useState,useEffect} from "react";
import ChartHeader from "./ChartHeader"
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ECharts, { EChartsReactProps } from 'echarts-for-react';
import {
    DataGridPremium,
    GridToolbarContainer,
    GridToolbar,
    koKR
} from '@mui/x-data-grid-premium';
import { useCookies } from 'react-cookie';
import PieChartData from './PieChartData'
import axios from 'axios'
import API  from '../../static/js/API'


const GridDiv = styled.div`
    display: flex;
    align-items:center;
    width: 98%;
    margin:0 auto;
    border-radius:10px;
    margin-bottom:2%;
`

const FaultCodeDiv = styled.div`
    width:98%;
    height:800px;
`

const SubjectDiv = styled.div`
    margin-left:1%;
    margin-top:30px;
    height:50px;
    display:flex;
    flex-direction: column;
    justify-content: center;
    font-weight:bold;
`
const BorderDiv = styled.div`
    display: flex;
    align-items:center;
    width: 100%;
    margin:0 auto;
    margin-bottom:2%;
    border:1px solid lightgray;
`
const SeachDiv = styled.div`
    width:600px;
    display:flex;
    justify-content:space-around;
    align-items:center;
`
const DateDiv = styled.div`
    width:100%;
    display:flex;
    justify-content:space-around;
    align-items:center;
`
const DeDiv = styled.div`
    width:600px;
    height: 100px;
    display:flex;
    align-items:center;
`
const DepartmentDiv = styled.div`
    width:200px;
    height:100px;
    display:flex;
    justify-content:space-around;
    align-items:center;
`
const ChartDiv = styled.div`
    display:flex;
    justify-content:space-around;
    margin:0 auto;
    width:98%;
    height:650px;
    border-radius:10px;
`
const columns = [
    { field: 'id', headerName: '순번', width: 100},
    { field: 'name', headerName: '접속부서', width: 200 },
    { field: 'cnt', headerName: '건수', width: 150 },
];

const dateFormater = (date) => {
    let dateFormat2 = date.getFullYear() +
        '-' + ( (date.getMonth()+1) < 9 ? "0" + (date.getMonth()+1) : (date.getMonth()+1) )+
        '-' + ( (date.getDate()) < 9 ? "0" + (date.getDate()) : (date.getDate()) );
    return dateFormat2;
}

const ChartDept = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['key']);

    const navigate = useNavigate();
    const now = new Date();	// 현재 날짜 및 시간
    const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));	// 한달 전

    const [startDate, setStartDate] = useState(dateFormater(oneMonthAgo));
    const [endDate, setEndDate] = useState(dateFormater(new Date()));
    const [department, setDepartment] = useState('');
    const [rows,setRows] = useState([])
    const [chartState, setChartState] = useState();
    const handleChange = (event) => {
        setDepartment(event.target.value === 0 ? '' : event.target.value);
    };

    useEffect(() =>{

        if(!cookies.key){
            alert('로그인이 필요합니다.')
            navigate(`/`);
        }


        axios.post(`${API}/stat/top10-dept`,{
            "startDate":startDate,
            "endDate":endDate,
            "access_key": cookies.key,
            "dept":department
        })
            .then(function (response) {

                const data = response.data.list
                const chartRows = []
                const gridRows = []
                console.log(data)

                data.map((item, idx) => {
                    chartRows.push({
                        name: item.dept,
                        value: item.cnt
                    })

                    gridRows.push({
                        id: idx+1,
                        name: item.dept,
                        cnt: item.cnt,
                    })
                })
                setRows(gridRows)
                setChartState(chartRows)
            })
            .catch(function (error) {
                console.log(error);
            });
    },[startDate,endDate,department])

    return (
<>
    <SubjectDiv>
       접속 통계
    </SubjectDiv>

    {/*차트 상단 검색조건*/}

    <GridDiv>
        <BorderDiv>
        <SeachDiv>
            <DateDiv>
                <div style={{'marginLeft':'15px','fontWeight': '400','width':'102px','fontSize':'14px', 'color':'#333333'}}>
                    접속일자 <br/>
                </div>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                    <DatePicker
                        label="시작 날짜"
                        renderInput={(params) => <TextField {...params} sx={{
                            '& .MuiInputBase-input': { fontSize:'14px',color:'#666666'},
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
                            '& .MuiInputBase-input': { fontSize:'14px',color:'#666666'},
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
        </SeachDiv>
        <DeDiv>
            <div style={{'marginLeft':'15px','fontWeight': '400','width':'102px','fontSize':'14px', 'color':'#333333'}}>
                부서선택 <br/>
            </div>
            <DepartmentDiv>
                <Box sx={{width:'200px'}}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">부서</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Age"
                            defaultValue={0}
                            onChange={handleChange}
                        >
                            <MenuItem value={0}>전체</MenuItem>
                            <MenuItem value={'차량'}>차량</MenuItem>
                            <MenuItem value={'관제'}>관제</MenuItem>
                            <MenuItem value={'승무'}>승무</MenuItem>
                            <MenuItem value={'기타'}>기타</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </DepartmentDiv>
        </DeDiv>
        </BorderDiv>
    </GridDiv>

    <ChartDiv>
        <div style={{ width:'34%', height:'500px' }}>
            <ChartHeader/>

            <DataGridPremium
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                sx={{fontSize:'13px',borderTop: '3px solid #008CCF',borderBottomColor: '#008CCF',borderLeft:'none',borderRight:'none',borderRadius:'0px'}}

            />
        </div>
        <div style={{ width:'65%', height:'550px',backgroundColor:'#F6F6F6' }}>
            <PieChartData data={chartState} title={'접속부서 TOP10'}/>

        </div>
    </ChartDiv>


</>

    )
}

export default ChartDept;