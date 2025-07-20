import React from "react";
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import AboutPage from "./AboutPage/AboutPage";
import MainPage from "./MainPage/MainPage";
import TourPage from "./ToursPage/ToursPage";
import TourDetailsPage from "./ToursPage/TourDetailsPage";
import Profile from "./headerImg/profile";

function App() {

    return (
        <Router>
            <nav>
                <Link to="/"></Link>
                <Link to="/tours"></Link>
                <Link to="/about"></Link>
            </nav>

            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/tours" element={<TourPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/tours/:name" element={<TourDetailsPage />} />
                <Route path="/:PIB" element={<Profile />} />
            </Routes>
        </Router>
    )
}

export default App;