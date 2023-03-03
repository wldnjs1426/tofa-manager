import logo from './logo.svg';
import './App.css';
import routes from './routes/routes';
import Header from "./components/fregment/Header";
import { BrowserRouter, Route,  Routes } from "react-router-dom";
import { LicenseInfo } from '@mui/x-license-pro';
import {useCallback, useState, useEffect} from "react";


LicenseInfo.setLicenseKey('eda985968670b41792906302d2418333Tz01Nzg2NCxFPTE3MDU1NjE3MzE4OTUsUz1wcmVtaXVtLExNPXN1YnNjcmlwdGlvbixLVj0y');

function App() {
    let data
    if(window.location.pathname === '/userlist'){
        data = '/home'
    }else if(window.location.pathname === '/chartdept' || window.location.pathname === '/chartmenu'){
        data = '/chart'
    }else{
        data = window.location.pathname
    }

    const [value, setValue] = useState(data);


    return (
    <>
          <Header pathValue={value} pathSetValue={setValue}/>
          {/*{window.location.pathname === '/login' ? undefined : }*/}

        <Routes>

          {routes.map(route => {
            return (
                <Route
                    key={route.id}
                    path={route.path}
                    element={<route.component pathValue={value} pathSetValue={setValue}/>}
                />
            );
          })}
        </Routes>
    </>
  );
}

export default App;
