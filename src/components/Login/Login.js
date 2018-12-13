import React, { Component } from 'react';
import logo from './communityBank.svg';
import './Login.css';
import axios from 'axios';
class Login extends Component {
    constructor() {
        super()
        this.state = {
            email: '',
            password: '',
        }
        this.signUp = this.signUp.bind(this);
        this.login = this.login.bind(this);
    }
    async login(){
        let {email,password} = this.state;
        let res = await axios.post('/auth/login', {email,password})
        this.setState({email: '', password: ''});
        if(res.data.loggedIn){
            this.props.history.push('/private')
        };
    }
    async signUp(){
        let {email,password} = this.state;
        let res = await axios.post('/auth/signup', {email,password})
        this.setState({email: '', password: ''})
        if(res.data.loggedIn){
            this.props.history.push('/private')
        };
    }
    render() {
        return (
            <div className='login-wrapper'>
                <img src={logo} alt='hi' />
                <p>Email:
                     <input value={this.state.email} onChange={(e) => { this.setState({ email: e.target.value }) }} type='text' />
                </p>
                <p>Pasword:
                    <input value={this.state.password} onChange={(e) => { this.setState({ password: e.target.value }) }} type='password' />
                </p>
                <button className='log-button' onClick={this.login}>Login</button>
                <button className='log-button' onClick={this.signUp}>Signup</button>
            </div>
        )
    }
}
export default Login;