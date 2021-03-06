import bip39 from 'bip39'
import { stopSubmit } from 'redux-form'

import { Router } from 'src/routes'
import { WalletEntryModel, SignInModel } from 'src/models'
import { createWallet, decryptWallet, walletSelect, walletAdd, validateMnemonicForWallet, resetPasswordWallet } from 'src/store'

import { FORM_LOGIN, FORM_PRIVATE_KEY, FORM_MNEMONIC } from 'src/components/Login'
import { web3Selector } from "../ethereum/selectors"
import { getUserData, userSave } from "../user/actions"
import * as backendApi from "./../../api/backend"

export const LoginSteps = {
  Ledger: 'ledger',
  Trezor: 'trezor',
  BrowserPlugIn: 'browserPlugIn',
  Mnemonic: 'mnemonic',
  Uport: 'uport',
  PrivateKey: 'privateKey',
  WalletFile: 'walletFile',
  CreateWallet: 'createWallet',
  SelectLoginMethod: 'selectLoginMethod',
  SelectWallet: 'selectWallet',
  Login: 'login',
  RecoveryPassword: 'recoveryPassword',
  RecoveryPasswordReset: 'recoveryPasswordReset',
}

export const LOGIN_SIGN_IN = 'login/signIn'
export const LOGIN_SET_SIGN_IN_MODEL = 'login/signInModel'
export const LOGIN_SIGN_OUT = 'login/signOut'
export const LOGIN_CHANGE_STEP = 'login/changeStep'
export const LOGIN_SELECT_WALLET_RECOVERY_FORM = 'login/selectWalletRecoveryForm'
export const LOGIN_SET_RECOVERY_PASSWORD_MODE = 'login/setRecoveryPasswordMode'
export const LOGIN_RESET_RECOVERY_PASSWORD_MODE = 'login/resetRecoveryPasswordMode'
export const LOGIN_SET_RECOVERY_FORM_MNEMONIC = 'login/setRecoveryFormMnemonic'
export const LOGIN_RESET_RECOVERY_FORM_MNEMONIC = 'login/resetRecoveryFormMnemonic'
export const LOGIN_RESET_WALLET_RECOVERY_FORM = 'login/resetWalletRecoveryForm'

export const setSignInModel = (signInModel) => (dispatch) => {
  dispatch({ type: LOGIN_SET_SIGN_IN_MODEL, signInModel })
}

export const signIn = ({ password }) => async (dispatch, getState) => {
  const state = getState()
  const { selectedWallet } = state.wallet
  const walletModel = await dispatch(decryptWallet(new WalletEntryModel(selectedWallet), password))
  const account = walletModel.wallet[0]
  const user = await dispatch(getUserData(account.address))
  const signinResBody = await backendApi.signin(account)
  dispatch(userSave({ ...user, ...signinResBody }))
}

export const onSignInSuccess = () => (dispatch) => {
  dispatch({ type: LOGIN_SIGN_IN })
  Router.pushRoute('/dashboard')
}

export const onSignInFail = () =>  (dispatch) => {
  dispatch(stopSubmit(FORM_LOGIN, { password: 'Password does not match' }))
}

export const signOut = () => (dispatch) => {
  dispatch({ type: LOGIN_SIGN_OUT })
}

export const createAccount = (walletName, password) => async (dispatch, getState) => {
  const state = getState()
  const signInModel = state.login.signIn

  if (signInModel) {
    const wallet = await dispatch(createWallet({
      [signInModel.method]: signInModel.key,
      name: walletName,
      password: password,
    }))

    dispatch(walletAdd(wallet))

    dispatch(changeStep(LoginSteps.SelectWallet))
  } else {
    Router.pushRoute('/account-password')
  }
}

export const onSubmitMnemonic = (values) => (dispatch, getState) => {

  const web3 = web3Selector()(getState())
  web3.eth.accounts.wallet.clear()

  const account = web3.eth.accounts.privateKeyToAccount(`0x${bip39.mnemonicToSeedHex(values.mnemonic)}`)

  const signInModel = new SignInModel({
    method: SignInModel.METHODS.MNEMONIC,
    key: values.mnemonic,
    address: account.address,
  })

  dispatch(setSignInModel(signInModel))

}

