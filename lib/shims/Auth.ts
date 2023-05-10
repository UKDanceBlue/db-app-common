interface AuthTypedParsedToken {
    auth_time: string;
    exp: string;
    firebase:  {
        identities?: Record<any, any>,
        sign_in_provider?: string,
        sign_in_second_factor?: string,
        [key: string]: unknown,
    }
    iat: string;
    sub: string;
    [key: string]: unknown,
}

type AuthParsedToken = Record<string, unknown> | AuthTypedParsedToken;

export interface AuthIdTokenResult {
    authTime: string;
    claims: AuthParsedToken;
    expirationTime: string;
    issuedAtTime: string;
    signInProvider: string | null;
    signInSecondFactor?: string | null;
    token: string;
}
