import style from "./style.module.css";
import React from "react";
import { Link } from 'react-router-dom';

function Location({ currentPage }) {
  return (
    <div className={style.breadcrumbWrapper}>
      <p className={style.breadcrumb}>
        <Link to="/">Головна</Link> / <span>{currentPage}</span>
      </p>
    </div>
  );
}

export default Location;