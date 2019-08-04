import React from "react";
import {Mutation} from "react-apollo";
import {SIGNUP_USER} from '../../queries/index';
import Error from '../error';
import { withRouter } from 'react-router-dom';

const initialState = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: ""
}

class Signup extends React.Component{
    state = {...initialState}
    clearState = () =>{
        this.setState({...initialState});
    }

    handleChange = (e)=>{
        const { name, value } = e.target;
        this.setState({[name]:value})
    }

    handleSubmit = (e, signUpUser)=>{
        e.preventDefault();
        signUpUser().then(async ({data}) => {
            console.log(data)
            localStorage.setItem('token', data.signUpUser.token);
            await this.props.refetch();
            this.clearState();
            this.props.history.push('/');
        })
    }
    validateForm = () =>{
        const {username, email, password, passwordConfirmation} = this.state;
        const isInvalid = !username || !email || !password || password !== passwordConfirmation;
        return isInvalid;
    }
    render(){
        const {username, email, password, passwordConfirmation} = this.state;
        return(
            <div className = "App">
                <h2 className="form">Signup</h2>
                <Mutation mutation={SIGNUP_USER} variables={{username, email, password}}>
                    {(signUpUser, {data, loading, error})=> {
                        return (
                            <form className="form" onSubmit={e => this.handleSubmit(e, signUpUser)} >
                                <input value={username} onChange={this.handleChange} type="text" name="username" placeholder="Username"></input>
                                <input value={email} onChange={this.handleChange} type="email" name="email" placeholder="Email Address"></input>
                                <input value={password} onChange={this.handleChange} type="password" name="password" placeholder="Password"></input>
                                <input value={passwordConfirmation} onChange={this.handleChange} type="password" name="passwordConfirmation" placeholder="Confirm Passowrd"></input>
                                <button disabled={loading || this.validateForm()} type="submit" className="button-primary">Submit</button>
                                {error && <Error error ={error}/>}
                            </form>
                        )
                    }}

                </Mutation>
            </div>
        )
    }
}

export default withRouter(Signup);