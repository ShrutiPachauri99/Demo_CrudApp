import { useState, useEffect, SetStateAction } from "react";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toastSuccessPopup, hasValue, formatDate } from "../common";

const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [dashboard, setDashboard] = useState<IContact[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const location = useLocation();
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [deleteContact, setDeleteContact] = useState(false);
  const navigate = useNavigate();
  //Search Region
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (value && value.trim().length >= 1) {
      setGlobalFilterValue(value);
      const filteredResults = dashboard.filter((contact) => {
        return (
          (hasValue(contact.contactName) &&
            contact.contactName.toLowerCase().includes(value.toLowerCase())) ||
          (hasValue(contact.contactEmail) &&
            contact.contactEmail.toLowerCase().includes(value.toLowerCase())) ||
          (hasValue(contact.contactAddress) &&
            contact.contactAddress
              .toLowerCase()
              .includes(value.toLowerCase())) ||
          (hasValue(contact.contactPhone) &&
            String(contact.contactPhone)
              .toLowerCase()
              .includes(value.toLowerCase()))
        );
      });

      setContacts(filteredResults);
    } else {
      setGlobalFilterValue("");
      setContacts(dashboard);
    }
  };
  //Delete Region
  const DeleteContact = async (contact: any) => {
    await contactAPI
      .deleteContact()
      .delete(contact)
      .then((res: any) => {
        if (res.status === 200) {
          console.log("Contact deleted successfully:", res.data);
        }
      })
      .catch((e: any) => {
        console.error("Error deleting contact:", e);
      });
  };

  const footerContentDeleteContact = (
    <div>
      <button
        onClick={() => setDeleteContact(false)}
        className="btn btn-secondary ms-2"
      >
        No
      </button>
      <button
        onClick={() => {
          selectedContact && DeleteContact(selectedContact);
          setDeleteContact(false);
        }}
        className="btn btn-primary ms-2"
      >
        Yes
      </button>
    </div>
  );
  //Initial loading
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true);
        await contactAPI
          .fetchContactsList()
          .fetchAll()
          .then((data) => {
            setContacts(data.data);
            setDashboard(data.data);
          });
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const renderActions = (rowData: any) => {
    return (
      <div style={{ display: "inline-flex", alignItems: "center", gap: "2px" }}>
        {/* Edit Button */}
        <Tooltip id="edit" />
        <button
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            padding: "1px",
            margin: "1px",
          }}
          data-tooltip-id="edit"
          data-tooltip-content="Edit"
          data-tooltip-place="top"
          data-tooltip-offset={3}
          onClick={() =>
            navigate("../contacts/add", {
              state: { contactId: rowData.contactId },
            })
          }
        >
          <FontAwesomeIcon
            icon={faPen}
            style={{ color: "blue", fontSize: "14px" }}
          />
        </button>

        {/* Delete Button */}
        <Tooltip id="Delete" />
        <button
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            padding: "1px",
            margin: "1px",
          }}
          data-tooltip-id="Delete"
          data-tooltip-content="Delete"
          data-tooltip-place="right"
          data-tooltip-offset={3}
          onClick={() => {
            setSelectedContact(rowData);
            setDeleteContact(true);
          }}
        >
          <FontAwesomeIcon
            icon={faTrash}
            style={{ color: "red", fontSize: "14px" }}
          />
        </button>
      </div>
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
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="mb-0">Contact Dashboard</h1>
                <div className="col-lg-7">
                  <div className="d-flex justify-content-end align-items-center">
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
              </div>

              <div className="row mt-4">
                <div className=" mb-4 col-md-12">
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
                      style={{
                        minWidth: "80px",
                        width: "80px",
                        textAlign: "left",
                      }}
                    ></Column>
                    <Column
                      field="contactName"
                      header="Contact Name"
                      sortable
                      style={{
                        minWidth: "120px",
                        width: "120px",
                        textAlign: "left",
                      }}
                    ></Column>
                    <Column
                      field="contactEmail"
                      header="Contact Email"
                      sortable
                      style={{
                        minWidth: "100px",
                        width: "100px",
                        textAlign: "left",
                      }}
                    ></Column>
                    <Column
                      field="contactPhone"
                      header="Contact Phone"
                      sortable
                      style={{
                        minWidth: "200px",
                        width: "200px",
                        textAlign: "left",
                      }}
                    ></Column>
                    <Column
                      field="contactAddress"
                      header="Contact Address"
                      sortable
                      style={{
                        minWidth: "200px",
                        width: "200px",
                        textAlign: "left",
                      }}
                    ></Column>
                    <Column
                      field="contactBirthDate"
                      header="Birth Date"
                      sortable
                      body={(x) => {
                        return formatDate(x.contactBirthDate);
                      }}
                      style={{
                        minWidth: "200px",
                        width: "200px",
                        textAlign: "left",
                      }}
                    ></Column>
                  </DataTable>
                </div>
                <Dialog
                  header="Delete Confirmation"
                  draggable={false}
                  visible={deleteContact}
                  style={{
                    width: "94%",
                    maxWidth: "680px",
                    backgroundColor: "#787878",
                    color: "white",
                    margin: "20px",
                  }}
                  onHide={() => {
                    if (!deleteContact) return;
                    setDeleteContact(false);
                  }}
                  footer={footerContentDeleteContact}
                >
                  <p className="m-0">
                    Are you sure you want to delete this contact from the
                    application?
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
