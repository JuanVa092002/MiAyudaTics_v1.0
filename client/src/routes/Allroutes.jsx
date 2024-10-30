import { Routes, Route } from "react-router-dom";
import LoginMain from '../pages/loginMain/LoginMain';
import JustLogin from '../pages/justLogin/JustLogin';
import RegisterLogin from '../pages/register/RegisterLogin';
import ForgotPassword from '../pages/forgotPassword/ForgotPassword';

import PrivateRoutes from "./private.routes";
import Funcionario from '../pages/funcionario/Funcionario';
import Home from "../pages/home/Home";
import AdminSolicitud from "../pages/admin/AdminSolicitud";
import AdminTecnicos from "../pages/admin/AdminTecnicos";
import AdminAmbientes from "../pages/admin/AdminAmbientes";
import AdminCasos from "../pages/admin/AdminCasos";
import AdminEstadisticas from "../pages/admin/AdminEstadisticas";
import TecnicosActivos from "../pages/admin/tecnicos/TecnicosActivos";
import TecnicosInactivos from "../pages/admin/tecnicos/TecnicosInactivos";



//tecnico
import CasosPorResolverTabla from '../pages/tecnico/CasosPorResolverTabla';
import MisCasosTabla from '../pages/tecnico/MisCasosTabla';
import CasosResueltosTabla from '../pages/tecnico/CasosResueltosTabla';
import SeguimientoSolicitud from "../pages/admin/solicitud/SeguimientoSolicitud";

export default function Allroutes() {

  return (
    <Routes>
        {/* rutas publicas */}
        <Route path="/loginMain" element={<LoginMain/>}/>
        <Route path="/register" element={<RegisterLogin/>}/>
        <Route path="/forgot" element={<ForgotPassword/>}/>
        <Route path="/login" element={<JustLogin/>}/>
        <Route path="/" element={<Home/>}/>

        {/* rutas privadas */}
        <Route element={<PrivateRoutes/>}>
            <Route path="/funcionario" element={<Funcionario/>}/>
            <Route path="/adminSolicitud" element={<AdminSolicitud/>}/>
            <Route path="/adminTecnicos" element={<AdminTecnicos/>}/>
            <Route path="/adminAmbientes" element={<AdminAmbientes/>}/>
            <Route path="/adminCasos" element={<AdminCasos/>}/>
            <Route path="/adminEstadisticas" element={<AdminEstadisticas/>}/>
            <Route path="/tecnicosActivos" element={<TecnicosActivos/>}/>
            <Route path="/tecnicosInactivos" element={<TecnicosInactivos/>}/>
            <Route path="/seguimiento" element={<SeguimientoSolicitud/>}/>

        
            {/* tecnico */}
            <Route path="/casos-por-resolver" element={<CasosPorResolverTabla />} />
            <Route path="/mis-casos" element={<MisCasosTabla />} />
            <Route path="/casos-resueltos" element={<CasosResueltosTabla />} />
            
        </Route>
    </Routes>
  )
  
}
