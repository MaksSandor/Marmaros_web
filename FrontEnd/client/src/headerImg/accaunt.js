import React from "react";
import style from "./accStyle.module.css"

const id = null;

function checkSignIn()  {
    if (id === null) {
        return false;
    } else {
        return true;
    }
}

function SignInForm() {

    return (
        <div className={style.SignBlock}>
            <input className={style.gmailInput} placeholder="Your email"/>
            <input className={style.passInput} placeholder="Password"/>
            <button className={style.SignInBtn}>Увійти</button>
        </div>
    )
}

function RegisterForm() {

    return (
        <div className={style.RegBlock}>
            <input className={style.Pib} />
            <input className={style.gmailInput}/>
            <input className={style.passInput}/>
            <button>Зареєструватись</button>
        </div>
    )
}

export {checkSignIn, SignInForm, RegisterForm};