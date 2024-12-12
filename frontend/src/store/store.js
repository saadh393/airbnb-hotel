import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import spotsReducer from "./spots";
import spotDetailsReducer from "./spotDetails";
import createSpotsReducer from "./createspot";
import reviewsReducer from "./reviews";
import manageStoreReducer from "./manageSpot";
import manageReviewReducer from "./manageReview";

const rootReducer = combineReducers({
  // ADD REDUCERS HERE
  session: sessionReducer,
  spots: spotsReducer,
  spotDetails: spotDetailsReducer,
  createSpot: createSpotsReducer,
  reviews: reviewsReducer,
  manageSpot: manageStoreReducer,
  manageReview: manageReviewReducer,
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  // const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  // enhancer = composeEnhancers(applyMiddleware(thunk, logger))
  enhancer = composeEnhancers(applyMiddleware(thunk));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
