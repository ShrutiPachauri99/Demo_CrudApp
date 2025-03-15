import { useState, useEffect } from "react";
import "./contacts.scss";
import { IContact } from "../../types/global.typing";
import { useNavigate, useLocation } from "react-router-dom";
import { contactAPI } from "../../services/contactService";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Tooltip } from "react-tooltip";
import { ToastContainer } from "react-toastify";
import Loader from "../../loader/loader";
import { Dialog } from "primereact/dialog";
import {toastSuccessPopup, hasValue , formatDate} from "../common"
 
const Contacts: React.FC = () => {
   const [contacts, setContacts] = useState<IContact[]>([]);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const location = useLocation();
   const [globalFilterValue, setGlobalFilterValue] = useState('');
   const [selectedContact, setSelectedContact] = useState(null);
    const [deleteContact, setDeleteContact] = useState(false);
   const onGlobalFilterChange = (x: { target: { value: any; }; }) => {
      let results = [];
      const value = x.target.value;
      if (value && value.trim().length > 2) {
        results = contacts.filter((x) => {
            return (
                (((hasValue(x.contactName) ? x.contactName.toLowerCase().includes(value.trim().toLowerCase()) : null) ||
                    (hasValue(x.contactEmail) ? x.contactEmail.toLowerCase().includes(value.trim().toLowerCase()) : null) ||
                    (hasValue(x.contactPhone) ? x.contactPhone.toLowerCase().includes(value.trim().toLowerCase()) : null) ||
                    (hasValue(x.contactPhone) ? formatDate(x.contactPhone).includes(value.trim().toLowerCase()) : null) 
                ))
            );
        });
    }
  };
   const navigate = useNavigate();
    
    const DeleteContact = async (contact:any) => {

        await contactAPI.deleteContact()
        .delete(contact)
        .then((res:any) => {
            if (res.status === 200) {
                // Handle success (e.g., show success message)
                console.log("Contact deleted successfully:", res.data);
            }
        })
        .catch((e: any) => {
            // Handle error (e.g., show error message)
            console.error("Error deleting contact:", e);
        });
        
}

      useEffect(() => {
         const fetchContacts = async () => {
            try {
               setIsLoading(true);
               await contactAPI.fetchContactsList().fetchAll().then((data) => {
                  setContacts(data.data);
               });
           } catch (error) {
            setIsLoading(false);
               console.log(error);
           }
           finally{
            setIsLoading(false);
           }
          };
       fetchContacts();
   }, []);
   const footerContentDeleteContact = (
    <div>
        <button onClick={() => setDeleteContact(false)} className="btn btn-secondary ms-2">No</button>
        <button onClick={() => { selectedContact && DeleteContact(selectedContact); setDeleteContact(false); }} className="btn btn-primary ms-2">Yes</button>
    </div>
);
  
  
   const renderActions = (rowData:any) => {
      return (
        <>
          <Tooltip id="edit" />
          <button
            className="border-0 bg-transparent text-primary"
            data-tooltip-id="edit"
            data-tooltip-content="edit"
            data-tooltip-place="top"
            data-tooltip-offset={3}
            onClick={() =>
              navigate("../contacts/add", { state: { contactId: rowData.contactId } })
            }
          >
            <i className="delete"></i>
            <span className="sr-only">Delete</span>
          </button>

          <Tooltip id="Delete" />
                <button
                    className="border-0 bg-transparent text-danger"
                    data-tooltip-id="Delete"
                    data-tooltip-content="Delet"
                    data-tooltip-place="right"
                    data-tooltip-offset={3}
                    onClick={() => { setSelectedContact(rowData); setDeleteContact(true); }}
                >
                    <i className="fas fa-trash"></i>
                    <span className="sr-only">Delete User</span>
                </button>
          
        </>
      );
    };
    

  return (
      <>
          <ToastContainer />
          {isLoading && <Loader />}
          <div className="dashboard">
              <div className="container">
                  <div className="card">
                        <div className="card-body">
                            <h1 className="mb-3"> Dashboard</h1>
                            <div className="col-lg-7 mb-3">
                                            <div className="d-flex justify-content-end align-items-center">
                                                {/* {<div className="border-end me-3">
                                                    <button className="btn btn-secondary me-3" type="button" onClick={() => GetFormDetailsCSV()}><i className="fas fa-download"></i> DOWNLOAD CSV</button>
                                                </div>} */}
                                                <span className="p-input-icon-left">
                                                    <i className="pi pi-search" />
                                                    <InputText
                                                        placeholder="Search"
                                                        className="form-control search-max-width"
                                                        aria-label="Search"
                                                        value={globalFilterValue}
                                                        onChange={onGlobalFilterChange}
                                                    />
                                                </span>
                                            </div>
                                        </div>
                            <div className="row mt-4">
                                <div className="col-md-12">
                                    <DataTable
                                        value={contacts}
                                        scrollable
                                        paginator
                                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                                        rows={10}
                                        emptyMessage="No Records Found."
                                    >
                                        <Column
                                            header="Action"
                                            body={(rowData) => renderActions(rowData)}
                                            style={{ minWidth: "80px", width: "80px" }}
                                        ></Column>
                                        <Column
                                            field="contactName"
                                            header="Contact Name"
                                            sortable
                                            style={{ minWidth: "120px", width: "120px" }}
                                        ></Column>
                                        <Column
                                            field="contactEmail"
                                            header="Contact Email"
                                            sortable
                                            style={{ minWidth: "100px", width: "100px" }}
                                        ></Column>
                                        <Column
                                            field="contactPhone"
                                            header="Contact Phone"
                                            sortable
                                            style={{ minWidth: "200px", width: "200px" }}
                                        ></Column>
                                        <Column
                                            field="contactAddress"
                                            header="Contact Address"
                                            sortable
                                            style={{ minWidth: "200px", width: "200px" }}
                                        ></Column>
                                         <Column
                                            field="contactBirthDate"
                                            header="Birth Date"
                                            sortable
                                            body={(x) => { return formatDate(x.contactBirthDate);}}
                                            style={{ minWidth: "200px", width: "200px" }}
                                        ></Column>
                                    </DataTable>
                                </div>
                                <Dialog header="Delete Confirmation" draggable={false} visible={deleteContact} style={{ width: '94%', maxWidth: '680px' }} onHide={() => { if (!deleteContact) return; setDeleteContact(false); }} footer={footerContentDeleteContact}>
                                    <p className="m-0">
                                        Are you sure you want to delete this Assistant from the application?
                                    </p>
                                </Dialog>
                            </div>
                        </div>
                    </div>
              </div>
          </div>
      </>
  );
};

export default Contacts;
