import _ from 'lodash'
import { LOAD_MODULE, ADD_LOT, UPDATE_LOT, SEARCH } from './actionTypes'

const initialState = {
  modules: [
    // {
    //   address: '0x0020281504ad36a39700414d7cb9fcc6b27d48c3',
    //   commissionToken: '0x0020281504ad36a39700414d7cb9fcc6b27d48c3',
    //   commission: 0,
    //   lots: [
    //     {
    //       sale_name: 'aaa',
    //       sale_address: '0x2222222222222222',
    //       sale_quantity: 1,
    //       buy_name: 'bbb',
    //       buy_address: '0x33333333333333333',
    //       buy_quantity: 2,
    //       approve_sale_quantity: 2,
    //       approve_buy_quantity: 2,
    //       my: false,
    //       sale_quantity_full: saleQuantityFull,
    //       buy_quantity_full: buyQuantityFull,
    //       sale_commission: saleCommission,
    //       buy_commission: buyCommission,
    //       commission_amount: 0
    //     }
    //   ]
    // }
  ],
  search: {
    sale: '',
    buy: ''
  }
}

export default function market(state = initialState, action) {
  switch (action.type) {
    case LOAD_MODULE: {
      const module = _.find(state.modules, ['address', action.payload.address])
      let modules
      if (module) {
        modules = state.modules.map((item) => {
          if (item.address === action.payload.address) {
            return {
              ...item,
              commissionToken: action.payload.commissionToken,
              commission: action.payload.commission,
              lots: action.payload.lots
            }
          }
          return item
        })
      } else {
        modules = [
          ...state.modules,
          action.payload
        ]
      }
      return { ...state, modules }
    }

    case ADD_LOT: {
      if (_.find(state.modules, ['address', action.payload.address])) {
        const modules = state.modules.map((item) => {
          if (item.address === action.payload.address) {
            return {
              ...item,
              lots: [action.payload.lot, ...item.lots]
            }
          }
          return item
        })
        return { ...state, modules }
      }
      return state;
    }

    case UPDATE_LOT: {
      if (_.find(state.modules, ['address', action.payload.address])) {
        const modules = state.modules.map((item) => {
          if (item.address === action.payload.address) {
            const lots = item.lots.map((lot) => {
              if (lot.address === action.payload.lot.address) {
                return action.payload.lot
              }
              return item
            })
            return {
              ...item,
              lots
            }
          }
          return item
        })
        return { ...state, modules }
      }
      return state;
    }

    case SEARCH:
      return { ...state, search: action.payload }

    default:
      return state;
  }
}