export const onSubmitMnemonicSuccess = () => (dispatch) => {
  dispatch(navigateToCreateWallet())
}

export const onSubmitMnemonicFail = () => (dispatch) => {
  dispatch(stopSubmit(FORM_MNEMONIC, { key: 'Wrong mnemonic' }))
}

export const onSubmitPrivateKey = (values) => async (dispatch, getState) => {

  const web3 = web3Selector()(getState())
  web3.eth.accounts.wallet.clear()

  const account = await web3.eth.accounts.privateKeyToAccount(`0x${values.key}`)

  const signInModel = new SignInModel({
    method: SignInModel.METHODS.PRIVATE_KEY,
    key: values.key,
    address: account.address,
  })

  dispatch(setSignInModel(signInModel))

}

export const onSubmitPrivateKeySuccess = () => (dispatch) => {
  dispatch(navigateToCreateWallet())
}

export const onSubmitPrivateKeyFail = () => (dispatch) => {
  dispatch(stopSubmit(FORM_PRIVATE_KEY, { key: 'Wrong private key' }))

}

export const selectWalletRecoveryForm = (wallet) => (dispatch) => {
  dispatch({ type: LOGIN_SELECT_WALLET_RECOVERY_FORM, wallet })
}

export const onSelectWallet = (wallet) => (dispatch, getState) => {
  const state = getState()

  const { isRecoveryPasswordMode } = state.login

  if (isRecoveryPasswordMode){

    dispatch(selectWalletRecoveryForm(wallet))

    dispatch(changeStep(LoginSteps.RecoveryPassword))

  } else {

    dispatch(walletSelect(wallet))

    dispatch(changeStep(LoginSteps.Login))
  }

}

export const navigateToCreateWallet = () => (dispatch) => {
  dispatch(changeStep(LoginSteps.CreateWallet))
}

export const navigateToSelectWallet = () => (dispatch) => {
  dispatch(changeStep(LoginSteps.SelectWallet))
}

export const navigateToSelectLoginMethod = () => (dispatch) => {
  dispatch(changeStep(LoginSteps.SelectLoginMethod))
}

export const navigateToLoginForm = () => (dispatch) => {
  dispatch(resetWalletRecoveryForm())
  dispatch(resetRecoveryPasswordMode())
  dispatch(changeStep(LoginSteps.Login))
}

export const navigateToRecoveryPassword = () => (dispatch, getState) => {
  const state = getState()

  const { selectedWallet } = state.wallet

  dispatch(selectWalletRecoveryForm(selectedWallet))
  dispatch({ type: LOGIN_SET_RECOVERY_PASSWORD_MODE })
  dispatch(changeStep(LoginSteps.RecoveryPassword))
}

export const onSubmitRecoveryAccountForm = ({ mnemonic }) => (dispatch) => {
  dispatch(setRecoveryFormMnemonic(mnemonic))
  dispatch(changeStep(LoginSteps.RecoveryPasswordReset))
}

export const resetRecoveryPasswordMode = () => (dispatch) => {
  dispatch({ type: LOGIN_RESET_RECOVERY_PASSWORD_MODE })
}

export const resetWalletRecoveryForm = () => (dispatch) => {
  dispatch({ type: LOGIN_RESET_WALLET_RECOVERY_FORM })
}

export const onConfirmRecoveryPassword = ({ password }) => (dispatch, getState) => {
  const state = getState()

  const { selectedWalletRecoveryForm, recoveryFormMnemonic } = state.login

  dispatch(resetPasswordWallet(selectedWalletRecoveryForm, recoveryFormMnemonic, password))

  dispatch({ type: LOGIN_RESET_RECOVERY_PASSWORD_MODE })

  Router.pushRoute('/dashboard')
}

export const changeStep = (step) => (dispatch) => {
  dispatch({ type: LOGIN_CHANGE_STEP, step })
}

export const validateRecoveryForm = (mnemonic) => (dispatch, getState) => {
  const state = getState()

  const { selectedWalletRecoveryForm } = state.login

  return dispatch(validateMnemonicForWallet(selectedWalletRecoveryForm, mnemonic))

}

export const setRecoveryFormMnemonic = (mnemonic) => (dispatch) => {
  return dispatch({ type: LOGIN_SET_RECOVERY_FORM_MNEMONIC, mnemonic })
}
