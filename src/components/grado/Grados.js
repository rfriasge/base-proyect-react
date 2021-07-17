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
import { addGradoAction, listarGradoAction, updateGradoAction, deleteGradoAction, updateGradoActual } from "./gradosDucks";
import moment from 'moment';

 

export const Grados = () => {

  
    const { grados, grado_actual } = useSelector(state => state.grado);
	
	
   const dispatch = useDispatch();
    const [ globalFilter, setGlobalFilter] = useState(null);
    const [ gradoDialog, setGradoDialog ] = useState(false);
    const [ gradoActual, setGradoActual] = useState(null);
    const { uid } = useSelector(state => state.login);
    const toast = useRef(null);
    const dt = useRef(null);
    const [actualizar, setActualizar] = useState(false);
    const [deleteDialogShow, setDeleteDialogShow] = useState(false);
    
    const [error, setError] = useState({
        errorDescripcion:'',
        errorInscripcion:'',
        errorColegiatura:'',
        errorClass:''       
    })

	const [ formValue, setFormValue, handleInputChange, reset ] = useForm({
    	descripcion:'',
		id:0,
		colegiatura:'',
		inscripcion:'',
		usrcre:'usrcre',
		feccre: new Date(),
		usrmod:'usrmod',
		fecmod: new Date()
	});
    
    useEffect(() => {
        dispatch(listarGradoAction(uid));
     }, [dispatch, uid]);

    const { descripcion,id,colegiatura, inscripcion, usrcre,feccre,usrmod,fecmod } = formValue;

    useEffect(() =>{
        dispatch( updateGradoActual(formValue));
    },[formValue]);
    
            
    const addDlg = (grado) =>{
        reset();
        setActualizar(false);
		setGradoDialog(true);
	}

    const editDlg = (grado) =>{
        setActualizar(true);
        actualizaGradoActual(grado);
 		setGradoDialog(true);
	}

    const deleteDlg = (grado) =>{
        actualizaGradoActual(grado);
        hideShowDeleteDialog(true);
	}

         
    const actualizaGradoActual = (grado) =>{
        setFormValue({
			descripcion: grado.descripcion,
			id: grado.id,
			colegiatura: parseFloat(grado.colegiatura).toFixed(2),
			inscripcion: parseFloat(grado.inscripcion).toFixed(2),
			usrcre: grado.usrcre,
			feccre: grado.feccre,
			usrmod: grado.usrmod,
			fecmod: grado.fecmod
        })
    }
	const onHide = (name) => {
        setError({});  
        reset();
        setGradoDialog(false);

    }

    const handleDeleteGrado = (_id) =>{
        dispatch(deleteGradoAction(_id));
        hideShowDeleteDialog(false);
    }
    
    const onSubmit = () =>{


		  if (!isFormValid()){
              return false;
          }
         
          if (actualizar){
            dispatch( updateGradoAction() );
          }else{
            dispatch( addGradoAction() );
          }
          setGradoDialog(false);
          reset();
        
    }

    const hideShowDeleteDialog = (hideShow) =>{
        setDeleteDialogShow(hideShow);
  }

  const isFormValid = () =>{
      setError({});   
      let errorDescripcion = '';
      let errorColegiatura = '';
      let errorInscripcion = '';
  
      if (descripcion.trim().length === 0 ){
          errorDescripcion = 'Descripción es obligatoria';
      } 

      if (errorDescripcion){
          setError({errorDescripcion, errorColegiatura, errorInscripcion, errorClass:'errorClass'});
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

  const formatCurrency = (value) => {
    return String(value).toLocaleString('en-US', { style: 'decimal', currency: 'DOP' });
  }


// Templates

    const header = (
		<div className="table-header">
			<h5 id="id_label_search" className="p-m-0">Listado de Grados</h5>
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
        	<Button label="Borrar" icon="pi pi-check" className="p-button-text" onClick={()=>handleDeleteGrado()} />
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
						<DataTable   value={grados}   ref={dt}  id="tbGrado"
                        onSelectionChange={  (e) =>setGradoActual(e.value) } 
						header="Small Table" 
							dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive p-datatable-sm"
							paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" globalFilter={globalFilter}
							currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Grados"
							emptyMessage="No existen registros"  header={header} selectionMode="single" 
							>
							<Column style={{width:"35%" }} field="descripcion" header="Descripción del Grado" sortable ></Column>
							{/*
                            <Column style={{width:"10%" }} field="colegiatura" header="Colegiatura" sortable body={currencyColegiaturaBodyTemplate}></Column>
							<Column style={{width:"10%" }} field="inscripcion" header="Inscripción" sortable body={currencyInscripcionBodyTemplate}></Column>
                        */}
							<Column style={{width:"10%" }} field="colegiatura" header="Colegiatura" sortable ></Column>
							<Column style={{width:"10%" }} field="inscripcion" header="Inscripción" sortable ></Column>                            
							<Column field="usrcre" header="Creado Por" sortable ></Column>
							<Column field="feccre" header="Fecha Creado"  sortable></Column>
							<Column field="usrmod" header="Modificado Por" sortable ></Column>
                            <Column field="fecmod" header="Fecha Modificado" sortable ></Column>
							<Column header="Acción" style={{ width:"5.6%" }} body={actionBodyTemplate} > </Column>
						</DataTable>

				   

		 	<Dialog visible={gradoDialog} style={{ width: '50%' }} header="Grado" modal className="p-fluid" footer={footer} onHide={onHide}>
                <form  >


                    <div className="p-fluid p-formgrid p-grid">
            
                        <div className="p-field p-col-12 p-md-12 p-mt-3 ">
                            <label htmlFor="firstname">Descripción del Grado</label>
                            <InputText  name="descripcion" type="text"  className =  { error.errorDescripcion?.length && error.errorClass } autoFocus 
                            onChange = { handleInputChange  } value ={ descripcion }/>
                            <div style={{ fontSize:12, color:"red" }}> { error.errorDescripcion }</div>
                        </div>

                        <div className="p-field p-col-12 p-md-6 p-mt-3 ">
                            <label htmlFor="inscripcion">Valor Inscripción</label>
                            <InputText  name="inscripcion" type="number"  className =  { error.errorInscripcion?.length && error.errorClass } pattern="^\d*(\.\d{0,2})?$" step="0.01" 
                            onChange = { handleInputChange  } value ={ inscripcion }/>
                            <div style={{ fontSize:12, color:"red" }}> { error.errorInscripcion }</div>
                        </div>

                        <div className="p-field p-col-12 p-md-6 p-mt-3 ">
                            <label htmlFor="colegiatura">Valor Colegiatura</label>
                            <InputText  name="colegiatura" type="number"  className =  { error.errorColegiatura?.length && error.errorClass } pattern="^\d*(\.\d{0,2})?$" step="0.01" 
                            onChange = { handleInputChange  } value ={ colegiatura }/>
                            <div style={{ fontSize:12, color:"red" }}> { error.errorColegiatura }</div>
                        </div>



                    </div>
                    
                </form>
           </Dialog>


           <Dialog visible={deleteDialogShow} style={{ width: '450px' }} header="Confirmación" modal footer={deleteDialogFooter} onHide={()=>hideShowDeleteDialog(false)}>
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
