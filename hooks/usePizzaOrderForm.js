import { useCallback, useReducer } from 'react'
import { makePostRequest } from '../lib'

const INITIAL_STATE = {
  size: null,
  ingredientsMap: {},
  totalPrice: 0,
  isOrderSuccessFul: false,
  hasError: false,
  message: undefined,
}

function reducePizzaOrder(state, action) {
  console.log(action.type)

  let newState = state

  switch (action.type) {
    case 'ACTION_SELECT_PIZZA_SIZE':
      newState = {
        ...state,
        size: action.size,
      }
      break

    case 'ACTION_SELECT_PIZZA_INGREDIENT':
      newState = {
        ...state,

        ingredientsMap: {
          ...state.ingredientsMap,
          [action.id]: true,
        },

        totalPrice: state.totalPrice + action.price,
      }
      break

    case 'ACTION_UNSELECT_PIZZA_INGREDIENT':
      newState = {
        ...state,
        totalPrice: state.totalPrice - action.price,
      }
      delete newState.ingredientsMap[action.id]
      break

    case 'ACTION_APPEND_ADDRESS':
      newState = {
        ...state,
        [action.name]: action.value,
      }
      break

    case 'ACTION_ORDER_COMPLETE':
      newState = {
        ...state,
        ...INITIAL_STATE,
        isOrderSuccessFul: true,
        hasError: false,
      }
      break

    case 'ACTION_ORDER_FAILED':
      newState = {
        ...state,
        ...INITIAL_STATE,
        isOrderSuccessFul: false,
        hasError: true,
        message: action.reason,
      }
      break
  }

  console.log(newState)

  return newState
}

export default function usePizzaOrderForm() {
  const [state, dispatch] = useReducer(reducePizzaOrder, INITIAL_STATE)

  const selectPizzaSize = useCallback(
    (size) => {
      dispatch({
        type: 'ACTION_SELECT_PIZZA_SIZE',
        size,
      })
    },
    [dispatch]
  )

  const selectPizzaIngredient = useCallback(
    (id, price) => {
      dispatch({
        type: 'ACTION_SELECT_PIZZA_INGREDIENT',
        id,
        price,
      })
    },
    [dispatch]
  )

  const unselectPizzaIngredient = useCallback(
    (id, price) => {
      dispatch({
        type: 'ACTION_UNSELECT_PIZZA_INGREDIENT',
        id,
        price,
      })
    },
    [dispatch]
  )

  const isIngredientSelected = useCallback(
    (id) => {
      return state.ingredientsMap[id]
    },
    [state]
  )

  const getCurrentPizzaSize = useCallback(() => {
    return state.size
  }, [state])

  const getTotalCost = useCallback(() => {
    return parseInt(state.totalPrice * 100, 10) / 100
  }, [state])

  const getPizzaSize = useCallback(() => {
    return state.size
  }, [state])

  const isComplete = useCallback(() => {
    return (
      !!state.size &&
      !!state.totalPrice > 0 &&
      !!state.houseNo &&
      !!state.postcode &&
      !!state.city &&
      !!state.street
    )
  }, [state])

  const addDeliveryAddress = useCallback(
    (e) => {
      dispatch({
        type: 'ACTION_APPEND_ADDRESS',
        name: e.target.name,
        value: e.target.value,
      })
    },
    [dispatch]
  )

  const submit = useCallback(async () => {
    try {
      const { houseNo, postcode, city, street, ingredientsMap, size } = state
      const response = await makePostRequest('api/customer/order', {
        customerId: '156722',
        baseSize: size,
        ingredientVarietyIds: Object.keys(ingredientsMap),
        houseNo,
        postcode,
        city,
        street,
      })
      if (response.success) {
        dispatch({ type: 'ACTION_ORDER_COMPLETE' })
      } else {
        dispatch({ type: 'ACTION_ORDER_FAILED', reason: response.reason })
      }
    } catch (err) {}
  }, [dispatch, state])

  return {
    isOrderSuccessFul: state.isOrderSuccessFul,
    hasError: state.hasError,
    message: state.message,
    getPizzaSize,
    getTotalCost,
    getCurrentPizzaSize,
    isIngredientSelected,
    selectPizzaSize,
    selectPizzaIngredient,
    unselectPizzaIngredient,
    submit,
    isComplete,
    addDeliveryAddress,
  }
}
