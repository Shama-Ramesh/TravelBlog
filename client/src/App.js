import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminRoute from "./Modules/admin/Route/AdminRoute";
import UserRoute from "./Modules/user/Route/UserRoute";
import SliderLoginForm from "./Modules/user/component/Pages/SliderLoginForm";



function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/*" element={<AdminRoute />} />
          <Route path="/user/*" element={<UserRoute />} />
          <Route path="/user/SliderLoginForm" element={<SliderLoginForm />} />
          

        </Routes>
        
      </BrowserRouter>
    </div>
  );
}

export default App;
