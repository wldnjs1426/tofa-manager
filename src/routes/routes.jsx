import Home from '../components/User/Home'
import UserList from '../components/User/UserList'
import Log from '../components/log/Log'
import Chart from '../components/chart/Chart'

export default [
    {
        path: '/',
        component: Home
    },
    {
        path: '/userlist',
        component: UserList
    },
    {
        path: '/log',
        component: Log
    },
    {
        path: '/chart',
        component: Chart
    }
];