import React, { Component } from "react";
import FormErrors from "../../FormErrors";
import Validate from "../../utility/FormValidation";
import { API } from "aws-amplify";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import Spinner from "../../utility/Spinner";

class AuditCreate extends Component {
  state = {
    auditName: "",
    selectedUsers: null,
    selectedProduct: null,
    loading: false,
    description: "",
    users: [],
    productList: [],
    errors: {
      cognito: null,
      blankfield: false
    }
  };

  clearErrorState = () => {
    this.setState({
      errors: {
        cognito: null,
        blankfield: false
      }
    });
  };

  handleChangeProduct = selectedProduct => {
    if (selectedProduct && selectedProduct.__isNew__) {
      this.createNewProduct(selectedProduct);
    } else {
      this.setState({ selectedProduct });
    }
  };

  handleChange = selectedUsers => {
    this.setState({ selectedUsers });
  };

  onInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
    document.getElementById(event.target.id).classList.remove("is-danger");
  };

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true });

    // Form validation
    this.clearErrorState();
    const error = Validate(event, this.state);
    if (error) {
      this.setState({
        errors: { ...this.state.errors, ...error }
      });
    }

    const userList =
      this.state.selectedUsers &&
      this.state.selectedUsers.map(({ value }) => value);
    let sk =
      "Product-" +
      this.state.selectedProduct.value +
      "-" +
      Date.now().toString();
    let date = new Date()
      .toGMTString()
      .split(" ")
      .join("-");
    try {
      await API.post("AuditApi", "/audits", {
        body: {
          pk: "Audit-Org-" + this.props.user.attributes["custom:organization"],
          sk: sk,
          name: this.state.auditName,
          product: this.state.selectedProduct.value,
          createdAt: new Date().toDateString(),
          createdBy: this.props.user.attributes.email,
          score: null,
          performerce: userList,
          description: this.state.description,
          auditDate: date
        }
      });
      this.props.history.push({
        pathname: `/performAudit/${sk}`,
        state: {
          productName: this.state.selectedProduct.value,
          auditDate: date,
          auditDesc:this.state.description
        }
      });
    } catch (error) {
      let err = null;
      !error.message ? (err = { message: error }) : (err = error);
      console.log(err);
      this.setState({
        loading: false,
        errors: {
          ...this.state.errors,
          cognito: err
        }
      });
    }
  };

  async fetchProductList() {
    this.setState({ loading: true });
    const orgData = "Org-" + this.props.user.attributes["custom:organization"];
    try {
      const response = await API.get(
        "ProductApi",
        "/products/Product/" + orgData
      );
      const options = response.map(item => {
        return { value: item.name, label: item.name };
      });
      this.setState({ productList: options });
    } catch (error) {
      let err = null;
      !error.message ? (err = { message: error }) : (err = error);
      this.setState({
        errors: {
          ...this.state.errors,
          cognito: err
        }
      });
    }
    this.setState({ loading: false });
  }

  async fetchUserList() {
    this.setState({ loading: true });
    const orgData = "Org-" + this.props.user.attributes["custom:organization"];
    try {
      const response = await API.get("UserApi", "/users/User/" + orgData);
      const options = response.map(item => {
        return { value: item.email, label: item.email };
      });
      this.setState({ users: options });
    } catch (error) {
      let err = null;
      !error.message ? (err = { message: error }) : (err = error);
      this.setState({
        errors: {
          ...this.state.errors,
          cognito: err
        }
      });
    }
    this.setState({ loading: false });
  }

  createNewProduct = async selectedProduct => {
    // Form validation
    this.clearErrorState();
    try {
      await API.post("ProductApi", "/products", {
        body: {
          pk: "Product",
          sk:
            "Org-" +
            this.props.user.attributes["custom:organization"] +
            "-" +
            Date.now().toString(),
          name: selectedProduct.value
        }
      });
      this.setState({ selectedProduct: selectedProduct });
    } catch (error) {
      let err = null;
      !error.message ? (err = { message: error }) : (err = error);
      this.setState({
        loading: false,
        errors: {
          ...this.state.errors,
          cognito: err
        }
      });
    }
  };

  canBeSubmitted() {
    const { auditName, selectedProduct } = this.state;
    return auditName.length > 0 && selectedProduct;
  }

  async componentDidMount() {
    await this.fetchProductList();
    await this.fetchUserList();
  }

  render() {
    const { selectedUsers, selectedProduct, productList } = this.state;
    const isEnabled = this.canBeSubmitted();
    return (
      <section className="section auth">
        <div className="container">
          
          <FormErrors formerrors={this.state.errors} />
          {!this.state.loading ? (
            <div>
            <h1>Create a new Audit</h1>
            <div className="row">
              <div className="col-md-6 col-lg-6 col-sm-12 col-xs-12">
                <form onSubmit={this.handleSubmit}>
                  <div className="field">
                    <p className="control">
                      <input
                        className="input"
                        type="text"
                        id="auditName"
                        aria-describedby="auditNameHelp"
                        placeholder="Enter AuditName"
                        value={this.state.auditName}
                        onChange={this.onInputChange}
                      />
                    </p>
                  </div>
                  <div className="field">
                    <p className="control">
                      <textarea
                        rows="5"
                        className="form-control"
                        type="text"
                        id="description"
                        aria-describedby="descriptionHelp"
                        placeholder="Description"
                        value={this.state.description}
                        onChange={this.onInputChange}
                      />
                    </p>
                  </div>
                  <div className="field">
                    <CreatableSelect
                      isClearable
                      value={selectedProduct}
                      noOptionsMessage={() => "Type to create a new product"}
                      onChange={this.handleChangeProduct}
                      placeholder={"select a product"}
                      options={productList}
                    />
                  </div>
                  <div className="field">
                    <Select
                      isMulti={true}
                      value={selectedUsers}
                      options={this.state.users}
                      placeholder={"add new users"}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="field">
                    <p className="control">
                      <button
                        disabled={!isEnabled}
                        className="button is-success"
                      >
                        Start
                      </button>
                    </p>
                  </div>
                </form>
              </div>
              <div className="col-md-6 col-lg-6 col-sm-12 col-xs-12 auditPerformanceDescription">
                <p style={{color:'#14cba8'}}>
                  You are about to perform a WPO audit. This consists of 20
                  senarios to validate the compliance of your product with WPO.
                  It will take approx 30 minutes to complete the audit.
                </p>
              </div>
            </div>
            </div>
          ) : (
            <Spinner />
          )}
        </div>
      </section>
    );
  }
}

export default AuditCreate;
