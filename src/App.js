import logo from './logo.svg';
import './App.css';
import routes from './routes/routes';
import Header from "./components/fregment/Header";
import { BrowserRouter, Route,  Routes } from "react-router-dom";
import { LicenseInfo } from '@mui/x-license-pro';

LicenseInfo.setLicenseKey('eda985968670b41792906302d2418333Tz01Nzg2NCxFPTE3MDU1NjE3MzE4OTUsUz1wcmVtaXVtLExNPXN1YnNjcmlwdGlvbixLVj0y');
function App() {
  return (
    <>
      <BrowserRouter>
        <Header/>

        <Routes>

          {routes.map(route => {
            return (
                <Route
                    key={route.path}
                    path={route.path}
                    element={<route.component />}
                >

                </Route>
            );
          })}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
