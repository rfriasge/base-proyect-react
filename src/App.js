import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Redirect  } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { useDispatch, useSelector } from 'react-redux';
import { AppTopbar } from './AppTopbar';
import { AppFooter } from './AppFooter';
import { AppMenu } from './AppMenu';
import { AppProfile } from './AppProfile';
import { AppConfig } from './AppConfig';

import { Dashboard } from './components/Dashboard';
//import { Calendar } from './pages/Calendar';
//import { Crud } from './pages/Crud';
import { EmptyPage } from './pages/EmptyPage';
import { TimelineDemo } from './utilities/TimelineDemo';

import PrimeReact from 'primereact/api';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';

import { firebase } from '../src/firebase/firebase-config';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import './layout/flags/flags.css';
import './layout/layout.scss';
import './App.scss';
import './app.css';
import { login } from './components/auth/loginAcciones';
import { PublicRoute } from './components/auth/PublicRoute';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { Colegio } from './components/colegio/Colegio';
import { Cargos } from './components/cargo/Cargos';
import { TipoEmpleado } from './components/tipo_empleado/TipoEmpleado';
import { Grados } from './components/grado/Grados';
import { Materias } from './components/materia/Materias';
import { AnoEscolar } from './components/ano_escolar/AnoEscolar';
import { Horarios } from './components/horario/Horarios';
import { Cursos } from './components/cursos/Cursos';
import { Empleados } from './components/empleado/Empleados';
import { Departamentos } from './components/departamento/Departamentos';
import { Estudiantes } from './components/estudiante/Estudiantes';





