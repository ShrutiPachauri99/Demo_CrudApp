import React, { useState } from "react";
import "./add-contact.scss";
import { IContact } from "../../types/global.typing";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../constants/url.constant";
import axios from "axios"; 
import { ToastContainer } from "react-toastify";
import Loader from "../../loader/loader";
import { Calendar } from "primereact/calendar";
import { FormEvent } from "primereact/ts-helpers";

const AddContact: React.FC = () => {
   const [contact, setContact] = React.useState<Partial<IContact>>({ contactName: "", contactEmail: "",contactBirthDate: new Date() });
   const navigate = useNavigate();
   var date = new Date();
   const [contactData, setContactData] = useState({
      contactId: 0,
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      contactAddress: "",
      contactBirthDate: null
  });
   const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
      setContact({
         ...contact,
         [event.target.name]: event.target.value,
      });
   };
   const dateChange = (newVal : Date|null) => {
      setContact({
         ...contact,
        //ontactBirthDate : newVal,
      });
   };

   const handleSaveBtnClick = () => {
      if (contact.contactName === "" || contact.contactEmail === "") {
         alert("Enter Values");
         return;
      }

      const data: Partial<IContact> = {
         contactName: contact.contactName,
         contactEmail: contact.contactEmail,
      };
      axios
         .post(baseUrl, data)
         .then((resposne) => navigate("/contacts", { state: { message: "Contact Created Successfully" } }))
         .catch((error) => alert("Error"));
   };

   const handleStartDate = (evt:any) => {
      const startDT = evt.value;
     
          setStartDate(evt.value);
  }
  const [startDate, setStartDate] = useState(new Date(date.setHours(9, 0)));
  const [loading, setLoading] = useState(false);
   return (
      <>
          <ToastContainer />
          {loading && <Loader />}
          <div>
              <div className="container">
                  <div className="row">
                      <div className="col-md-12 mb-3">
                          <div className="d-flex align-items-center">
                              <div className="back">
                                  <button
                                      className="me-2" onClick={() =>
                                          navigate("../Contacts")
                                      }
                                  >
                                      <i className="fas fa-angle-double-left"></i>
                                      <span className="sr-only">
                                          Back to Dashboard
                                      </span>
                                  </button>
                              </div>
                              <h2 className="mb-0 text-white">
                                  Back
                              </h2>
                          </div>
                      </div>
                  </div>
                  <div className="card">
                      <div className="card-body">
                          <div className="row">
                              <div className="col-md-12">
                                  <h2 className="font-weight-medium mb-3 border-bottom">Contact Information</h2>
                              </div>
                              <div className="col-md-4">
                                  <div className="mb-3">
                                      <label htmlFor="nsheId">Contact Name <span className="required-star" ></span></label>
                                      <div className="col-md-4">
                                  <div className="mb-3">
                                      <label htmlFor="contactName">Contact Name <span className="required-star" ></span></label>
                                      <input type="text" id="contactName" className="form-control" aria-required="true" placeholder="Contact Name"
                                          value={contactData.contactName}
                                          disabled autoComplete="off" maxLength={100} />
                                  </div>
                              </div>
                                  </div>
                              </div>
                              <div className="col-md-4">
                                  <div className="mb-3">
                                      <label htmlFor="contactEmail">Contact Email <span className="required-star" ></span></label>
                                      <div className="col-md-4">
                                  <div className="mb-3">
                                      <label htmlFor="contactEmail">Contact Email <span className="required-star" ></span></label>
                                      <input type="text" id="firstName" className="form-control" aria-required="true" placeholder="Contact Email"
                                          value={contactData.contactEmail}
                                          disabled autoComplete="off" maxLength={100} />
                                  </div>
                              </div>
                                  </div>
                              </div>
                              <div className="col-md-4">
                                  <div className="mb-3">
                                      <label htmlFor="contactAddress">contactAddress <span className="required-star" ></span></label>
                                      <div className="col-md-4">
                                  <div className="mb-3">
                                      <label htmlFor="contactAddress">Contact Address <span className="required-star" ></span></label>
                                      <input type="text" id="contactAddress" className="form-control" aria-required="true" placeholder="Contact Address"
                                          value={contactData.contactAddress}
                                          disabled autoComplete="off" maxLength={100} />
                                  </div>
                              </div>
                                  </div>
                              </div>
                              <div className="col-md-4">
                                  <div className="mb-3">
                                      <label htmlFor="contactPhone">Email <span className="required-star" ></span></label>
                                      <div className="col-md-4">
                                  <div className="mb-3">
                                      <label htmlFor="contactPhone">First Name <span className="required-star" ></span></label>
                                      <input type="text" id="contactPhone" className="form-control" aria-required="true" placeholder="Contact Phone"
                                          value={contactData.contactPhone}
                                          disabled autoComplete="off" maxLength={100} />
                                  </div>
                              </div>
                                  </div>
                              </div>
                              <div className="col-md-4">
                                  <div className="mb-3">
                                      <label htmlFor="startTime">Start Time <span className="required-star" ></span></label>
                                      <Calendar className="w-100" inputId="startTime"
                                         value={startDate} onChange={(e) => handleStartDate(e)} showIcon showTime dateFormat="mm/dd/yy" hourFormat="12" stepMinute={5}
                                          placeholder="Select Start Time" appendTo="self" />
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </>
  );
};

export default AddContact;
