import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    errorMessage: '',
    showLoginLoading: false,
    showTrailLoading: false,
    showErrorMessage: false,
  }

  onChangeUsername = event => {
    this.setState({
      username: event.target.value,
    })
  }

  onChangePassword = event => {
    this.setState({
      password: event.target.value,
    })
  }

  onFormSubmit = event => {
    event.preventDefault()
    this.setState({
      showLoginLoading: true,
      showErrorMessage: false,
    })
    const {username, password} = this.state
    this.postLoginCredentials(username, password)
  }

  // Trail Login JWT Token will expire in 1 hour
  onClickTrailLogin = () => {
    this.setState({
      showTrailLoading: true,
      showErrorMessage: false,
    })
    this.postLoginCredentials('rahul', 'rahul@2021', 0.041)
  }

  postLoginCredentials = async (username, password, expiryDays = 7) => {
    const credentials = {
      username,
      password,
    }

    const loginApiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(credentials),
    }
    const response = await fetch(loginApiUrl, options)
    const data = await response.json()

    if (response.ok) {
      this.onLoginSuccessful(data.jwt_token, expiryDays)
    } else {
      this.onLoginFailure(data.error_msg)
    }
  }

  onLoginSuccessful = (jwtToken, expiryDays) => {
    Cookies.set('jwt_token', jwtToken, {
      expires: expiryDays,
    })

    const {history} = this.props
    history.replace('/')
  }

  onLoginFailure = errorMsg => {
    this.setState({
      errorMessage: errorMsg,
      showErrorMessage: true,
      showLoginLoading: false,
    })
  }

  renderLoadingView = (color = '#ffffff', prefix = '') => (
    <div className={`${prefix}login-button`}>
      <Loader type="ThreeDots" color={color} height={14} width={48} />
    </div>
  )

  renderUsernameField = () => {
    const {username} = this.state
    return (
      <>
        <label className="form-label" htmlFor="username">
          USERNAME
        </label>
        <input
          className="form-input"
          id="username"
          type="text"
          value={username}
          placeholder="Enter Username"
          onChange={this.onChangeUsername}
        />
      </>
    )
  }

  renderPasswordField = () => {
    const {password} = this.state
    return (
      <>
        <label className="form-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          className="form-input"
          id="password"
          type="password"
          value={password}
          placeholder="Enter Password"
          onChange={this.onChangePassword}
        />
      </>
    )
  }

  renderButtonsContainer = () => {
    const {showLoginLoading, showTrailLoading} = this.state

    return (
      <div className="login-buttons-container">
        {showLoginLoading ? (
          this.renderLoadingView()
        ) : (
          <button className="login-button" type="submit">
            Login
          </button>
        )}

        {showTrailLoading ? (
          this.renderLoadingView('#f7931e', 'trail-')
        ) : (
          <button
            className="trail-login-button"
            type="button"
            onClick={this.onClickTrailLogin}
          >
            Guest Login
          </button>
        )}
      </div>
    )
  }

  renderFormContainer = () => {
    const {errorMessage, showErrorMessage} = this.state

    return (
      <div className="login-container">
        <div className="login-heading-mobile-container">
          <h1 className="login-heading-mobile">Login</h1>
        </div>
        <form className="form-container" onSubmit={this.onFormSubmit}>
          <img
            className="login-website-logo"
            src="https://res.cloudinary.com/pavankalyanbandaru/image/upload/v1651083200/tasty-kitchens/website-logo.png"
            alt="website logo"
          />
          <h1 className="login-website-title">Tasty Kitchens</h1>

          <h1 className="login-heading">Login</h1>

          {this.renderUsernameField()}
          {this.renderPasswordField()}

          {showErrorMessage && (
            <p className="login-error-message">{errorMessage}</p>
          )}

          {this.renderButtonsContainer()}
        </form>
      </div>
    )
  }

  renderAppLoginImage = () => (
    <img
      className="login-route-image"
      src="https://res.cloudinary.com/pavankalyanbandaru/image/upload/v1651081958/tasty-kitchens/login-image.png"
      alt="website login"
    />
  )

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-route">
        {this.renderFormContainer()}
        {this.renderAppLoginImage()}
      </div>
    )
  }
}

export default Login
