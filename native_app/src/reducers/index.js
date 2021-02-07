import { combinedReducers} from 'redux'
import userReducer from './userReducer'

const rootReducer = combinedReducers({
    userReducer
})

export default rootReducer