const App = () => {

    const [layoutMode, setLayoutMode] = useState('static');
    const [layoutColorMode, setLayoutColorMode] = useState('dark')
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [inputStyle, setInputStyle] = useState('outlined');
    const [ripple, setRipple] = useState(false);
    const sidebar = useRef();
    let menuClick = false;


    
    const dispatch = useDispatch();
    
    useEffect(() => {
        firebase.auth().onAuthStateChanged((user)=>{
            if (user?.uid){
                dispatch(login(user.uid, user.displayName));
            }
        })

    }, [dispatch])

    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    }

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value)
    }

    const onLayoutModeChange = (mode) => {
        setLayoutMode(mode)
    }

    const onColorModeChange = (mode) => {
        setLayoutColorMode(mode)
    }

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
        menuClick = false;
    }

    const onToggleMenu = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === 'overlay') {
                setOverlayMenuActive(prevState => !prevState);
            }
            else if (layoutMode === 'static') {
                setStaticMenuInactive(prevState => !prevState);
            }
        }
        else {
            setMobileMenuActive(prevState => !prevState);
        }
        event.preventDefault();
    }

    const onSidebarClick = () => {
        menuClick = true;
    }

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    }

    const menu = [
        { label: 'Inicio', icon: 'pi pi-fw pi-home', to: '/' },
    {/* label: 'Login', icon: 'pi pi-fw pi-home', to: '/login' */},
        {
            label: 'Mantenimientos', icon: 'pi pi-fw pi-clone',
            items: [
                { label: 'Colegio', icon: 'pi pi-fw pi-user-edit', to: '/colegio' },
                { label: 'Cargos', icon: 'pi pi-fw pi-calendar-plus', to: '/cargos' },
                { label: 'Departamentos', icon: 'pi pi-fw pi-calendar', to: './departamentos' },
                { label: 'Tipo Empleado', icon: 'pi pi-fw pi-calendar', to: '/TiposEmpleado' },
                { label: 'Año Escolar', icon: 'pi pi-fw pi-circle-off', to: '/AnoEscolar' },                
                { label: 'Grados', icon: 'pi pi-fw pi-circle-off', to: '/grados' },
                { label: 'Materias', icon: 'pi pi-fw pi-circle-off', to: '/materias' },
                { label: 'Horarios', icon: 'pi pi-fw pi-circle-off', to: '/horarios' },                
                { label: 'Cursos', icon: 'pi pi-fw pi-circle-off', to: '/cursos' },                                
                { label: 'Empleados', icon: 'pi pi-fw pi-circle-off', to: '/empleados' },
                { label: 'Estudiante', icon: 'pi pi-fw pi-user-edit', to: '/estudiantes' }                
            ]
        },
        {
            label: 'Procesos', icon: 'pi pi-fw pi-clone',
            items: [
                { label: 'Estudiante / Cursos', icon: 'pi pi-fw pi-calendar-plus', to: '/empty' },
                { label: 'Inscripción', icon: 'pi pi-fw pi-calendar', to: '/empty' },
                { label: 'Traslado Estudiante Curso', icon: 'pi pi-fw pi-calendar', to: '/empty' },                
                { label: 'Notas Mensuales', icon: 'pi pi-fw pi-calendar', to: '/empty' },   
                { label: 'Notas Trimestrales', icon: 'pi pi-fw pi-calendar', to: '/empty' },     
           ]
        },

        {
            label: 'Cuentas por Cobrar', icon: 'pi pi-fw pi-clone',
            items: [
                { label: 'Cobros', icon: 'pi pi-fw pi-user-edit', to: '/empty' },
                { label: 'Aplica Cobro', icon: 'pi pi-fw pi-calendar-plus', to: '/empty' },
                { label: 'Reporte de Cobros', icon: 'pi pi-fw pi-calendar', to: '/empty' },
           ]
        },
        {
            label: 'Reportes', icon: 'pi pi-fw pi-clone',
            items: [
                { label: 'Estudiante por Curso', icon: 'pi pi-fw pi-user-edit', to: '/empty' },
                { label: 'Notas por Cursos', icon: 'pi pi-fw pi-calendar-plus', to: '/empty' },
                { label: 'Notas por Estudiantes', icon: 'pi pi-fw pi-calendar', to: '/empty' },
                { label: 'Certificación Inscripción Md1', icon: 'pi pi-fw pi-calendar', to: '/empty' },                
                { label: 'Certificación Inscripción Md2', icon: 'pi pi-fw pi-calendar', to: '/empty' },   
                { label: 'Record de Notas', icon: 'pi pi-fw pi-calendar', to: '/empty' },     
           ]
        },

    ];

      
     const isDesktop = () => {
        return window.innerWidth > 1024;
    }

    const isSidebarVisible = () => {


        if (isDesktop()) {
            if (layoutMode === 'static')
                return !staticMenuInactive;
            else if (layoutMode === 'overlay')
                return overlayMenuActive;
            else
                return true;
        }

        return true;
    }

    const logo = layoutColorMode === 'dark' ? 'assets/layout/images/logo-white.svg' : 'assets/layout/images/logo.svg';

    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-static-sidebar-inactive': staticMenuInactive && layoutMode === 'static',
        'layout-overlay-sidebar-active': overlayMenuActive && layoutMode === 'overlay',
        'layout-mobile-sidebar-active': mobileMenuActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': ripple === false
    });

    const sidebarClassName = classNames('layout-sidebar', {
        'layout-sidebar-dark': layoutColorMode === 'dark',
        'layout-sidebar-light': layoutColorMode === 'light'
    });
    const { isConnected } = useSelector(state => state.login)
    
    return (
        <div className={wrapperClass} onClick={onWrapperClick}>
            <AppTopbar onToggleMenu={onToggleMenu} />

            <CSSTransition classNames="layout-sidebar" timeout={{ enter: 200, exit: 200 }} in={isSidebarVisible()} unmountOnExit>
                <div ref={sidebar} className={sidebarClassName} onClick={onSidebarClick}>
                    <div className="layout-logo">
                        <img alt="Logo" src={logo} />
                    </div>
                    {
                        (isConnected)
                        &&<AppProfile /> 
                    }
                    {    (isConnected)&&
                         <AppMenu model={menu} onMenuItemClick={onMenuItemClick} /> 
                    }
                </div>
            </CSSTransition>

            <AppConfig rippleEffect={ripple} onRippleEffect={onRipple} inputStyle={inputStyle} onInputStyleChange={onInputStyleChange}
                layoutMode={layoutMode} onLayoutModeChange={onLayoutModeChange} layoutColorMode={layoutColorMode} onColorModeChange={onColorModeChange} />

            <div className="layout-main">
            
{/* 
                    isConnected&&
                    (
                        <Route path="/"  exact component={Dashboard} />                                
                    )
                }
    */}                            
                
                    <PublicRoute path="/login"  exact component={ Login }  isAuthenticated = {  isConnected }/>   
                    <PublicRoute path="/register" exact component={ Register }  isAuthenticated = {  isConnected } />

                    <PrivateRoute path="/" exact component={Dashboard}  isAuthenticated = {  isConnected } />
                    <PrivateRoute path="/colegio" exact component={ Colegio }  isAuthenticated = {  isConnected } />
                    <PrivateRoute path="/cargos" exact component={ Cargos }  isAuthenticated = {  isConnected } />
                    <PrivateRoute path="/departamentos" exact component={ Departamentos }  isAuthenticated = {  isConnected } />
                    <PrivateRoute path="/tiposEmpleado" exact component={ TipoEmpleado }  isAuthenticated = {  isConnected } />
                    <PrivateRoute path="/anoEscolar" exact component={AnoEscolar}   isAuthenticated = {  isConnected }  />
                    <PrivateRoute path="/grados" exact component={ Grados }  isAuthenticated = {  isConnected }  />
                    <PrivateRoute path="/materias" exact component={ Materias }  isAuthenticated = {  isConnected }  />
                    <PrivateRoute path="/horarios" exact component={ Horarios }  isAuthenticated = {  isConnected }  />
                    <PrivateRoute path="/cursos" exact component={ Cursos }  isAuthenticated = {  isConnected }  />
                    <PrivateRoute path="/empleados" exact component={ Empleados }  isAuthenticated = {  isConnected }  />
                    <PrivateRoute path="/estudiantes" exact component={ Estudiantes }  isAuthenticated = {  isConnected }  />

                    <Redirect to="/login" />
                
            </div>

            <AppFooter />

        </div>
    );

}

export default App;
