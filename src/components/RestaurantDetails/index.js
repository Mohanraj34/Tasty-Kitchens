import {Component} from 'react'
import Cookies from 'js-cookie'

import {AiFillStar} from 'react-icons/ai'
import {BiRupee} from 'react-icons/bi'

import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import Header from '../Header'
import Footer from '../Footer'
import FoodItem from '../FoodItem'

import './index.css'

const statusConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class RestaurantDetails extends Component {
  state = {
    restaurantDetails: '',
    foodItemsList: [],
    fetchStatus: statusConstants.initial,
  }

  componentDidMount() {
    this.fetchRestaurantDetails()
  }

  fetchRestaurantDetails = async () => {
    this.setState({
      fetchStatus: statusConstants.loading,
    })

    const {match} = this.props
    const {params} = match

    const restaurantDetailsApiUrl = `https://apis.ccbp.in/restaurants-list/${params.id}`
    const options = this.getOptionsObject()

    const response = await fetch(restaurantDetailsApiUrl, options)
    const data = await response.json()

    if (response.ok) {
      this.onFetchSuccessful(data)
    } else {
      this.setState({
        fetchStatus: statusConstants.failure,
      })
    }
  }

  onFetchSuccessful = data => {
    const formattedRestaurantDetails = this.formatRestaurantDetails(data)
    const formattedFoodItemsList = data.food_items.map(item =>
      this.formatFoodItemObject(item),
    )

    this.setState({
      fetchStatus: statusConstants.success,
      restaurantDetails: formattedRestaurantDetails,
      foodItemsList: formattedFoodItemsList,
    })
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

  formatRestaurantDetails = data => ({
    id: data.id,
    name: data.name,
    rating: data.rating,
    cuisine: data.cuisine,
    location: data.location,
    imageUrl: data.image_url,
    costForTwo: data.cost_for_two,
    reviewsCount: data.reviews_count,
  })

  formatFoodItemObject = obj => ({
    id: obj.id,
    name: obj.name,
    cost: obj.cost,
    rating: obj.rating,
    imageUrl: obj.image_url,
  })

  renderLoadingView = () => (
    <div className="loader-container">
      <Loader type="ThreeDots" color="#F7931E" height={50} width={50} />
    </div>
  )

  renderBannerView = () => {
    const {restaurantDetails} = this.state
    const {
      name,
      rating,
      cuisine,
      location,
      imageUrl,
      costForTwo,
      reviewsCount,
    } = restaurantDetails

    return (
      <div className="restaurant-banner">
        <img className="restaurant-image" src={imageUrl} alt="restaurant" />

        <div className="restaurant-details-container">
          <h1 className="restaurant-name">{name}</h1>
          <p className="restaurant-cuisine">{cuisine}</p>
          <p className="restaurant-location">{location}</p>

          <div className="restaurant-banner-sub-container">
            <div>
              <div className="restaurant-rating-icon-container">
                <AiFillStar className="restaurant-star-icon" />
                <p className="restaurant-rating">{rating}</p>
              </div>
              <p className="restaurant-reviews">{reviewsCount}+ Ratings</p>
            </div>
            <hr className="vertical-hr" />
            <div>
              <div className="restaurant-rating-icon-container">
                <BiRupee className="restaurant-star-icon" />
                <p className="restaurant-rating">{costForTwo}</p>
              </div>
              <p className="restaurant-reviews">Cost for two</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderFoodItemsView = () => {
    const {foodItemsList} = this.state
    return (
      <ul className="food-items-container">
        {foodItemsList.map(item => (
          <FoodItem key={item.id} data={item} />
        ))}
      </ul>
    )
  }

  switchDisplayViews = successView => {
    const {fetchStatus} = this.state

    switch (fetchStatus) {
      case statusConstants.loading:
        return this.renderLoadingView()

      case statusConstants.success:
        return successView()

      case statusConstants.failure:
        return <h1>Failed to fetch details, Please Retry</h1>

      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.switchDisplayViews(this.renderBannerView)}
        {this.switchDisplayViews(this.renderFoodItemsView)}
        <Footer />
      </>
    )
  }
}

export default RestaurantDetails
