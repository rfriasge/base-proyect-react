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
import { useForm } from '../../hooks/useForm';
import CurrencyInput from 'react-currency-masked-input'
import { addHorarioAction, listarHorarioAction, updateHorarioAction, deleteHorarioAction, updateHorarioActual } from "./HorariosDucks";
import moment from 'moment';

 

export const Horarios = () => {

  
    const { horarios, horario_actual } = useSelector(state => state.horario);
	
	
   const dispatch = useDispatch();
    const [ globalFilter, setGlobalFilter] = useState(null);
    const [ horarioDialog, setHorarioDialog ] = useState(false);
    const [ horarioActual, setHorarioActual] = useState(null);
    const { uid } = useSelector(state => state.login);
    const toast = useRef(null);
    const dt = useRef(null);
    const [actualizar, setActualizar] = useState(false);
    const [deleteDialogShow, setDeleteDialogShow] = useState(false);
    
    const [error, setError] = useState({
        errorDescripcion:'',
        errorClass:''       
    })

	const [ formValue, setFormValue, handleInputChange, reset ] = useForm({
    	descripcion:'',
		id:0,
		usrcre:'usrcre',
		feccre: new Date(),
		usrmod:'usrmod',
		fecmod: new Date()
	});
    
    useEffect(() => {
        dispatch(listarHorarioAction(uid));
     }, [dispatch, uid]);

    const { descripcion,id, usrcre,feccre,usrmod,fecmod } = formValue;

    useEffect(() =>{
        dispatch( updateHorarioActual(formValue));
    },[formValue]);
    
            
    const addDlg = () =>{
        reset();
        setActualizar(false);
		setHorarioDialog(true);
	}

    const editDlg = (horario) =>{
        setActualizar(true);
        actualizaHorarioActual(horario);
 		setHorarioDialog(true);
	}

    const deleteDlg = (horario) =>{
        actualizaHorarioActual(horario);
        hideShowDeleteDialog(true);
	}

         
    const actualizaHorarioActual = (horario) =>{
        setFormValue({
			descripcion: horario.descripcion,
			id: horario.id,
			usrcre: horario.usrcre,
			feccre: horario.feccre,
			usrmod: horario.usrmod,
			fecmod: horario.fecmod
        })
    }
	const onHide = (name) => {
        setError({});  
        reset();
        setHorarioDialog(false);

    }

    const handleDeleteHorario = (_id) =>{
        dispatch(deleteHorarioAction(_id));
        hideShowDeleteDialog(false);
    }
    
    const onSubmit = () =>{


		  if (!isFormValid()){
              return false;
          }
         
          if (actualizar){
            dispatch( updateHorarioAction() );
          }else{
            dispatch( addHorarioAction() );
          }
          setHorarioDialog(false);
          reset();
        
    }

    const hideShowDeleteDialog = (hideShow) =>{
        setDeleteDialogShow(hideShow);
  }

  const isFormValid = () =>{
      setError({});   
      let errorDescripcion = '';
  
      if (descripcion.trim().length === 0 ){
          errorDescripcion = 'Descripción es obligatoria';
      } 

      if (errorDescripcion){
          setError({errorDescripcion, errorClass:'errorClass'});
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
			<h5 id="id_label_search" className="p-m-0">Listado de Horarios</h5>
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
        	<Button label="Borrar" icon="pi pi-check" className="p-button-text" onClick={()=>handleDeleteHorario()} />
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

  return (
		<div>
			<div className="p-grid crud-demo">
				<div className="p-col-12">
					<div className="card">
						<Toast ref={toast} />
						<DataTable   value={horarios}   ref={dt}  id="tbHorario"
                        onSelectionChange={  (e) =>setHorarioActual(e.value) } 
						header="Small Table" 
							dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive p-datatable-sm"
							paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" globalFilter={globalFilter}
							currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Grados"
							emptyMessage="No existen registros"  header={header} selectionMode="single" 
							>
							<Column style={{width:"50%" }} field="descripcion" header="Descripción Horario" sortable ></Column>
							<Column field="usrcre" header="Creado Por" sortable ></Column>
							<Column field="feccre" header="Fecha Creado"  sortable></Column>
							<Column field="usrmod" header="Modificado Por" sortable ></Column>
                            <Column field="fecmod" header="Fecha Modificado" sortable ></Column>
							<Column header="Acción" style={{ width:"5.6%" }} body={actionBodyTemplate} > </Column>
						</DataTable>

				   

		 	<Dialog visible={horarioDialog} style={{ width: '30%' }} header="Horario" modal className="p-fluid" footer={footer} onHide={onHide}>
                <form  >


                    <div className="p-fluid p-formgrid p-grid">
            
                        <div className="p-field p-col-12 p-md-12 p-mt-3 ">
                            <label htmlFor="descripcion">Descripción de la Horario</label>
                            <InputText  name="descripcion" type="text"  className =  { error.errorDescripcion?.length && error.errorClass } autoFocus 
                            onChange = { handleInputChange  } value ={ descripcion }/>
                            <div style={{ fontSize:12, color:"red" }}> { error.errorDescripcion }</div>
                        </div>

                    </div>
                    
                </form>
           </Dialog>


           <Dialog visible={deleteDialogShow} style={{ width: '30%' }} header="Confirmación" modal footer={deleteDialogFooter} onHide={()=>hideShowDeleteDialog(false)}>
                       <div className="confirmation-content">
                           <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                           { <span>Esta seguro de borrar el registro :  <b style={{'color':'red'}}>{ descripcion }</b>?</span>}
                       </div>
           </Dialog>


					</div>
				</div>
			</div>
		</div>
	)

}
