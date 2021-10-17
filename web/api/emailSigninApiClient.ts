import 'firebase/auth'
import firebase from 'firebase/app'
import { NuxtFireInstance } from '@nuxtjs/firebase'
import { AppError, ErrorType } from '~/types/dto'
import UserCredential = firebase.auth.UserCredential

export const signUpWithEmail = async (
  fire: NuxtFireInstance,
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    const providers: string[] = await fire.auth.fetchSignInMethodsForEmail(
      email
    )
    if (
      providers.findIndex(
        (p) =>
          p === firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD
      ) !== -1
    ) {
      throw new AppError(
        `The email is already registered.`,
        ErrorType.FIREBASE_ERROR
      )
    }
    const data: UserCredential = await fire.auth.createUserWithEmailAndPassword(
      email,
      password
    )
    return data
  } catch (e) {
    console.log(e)
    throw new AppError(e.message, ErrorType.FIREBASE_ERROR)
  }
}

export const signInToWithEmail = async (
  fire: NuxtFireInstance,
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    const data: UserCredential = await fire.auth.signInWithEmailAndPassword(
      email,
      password
    )
    return data
  } catch (e) {
    console.log(e)
    throw new AppError(e.message, ErrorType.FIREBASE_ERROR)
  }
}

export const resetPassword = async (email: string): Promise<void> => {
  return await firebase
    .auth()
    .sendPasswordResetEmail(email)
    .catch((error: firebase.auth.Error) => {
      throw new AppError(
        `${error.message} : ${error.code}`,
        ErrorType.FIREBASE_ERROR
      )
    })
}
