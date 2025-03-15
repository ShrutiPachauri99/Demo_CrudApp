import { useState, useEffect } from "react";
import "./contacts.scss";
import { IContact } from "../../types/global.typing";
import { Button } from "@mui/material";
import { Edit, Delete,Add } from "@mui/icons-material";
import moment from "moment";
import { useNavigate, useLocation } from "react-router-dom";
import { contactAPI } from "../../services/contactService";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Tooltip } from "react-tooltip";
import { ToastContainer } from "react-toastify";
import Loader from "../../loader/loader";
function formatDate(dateString: string): string {
   const date = new Date(dateString);
 
   // Get the month, day, and year
   const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
   const day = String(date.getDate()).padStart(2, '0');
   const year = String(date.getFullYear()).slice(2); // Get last two digits of the year
 
   return `${month}/${day}/${year}`;
 }
 
const Contacts: React.FC = () => {
   const [contacts, setContacts] = useState<IContact[]>([]);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const location = useLocation();
   const [globalFilterValue, setGlobalFilterValue] = useState('');
   const onGlobalFilterChange = (e: { target: { value: any; }; }) => {
      let results = [];
      const value = e.target.value;
      if (value && value.trim().length > 2) {
         //  results = contacts.filter((x) => {
         //    (hasValue(x.studentName) ? x.studentName.toLowerCase().includes(globalFilterValue.trim().toLowerCase()) : null) ||
                       
         //  });
      }
  };
   const navigate = useNavigate();
  
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

   const renderActions = (rowData: { contactId: number; }) => {
      return (
        <>
          <Tooltip id="view" />
          <Tooltip id="edit" />
    
          <button
            className="border-0 bg-transparent text-primary"
            data-tooltip-id="edit"
            data-tooltip-content="edit"
            data-tooltip-place="top"
            data-tooltip-offset={3}
            onClick={() =>
              navigate("../add", { state: { contactId: rowData.contactId } })
            }
          >
            <i className="fas fa-eye"></i>
            <span className="sr-only">View</span>
          </button>
          {/* <button
            className="border-0 bg-transparent text-primary"
            data-tooltip-id="edit"
            data-tooltip-content="Edit"
            data-tooltip-place="top"
            data-tooltip-offset={3}
            onClick={() =>
               navigate("../AddContact", { state: { AppId: rowData.appId } })
                   
            }
          >
            <i className="fa-solid fa-pen"></i>
            <span className="sr-only">Edit</span>
          </button> */}
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
                                            body={(rowData: { contactId: number }) => renderActions(rowData)}
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
                                            //body={(x) => { formatDate(contactBirthDate)}}
                                            style={{ minWidth: "200px", width: "200px" }}
                                        ></Column>
                                    </DataTable>
                                </div>
                            </div>
                        </div>
                    </div>
              </div>
          </div>
      </>
  );
};

export default Contacts;
