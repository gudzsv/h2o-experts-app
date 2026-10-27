export const selectUser = state => state.auth.user;
export const selectToken = state => state.auth.token;
export const selectUnits = state => state.auth.user?.units ?? 'ml';
export const selectIsLoading = state => state.auth.isLoading;
export const selectIsLoggedIn = state => state.auth.isLoggedIn;
export const selectIsRefreshing = state => state.auth.isRefreshing;
export const selectCounter = state => state.auth.counter;
export const selectOAuthURL = state => state.auth.OAuthURL;
