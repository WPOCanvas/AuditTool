// import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import './App.css';
// import Navbar from './components/Navbar';
// import Home from './components/Home';
// import LogIn from './components/auth/LogIn';
// import Register from './components/auth/Register';
// import ForgotPassword from './components/auth/ForgotPassword';
// import ForgotPasswordVerification from './components/auth/ForgotPasswordVerification';
// import ChangePassword from './components/auth/ChangePassword';
// import ChangePasswordConfirm from './components/auth/ChangePasswordConfirm';
// import Welcome from './components/auth/Welcome';
// import Footer from './components/Footer';
// import { Auth } from 'aws-amplify';
// import { library } from '@fortawesome/fontawesome-svg-core';
// import { faEdit } from '@fortawesome/free-solid-svg-icons';
// import NewUser from './components/users/NewUser';
// import Amplify from 'aws-amplify';
// import awsconfig from './aws-exports';
// Amplify.configure(awsconfig);
// library.add(faEdit);

// class App extends Component {

//   state = {
//     isAuthenticated: false,
//     isAuthenticating: true,
//     user: null
//   }

//   setAuthStatus = authenticated => {
//     this.setState({ isAuthenticated: authenticated });
//   }

//   setUser = user => {
//     this.setState({ user: user });
//   }

//   async componentDidMount() {
//     try {
//       const session = await Auth.currentSession();
//       this.setAuthStatus(false);
//       console.log(session);
//       const user = await Auth.currentAuthenticatedUser();
//       this.setUser({user});
//     } catch(error) {
//       if (error !== 'No current user') {
//         console.log(error);
//       }
//     }

//     this.setState({ isAuthenticating: false });
//   }

//   render() {
//     const authProps = {
//       isAuthenticated: this.state.isAuthenticated,
//       user: this.state.user,
//       setAuthStatus: this.setAuthStatus,
//       setUser: this.setUser
//     }
//     return (
//       !this.state.isAuthenticating &&
//       <div className="App">
//         <Router>
//           <div>
//             <Navbar auth={authProps} />
//             <Switch>
//               <Route exact path="/" render={(props) => <Home {...props} auth={authProps} />} />
//               <Route exact path="/login" render={(props) => <LogIn {...props} auth={authProps} />} />
//               <Route exact path="/register" render={(props) => <Register {...props} auth={authProps} />} />
//               <Route exact path="/forgotpassword" render={(props) => <ForgotPassword {...props} auth={authProps} />} />
//               <Route exact path="/forgotpasswordverification" render={(props) => <ForgotPasswordVerification {...props} auth={authProps} />} />
//               <Route exact path="/changepassword" render={(props) => <ChangePassword {...props} auth={authProps} />} />
//               <Route exact path="/changepasswordconfirmation" render={(props) => <ChangePasswordConfirm {...props} auth={authProps} />} />
//               <Route exact path="/welcome" render={(props) => <Welcome {...props} auth={authProps} />} />
//               <Route exact path="/newUser" render={(props) => <NewUser {...props} auth={authProps} />} />
//             </Switch>
//             <Footer />
//           </div>
//         </Router>
//       </div>
//     );
//   }
// }

// export default App;

import React, { Component } from "react"; import List from "./List"; import Details from "./Details";
import Amplify, { API } from "aws-amplify"; import aws_exports from "./aws-exports";
import { withAuthenticator } from "aws-amplify-react";
Amplify.configure(aws_exports);
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      title: "",
      list: [],
      item: {},
      showDetails: false
    };
  }
  async componentDidMount() {
    await this.fetchList();
  } handleChange = event => {
    const id = event.target.id;
    this.setState({ [id]: event.target.value });
  };
  handleSubmit = async event => {
    event.preventDefault();
    await API.post("itemApi", "/items", {
      body: {
        id: Date.now().toString(),
        title: this.state.title,
        content: this.state.content
      }
    });
    this.setState({ content: "", title: "" });
    this.fetchList();
  }; async fetchList() {
    const response = await API.get("itemApi", "/items");
    this.setState({ list: [...response] });
  }
  loadDetailsPage = async id => {
    const response = await API.get("itemApi", "/items/" + id);
    this.setState({ item: { ...response }, showDetails: true });
  };
  loadListPage = () => {
    this.setState({ showDetails: false });
  };
  delete = async id => {
    //TODO: Implement functionality  
  };
  render() {
    return (
      <div className="container">
        <form onSubmit={this.handleSubmit}>
          <legend>Add</legend>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              placeholder="Title"
              value={this.state.title}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              className="form-control"
              id="content"
              placeholder="Content"
              value={this.state.content}
              onChange={this.handleChange} />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
        <hr />
        {this.state.showDetails ?
          (<Details item={this.state.item}
            loadListPage={this.loadListPage}
            delete={this.delete} />) : (<List list={this.state.list}
              loadDetailsPage={this.loadDetailsPage} />)}
      </div>);
  }
}
export default withAuthenticator(App, true);
