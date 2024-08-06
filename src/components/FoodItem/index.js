import {AiFillStar} from 'react-icons/ai'
import {BiRupee} from 'react-icons/bi'

import CartContext from '../../context/CartContext'
import Counter from '../Counter'

import './index.css'

const FoodItem = props => {
  let addCartItem = null
  const {data} = props
  const {id, name, cost, rating, imageUrl} = data

  const onAddButtonClicked = () => {
    addCartItem({id, name, cost, quantity: 1, imageUrl})
  }

  return (
    <CartContext.Consumer>
      {value => {
        addCartItem = value.addCartItem
        const quantity = value.getQuantity(id)

        return (
          <li className="food-item-li">
            <img className="li-food-image" src={imageUrl} alt={name} />

            <div className="li-food-content-container">
              <h1 className="li-food-name">{name}</h1>

              <div className="li-price-rating-container">
                <BiRupee className="li-rupee-icon" />
                <p className="li-food-price">{cost}</p>
              </div>

              <div className="li-price-rating-container">
                <AiFillStar className="li-food-star-icon" />
                <p className="li-food-rating">{rating}</p>
              </div>

              {quantity === 0 ? (
                <button
                  className="li-add-button"
                  type="button"
                  onClick={onAddButtonClicked}
                >
                  Add
                </button>
              ) : (
                <Counter id={id} quantity={quantity} />
              )}
            </div>
          </li>
        )
      }}
    </CartContext.Consumer>
  )
}

export default FoodItem
