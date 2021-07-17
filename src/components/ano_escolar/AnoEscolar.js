import React, { useRef, useState, useEffect,  Component  } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Toast } from 'primereact/toast';
import validator from 'validator';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputMask } from 'primereact/inputmask';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import 'primeflex/primeflex.css';
import { useForm } from '../../hooks/useForm';
import { addAnoEscolarAction, listarAnosEscolaresAction, updateAnoEscolarAction, deleteAnoEscolarAction, updateAnoEscolarActual } from './anoEscolarDuck';
import moment from "moment";

import  "./anoEscolar.css";


export const AnoEscolar = () => {


    const { ano_escolar, anos_escolares } = useSelector(state => state.ano_escolar);
  
    const dispatch = useDispatch();
    const [ globalFilter, setGlobalFilter] = useState(null);
    const [ dlgShow, setDlgShow ] = useState(false);
    const { uid } = useSelector(state => state.login);
    const toast = useRef(null);
    const dt = useRef(null);
    const [actualizar, setActualizar] = useState(false);
    const [deleteDlgShow, setDeleteDlgShow] = useState(false)

        
	const [error, setError] = useState({
        errorDescripcion:'',
        errorFechaExamenSem:'',
        errorFechaExamenCom:'',
        errorClass:''       
    })

	const [ formValue, setFormValue, handleInputChange, reset ] = useForm({
    	descripcion:'',
		id:0,
		fecha_examen_sem:'', 
		fecha_examen_com:'',
		usrcre:'usrcre',
		feccre: new Date(),
		usrmod:'usrmod',
		fecmod: new Date()
	});
    
    useEffect(() => {
        dispatch(listarAnosEscolaresAction(uid));
     }, [dispatch, uid])

    const { descripcion,id, fecha_examen_sem, fecha_examen_com, usrcre, feccre, usrmod,fecmod } = formValue;

    useEffect(() =>{
        dispatch( updateAnoEscolarActual(formValue));
    },[formValue, dispatch]);
            
    
      

	const addDlg = () =>{
        setActualizar(false);
		setDlgShow(true);
	}

    const editDlg = (formValue) =>{
        


        setActualizar(true);

        //let fecComMDY = formValue.fecha_examen_com.substr(3,2)+'/'+formValue.fecha_examen_com.substr(0,2) +'/'+formValue.fecha_examen_com.substr(6,4);
        //let fecSemMDY = formValue.fecha_examen_sem.substr(3,2)+'/'+formValue.fecha_examen_sem.substr(0,2) +'/'+formValue.fecha_examen_sem.substr(6,4);
        setFormValue({
			descripcion: formValue.descripcion,
			id: formValue.id,
		    fecha_examen_sem: formValue.fecha_examen_sem,
            fecha_examen_com: formValue.fecha_examen_com,            
			usrcre: formValue.usrcre,
			feccre: formValue.feccre,
			usrmod: formValue.usrmod,
			fecmod: formValue.fecmod
        })
		setDlgShow(true);
	}

         
	const onHide = (name) => {
        setError({});  
        reset();
        setDlgShow(false);

    }

    const handleDeleteAnoEscolar = () =>{
        dispatch(deleteAnoEscolarAction());
        setDeleteDlgShow(false);
    }
    
    const onSubmit = () =>{


		  if (!isFormValid()){
              return false;
          }
         
          if (actualizar){

            dispatch( updateAnoEscolarAction() );
          }else{

            dispatch( addAnoEscolarAction(  ) );
          }
          setDlgShow(false);
          reset();
        
    }

	

    const header = (
		<div className="table-header">
			<h5 id="id_label_search" className="p-m-0">Listado Años Escolares</h5>
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
        	<Button label="Borrar" icon="pi pi-check" className="p-button-text" onClick={()=>handleDeleteAnoEscolar()} />
    	</div>
	);
 
    const showDeleteAnoEscolar = (formValue) =>{
          
        setFormValue({
            descripcion: formValue.descripcion,
            id: formValue.id,
            fecha_examen_sem: formValue.fecha_examen_sem,
            fecha_examen_com: formValue.fecha_examen_com,
            usrcre: formValue.usrcre,
            feccre: formValue.feccre,
            usrmod: formValue.usrmod,
            fecmod: formValue.fecmod
      })

          setDeleteDlgShow(true);
    }

    const hideShowDeleteDialog = (hideShow) =>{
		setDeleteDlgShow(hideShow);
    }

    const isFormValid = () =>{
        setError({});   

        let errorDescripcion = '';
        let errorFechaExamenSem = '';
        let errorFechaExamenCom = '';

        if (descripcion.trim().length === 0 ){
            setError(errorDescripcion = 'Descripción es obligatoria');
        } 


        if (fecha_examen_sem === "" ){
            setError(errorFechaExamenSem = 'Fecha es obligatoria');
        } 
        
        if (  fecha_examen_com === "" )  {
            setError(errorFechaExamenCom = 'Fecha es obligatoria');
        } 

        if (errorDescripcion || errorFechaExamenSem || errorFechaExamenCom){
            setError({errorDescripcion, errorFechaExamenSem, errorFechaExamenCom, errorClass:'errorClass'});
            return false
        }
        return true;
    }
 
    const actionBodyTemplate = (rowData) => {
        
        return (

            <div className="actions" style={{width:"75px"}}>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editDlg(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={ ()=>showDeleteAnoEscolar(rowData) } />
            </div>
        );
    }
   
    const exportCSV = () => {
        dt.current.exportCSV();
    }    

    const convierte_fecha = (fecha) =>{
        return moment(fecha).toDate("mm/dd/yyyy");
    }

    return (
		<div>
			<div className="p-grid crud-demo">
				<div className="p-col-12">
					<div className="card">
						<Toast ref={toast} />
						<DataTable   value={anos_escolares}   ref={dt} 
						    header="Small Table" 
							dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive p-datatable-sm"
							paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" globalFilter={globalFilter}
							currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Tipos Empleado"
							emptyMessage="No existen registros"  header={header} selectionMode="single" 
							>
							<Column style={{width:"30%" }} field="descripcion" header="Descripción Año Escolar" sortable ></Column>
							<Column field="fecha_examen_sem" header="Fecha Examen Sem" sortable ></Column>
							<Column field="fecha_examen_com" header="Fecha Examen Final" sortable ></Column>
							<Column field="usrcre" header="Creado Por" sortable ></Column>
							<Column field="feccre" header="Fecha Creado"  sortable></Column>
							<Column field="usrmod" header="Modificado Por" sortable ></Column>
                            <Column field="fecmod" header="Fecha Modificado" sortable ></Column>
							<Column header="Acción" style={{ width:"5.6%" }} body={actionBodyTemplate} > </Column>
						</DataTable>

				   

		 	<Dialog id="anoEscolarDlg" visible={dlgShow}  header="Año Escolar" modal className="p-fluid" footer={footer} onHide={onHide} style={{width: '30vw'}} >
                <form  >
  
                
                    <div className="p-fluid p-formgrid p-grid">
            
                        <div className="p-field p-col-12 p-md-12 p-mt-3 ">
                            <label htmlFor="descripcion">Descripción Año Escolar</label>
                            <InputText name="descripcion" type="text"  className =  { error.errorDescripcion?.length && error.errorClass } autoFocus
                            onChange = { handleInputChange  } value ={ descripcion }/>
                            <div style={{ fontSize:12, color:"red" }}> { error.errorDescripcion }</div>
                        </div>

                        <div className="p-field p-col-12 p-md-6 p-mt-3 ">
                            <label htmlFor="fecha_examen_sem">Fecha examen trimestral</label>
                            <InputMask  name="fecha_examen_sem" type="text" mask="99/99/9999" placeholder="dd/mm/yyyy" slotChar="dd/mm/yyyy" 
                            onChange = { handleInputChange  } value = {fecha_examen_sem}  
                            //className =  { error.errorFechaExamenSem?.length && error.errorClass }
                            />
                            <div style={{ fontSize:12, color:"red", BorderColor:"red" }}> { error.errorFechaExamenSem }</div>
                        </div>

                        <div className="p-field p-col-12 p-md-6 p-mt-3 ">
                            <label htmlFor="fecha_examen_com">Fecha examen Completivos</label>
                            <InputMask  name="fecha_examen_com" type="text" mask="99/99/9999" placeholder="dd/mm/yyyy" slotChar="dd/mm/yyyy" 
                            onChange = { handleInputChange  } value ={ fecha_examen_com }
                            //className =  { error.errorFechaExamenCom?.length && error.errorClass }
                            />
                            <div style={{ fontSize:12, color:"red", borderColor:"red" }}> { error.errorFechaExamenCom }</div>
                        </div>

 
 


                    </div>
                    
                </form>
           </Dialog>


           <Dialog visible={deleteDlgShow} style={{ width: '450px' }} header="Confirmación" modal footer={deleteDialogFooter} onHide={()=>hideShowDeleteDialog(false)}>
                       <div className="confirmation-content">
                           <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                           { <span>Esta seguro de borrar el registro :  <b style={{'color':'red'}}>{ descripcion  }</b>?</span>}
                       </div>
           </Dialog>


					</div>
				</div>
			</div>
 
		</div>
	)
    
}

