import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { Link } from "react-router-dom"
import { eventBusService } from "../services/event-bus.service"
import { doseUserExist, login, signup } from "../store/actions/user.actions"

export function Register({ type }) {
    const [registerInfo, setRegisterInfo] = useState({username: '', password: ''})

    const navigate = useNavigate()

    function handleChange(ev) {
        let { name: field, value, type } = ev.target
        if (type === 'string') value = value
        setRegisterInfo(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    async function onSignup(ev) {
        ev.preventDefault()
        try{
            if(await doseUserExist(registerInfo.fullname)) {
                eventBusService.showErrorMsg('User already exists.')
                return
            }

            const user = await signup(registerInfo.fullname, registerInfo.password)
            console.log("signup", user)
            navigate("/melodiva/home")
        } catch(err) {
            console.log(err)
            eventBusService.showErrorMsg('Faild to create user.')
        }
    }

    async function onLogin(ev) {
        ev.preventDefault()
        try{
            if(!await doseUserExist(registerInfo.fullname)) {
                eventBusService.showErrorMsg('User dosen\'t exists.')
                return
            }

            const user = await login(registerInfo.fullname, registerInfo.password)
            console.log("login", user)
            navigate("/melodiva/home")
        } catch(err) {
            console.log(err)
            eventBusService.showErrorMsg('Faild to login.')
        }
    }

    return(
        <div className="register">
            {type === "signup" ?
                <form className="content">
                    <h1>Sign up to Start Listening</h1>

                    <label htmlFor="register-name">Name</label>
                    <input className="input register-name" 
                        type="text" 
                        id="register-name"
                        name="fullname"
                        placeholder="Enter name"
                        defaultValue=''
                        maxLength="30"
                        onKeyDown={handleChange}
                        autoComplete="off"
                        required
                    />
                    <label htmlFor="register-password">Password</label>
                    <input className="input register-password" 
                        type="password" 
                        id="register-name"
                        name="password"
                        placeholder="Enter password"
                        minLength="4"
                        maxLength="30"
                        onKeyDown={handleChange}
                        autoComplete="off"
                        required
                    />

                    <button className="btn-submit" onClick={onSignup}>Sign In</button>
                    <div className="nav">
                        <p>Already have an account?</p>
                        <Link to="/melodiva/login">Log in here</Link>
                    </div>
                    
                </form>
                :
                <form className="content">
                    <h1>Log in to MeloDiva</h1>

                    <label htmlFor="register-name">Name</label>
                    <input className="input register-name" 
                        type="text" 
                        id="register-name"
                        name="fullname"
                        placeholder="Enter name"
                        defaultValue=''
                        maxLength="30"
                        onKeyDown={handleChange}
                        autoComplete="off"
                    />
                    <label htmlFor="register-password">Password</label>
                    <input className="input register-password" 
                        type="password" 
                        id="register-name"
                        name="password"
                        placeholder="Enter password"
                        minLength="4"
                        maxLength="30"
                        onKeyDown={handleChange}
                        autoComplete="off"
                        required
                    />

                    <button className="btn-submit" onClick={onLogin}>Log In</button>
                    <div className="nav">
                        <p>Don't have an account?</p>
                        <Link to="/melodiva/signup">Sign up here</Link>
                    </div>
                </form>
            }
        </div>
    )
}