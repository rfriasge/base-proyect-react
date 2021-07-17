import React, { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Toast } from 'primereact/toast';
import validator from 'validator';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputMask } from 'primereact/inputmask';
import { InputText } from 'primereact/inputtext';
import { useForm } from '../../hooks/useForm';
import { addPuestoAction, listarPuestosAction, updatePuestoAction, deletePuestoAction, updatePuestoActual } from './puestoDucks';
import moment from 'moment';


export const Puestos = () => {


    const { puestos, puesto_actual } = useSelector(state => state.puesto);
	
  
    const dispatch = useDispatch();
    const [ globalFilter, setGlobalFilter] = useState(null);
    const [ puestoDialog, setPuestoDialog ] = useState(false);
    const [puestoActual, setPuestoActual] = useState(null);
    const { uid } = useSelector(state => state.login);
    const toast = useRef(null);
    const dt = useRef(null);
    const [actualizar, setActualizar] = useState(false);
    const [deleteDialogShow, setDeleteDialogShow] = useState(false);
    const [nombrePuestoDelete, setNombrePuestoDelete] = useState('');
    const [idPuestoDelete, setIdPuestoDelete] = useState('');

    const [error, setError] = useState({
        errorNombre:'',
        errorDireccion:'',
        errorEmail:'',
        errorClass:''       
    })

	const [ formValue, setFormValue, handleInputChange, reset ] = useForm({
    	nombre_puesto:'',
		id:0,
		usrcre:'usrcre',
		feccre: new Date(),
		usrmod:'usrmod',
		fecmod: new Date()
	});
    
    useEffect(() => {
        dispatch(listarPuestosAction(uid));
     }, [dispatch, uid])

    const { nombre_puesto,puesto_id,usrcre,feccre,usrmod,fecmod } = formValue;

    useEffect(() =>{
        dispatch( updatePuestoActual(formValue));
    },[formValue]);
            
    
      

	const addDlg = (puesto) =>{
        setActualizar(false);
		setPuestoDialog(true);
	}

    const editDlg = (puesto) =>{
        
        setActualizar(true);

        setFormValue({
            
			nombre_puesto: puesto.nombre_puesto,
			id: puesto.id,
			usrcre: puesto.usrcre,
			feccre: puesto.feccre,
			usrmod: puesto.usrmod,
			fecmod: puesto.fecmod
        })
 		setPuestoDialog(true);
	}

         
	const onHide = (name) => {
        setError({});  
        reset();
        setPuestoDialog(false);

    }

    const handleDeletePuesto = () =>{
        dispatch(deletePuestoAction(idPuestoDelete));
        hideShowDeleteDialog(false);
    }
    
    const onSubmit = () =>{


		  if (!isFormValid()){
              return false;
          }
         
          if (actualizar){
            dispatch( updatePuestoAction() );
          }else{
            dispatch( addPuestoAction(  ) );
          }
          setPuestoDialog(false);
          reset();
        
    }

	

    const header = (
		<div className="table-header">
			<h5 id="id_label_search" className="p-m-0">Listado de Puestos</h5>
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
        	<Button label="Borrar" icon="pi pi-check" className="p-button-text" onClick={()=>handleDeletePuesto()} />
    	</div>
	);
    
    const hideDeleteDialog = () =>{
        hideShowDeleteDialog(false);         
    }
          
      const showDeletePuesto = (id, nombre) =>{
        setNombrePuestoDelete(nombre);
        setIdPuestoDelete(id);
        hideShowDeleteDialog(true);
    }

    const hideShowDeleteDialog = (hideShow) =>{
          setDeleteDialogShow(hideShow);
    }

    const isFormValid = () =>{
    setError({});   
    let errorNombre = '';
    let errorDireccion = '';
    let errorEmail = '';
    
        if (nombre_puesto.trim().length === 0 ){
            errorNombre = 'El nombre es obligatorio';
        } 

        if (errorNombre){
            setError({errorNombre, errorDireccion, errorEmail, errorClass:'errorClass'});
            return false
        }
        return true;
    }

    const actionBodyTemplate = (rowData) => {
        
        return (

            <div className="actions" style={{width:"75px"}}>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editDlg(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={ ()=>showDeletePuesto(rowData.id, rowData.nombre_puesto) } />
            </div>
        );
    }
   
    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const FormatDate =(fecha) =>{
        return moment(fecha).format("DD/MM/YYYY"); 
    }

	return (
		<div>
			<div className="p-grid crud-demo">
				<div className="p-col-12">
					<div className="card">
						<Toast ref={toast} />
						<DataTable   value={puestos}   ref={dt} 
                        onSelectionChange={  (e) =>setPuestoActual(e.value) } 
						header="Small Table" 
							dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive p-datatable-sm"
							paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" globalFilter={globalFilter}
							currentPageReportTemplate="Showing {first} to {last} of {totalRecords} PUESTOs"
							emptyMessage="No existen registros"  header={header} selectionMode="single" 
							>
							<Column style={{width:"55%" }} field="nombre_puesto" header="Nombre del Puesto" sortable ></Column>
							<Column field="usrcre" header="Creado Por" sortable ></Column>
							<Column field="feccre" header="Fecha Creado"  sortable></Column>
							<Column field="usrmod" header="Modificado Por" sortable ></Column>
                            <Column field="fecmod" header="Fecha Modificado" sortable ></Column>
							<Column header="Acción" style={{ width:"5.6%" }} body={actionBodyTemplate} > </Column>
						</DataTable>

				   

		 	<Dialog visible={puestoDialog} style={{ width: '50%' }} header="Puesto" modal className="p-fluid" footer={footer} onHide={onHide}>
                <form  >


                    <div className="p-fluid p-formgrid p-grid">
            
                        <div className="p-field p-col-12 p-md-12 p-mt-3 ">
                            <label htmlFor="firstname">Nombre del Puesto</label>
                            <InputText name="nombre_puesto" type="text"  className =  { error.errorNombre?.length && error.errorClass }
                            onChange = { handleInputChange  } value ={ nombre_puesto }/>
                            <div style={{ fontSize:12, color:"red" }}> { error.errorNombre }</div>
                        </div>


                    </div>
                    
                </form>
           </Dialog>


           <Dialog visible={deleteDialogShow} style={{ width: '450px' }} header="Confirmación" modal footer={deleteDialogFooter} onHide={()=>hideShowDeleteDialog(false)}>
                       <div className="confirmation-content">
                           <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                           { <span>Esta seguro de borrar el registro :  <b style={{'color':'red'}}>{ nombrePuestoDelete }</b>?</span>}
                       </div>
           </Dialog>


					</div>
				</div>
			</div>
		</div>
	)
}
