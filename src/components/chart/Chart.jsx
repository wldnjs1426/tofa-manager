import styled from 'styled-components'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {useState} from "react";
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
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

const GridDiv = styled.div`
    display: flex;
    justify-content:center;
    align-items:center;
    width: 98%;
    margin:0 auto;
    border:1px solid lightgray;
    border-radius:10px;
    margin-bottom:2%;
`

const SubjectDiv = styled.div`
    width:100%;
    height:50px;
    display:flex;
    flex-direction: column;
    justify-content: center;
    font-weight:bold;
    margin-left:1%;
`
const SeachDiv = styled.div`
    width:40%;
    height: 150px;
    display:flex;
    justify-content:space-around;
    align-items:center;
    border-radius:10px
`
const DateDiv = styled.div`
    width:65%;
    height:100px;
    display:flex;
    justify-content:space-around;
    align-items:center;
`

const DepartmentDiv = styled.div`
    width:40%;
    height:100px;
    display:flex;
    justify-content:space-around;
    align-items:center;
`
const ChartDiv = styled.div`
    display:flex;
    margin:0 auto;
    width:98%;
    height:800px;
    border:1px solid lightgray;
    border-radius:10px;
`
const columns = [
    { field: 'id', headerName: '순번', width: 300},
    { field: 'name', headerName: '접속자수', width: 300 },
    { field: 'belong', headerName: '건수', width: 300 }
];

const rows = [
    {
        id: 1,
        name: '김지원',
        belong: '기타'
    },
    {
        id: 2,
        name: '김지원',
        belong: '기타'
    },
    {
        id: 3,
        name: '김지원',
        belong: '기타'
    }
];

const Chart = () => {
    const [startDate, setStartDate] = useState(dayjs('2018-01-01T00:00:00.000Z'));
    const [endDate, setEndDate] = useState(dayjs('2018-01-01T00:00:00.000Z'));
    const [department, setDepartment] = useState('');

    const handleChange = (event) => {
        setDepartment(event.target.value);
    };

    const [options, setOptions] = useState({
        title: {
            text: 'Referer of a Website',
            subtext: 'Fake Data',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: '50%',
                data: [
                    { value: 1048, name: 'Search Engine' },
                    { value: 735, name: 'Direct' },
                    { value: 580, name: 'Email' },
                    { value: 484, name: 'Union Ads' },
                    { value: 300, name: 'Video Ads' }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    });

    return (
<>
    <SubjectDiv>
       접속 통계
    </SubjectDiv>

    {/*차트 상단 검색조건*/}

    <GridDiv>
        <SeachDiv>
            <DateDiv>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        label="시작 날짜"
                        renderInput={(params) => <TextField {...params} />}
                        value={startDate}
                        onChange={(newValue) => {
                            setStartDate(newValue);
                        }}
                    />
                </LocalizationProvider>
                <div style={{width:'50px',textAlign:'center'}}>
                    ~
                </div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        label="종료 날짜"
                        renderInput={(params) => <TextField {...params} />}
                        value={endDate}
                        onChange={(newValue) => {
                            setEndDate(newValue);
                        }}
                    />
                </LocalizationProvider>
            </DateDiv>
        </SeachDiv>
        <SeachDiv>
            <DepartmentDiv>
                <Box sx={{width:'200px'}}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">부서</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={department}
                            label="Age"
                            onChange={handleChange}
                        >
                            <MenuItem value={10}>차량</MenuItem>
                            <MenuItem value={20}>관제</MenuItem>
                            <MenuItem value={30}>승무</MenuItem>
                            <MenuItem value={40}>기타</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Button variant="contained">검색</Button>
            </DepartmentDiv>
        </SeachDiv>
    </GridDiv>

    <ChartDiv>
        <div style={{borderRight:'1px solid lightgray', width:'50%', height:'100%' }}>
            <DataGridPremium
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection
            />
        </div>
        <ECharts
            option={options}
            opts={{ renderer: 'svg'}}
            style={{height: '100%', width: '50%'}}
        />
    </ChartDiv>


</>

    )
}

export default Chart;