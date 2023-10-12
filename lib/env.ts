import { cleanEnv, str, port } from 'envalid'

const env = cleanEnv(process.env, {
    PEXELS_API_KEY: str(),
    FIREBASE_PROJECT_ID: str(),
    FIREBASE_CLIENT_EMAIL: str(),
    FIREBASE_PRIVATE_KEY: str(),
    GITHUB_CLIENT_ID: str(),
    GITHUB_CLIENT_SECRET: str(),
    GOOGLE_CLIENT_ID: str(),
    GOOGLE_CLIENT_SECRET: str(),
})

export default env