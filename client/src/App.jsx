import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import CreateListing from "./pages/CreateListing";
import SignIn from "./pages/SignIn";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import UpdateListing from "./pages/UpdateListing";

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/about' element={<About />} />
                <Route path='/sign-up' element={<SignUp />} />
                <Route path='/sign-in' element={<SignIn />} />
                <Route element={<PrivateRoute />}>
                    <Route path='/profile' element={<Profile />} />
                    <Route path='/create-listing' element={<CreateListing />} />
                    <Route
                        path='/update-listing/:listingId'
                        element={<UpdateListing />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
