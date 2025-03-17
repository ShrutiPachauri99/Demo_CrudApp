//We use this compnent to both add-edit contact form
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../loader/loader";
import { Calendar } from "primereact/calendar";
import { contactAPI } from "../../services/contactService";
import { toastSuccessPopup } from "../common";
const AddContact: React.FC = () => {
  const navigate = useNavigate();
  const params = useLocation();
  const hasEdited = useRef(false);
  const [isEdit, setIsEdit] = useState(false);
  const [birthDate, setBirthDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contactData, setContactData] = useState({
    contactId: 0,
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    contactAddress: "",
    contactBirthDate: new Date(),
  });

  //Submit form
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    //Validations
    if (!contactData.contactName) {
      toast.error("Please enter Contact Name!");
      return;
    }
    if (!contactData.contactEmail) {
      toast.error("Please enter Contact Email!");
      return;
    }
    if (contactData.contactEmail && !validateEmail(contactData.contactEmail)) {
      toast.error("Please enter valid Contact Email!");
      return;
    }

    if (!contactData.contactAddress) {
      toast.error("Please enter Contact Address!");
      return;
    }

    if (!contactData.contactPhone) {
      toast.error("Please enter Contact Phone!");
      return;
    }
    if (contactData.contactPhone && contactData.contactPhone.length !== 10) {
      toast.error("Please enter 10 valid number for phone!");
      return;
    }
    const formData = new FormData();

    const data = {
      contactId: contactData.contactId ? contactData.contactId : 0,
      contactName: contactData.contactName,
      contactEmail: contactData.contactEmail,
      contactAddress: contactData.contactAddress,
      contactPhone: contactData.contactPhone,
      contactBirthDate: birthDate,
    };
    if (!isEdit) {
      setIsLoading(true);
      await contactAPI
        .createContact()
        .create(contactData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setIsLoading(false);
          if (res.data) {
            toastSuccessPopup(
              "Contact created Sucessfully",
              false,
              "../../Contacts"
            );
            console.log("Contact created successfully with ID:", res.data);
          } else {
            console.error("Error:", res.data);
          }
        })
        .catch((e) => {
          console.error("Error during request:", e);
        });
    } else {
      setIsLoading(true);
      await contactAPI
        .updateContact()
        .update(contactData, {
          headers: {
            "Content-Type": "application/json", // Ensure you are sending JSON
          },
        })
        .then((res) => {
          setIsLoading(false);
          if (res.data) {
            console.log("Contact updated successfully with ID:", res.data);
            toastSuccessPopup(
              "Contact Updated Sucessfully",
              false,
              "../../Contacts"
            );
          } else {
            console.error("Error:", res.data);
          }
        })
        .catch((e) => {
          console.error("Error during request:", e);
        });
    }
  };
  const handleBirthDate = (evt: any) => {
    setBirthDate(evt.value);
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    setContactData({
      ...contactData,
      [name]: event.target.value,
    });
  };
  //Email Validation
  const validateEmail = (email: any) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  //Handle editing of data
  const editFormData = async (contactId: number) => {
    setIsLoading(true);
    contactAPI
      .getContact()
      .fetchAll(contactId)
      .then(async (response) => {
        setIsLoading(false);
        setContactData(response.data);
        setIsEdit(true);
      });
  };
  useEffect(() => {
    //we check whether it is a new form or edit form based upon we do either editing or adding
    const contactId = params?.state?.contactId; // Optional chaining to prevent errors
    if (contactId !== undefined) {
      editFormData(Number(contactId));
      hasEdited.current = true;
    }
  }, []);

  return (
    <>
      <ToastContainer />
      {isLoading && <Loader />}
      <div>
        <div className="container">
          <div className="row">
            <div className="col-md-12 mb-3">
              <div className="d-flex align-items-center">
                <div className="back">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("../../Contacts")}
                  >
                    Back
                  </button>
                </div>
                <h2 className="mb-0 text-white">Back</h2>
              </div>
            </div>
          </div>
          <div className="custom-card-container">
            <div className="custom-card">
              <div className="custom-card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-12">
                      <h2 className="font-weight-medium mb-3 border-bottom text-center">
                        Contact Information
                      </h2>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="contactName">
                          Contact Name <span className="required-star"></span>
                        </label>
                        <input
                          type="text"
                          id="contactName"
                          className="form-control"
                          aria-required="true"
                          placeholder="Contact Name"
                          value={contactData.contactName}
                          name="contactName"
                          onChange={handleInputChange}
                          autoComplete="off"
                          maxLength={100}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="contactEmail">
                          Contact Email <span className="required-star"></span>
                        </label>
                        <input
                          type="text"
                          id="contactEmail"
                          className="form-control"
                          aria-required="true"
                          placeholder="Contact Email"
                          value={contactData.contactEmail}
                          name="contactEmail"
                          onChange={handleInputChange}
                          autoComplete="off"
                          maxLength={100}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="contactAddress">
                          Contact Address{" "}
                          <span className="required-star"></span>
                        </label>
                        <input
                          type="text"
                          id="contactAddress"
                          className="form-control"
                          aria-required="true"
                          placeholder="Contact Address"
                          value={contactData.contactAddress}
                          name="contactAddress"
                          onChange={handleInputChange}
                          autoComplete="off"
                          maxLength={100}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="contactPhone">
                          Contact Phone <span className="required-star"></span>
                        </label>
                        <input
                          type="text"
                          id="contactPhone"
                          className="form-control"
                          aria-required="true"
                          placeholder="Contact Phone"
                          value={contactData.contactPhone}
                          name="contactPhone"
                          onChange={handleInputChange}
                          autoComplete="off"
                          maxLength={100}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="birthDate">
                          Birth Date <span className="required-star"></span>
                        </label>
                        <Calendar
                          className=" w-100"
                          inputId="BirthDate"
                          name="birthDate"
                          value={birthDate}
                          onChange={(e) => handleBirthDate(e)}
                          showIcon
                          dateFormat="mm/dd/yy"
                          hourFormat="12"
                          placeholder="Birth Date"
                          appendTo="self"
                        />
                      </div>
                    </div>
                    <div className="col-md-12 d-flex justify-content-center gap-2">
                      {!isEdit && (
                        <button
                          type="submit"
                          value="Add"
                          className="btn btn-primary"
                        >
                          Add
                        </button>
                      )}
                      {isEdit && (
                        <button
                          type="submit"
                          value="Update"
                          className="btn btn-primary"
                        >
                          Update
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddContact;
