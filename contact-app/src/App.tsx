import React from "react";
import { Routes, Route } from "react-router-dom";
import AddContact from "./components/add-contact/AddContact.page";
import DeleteProduct from "./components/delete-product/DeleteProduct.page";
import EditProduct from "./components/edit-product/EditProduct.page";
import Contacts from "./components/contacts/Contacts.page";

const App: React.FC = () => {
   return (
      <div>

         <div className="wrapper">
            <Routes>
               <Route path="/" element={<Contacts />} />
               <Route path="/contacts">
                  <Route index element={<Contacts />} />
                  <Route path="add/" element={<AddContact />} />
                  <Route path="edit/:id?" element={<AddContact />} />
                  <Route path="delete/:id" element={<DeleteProduct />} />
               </Route>
            </Routes>
         </div>
      </div>
   );
};

export default App;
