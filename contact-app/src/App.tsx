import React from "react";
import { Routes, Route } from "react-router-dom";
import AddContact from "./components/add-contact/AddContact.page";
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
               </Route>
            </Routes>
         </div>
      </div>
   );
};

export default App;
