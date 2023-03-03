import Home from '../components/User/Home'
import Login from '../components/User/Login'
import UserList from '../components/User/UserList'
import Log from '../components/log/Log'
import Chart from '../components/chart/Chart'
import ChartDept from '../components/chart/ChartDept'
import ChartMenu from '../components/chart/ChartMenu'

export default [
    {
        id:0,
        path: '/',
        component: Login
    },
    {
        id:1,
        path: '/home',
        component: Home
    },
    {
        id:2,
        path: '/userlist',
        component: UserList
    },
    {
        id:3,
        path: '/log',
        component: Log
    },
    {
        id:4,
        path: '/chart',
        component: Chart
    },
    {
        id:5,
        path: '/chartdept',
        component: ChartDept
    },
    {
        id:5,
        path: '/chartmenu',
        component: ChartMenu
    }
];