import { Amplify } from 'aws-amplify'

const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID
const userPoolClientId = import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID
const awsRegion = import.meta.env.VITE_AWS_REGION || 'us-east-1'

if (!userPoolId || !userPoolClientId) {
  console.warn('Cognito environment variables are missing. Set VITE_COGNITO_USER_POOL_ID and VITE_COGNITO_USER_POOL_CLIENT_ID.')
}

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId,
      userPoolClientId,
      loginWith: { email: true },
      signUpVerificationMethod: 'code',
      userAttributes: {
        email: { required: true },
      },
      passwordFormat: {
        minLength: 10,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      },
    },
  },
})

export const cognitoConfig = { userPoolId, userPoolClientId, awsRegion }
