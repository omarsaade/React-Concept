import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  deviceInfo: null,
  notifications: [],
  DialogueLog: [],
  isCloseButtonVisible: false,
  isSubscriptionModalVisible: false,
  isSplashScreenVisible: true,
  isRequestPending: false,
  settings: null,
  status: null,
  errorMessage: '',
  subscriptionOffers: [],
  messageHasMoreContent: false,
  selectedOffer: null,
  purchaseInProcess: false,
  isSubscribed: false,
  subscriptionInfo: [],
  appInitialized: false,
  subscriptionInitialized: false,
  firstMessage: true,
  pagesUrl: [],
  isFreeTrialSelected: true,
  subscribeBtnText: 'الإستمرار',
  isAIDisplayed: false,
  aiImageUrl: '',
  isSketchPending: false,
  enableNotification: true,
};

export const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setDataRegistration(state, action) {
      state.deviceInfo = action.payload;
    },
    setNewMessage(state, action) {
      state.DialogueLog.push(action.payload);
    },
    updateMessage(state, action) {
      state.DialogueLog.splice(state.DialogueLog.length - 1, 1, action.payload);
    },
    setCloseButtonVisibility(state, action) {
      state.isCloseButtonVisible = action.payload;
    },
    setSubscriptionModalVisible(state, action) {
      state.isSubscriptionModalVisible = action.payload;
    },
    setSplashScreenVisibility(state, action) {
      state.isSplashScreenVisible = action.payload;
    },
    removeLastItemFromDialogue(state, action) {
      state.DialogueLog.pop();
    },
    setIsRequestPending(state, action) {
      state.isRequestPending = action.payload;
    },
    setSettings(state, action) {
      state.settings = action.payload;
    },
    setSubscriptionOffers(state, action) {
      state.subscriptionOffers = action.payload;
    },
    setMessageHasMoreContent(state, action) {
      state.messageHasMoreContent = action.payload;
    },
    setSelectedOffer(state, action) {
      state.selectedOffer = action.payload;
    },
    setPurchaseInProcess(state, action) {
      state.purchaseInProcess = action.payload;
    },
    setIsSubscribed(state, action) {
      state.isSubscribed = action.payload;
    },
    setSubscriptionInfo(state, action) {
      state.subscriptionInfo = action.payload;
    },
    setAppInitialized(state, action) {
      state.appInitialized = action.payload;
    },
    setSubscriptionInitialized(state, action) {
      state.subscriptionInitialized = action.payload;
    },
    setFirstMessage(state, action) {
      state.firstMessage = action.payload;
    },
    setPagesUrl(state, action) {
      state.pagesUrl = action.payload;
    },
    setIsFreeTrialSelected(state, action) {
      state.isFreeTrialSelected = action.payload;
    },
    setSubscribeBtnText(state, action) {
      state.subscribeBtnText = action.payload;
    },
    setAIDisplayed(state, action) {
      state.isAIDisplayed = action.payload;
    },
    setAiImageUrl(state, action) {
      state.aiImageUrl = action.payload;
    },
    setSketchPending(state, action) {
      state.isSketchPending = action.payload;
    },
    setEnableNotification(state, action) {
      state.enableNotification = action.payload;
    },
    markMessageAsSentByText(state, action) {
      state.DialogueLog.forEach(message => {
        if (message.message === action.payload) {
          message.isSent = true;
        }
      });
    },
  },
});

export const {
  setNewMessage,
  updateMessage,
  setCloseButtonVisibility,
  setSubscriptionModalVisible,
  setSplashScreenVisibility,
  setDataRegistration,
  removeLastItemFromDialogue,
  setIsRequestPending,
  setSettings,
  setSubscriptionOffers,
  setMessageHasMoreContent,
  setSelectedOffer,
  setIsSubscribed,
  setPurchaseInProcess,
  setSubscriptionInfo,
  setAppInitialized,
  setSubscriptionInitialized,
  setFirstMessage,
  setPagesUrl,
  setIsFreeTrialSelected,
  setSubscribeBtnText,
  setAIDisplayed,
  setAiImageUrl,
  setSketchPending,
  setEnableNotification,
  markMessageAsSentByText,
} = registerSlice.actions;

export default registerSlice.reducer;
