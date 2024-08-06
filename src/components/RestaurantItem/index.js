import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'

import './index.css'

const RestaurantItem = props => {
  const {data} = props
  const {id, name, cuisine, imageUrl, totalReviews, ratingColor, rating} = data

  return (
    <li className="restaurant-li">
      <Link className="li-restaurant-link" to={`/restaurant/${id}`}>
        <img className="li-restaurant-image" src={imageUrl} alt="restaurant" />
        <div className="li-restaurant-container">
          <h1 className="li-restaurant-name">{name}</h1>
          <p className="li-restaurant-type">{cuisine}</p>

          <div className="li-restaurant-ratings-container">
            <AiFillStar className="li-star-icon" style={{color: ratingColor}} />
            <h1 className="li-restaurant-rating">{rating}</h1>
            <p className="li-restaurant-ratings-count">
              ({totalReviews} ratings)
            </p>
          </div>
        </div>
      </Link>
    </li>
  )
}

export default RestaurantItem
