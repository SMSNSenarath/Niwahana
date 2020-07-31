import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutHirer } from "../actions/authActions";
import HirerNavBar from "../elements/HirerNavBar/HirerNavBar";
import WorksList from "../elements/WorksList/WorksList";

class HirerDashboard extends Component {
  onLogoutClick = (e) => {
    e.preventDefault();
    this.props.logoutHirer();
  };
  render() {
    const { hirer } = this.props.auth.user;
    console.log(hirer);
    return (
      <div>
        <HirerNavBar />
        <br />
        <br />
        <br />
        <br />
        <div className="container">
          <WorksList />
        </div>
      </div>
    );
  }
}
HirerDashboard.propTypes = {
  logoutHirer: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { logoutHirer })(HirerDashboard);
