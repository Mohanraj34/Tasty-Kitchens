import {Component} from 'react'
import Slider from 'react-slick'
import Cookies from 'js-cookie'

import {MdSort} from 'react-icons/md'
import {AiOutlineLeft, AiOutlineRight} from 'react-icons/ai'

import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import Header from '../Header'
import Footer from '../Footer'
import RestaurantItem from '../RestaurantItem'

import './index.css'

const sortByOptions = [
  {
    id: 0,
    displayText: 'Highest',
    value: 'Highest',
  },
  {
    id: 2,
    displayText: 'Lowest',
    value: 'Lowest',
  },
]

const statusConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    pageNumber: 1,
    offersList: [],
    restaurantsList: [],
    sortByValue: sortByOptions[0].value,
    offersFetchStatus: statusConstants.initial,
    restaurantsFetchStatus: statusConstants.initial,
  }

  componentDidMount() {
    this.fetchOffersList()
    this.fetchRestaurantsList()
  }

  getOptionsObject = () => {
    const jwtToken = Cookies.get('jwt_token')
    return {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  }

  formatOfferObject = offerObject => ({
    id: offerObject.id,
    imageUrl: offerObject.image_url,
  })

  fetchOffersList = async () => {
    this.setState({
      offersFetchStatus: statusConstants.loading,
    })

    const offersApiUrl = 'https://apis.ccbp.in/restaurants-list/offers'
    const options = this.getOptionsObject()

    const response = await fetch(offersApiUrl, options)
    const data = await response.json()

    if (response.ok) {
      const formattedData = data.offers.map(offer =>
        this.formatOfferObject(offer),
      )
      this.setState({
        offersFetchStatus: statusConstants.success,
        offersList: formattedData,
      })
    } else {
      this.setState({
        offersFetchStatus: statusConstants.failure,
      })
    }
  }

  formatRestaurantObject = object => ({
    id: object.id,
    name: object.name,
    cuisine: object.cuisine,
    imageUrl: object.image_url,
    totalReviews: object.user_rating.total_reviews,
    ratingColor: object.user_rating.rating_color,
    rating: object.user_rating.rating,
  })

  fetchRestaurantsList = async () => {
    this.setState({
      restaurantsFetchStatus: statusConstants.loading,
    })

    const {pageNumber, sortByValue} = this.state
    const offset = (pageNumber - 1) * 9

    const restaurantsApiUrl = `https://apis.ccbp.in/restaurants-list?offset=${offset}&limit=9&sort_by_rating=${sortByValue}`
    const options = this.getOptionsObject()

    const response = await fetch(restaurantsApiUrl, options)
    const data = await response.json()

    if (response.ok) {
      const formattedData = data.restaurants.map(restaurant =>
        this.formatRestaurantObject(restaurant),
      )
      this.setState({
        restaurantsFetchStatus: statusConstants.success,
        restaurantsList: formattedData,
      })
    } else {
      this.setState({
        restaurantsFetchStatus: statusConstants.failure,
      })
    }
  }

  onChangeSortByOrder = event => {
    this.setState(
      {
        sortByValue: event.target.value,
      },
      this.fetchRestaurantsList,
    )
  }

  gotoPreviousPage = () => {
    const {pageNumber} = this.state
    if (pageNumber === 1) {
      return
    }

    this.setState(
      preState => ({
        pageNumber: preState.pageNumber - 1,
      }),
      this.fetchRestaurantsList,
    )
  }

  gotoNextPage = () => {
    const {pageNumber} = this.state
    if (pageNumber === 4) {
      return
    }

    this.setState(
      preState => ({
        pageNumber: preState.pageNumber + 1,
      }),
      this.fetchRestaurantsList,
    )
  }

  renderOffersLoaderView = () => (
    <div className="loader-container">
      <Loader type="ThreeDots" color="#F7931E" height={50} width={50} />
    </div>
  )

  renderRestaurantsLoaderView = () => (
    <div className="loader-container">
      <Loader type="ThreeDots" color="#F7931E" height={50} width={50} />
    </div>
  )

  renderOffersView = () => {
    const {offersList} = this.state

    const settings = {
      dots: true,
      arrows: false,
      infinite: true,
      speed: 1000,
      autoplay: true,
      slidesToShow: 1,
      slidesToScroll: 1,
    }

    return (
      <div className="offers-container">
        <Slider {...settings}>
          {offersList.map(offer => (
            <div key={offer.id} className="offer-container">
              <img className="offer-image" src={offer.imageUrl} alt="offer" />
            </div>
          ))}
        </Slider>
      </div>
    )
  }

  renderRestaurantsView = () => {
    const {restaurantsList} = this.state

    return (
      <ul className="restaurants-container">
        {restaurantsList.map(restaurant => (
          <RestaurantItem key={restaurant.id} data={restaurant} />
        ))}
      </ul>
    )
  }

  renderOffersSection = () => {
    const {offersFetchStatus} = this.state

    switch (offersFetchStatus) {
      case statusConstants.loading:
        return this.renderOffersLoaderView()

      case statusConstants.success:
        return this.renderOffersView()

      case statusConstants.failure:
        return <h1>Failed, Retry</h1>

      default:
        return null
    }
  }

  renderRestaurantsSection = () => {
    const {restaurantsFetchStatus} = this.state

    switch (restaurantsFetchStatus) {
      case statusConstants.loading:
        return this.renderRestaurantsLoaderView()

      case statusConstants.success:
        return this.renderRestaurantsView()

      case statusConstants.failure:
        return <h1>Failed Retry</h1>

      default:
        return null
    }
  }

  renderPaginationSection = () => {
    const {pageNumber} = this.state

    return (
      <div className="pagination-container">
        <button
          className="pagination-button"
          type="button"
          onClick={this.gotoPreviousPage}
        >
          {/* */}
          <AiOutlineLeft className="pagination-icon" />
        </button>

        <p className="page-number">
          <span>{pageNumber}</span> of 4
        </p>

        <button
          className="pagination-button"
          type="button"
          onClick={this.gotoNextPage}
        >
          {/* */}
          <AiOutlineRight className="pagination-icon" />
        </button>
      </div>
    )
  }

  render() {
    const {restaurantsList, sortByValue} = this.state
    return (
      <>
        <Header />
        <div className="home-route">
          {this.renderOffersSection()}

          <h1 className="home-heading">Popular Restaurants</h1>

          <div className="home-sub-container">
            <p className="home-description">
              Select Your favourite restaurant special dish and make your day
              happy...
            </p>

            <div className="sort-by-container">
              <MdSort className="sort-icon" />
              <p className="sort-by-text">Sort by</p>
              <select
                className="sort-by-select"
                value={sortByValue}
                onChange={this.onChangeSortByOrder}
              >
                {sortByOptions.map(sortByObj => (
                  <option key={sortByObj.id} value={sortByObj.value}>
                    {sortByObj.displayText}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <hr className="hr" />

          {this.renderRestaurantsSection()}
          {restaurantsList.length > 0 && this.renderPaginationSection()}
        </div>
        <Footer />
      </>
    )
  }
}

export default Home
