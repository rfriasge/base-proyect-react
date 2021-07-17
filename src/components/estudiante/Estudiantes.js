import React, { useRef, useState, useEffect } from 'react';
import {  useDispatch, useSelector } from 'react-redux';
import { Toast } from 'primereact/toast';
import validator from 'validator';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputMask } from 'primereact/inputmask';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputTextarea } from 'primereact/inputtextarea';
import { useForm } from '../../hooks/useForm';
import CurrencyInput from 'react-currency-masked-input';
import { Dropdown } from 'primereact/dropdown';
import { addEstudianteAction, listarEstudianteAction, updateEstudianteAction, deleteEstudianteAction, updateEstudianteActual } from "./EstudiantesDucks";
import { listarGradoAction } from "../grado/gradosDucks";
import moment from 'moment';
import { listarDepartamentosAction } from '../departamento/DepartamentoDucks';
import { listarCargosAction } from '../cargo/cargoDucks';
import './estudiantes.css'
 

export const Estudiantes = () => {

  
    const { estudiantes, estudiante_actual } = useSelector(state => state.estudiante);
	
	
    const dispatch = useDispatch();
    const [ globalFilter, setGlobalFilter] = useState(null);
    const [ estudianteDialog, setEstudianteDialog ] = useState(false);
    const [ estudianteActual, setEstudianteActual] = useState(null);
    const { uid } = useSelector(state => state.login);
	const { grados } = useSelector(state => state.grado);
    const { departamentos } = useSelector(state => state.departamento);
    const { cargos } = useSelector(state => state.cargo);        
	const { tipos_estudiante, estados } = useSelector(state => state.estudiante);
    const toast = useRef(null);
    const dt = useRef(null);
    const [actualizar, setActualizar] = useState(false);
    const [deleteDialogShow, setDeleteDialogShow] = useState(false);
	
    
    const [error, setError] = useState({
        errorDescripcion:'',
        errorClass:''       
    })

	const [ formValue, setFormValue, handleInputChange, reset ] = useForm({
		id:'',
		nombres:'',
		apellidos:'',
		direccion:'',
		telefono_residencial:'',
		celular:'',
		cedula:'',
		fecha_nacimiento:'',
		nombre_padre:'',
		celular_padre:'',
		tel_residencia_padre:'',
		tel_oficina_padre:'',
		nombre_madre:'',
		celular_madre:'',
		tel_residencia_madre:'',		
		tel_oficina_madre:'',
		observacion:'',
		estado:'1',
		fecha_egreso:'',
		fecha_ingreso:'',
        grado_inicial:'',
        persona_emergencia:'',
        telefono_emergencia:'',
		usrcre:'usrcre',
		feccre: '',
		usrmod:'usrmod',
		fecmod: ''
   	});
    
    useEffect(() => {
        dispatch(listarEstudianteAction(uid));
        dispatch(listarDepartamentosAction(uid));
        dispatch(listarCargosAction(uid));        
		dispatch(listarGradoAction(uid));
     }, [dispatch, uid]);
     
    const { 
		id,nombres,	apellidos,direccion,telefono_residencial,celular,cedula,fecha_nacimiento,nombre_padre,celular_padre,
        tel_residencia_padre,tel_oficina_padre,nombre_madre,celular_madre,tel_residencia_madre,tel_oficina_madre,
        observacion,estado,fecha_egreso,fecha_ingreso, grado_inicial,persona_emergencia,telefono_emergencia,usrcre,feccre,usrmod,fecmod } =  formValue;

    useEffect(() =>{
        dispatch( updateEstudianteActual(formValue));
    },[formValue]);
    
            
    const addDlg = () =>{
        reset();
        setActualizar(false);
		setEstudianteDialog(true);
	}

    const editDlg = (estudiante) =>{
        setActualizar(true);
        actualizaEstudianteActual(estudiante);
 		setEstudianteDialog(true);
	}

    const deleteDlg = (estudiante) =>{
        actualizaEstudianteActual(estudiante);
        hideShowDeleteDialog(true);
	}

         
    const actualizaEstudianteActual = (estudiante) =>{
        setFormValue({
			id:estudiante.id,
			nombres:estudiante.nombres,
			apellidos:estudiante.apellidos,
			direccion:estudiante.direccion,
			telefono_residencial:estudiante.telefono_residencial,
			celular:estudiante.celular,
			cedula:estudiante.cedula,
			fecha_nacimiento:estudiante.fecha_nacimiento,
			nombre_padre:estudiante.nombre_padre,
            cedular_padre:estudiante.celular_padre,
            telefono_residencial_padre:estudiante.telefono_residencial_padre,
            telefono_oficina_padre:estudiante.telefono_oficina_padre,
            nombre_madre:estudiante.nombre_madre,
            celular_madre:estudiante.celular_madre,
            telefono_residencia_madre:estudiante.telefono_residencia_madre,		
            telefono_oficina_madre:estudiante.telefono_oficina_madre,
            observacion:estudiante.observacion,
            estado:estudiante.estado,
            fecha_egreso:estudiante.fecha_egreso,
            fecha_ingreso:estudiante.fecha_ingreso,    
            grado_inicial:estudiante.grado_incial,
            persona_emergencia:estudiante.persona_emergencia,
            telefono_emergencia:estudiante.telefono_emergencia,                    
            usrcre:estudiante.usrcre,
			feccre:estudiante.feccre,
			usrmod:estudiante.usrmod,
			fecmod:estudiante.fecmod
        })
    }
	const onHide = (name) => {
        setError({});  
        reset();
        setEstudianteDialog(false);

    }

    const handleDeleteEstudiante = (_id) =>{
        dispatch(deleteEstudianteAction(_id));
        hideShowDeleteDialog(false);
    }
     
    const onSubmit = () =>{


		  if (!isFormValid()){
              return false;
          }
         
          if (actualizar){
            dispatch( updateEstudianteAction() );
          }else{
            dispatch( addEstudianteAction() );
          }
          setEstudianteDialog(false);
          reset();
        
    }

    const hideShowDeleteDialog = (hideShow) =>{
        setDeleteDialogShow(hideShow);
  }

  const isFormValid = () =>{
      setError({});   
      let errorNombres = '';
  
      if (nombres.trim().length === 0 ){
          errorNombres = 'Nombre es obligatorio';
      } 

      if (errorNombres){
          setError({errorNombres, errorClass:'errorClass'});
          return false
      }
      return true;
  }

 
  const exportCSV = () => {
      dt.current.exportCSV();
  }

  const FormatDate =(fecha) =>{
      return moment(fecha).format("DD/MM/YYYY"); 
  }


// Templates

    const header = (
		<div className="table-header">
			<h5 id="id_label_search" className="p-m-0">Listado de Estudiantes</h5>
			<Button label="Export Excel" icon="pi pi-upload" className="p-button-help"  style={{marginRight:"10px"}}  onClick={()=>exportCSV()} /> 			
			<Button  id="btn_new" label="Agregar" icon="pi pi-plus" onClick={ addDlg } />
			<span id="text_search"  className="p-input-icon-left">
			   <i className="pi pi-search" />
				<InputText name="txt_buscar" id="txt_buscar" type="search" onInput={(e) => setGlobalFilter(e.target.value)} />
			</span>
		</div>
	);

	const footer = (
        <div>
            <Button label="Grabar" icon="pi pi-check" onClick={onSubmit} />
            <Button label="Cancelar" icon="pi pi-times" onClick={onHide} />
        </div>
    );

    const deleteDialogFooter =(rowData) => (
    	<div>
        	<Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={()=>hideShowDeleteDialog(false)} />
        	<Button label="Borrar" icon="pi pi-check" className="p-button-text" onClick={()=>handleDeleteEstudiante()} />
    	</div>
	);
    

    const actionBodyTemplate = (rowData) => {
        return (

            <div className="actions" style={{width:"75px"}}>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editDlg(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={ ()=>deleteDlg(rowData) } />
            </div>
        );
    }

	const gradoOptionTemplate = (option) => {
		return (
			<div >
				<div>{option.descripcion}</div>
			</div>
		);
	}

  return (
		<div>
			<div className="p-grid crud-demo">
				<div className="p-col-12">
					<div className="card">
						<Toast ref={toast} />
						<DataTable   value={estudiantes}   ref={dt}  id="tbEstudiante"
                        onSelectionChange={  (e) =>setEstudianteActual(e.value) } 
						header="Small Table" 
							dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive p-datatable-sm"
							paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" globalFilter={globalFilter}
							currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Estudiantes"
							emptyMessage="No existen registros"  header={header} selectionMode="single">
							<Column style={{width:"15%" }} field="nombres" header="Nombre Estudiante / Profesor" sortable ></Column>
                            <Column style={{width:"15%" }} field="apellidos" header="Apellidos" sortable ></Column>
                            <Column style={{width:"10%" }} field="cedula" header="cedula" sortable ></Column>
                            <Column style={{width:"10%" }} field="celular" header="Celular" sortable ></Column>
                            <Column style={{width:"10%" }} field="departamento.nombre_departamento" header="Departamento" sortable ></Column>
                            <Column style={{width:"10%" }} field="cargo.nombre_cargo" header="Cargo" sortable ></Column>
							<Column header="Acción" style={{ width:"5.6%" }} body={actionBodyTemplate} > </Column>
						</DataTable>

				   

		 	<Dialog visible={estudianteDialog} style={{ width: '50%' }} header="Estudiante" modal className="p-fluid" footer={footer} onHide={onHide}>
                <form>

                    <div className="p-fluid p-formgrid p-grid container">
            
			
                      {/*   <div className="p-field p-col-12 p-md-3 p-mt-3 ">
                            <label htmlFor="nombres">Nombre(s) estudiante</label>
                            <InputText  name="nombres" type="text"  className =  { error.errorNombre?.length && error.errorClass } autoFocus 
                            onChange = { handleInputChange  } value ={ nombres }/>
                            <div style={{ fontSize:12, color:"red" }}> { error.errorNombre }</div>
                        </div>

                        <div className="p-field p-col-12 p-md-3 p-mt-3 ">
                            <label htmlFor="apellidos">Apellido(s)</label>
                            <InputText  name="apellidos" type="text"  className =  { error.errorApellidos?.length && error.errorClass }
                            onChange = { handleInputChange  } value ={ apellidos }/>
                            <div style={{ fontSize:12, color:"red" }}> { error.errorApelidos }</div>
                        </div>

                        <div className="p-field p-col-12 p-md-3 p-mt-3 ">
                            <label htmlFor="cedula">Cédula/Rnc</label>
                            <InputText  name="cedula" type="text"  className =  { error.errorCedula?.length && error.errorClass }
                            onChange = { handleInputChange  } value ={ cedula }/>
                            <div style={{ fontSize:12, color:"red" }}> { error.errorCedula }</div>
                        </div>

                        <div className="p-field p-col-12 p-md-9 p-mt-1  p-offset-3">
                          <label htmlFor="direccion">Dirección</label>
                          <InputText  name="direccion" type="text"  className =  { error.errorDireccion?.length && error.errorClass }
                          onChange = { handleInputChange  } value ={ direccion }/>
                          <div style={{ fontSize:12, color:"red" }}> { error.errorDireccion }</div>
                      </div>
                        */}
                    <div className="card">
                        <div className="p-grid nested-grid">

                            <div className="p-col-10">
                                <div className="p-grid">

                                    <div className="p-col-4 p-mt-5">
                                        <label htmlFor="nombres">Nombre(s) estudiante</label>
                                        <InputText  name="nombres" type="text"  className =  { error.errorNombre?.length && error.errorClass }   autoFocus 
                                        style={{marginTop:"7px"}}
                                        onChange = { handleInputChange  } value ={ nombres }/>
                                        <div style={{ fontSize:12, color:"red" }}> { error.errorNombre }</div>

                                    </div>
                                    <div className="p-col-4 p-mt-5">

                                        <label htmlFor="apellidos">Apellido(s)</label>
                                        <InputText  name="apellidos" type="text"  className =  { error.errorApellidos?.length && error.errorClass }
                                        style={{marginTop:"7px"}}
                                        onChange = { handleInputChange  } value ={ apellidos }/>
                                        <div style={{ fontSize:12, color:"red" }}> { error.errorApelidos }</div>

                                    </div>     

                                    <div className="p-col-4 p-mt-5">

                                        <label htmlFor="cedula">Cédula/Rnc</label>
                                        <InputText  name="cedula" type="text"  className =  { error.errorCedula?.length && error.errorClass }
                                        style={{marginTop:"7px"}}
                                        onChange = { handleInputChange  } value ={ cedula }/>
                                        <div style={{ fontSize:12, color:"red" }}> { error.errorCedula }</div>

                                    </div> 
                                    <div className="p-col-12  p-mt-3 ">

                                        <label htmlFor="direccion">Dirección</label>
                                        <InputText  name="direccion" type="text"  className =  { error.errorDireccion?.length && error.errorClass }
                                        onChange = { handleInputChange  } value ={ direccion }/>
                                        <div style={{ fontSize:12, color:"red" }}> { error.errorDireccion }</div>

                                    </div>
                                </div>
                            </div>
                            <div className="p-col-2 p-mt-5 ">
                              {/* <a href="">  <img src="/assets/demo/images/product/brown-purse.jpg" width="140" height="115" /> </a> */}
                              <a href="">  <img id="foto" src="/assets/demo/images/product/user-1.png" width="140" height="115" /> </a>
                           

                            </div>

                            <div className="p-field p-col-2 p-mt-3 ">
                                <label htmlFor="telefono_residencial">Teléfon Residencia</label>
                                <InputMask  name="telefono_residencial" type="text" mask="(999) 999-9999" placeholder="(999) 999-9999" 
                                onChange = { handleInputChange  } value ={ telefono_residencial }/>
                                <div style={{ fontSize:12, color:"red" }}> { error.errorTelefonoResidencial }</div>
                            </div>

                            <div className="p-field p-col-2  p-mt-3 ">
                                <label htmlFor="celular">Celular</label>
                                <InputMask  name="celular" type="text" mask="(999) 999-9999" placeholder="(999) 999-9999"
                                onChange = { handleInputChange  } value ={ celular }/>
                                <div style={{ fontSize:12, color:"red" }}> { error.errorCelular }</div>
                            </div>


                            <div className="p-field p-col-2  p-mt-3 ">
                                <label htmlFor="fecha_nacimiento">Fecha Nacimiento</label>
                                <InputMask  name="fecha_nacimiento" type="text" mask="99/99/9999" placeholder="dd/mm/yyyy" slotChar="dd/mm/yyyy" 
                                onChange = { handleInputChange  } value ={ fecha_nacimiento }/>
                                <div style={{ fontSize:12, color:"red" }}> { error.errorFechaNacimiento }</div>
                            </div>

                            <div className="p-field p-col-2 p-mt-3 ">
                                <label htmlFor="celular">Fecha Ingreso</label>
                                <InputMask  name="fecha_ingreso" type="text" mask="99/99/9999" placeholder="dd/mm/yyyy" slotChar="dd/mm/yyyy" 
                                onChange = { handleInputChange  } value ={ fecha_ingreso }/>
                                <div style={{ fontSize:12, color:"red" }}> { error.errorFechaIngreso}</div>
                            </div>

                            <div className="p-field p-col-4 p-mt-3 ">
                                <label htmlFor="grado_inicial">Grado Inicio</label>
                                <Dropdown name="grado_inicial" options={grados} optionLabel="descripcion" optionValue="id"   placeholder="Grado inicial" 
                                onChange = { handleInputChange  } value ={ grado_inicial }/>
                                <div style={{ fontSize:12, color:"red" }}> { error.errorFechaEgreso }</div>
                            </div>

                            <div className="p-field p-col-4 p-mt-3 ">
                                <label htmlFor="persona_emergencia">Persona Emergencia</label>
                                <InputText  name="persona_emergencia" type="text"  className =  { error.errorPersonaEmergencia?.length && error.errorClass }
                                onChange = { handleInputChange  } value ={ persona_emergencia }/>
                                <div style={{ fontSize:12, color:"red" }}> { error.errorPersonaEmergencia }</div>
                            </div>

                            <div className="p-field p-col-2 p-mt-3 ">
                                <label htmlFor="telefono_emergencia">Teléfono Emergencia</label>
                                <InputMask  name="telefono_emergencia" type="text" mask="(999) 999-9999" placeholder="(999) 999-9999" 
                                onChange = { handleInputChange  } value ={ telefono_emergencia }/>
                                <div style={{ fontSize:12, color:"red" }}> { error.errorTelefonoEmergencia }</div>
                            </div>

                            <div className="p-field p-col-2 p-mt-3 ">
                                <label htmlFor="celular">Fecha Egreso</label>
                                <InputMask  name="fecha_egreso" type="text" mask="99/99/9999" placeholder="dd/mm/yyyy" slotChar="dd/mm/yyyy" 
                                onChange = { handleInputChange  } value ={ fecha_egreso }/>
                                <div style={{ fontSize:12, color:"red" }}> { error.errorFechaEgreso }</div>
                            </div>
                            
                            <div className="p-field p-col-4 p-mt-3 ">
                                <label htmlFor="estado">Estado</label>
                                <Dropdown name="estado" value={estado} options={estados} optionLabel="label" 
                                    placeholder="Seleccione Estado" 
                                onChange = { handleInputChange  } />
                                <div style={{ fontSize:12, color:"red" }}> { error.errorGrado }</div>
                            </div>

                        </div>
                    </div>        

                </div>        

              

              
                <div style={{marginLeft:7, marginRight:7}}>
                    <Accordion >

                        <AccordionTab header="Información de la Madre">
                        <div className="p-grid">
                            <div className="p-field p-col-6 p-mt-3">
                                <label htmlFor="nombres">Nombre de la Madre</label>
                                <InputText  name="nombre_madre" type="text"  className =  { error.errorNombre?.length && error.errorClass }   autoFocus 
                                onChange = { handleInputChange  } value ={ nombre_madre }/>
                                <div style={{ fontSize:12, color:"red" }}> { error.errorNombreMadre }</div>
                            </div>

                            <div className="p-field  p-col-2 p-mt-3 ">
                                <label htmlFor="tel_residencia_madre">Teléfon Residencia</label>
                                <InputMask  name="tel_residencia_madre" type="text" mask="(999) 999-9999" placeholder="(999) 999-9999" 
                                onChange = { handleInputChange  } value ={ tel_residencia_madre }/>
                                <div style={{ fontSize:12, color:"red" }}> { error.errorTelResidenciaMadre }</div>
                            </div>

                            <div className="p-field p-col-2  p-mt-3 ">
                                <label htmlFor="celular_madre">Celular</label>
                                <InputMask  name="celular_madre" type="text" mask="(999) 999-9999" placeholder="(999) 999-9999"
                                onChange = { handleInputChange  } value ={ celular_madre }/>
                                <div style={{ fontSize:12, color:"red" }}> { error.errorCelular }</div>
                            </div>

                            <div className="p-field p-col-2  p-mt-3 ">
                                <label htmlFor="tel_oficina_madre">Oficina</label>
                                <InputMask  name="tel_oficina_madre" type="text" mask="(999) 999-9999" placeholder="(999) 999-9999"
                                onChange = { handleInputChange  } value ={ tel_oficina_madre }/>
                                <div style={{ fontSize:12, color:"red" }}> { error.errorCelular }</div>
                            </div>
                    </div>
                    </AccordionTab>
                        <AccordionTab header="Información del Padre">
                        <div className="p-grid">
                                <div className="p-field p-col-6 p-mt-3">
                                    <label htmlFor="nombres">Nombre del Padre</label>
                                    <InputText  name="nombre_padre" type="text"  className =  { error.errorNombre?.length && error.errorClass }   autoFocus 
                                    onChange = { handleInputChange  } value ={ nombre_padre }/>
                                    <div style={{ fontSize:12, color:"red" }}> { error.errorNombrePadre }</div>
                                </div>

                                <div className="p-field  p-col-2 p-mt-3 ">
                                    <label htmlFor="tel_residencia_padre">Teléfon Residencia</label>
                                    <InputMask  name="tel_residencia_padre" type="text" mask="(999) 999-9999" placeholder="(999) 999-9999" 
                                    onChange = { handleInputChange  } value ={ tel_residencia_padre }/>
                                    <div style={{ fontSize:12, color:"red" }}> { error.errorTelResidenciaPadre }</div>
                                </div>

                                <div className="p-field p-col-2  p-mt-3 ">
                                    <label htmlFor="celular_padre">Celular</label>
                                    <InputMask  name="celular_padre" type="text" mask="(999) 999-9999" placeholder="(999) 999-9999"
                                    onChange = { handleInputChange  } value ={ celular_padre }/>
                                    <div style={{ fontSize:12, color:"red" }}> { error.errorCelularPadre }</div>
                                </div>

                                <div className="p-field p-col-2  p-mt-3 ">
                                    <label htmlFor="tel_oficina_padre">Oficina</label>
                                    <InputMask  name="tel_oficina_padre" type="text" mask="(999) 999-9999" placeholder="(999) 999-9999"
                                    onChange = { handleInputChange  } value ={ tel_oficina_padre }/>
                                    <div style={{ fontSize:12, color:"red" }}> { error.errorTelOficinaPadre }</div>
                                </div>
                        </div>
                        </AccordionTab>

                        <AccordionTab  header="Observación" style={{backgroundColor:'red !important'}}>

                            <div className="p-field p-col-12 ">
                                    <label htmlFor="observacion">Obsevación</label>
                                    <InputTextarea   name="observacion" type="text"  className =  { error.errorObservacion?.length && error.errorClass } rows={5}
                                    onChange = { handleInputChange  } value ={ observacion }/>
                                    <div style={{ fontSize:12, color:"red" }}> { error.errorObservacion }</div>
                            </div>   

                        </AccordionTab>
                    </Accordion>
                </div>
            </form>

        </Dialog>


        <Dialog visible={deleteDialogShow} style={{ width: '30%' }} header="Confirmación" modal footer={deleteDialogFooter} onHide={()=>hideShowDeleteDialog(false)}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                        { <span>Esta seguro de borrar el registro :  <b style={{'color':'red'}}>{ nombres } { apellidos}</b>?</span>}
                    </div>
        </Dialog>


                </div>
            </div>
        </div>
    </div>
	)

}
