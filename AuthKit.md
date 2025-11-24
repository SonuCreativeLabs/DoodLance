# AuthKit


## Introduction {{ "visibility": "no-quick-nav" }}

Integrating AuthKit into your app is quick and easy. In this guide, we'll walk you through adding a hosted authentication flow to your application using AuthKit.

In addition to this guide, there are a variety of [example apps](/docs/authkit/example-apps) available to help with your integration.

## Before getting started {{ "visibility": "no-quick-nav" }}

To get the most out of this guide, you'll need:

- A [WorkOS account](https://dashboard.workos.com/)
- Your WorkOS [API Key](/docs/glossary/api-key) and [Client ID](/docs/glossary/client-id)

Additionally you'll need to activate AuthKit in your WorkOS Dashboard if you haven't already. In the _Overview_ section, click the _Set up AuthKit_ button and follow the instructions.

![WorkOS dashboard with the AuthKit setup button highlighted](https://images.workoscdn.com/images/48aa13fa-0295-4027-8e08-e7bd14753fd3.png?auto=format&fit=clip&q=50)

---

## (1) Configure your project

Let's add the necessary dependencies and configuration in your WorkOS Dashboard.

<StackSelection />

### Install dependencies

- $ frontend="client-only"

  For a client-only approach, use the `authkit-react` library to integrate AuthKit directly into your React application. Start by installing the library to your project via `npm`.

  ```bash title="Install React SDK"
  npm install @workos-inc/authkit-react
  ```

- $ frontend="nextjs"

  For a Next.js integration, use the `authkit-nextjs` library. Start by installing it in your Next.js project via `npm`.

  ```bash title="Install Next.js SDK"
  npm install @workos-inc/authkit-nextjs
  ```

- $ frontend="remix"

  To use AuthKit with a Remix application, use the `authkit-remix` library. Start by installing it in your Remix project via `npm`.

  ```bash title="Install Remix SDK"
  npm install @workos-inc/authkit-remix
  ```

- $ backend="nodejs"

  First, install the required Node SDK via `npm`.

  ```bash title="Install Node SDK"
  npm install @workos-inc/node
  ```

- $ backend="ruby"
  First, install the WorkOS gem.

  ```bash title="Install Ruby SDK"
  gem install workos
  ```

- $ backend="python"

  First, install the Python SDK.

  ```bash title="Install Python SDK"
  pip install workos
  ```

### Configure a redirect URI

A redirect URI is a callback endpoint that WorkOS will redirect to after a user has authenticated. This endpoint will exchange the authorization code returned by WorkOS for an authenticated [User object](/docs/reference/authkit/user). We'll create this endpoint in the next step.

You can set a redirect URI in the _Redirects_ section of the [WorkOS Dashboard](https://dashboard.workos.com).

WorkOS supports using wildcard characters in Redirect URIs, but not for the default Redirect URI. More information about wildcard characters support can be found in the [Redirect URIs](/docs/sso/redirect-uris/wildcard-characters) guide.

- $ frontend="client-only"

  ![Dashboard Redirect URIs](https://images.workoscdn.com/images/6da31d23-c823-4557-8403-b38b2700e4d2.png?auto=format&fit=clip&q=50)

  > For the client-only integration, make sure to set the callback URI as the same route where you require auth.

- $ frontend="nextjs, remix, vanilla, react"

  ![Dashboard redirect URI](https://images.workoscdn.com/images/58232e3c-ab9f-41cc-99f4-1692214073fa.png?auto=format&fit=clip&q=80)

When users sign out of their application, they will be redirected to your app's [Logout redirect](/docs/authkit/sessions/configuring-sessions/logout-redirect) location which is configured in the same dashboard area.

### Configure login endpoint

- $ frontend="client-only"

  All login requests must originate at your application for the [PKCE](/docs/reference/authkit/authentication/get-authorization-url/pkce) code exchange to work properly. In some instances, requests may not begin at your app. For example, some users might bookmark the hosted login page or they might be led directly to the hosted login page when clicking on a password reset link in an email.

- $ frontend="nextjs, remix, vanilla, react"

  Login requests should originate from your application. In some instances, requests may not begin at your app. For example, some users might bookmark the hosted login page or they might be led directly to the hosted login page when clicking on a password reset link in an email.

In these cases, AuthKit will detect when a login request did not originate at your application and redirect to your application's login endpoint. This is an endpoint that you define at your application that redirects users to sign in using AuthKit. We'll create this endpoint in the next step.

You can configure the login endpoint from the _Redirects_ section of the WorkOS dashboard.

![Login endpoint](https://images.workoscdn.com/images/6cb6f548-8093-495b-a401-76bbda007842.png?auto=format&fit=clip&q=50)

- $ frontend="client-only"

  ### Configure CORS

  Since your user's browser will be making calls to the WorkOS API directly, it is necessary to add your domain to the allow list in your WorkOS Settings. This can be configured in the _Configure CORS_ dialog on the _Authentication_ page of the WorkOS dashboard.

  ![Screenshot of the WorkOS dashboard showing the "Configure CORS" option in the "Authentication" section.](https://images.workoscdn.com/images/3b7863df-8c59-4d48-ab91-f537fd5c9f66.png?auto=format&fit=clip&q=50)

  While building your integration in the Staging environment you should add your local development URL here. In the example below we're adding `http://localhost:5173` to the list of allowed web origins.

  ![Screenshot of the WorkOS dashboard showing the CORS configuration panel.](https://images.workoscdn.com/images/e20fdbfb-965f-47b5-9c64-b83f6e6b8a39.png?auto=format&fit=clip&q=50)

- $ frontend="nextjs, remix"

  ### Set secrets

  To make calls to WorkOS, provide the API key and the client ID. Store these values as managed secrets and pass them to the SDKs either as environment variables or directly in your app's configuration depending on your preferences.

- $ frontend="nextjs"

  ```plain title="Environment variables"
  WORKOS_API_KEY='sk_example_123456789'
  WORKOS_CLIENT_ID='client_123456789'
  WORKOS_COOKIE_PASSWORD="<your password>" # generate a secure password here

  # configured in the WorkOS dashboard
  NEXT_PUBLIC_WORKOS_REDIRECT_URI="http://localhost:3000/callback"
  ```

  The `NEXT_PUBLIC_WORKOS_REDIRECT_URI` uses the `NEXT_PUBLIC` prefix so the variable is accessible in edge functions and middleware configurations. This is useful for configuring operations like Vercel preview deployments.

- $ frontend="remix"

  ```plain title="Environment variables"
  WORKOS_API_KEY='sk_example_123456789'
  WORKOS_CLIENT_ID='client_123456789'

  WORKOS_REDIRECT_URI="http://localhost:3000/callback" # configured in the WorkOS dashboard
  WORKOS_COOKIE_PASSWORD="<your password>" # generate a secure password here
  ```

- $ frontend="nextjs, remix"

  The SDK requires you to set a strong password to encrypt cookies. This password must be at least 32 characters long. You can generate a secure password by using the [1Password generator](https://1password.com/password-generator/) or the `openssl` library via the command line:

  ```bash title="Generate a strong password"
  openssl rand -base64 24
  ```

- $ backend="nodejs, ruby, python"

  ### Set secrets

  To make calls to WorkOS, provide the API key and the client ID. Store these values as managed secrets and pass them to the SDKs either as environment variables or directly in your app's configuration depending on your preferences.

  ```plain title="Environment variables"
  WORKOS_API_KEY='sk_example_123456789'
  WORKOS_CLIENT_ID='client_123456789'
  ```

> The code examples use your staging API keys when [signed in](https://dashboard.workos.com)

---

## (2) Add AuthKit to your app

Let's integrate the hosted authentication flow into your app.

- $ frontend="client-only"

  ### Wrap your app with the AuthKit provider

  The `AuthKitProvider` component will handle the redirect from Hosted AuthKit, refresh the session when needed and provide context for hooks used in the components of your app. Initialize it with your client ID, which you can find in the WorkOS dashboard. You should also specify your custom authentication API domain.

  > If you have not set up a custom authentication domain in WorkOS, set `devMode={true}` on `<AuthKitProvider />`. This will keep the refresh token in local storage instead of a secure, HTTP-only cookie.

  #### /app/root.tsx



```jsx
import { AuthKitProvider } from '@workos-inc/authkit-react';

export default function Root() {
  return (
    <AuthKitProvider
      clientId="client_123456789"
      apiHostname="auth.foo-corp.com"
    >
      <App />
    </AuthKitProvider>
  );
}
```



  > For security reasons, the client-only integration cannot be nested inside an `iframe`.

  ### Use the auth hook in your components

  The `useAuth` hook will return user information and loading status. It also provides functions to retrieve the access token and sign in and sign out the user.

  #### /app.jsx



```jsx
import * as React from 'react';
import { useAuth } from '@workos-inc/authkit-react';

export default function App() {
  const { isLoading, user, getAccessToken, signIn, signUp, signOut } =
    useAuth();

  // This `/login` endpoint should be registered as the login endpoint on
  // the "Redirects" page of the WorkOS Dashboard. In a real app, this code would
  // live in a route instead of in the main <App/> component
  React.useEffect(() => {
    if (window.location.pathname === '/login') {
      // Redirects to the signIn page
      signIn();
    }
  }, [window.location, signIn]);

  // isLoading is true until WorkOS has determined the user's authentication status
  if (isLoading) {
    return <p>... insert cool spinner here ...</p>;
  }

  // If user doesn't exist, then the user is signed out
  if (!user) {
    return (
      <>
        <button
          onClick={() => {
            // Redirects to the signIn page
            signIn();
          }}
        >
          Sign in
        </button>
        <button
          onClick={() => {
            // Redirects to the signUp page
            signUp();
          }}
        >
          Sign up
        </button>
      </>
    );
  }

  // Show the logged in view
  return (
    <>
      <p>Welcome back{user.firstName && `, ${user.firstName}`}</p>
      <p>
        <button
          onClick={async () => {
            // getAccessToken will return an existing (unexpired) access token, or
            // obtain a fresh one if necessary
            const accessToken = await getAccessToken();
            console.log(`Making API request with ${accessToken}`);
          }}
        >
          Make API Request
        </button>
      </p>
      <p>
        <button
          onClick={() => {
            signOut();
          }}
        >
          Sign Out
        </button>
      </p>
    </>
  );
}
```



  ### Protect routes with custom hooks

  If you have routes that you wish to only be accessible to logged in users, you can use a custom React hook.

  #### /hooks/use-user.ts



```ts
import { useAuth } from '@workos-inc/authkit-react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type UserOrNull = ReturnType<typeof useAuth>['user'];

// redirects to the sign-in page if the user is not signed in
export const useUser = (): UserOrNull => {
  const { user, isLoading, signIn } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      // Use 'state' to return the user to the current page after signing in
      signIn({ state: { returnTo: location.pathname } });
    }
  }, [isLoading, user]);

  return user;
};
```



  Then use that hook to protect your mandatory sign in routes.

  #### /app/protected.jsx



```jsx
import { useUser } from '../hooks/use-user';

export default function MyProtectedPage() {
  const user = useUser();

  if (!user) {
    // Redirect to sign in page
    return '...';
  }

  return (
    <>
      <p>Welcome back{user.firstName && `, ${user.firstName}`}</p>
    </>
  );
}
```



- $ frontend="nextjs"

  ### Provider

  The `AuthKitProvider` component adds protections for auth edge cases and is required to wrap your app layout.

  #### /app/layout.tsx



```jsx
import { AuthKitProvider } from '@workos-inc/authkit-nextjs/components';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthKitProvider>{children}</AuthKitProvider>
      </body>
    </html>
  );
}
```



  ### Middleware

  [Next.js middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware) is required to determine which routes require authentication.

  #### Implementing the middleware

  When implementing, you can opt to use either the complete `authkitMiddleware` solution or the composable `authkit` method. You'd use the former in cases where your middleware is only used for authentication. The latter is used for more complex apps where you want to have your middleware perform tasks in addition to auth.

  - | Complete

    The middleware can be implemented in the `middleware.ts` file. This is a full middleware solution that handles all the auth logic including session management and redirects for you.

    With the complete middleware solution, you can choose between page based auth and middleware auth.

    #### Page based auth

    Protected routes are determined via the use of the `withAuth` method, specifically whether the `ensureSignedIn` option is used. Usage of `withAuth` is covered further down in the _Access authentication data_ section.

    #### middleware.ts



```js
import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

export default authkitMiddleware();

// Match against pages that require authentication
// Leave this out if you want authentication on every page in your application
export const config = { matcher: ['/'] };
```



    #### Middleware auth

    In this mode the middleware is used to protect all routes by default, redirecting users to AuthKit if no session is available. Exceptions can be configured via an allow list.

    #### middleware.ts



```js
import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

// In middleware auth mode, each page is protected by default.
// Exceptions are configured via the `unauthenticatedPaths` option.
export default authkitMiddleware({
  middlewareAuth: {
    enabled: true,
    unauthenticatedPaths: ['/'],
  },
});

// Match against pages that require authentication
// Leave this out if you want authentication on every page in your application
export const config = { matcher: ['/', '/account/:page*'] };
```



    In the above example, the home page `/` can be viewed by unauthenticated users. The `/account` page and its children can only be viewed by authenticated users.

  - | Composable

    The middleware can be implemented in the `middleware.ts` file. This is a composable middleware solution that handles the session management part for you but leaves the redirect and route protection logic to you.

    #### middleware.ts



```js
import { authkit } from '@workos-inc/authkit-nextjs';
import { NextResponse } from 'next/server';

export default async function middleware(request) {
  // Perform logic before or after AuthKit

  // Auth object contains the session, response headers and an authorization
  // URL in the case that the session isn't valid. This method will automatically
  // handle setting the cookie and refreshing the session
  const {
    session,
    headers: authkitHeaders,
    authorizationUrl,
  } = await authkit(request, {
    debug: true,
  });

  const { pathname } = new URL(request.url);

  // Control of what to do when there's no session on a protected route
  // is left to the developer
  if (pathname.startsWith('/account') && !session.user) {
    console.log('No session on protected path');

    // Preserve AuthKit headers on redirects (e.g., cookies)
    const response = NextResponse.redirect(authorizationUrl);
    for (const [key, value] of authkitHeaders) {
      if (key.toLowerCase() === 'set-cookie') {
        response.headers.append(key, value);
      } else {
        response.headers.set(key, value);
      }
    }
    return response;
  }

  // Forward the incoming request headers and then add AuthKit's headers
  const response = NextResponse.next({
    request: { headers: new Headers(request.headers) },
  });

  for (const [key, value] of authkitHeaders) {
    if (key.toLowerCase() === 'set-cookie') {
      response.headers.append(key, value);
    } else {
      response.headers.set(key, value);
    }
  }

  return response;
}

// Match against pages that require authentication
// Leave this out if you want authentication on every page in your application
export const config = { matcher: ['/', '/account'] };
```



  ### Callback route

  When a user has authenticated via AuthKit, they will be redirected to your app's callback route. Make sure this route matches the `WORKOS_REDIRECT_URI` environment variable and the configured redirect URI in your WorkOS dashboard.

  #### /app/callback/route.ts



```js
import { handleAuth } from '@workos-inc/authkit-nextjs';

// Redirect the user to `/` after successful sign in
// The redirect can be customized: `handleAuth({ returnPathname: '/foo' })`
export const GET = handleAuth();
```



  ### Login endpoint

  We'll need a login endpoint to direct users to sign in using AuthKit before redirecting them back to your application. We'll do this by generating an AuthKit authorization URL server side and redirecting the user to it.

  #### /app/login/route.ts



```js
import { getSignInUrl } from '@workos-inc/authkit-nextjs';
import { redirect } from 'next/navigation';

export const GET = async () => {
  const signInUrl = await getSignInUrl();

  return redirect(signInUrl);
};
```



  ### Access authentication data

  AuthKit can be used in both server and client components.

  - | Server component

    The `withAuth` method is used to retrieve the current logged in user and their details.

    #### /app/home-page/page.jsx



```jsx
import Link from 'next/link';
import { getSignUpUrl, withAuth } from '@workos-inc/authkit-nextjs';

export default async function HomePage() {
  // Retrieves the user from the session or returns `null` if no user is signed in
  const { user } = await withAuth();

  // Get the URL to redirect the user to AuthKit to sign up
  const signUpUrl = await getSignUpUrl();

  if (!user) {
    return (
      <>
        <a href="/login">Sign in</a>
        <Link href={signUpUrl}>Sign up</Link>
      </>
    );
  }

  return (
    <>
      <p>Welcome back{user.firstName && `, ${user.firstName}`}</p>
    </>
  );
}
```



  - | Client component

    The `useAuth` hook is used to retrieve the current logged in user and their details.

    #### /app/home-page/page.jsx



```jsx
'use client';

import { useAuth } from '@workos-inc/authkit-nextjs/components';

export default function HomePage() {
  // Retrieves the user from the session or returns `null` if no user is signed in
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <p>Welcome back{user.firstName && `, ${user.firstName}`}</p>
    </>
  );
}
```



  ### Protected routes

  For routes where a signed in user is mandatory, you can use the `ensureSignedIn` option.

  - | Server component

    #### /app/protected/page.tsx



```jsx
import { withAuth } from '@workos-inc/authkit-nextjs';

export default async function ProtectedPage() {
  // If the user isn't signed in, they will be automatically redirected to AuthKit
  const { user } = await withAuth({ ensureSignedIn: true });

  return (
    <>
      <p>Welcome back{user.firstName && `, ${user.firstName}`}</p>
    </>
  );
}
```



  - | Client component

    #### /app/protected/page.jsx



```jsx
'use client';

import { useAuth } from '@workos-inc/authkit-nextjs/components';

export default function HomePage() {
  // If the user isn't signed in, they will be automatically redirected to AuthKit
  const { user, loading } = useAuth({ ensureSignedIn: true });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <p>Welcome back{user.firstName && `, ${user.firstName}`}</p>
    </>
  );
}
```



  ### Ending the session

  Finally, ensure the user can end their session by redirecting them to the logout URL. After successfully signing out, the user will be redirected to your app's [Logout redirect](/docs/authkit/sessions/configuring-sessions/logout-redirect) location, which is configured in the WorkOS dashboard.

  #### /app/home-page/page.jsx



```jsx
import Link from 'next/link';
import {
  getSignUpUrl,
  withAuth,
  // +diff-start
  signOut,
  // +diff-end
} from '@workos-inc/authkit-nextjs';

export default async function HomePage() {
  // Retrieves the user from the session or returns `null` if no user is signed in
  const { user } = await withAuth();

  // Get the URL to redirect the user to AuthKit to sign up
  const signUpUrl = await getSignUpUrl();

  if (!user) {
    return (
      <>
        <a href="/login">Sign in</a>
        <Link href={signUpUrl}>Sign up</Link>
      </>
    );
  }

  return (
    // +diff-start
    <form
      action={async () => {
        'use server';
        await signOut();
      }}
    >
      // +diff-end
      <p>Welcome back{user.firstName && `, ${user.firstName}`}</p>
      // +diff-start
      <button type="submit">Sign out</button>
    </form>
    // +diff-end
  );
}
```



- $ frontend="remix"

  ### Callback route

  When a user has authenticated via AuthKit, they will be redirected to your app's callback route. In your Remix app, [create a new route](https://remix.run/docs/en/main/discussion/routes) and add the following:

  #### /routes/callback.ts



```js
import { authLoader } from '@workos-inc/authkit-remix';

export const loader = authLoader();
```



  ### Login endpoint

  We'll need a login endpoint to direct users to sign in using AuthKit before redirecting them back to your application. We'll do this by generating an AuthKit authorization URL server side and redirecting the user to it.

  #### /routes/login.ts



```js
import { redirect } from '@remix-run/node';
import { getSignInUrl } from '@workos-inc/authkit-remix';

export const loader = async () => {
  const signInUrl = await getSignInUrl();

  return redirect(signInUrl);
};
```



  ### Access authentication data in your Remix application

  We'll need to direct users to sign in (or sign up) using AuthKit before redirecting them back to your application. We'll do this by generating an AuthKit authorization URL server side and redirecting the user to it.

  Use `authkitLoader` to configure AuthKit for your Remix application routes. You can choose to return custom data from your loader, like for instance the sign in and sign out URLs.

  #### /app/routes/_index.jsx



```jsx
import { json } from '@remix-run/node';
import { Form, Link, useLoaderData } from '@remix-run/react';
import { getSignUpUrl, authkitLoader } from '@workos-inc/authkit-remix';

export const loader = (args) =>
  authkitLoader(args, async ({ request, auth }) => {
    return json({
      signUpUrl: await getSignUpUrl(),
    });
  });

export default function Index() {
  // Retrieves the user from the session or returns `null` if no user is signed in
  const { user, signUpUrl } = useLoaderData();

  if (!user) {
    return (
      <>
        <a href="/login">Log in</a>
        <br />
        <Link to={signUpUrl}>Sign Up</Link>
      </>
    );
  }

  return (
    <Form method="post">
      <p>Welcome back {user?.firstName && `, ${user?.firstName}`}</p>
    </Form>
  );
}
```



  ### Protected routes

  For routes where a signed in user is mandatory, you can use the `ensureSignedIn` option in your loader.

  #### /app/protected/route.tsx



```jsx
import { Form, useLoaderData } from '@remix-run/react';
import { authkitLoader } from '@workos-inc/authkit-remix';

export const loader = (args) => authkitLoader(args, { ensureSignedIn: true });

export default function ProtectedPage() {
  // If the user isn't signed in, they will be automatically redirected to AuthKit
  const { user } = useLoaderData();

  return (
    <>
      <p>Welcome back {user?.firstName && `, ${user?.firstName}`}</p>
    </>
  );
}
```



  ### Ending the session

  Finally, ensure the user can end their session by redirecting them to the logout URL. After successfully signing out, the user will be redirected to your app's [Logout redirect](/docs/authkit/sessions/configuring-sessions/logout-redirect) location, which is configured in the WorkOS dashboard.

  #### /app/routes/_index.jsx



```jsx
import { json } from '@remix-run/node';
import { Form, Link, useLoaderData } from '@remix-run/react';
import {
  getSignUpUrl,
  authkitLoader,
  // +diff-start
  signOut,
  // +diff-end
} from '@workos-inc/authkit-remix';

export const loader = (args) =>
  authkitLoader(args, async ({ request, auth }) => {
    return json({
      signUpUrl: await getSignUpUrl(),
    });
  });

// +diff-start
export async function action({ request }) {
  return await signOut(request);
}
// +diff-end

export default function Index() {
  // Retrieves the user from the session or returns `null` if no user is signed in
  const { user, signUpUrl } = useLoaderData();

  if (!user) {
    return (
      <>
        <a href="/login">Log in</a>
        <br />
        <Link to={signUpUrl}>Sign Up</Link>
      </>
    );
  }

  return (
    <Form method="post">
      <p>Welcome back {user?.firstName && `, ${user?.firstName}`}</p>
      // +diff-start
      <button type="submit">Sign out</button>
      // +diff-end
    </Form>
  );
}
```



- $ frontend="vanilla, react"

  ### Set up the frontend

  To demonstrate AuthKit, we only need a simple page with links to logging in and out.

- $ frontend="vanilla"

  #### index.html



```html
<!doctype html>
<html lang="en">
  <head>
    <title>AuthKit example</title>
  </head>
  <body>
    <h1>AuthKit example</h1>
    <p>This is an example of how to use AuthKit with an HTML frontend.</p>
    <p>
      <a href="/login">Sign in</a>
    </p>
    <p>
      <a href="/logout">Sign out</a>
    </p>
  </body>
</html>
```



- $ frontend="react"

  #### App.js



```jsx
export default function App() {
  return (
    <div className="App">
      <h1>AuthKit example</h1>
      <p>This is an example of how to use AuthKit with a React frontend.</p>
      <p>
        <a href="/login">Sign in</a>
      </p>
      <p>
        <a href="/logout">Sign out</a>
      </p>
    </div>
  );
}
```



- $ frontend="vanilla, react"

  Clicking the "Sign in" and "Sign out" links should invoke actions on our server, which we'll set up next.

- $ backend="nodejs, ruby, php, go, python, java"

  ### Add a login endpoint

  We'll need a login endpoint to direct users to sign in (or sign up) using AuthKit before redirecting them back to your application. This endpoint should generate an AuthKit authorization URL server side and redirect the user to it.

  You can use the optional state parameter to encode arbitrary information to help restore application `state` between redirects.

- $ backend="nodejs"

  For this guide we'll be using the `express` web server for Node. This guide won't cover how to set up an Express app, but you can find more information in the [Express documentation](https://expressjs.com/en/starter/installing.html).

  #### server.js



```jsx
const express = require('express');
const { WorkOS } = require('@workos-inc/node');

const app = express();
const workos = new WorkOS(process.env.WORKOS_API_KEY, {
  clientId: process.env.WORKOS_CLIENT_ID,
});

// This `/login` endpoint should be registered as the login endpoint
// on the "Redirects" page of the WorkOS Dashboard.
app.get('/login', (req, res) => {
  const authorizationUrl = workos.userManagement.getAuthorizationUrl({
    // Specify that we'd like AuthKit to handle the authentication flow
    provider: 'authkit',

    // The callback endpoint that WorkOS will redirect to after a user authenticates
    redirectUri: 'http://localhost:3000/callback',
    clientId: process.env.WORKOS_CLIENT_ID,
  });

  // Redirect the user to the AuthKit sign-in page
  res.redirect(authorizationUrl);
});
```



- $ backend="ruby"

  For this guide we'll be using the `sinatra` web server for Ruby. This guide won't cover how to set up a Sinatra app, but you can find more information in the [Sinatra documentation](https://sinatrarb.com/intro.html).

  #### server.rb



```ruby
require "dotenv/load"
require "workos"
require "sinatra"

WorkOS.configure do |config|
  config.key = ENV["WORKOS_API_KEY"]
end

get "/login" do
  authorization_url = WorkOS::UserManagement.authorization_url(
    provider: "authkit",
    client_id: ENV["WORKOS_CLIENT_ID"],
    redirect_uri: "http://localhost:4567/callback"
  )

  redirect authorization_url
end
```



- $ backend="python"

  For this guide we'll be using the `flask` web server for Python. This guide won't cover how to set up a Flask app, but you can find more information in the [Flask documentation](https://flask.palletsprojects.com/en/stable/).

  #### server.py



```python
from dotenv import load_dotenv
import os
from flask import Flask, redirect
from workos import WorkOSClient

load_dotenv()

app = Flask(__name__)

workos = WorkOSClient(
    api_key=os.getenv("WORKOS_API_KEY"), client_id=os.getenv("WORKOS_CLIENT_ID")
)


@app.route("/login")
def login():
    authorization_url = workos.user_management.get_authorization_url(
        provider="authkit", redirect_uri=os.getenv("WORKOS_REDIRECT_URI")
    )

    return redirect(authorization_url)


if __name__ == "__main__":
    app.run(debug=True, port=3000)
```



- $ backend="nodejs, ruby, python"

  > WorkOS will redirect to your [Redirect URI](/docs/glossary/redirect-uri) if there is an issue generating an authorization URL. Read our [API Reference](/docs/reference) for more details.

  ### Add a callback endpoint

  Next, let's add the callback endpoint (referenced in [Configure a redirect URI](/docs/authkit/1-configure-your-project/configure-a-redirect-uri)) which will exchange the authorization code (valid for 10 minutes) for an authenticated User object.

- $ backend="nodejs"

  #### server.js



```js
const express = require('express');
const { WorkOS } = require('@workos-inc/node');

const app = express();

const workos = new WorkOS(process.env.WORKOS_API_KEY, {
  clientId: process.env.WORKOS_CLIENT_ID,
});

app.get('/callback', async (req, res) => {
  // The authorization code returned by AuthKit
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('No code provided');
  }

  const { user } = await workos.userManagement.authenticateWithCode({
    code,
    clientId: process.env.WORKOS_CLIENT_ID,
  });

  // Use the information in `user` for further business logic.

  // Redirect the user to the homepage
  return res.redirect('/');
});
```



- $ backend="ruby"

  #### server.rb



```ruby
get "/callback" do
  code = params["code"]

  begin
    auth_response = WorkOS::UserManagement.authenticate_with_code(
      client_id: ENV["WORKOS_CLIENT_ID"],
      code: code
    )

    # Use the information in auth_response for further business logic.

    redirect "/"
  rescue => e
    puts e
    redirect "/login"
  end
end
```



- $ backend="python"

  #### server.py



```python
from dotenv import load_dotenv
import os

# +diff-start
from flask import Flask, redirect, request, make_response, url_for

# +diff-end
from workos import WorkOSClient

load_dotenv()

app = Flask(__name__)

workos = WorkOSClient(
    api_key=os.getenv("WORKOS_API_KEY"), client_id=os.getenv("WORKOS_CLIENT_ID")
)

cookie_password = os.getenv("WORKOS_COOKIE_PASSWORD")


@app.route("/login")
def login():
    authorization_url = workos.user_management.get_authorization_url(
        provider="authkit", redirect_uri=os.getenv("WORKOS_REDIRECT_URI")
    )

    return redirect(authorization_url)


# +diff-start
@app.route("/callback")
def callback():
    code = request.args.get("code")

    try:
        auth_response = workos.user_management.authenticate_with_code(
            code=code,
        )

        # Use the information in auth_response for further business logic.

        response = make_response(redirect("/"))

        return response

    except Exception as e:
        print("Error authenticating with code", e)
        return redirect(url_for("/login"))


# +diff-end

if __name__ == "__main__":
    app.run(debug=True, port=3000)
```



- $ backend="nodejs, ruby, python"

  ## (3) Handle the user session

  Session management helper methods are included in our SDKs to make integration easy. For security reasons, sessions are automatically "sealed", meaning they are encrypted with a strong password.

  ### Create a session password

  The SDK requires you to set a strong password to encrypt cookies. This password must be 32 characters long. You can generate a secure password by using the [1Password generator](https://1password.com/password-generator/) or the `openssl` library via the command line:

  ```bash title="Generate a strong password"
  openssl rand -base64 24
  ```

  Then add it to the environment variables file.

  ```plain title=".env"
  WORKOS_API_KEY='sk_example_123456789'
  WORKOS_CLIENT_ID='client_123456789'

  # +diff-start
  WORKOS_COOKIE_PASSWORD='<your password>'
  # +diff-end
  ```

  ### Save the encrypted session

  Next, use the SDK to authenticate the user and return a password protected session. The refresh token is considered sensitive as it can be used to re-authenticate, hence why the session is encrypted before storing it in a session cookie.

- $ backend="nodejs"

  #### server.js



```js
import cookieParser from 'cookie-parser';

app.use(cookieParser());

app.get('/callback', async (req, res) => {
  // The authorization code returned by AuthKit
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('No code provided');
  }

  // +diff-start
  try {
    const authenticateResponse =
      await workos.userManagement.authenticateWithCode({
        clientId: process.env.WORKOS_CLIENT_ID,
        code,
        session: {
          sealSession: true,
          cookiePassword: process.env.WORKOS_COOKIE_PASSWORD,
        },
      });

    const { user, sealedSession } = authenticateResponse;

    // Store the session in a cookie
    res.cookie('wos-session', sealedSession, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    // Use the information in `user` for further business logic.

    // Redirect the user to the homepage
    return res.redirect('/');
  } catch (error) {
    return res.redirect('/login');
  }
  // +diff-end
});
```



  ### Protected routes

  Then, use middleware to specify which routes should be protected. If the session has expired, use the SDK to attempt to generate a new one.

  #### server.js



```js
import { WorkOS } from '@workos-inc/node';

const workos = new WorkOS(process.env.WORKOS_API_KEY, {
  clientId: process.env.WORKOS_CLIENT_ID,
});

// Auth middleware function
async function withAuth(req, res, next) {
  const session = workos.userManagement.loadSealedSession({
    sessionData: req.cookies['wos-session'],
    cookiePassword: process.env.WORKOS_COOKIE_PASSWORD,
  });

  const { authenticated, reason } = await session.authenticate();

  if (authenticated) {
    return next();
  }

  // If the cookie is missing, redirect to login
  if (!authenticated && reason === 'no_session_cookie_provided') {
    return res.redirect('/login');
  }

  // If the session is invalid, attempt to refresh
  try {
    const { authenticated, sealedSession } = await session.refresh();

    if (!authenticated) {
      return res.redirect('/login');
    }

    // update the cookie
    res.cookie('wos-session', sealedSession, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    // Redirect to the same route to ensure the updated cookie is used
    return res.redirect(req.originalUrl);
  } catch (e) {
    // Failed to refresh access token, redirect user to login page
    // after deleting the cookie
    res.clearCookie('wos-session');
    res.redirect('/login');
  }
}
```



  Add the middleware to the route that should only be accessible to logged in users.

  #### server.js



```js
// Specify the `withAuth` middleware function we defined earlier to protect this route
app.get('/dashboard', withAuth, async (req, res) => {
  const session = workos.userManagement.loadSealedSession({
    sessionData: req.cookies['wos-session'],
    cookiePassword: process.env.WORKOS_COOKIE_PASSWORD,
  });

  const { user } = await session.authenticate();

  console.log(`User ${user.firstName} is logged in`);

  // ... render dashboard page
});
```



  ### Ending the session

  Finally, ensure the user can end their session by redirecting them to the logout URL. After successfully signing out, the user will be redirected to your app's [Logout redirect](/docs/authkit/sessions/configuring-sessions/logout-redirect) location, which is configured in the WorkOS dashboard.

  #### server.js



```js
app.get('/logout', async (req, res) => {
  const session = workos.userManagement.loadSealedSession({
    sessionData: req.cookies['wos-session'],
    cookiePassword: process.env.WORKOS_COOKIE_PASSWORD,
  });

  const url = await session.getLogoutUrl();

  res.clearCookie('wos-session');
  res.redirect(url);
});
```



- $ backend="ruby"

  #### server.rb



```ruby
get "/callback" do
  code = params["code"]

  begin
    auth_response = WorkOS::UserManagement.authenticate_with_code(
      client_id: ENV["WORKOS_CLIENT_ID"],
      code: code,
      # +diff-start
      session: {
        seal_session: true,
        cookie_password: ENV["WORKOS_COOKIE_PASSWORD"]
      }
      # +diff-end
    )

    # +diff-start
    # store the session in a cookie
    response.set_cookie(
      "wos_session",
      value: auth_response.sealed_session,
      httponly: true,
      secure: true,
      samesite: "lax"
    )
    # +diff-end

    # Use the information in auth_response for further business logic.

    redirect "/"
  rescue => e
    puts e
    redirect "/login"
  end
end
```



  ### Protected routes

  Then, use a helper method to specify which routes should be protected. If the session has expired, use the SDK to attempt to generate a new one.

  #### server.rb



```ruby
helpers do
  def with_auth(request, response)
    session = WorkOS::UserManagement.load_sealed_session(
      client_id: ENV["WORKOS_CLIENT_ID"],
      session_data: request.cookies["wos_session"],
      cookie_password: ENV["WORKOS_COOKIE_PASSWORD"]
    )

    session.authenticate => { authenticated:, reason: }

    return if authenticated == true

    redirect "/login" if !authenticated && reason == "NO_SESSION_COOKIE_PROVIDED"

    # If no session, attempt a refresh
    begin
      session.refresh => { authenticated:, sealed_session: }

      redirect "/login" if !authenticated

      response.set_cookie(
        "wos_session",
        value: sealed_session,
        httponly: true,
        secure: true,
        samesite: "lax"
      )

      # Redirect to the same route to ensure the updated cookie is used
      redirect request.url
    rescue => e
      warn e
      response.delete_cookie("wos_session")
      redirect "/login"
    end
  end
end
```



  Call the helper method in the route that should only be accessible to logged in users.

  #### server.rb



```ruby
get "/dashboard" do
  with_auth(request, response)

  session = WorkOS::UserManagement.load_sealed_session(
    client_id: ENV["WORKOS_CLIENT_ID"],
    session_data: request.cookies["wos_session"],
    cookie_password: ENV["WORKOS_COOKIE_PASSWORD"]
  )

  session.authenticate => { authenticated:, user: }

  redirect "/login" if !authenticated

  puts "User #{user[:first_name]} is logged in"

  # Render a dashboard view
end
```



  ### Ending the session

  Finally, ensure the user can end their session by redirecting them to the logout URL. After successfully signing out, the user will be redirected to your app's [Logout redirect](/docs/authkit/sessions/configuring-sessions/logout-redirect) location, which is configured in the WorkOS dashboard.

  #### server.rb



```ruby
get "/logout" do
  session = WorkOS::UserManagement.load_sealed_session(
    client_id: ENV["WORKOS_CLIENT_ID"],
    session_data: request.cookies["wos_session"],
    cookie_password: ENV["WORKOS_COOKIE_PASSWORD"]
  )

  url = session.get_logout_url

  response.delete_cookie("wos_session")

  # After log out has succeeded, the user will be redirected to your
  # app homepage which is configured in the WorkOS dashboard
  redirect url
end
```



- $ backend="python"

  #### server.py



```python
from dotenv import load_dotenv
import os
from flask import Flask, redirect, request, make_response, url_for
from workos import WorkOSClient

load_dotenv()

app = Flask(__name__)

workos = WorkOSClient(
    api_key=os.getenv("WORKOS_API_KEY"), client_id=os.getenv("WORKOS_CLIENT_ID")
)

cookie_password = os.getenv("WORKOS_COOKIE_PASSWORD")


@app.route("/login")
def login():
    authorization_url = workos.user_management.get_authorization_url(
        provider="authkit", redirect_uri=os.getenv("WORKOS_REDIRECT_URI")
    )

    return redirect(authorization_url)


@app.route("/callback")
def callback():
    code = request.args.get("code")

    try:
        auth_response = workos.user_management.authenticate_with_code(
            code=code,
            # +diff-start
            session={"seal_session": True, "cookie_password": cookie_password},
            # +diff-end
        )

        response = make_response(redirect("/"))
        # +diff-start
        # store the session in a cookie
        response.set_cookie(
            "wos_session",
            auth_response.sealed_session,
            secure=True,
            httponly=True,
            samesite="lax",
        )
        # +diff-end
        return response

    except Exception as e:
        print("Error authenticating with code", e)
        return redirect(url_for("/login"))


if __name__ == "__main__":
    app.run(debug=True, port=3000)
```



  ### Protected routes

  Then, use a decorator to specify which routes should be protected. If the session has expired, use the SDK to attempt to generate a new one.

  #### server.py



```python
from dotenv import load_dotenv
import os

# +diff-start
from functools import wraps

# +diff-end
from flask import Flask, redirect, request, make_response, url_for
from workos import WorkOSClient

load_dotenv()

app = Flask(__name__)

workos = WorkOSClient(
    api_key=os.getenv("WORKOS_API_KEY"), client_id=os.getenv("WORKOS_CLIENT_ID")
)

cookie_password = os.getenv("WORKOS_COOKIE_PASSWORD")

# +diff-start
# Decorator to check if the user is authenticated. If not, redirect to login
def with_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        session = workos.user_management.load_sealed_session(
            sealed_session=request.cookies.get("wos_session"),
            cookie_password=cookie_password,
        )
        auth_response = session.authenticate()
        if auth_response.authenticated:
            return f(*args, **kwargs)

        if (
            auth_response.authenticated is False
            and auth_response.reason == "no_session_cookie_provided"
        ):
            return make_response(redirect("/login"))

        # If no session, attempt a refresh
        try:
            print("Refreshing session")
            result = session.refresh()
            if result.authenticated is False:
                return make_response(redirect("/login"))

            response = make_response(redirect(request.url))
            response.set_cookie(
                "wos_session",
                result.sealed_session,
                secure=True,
                httponly=True,
                samesite="lax",
            )
            return response
        except Exception as e:
            print("Error refreshing session", e)
            response = make_response(redirect("/login"))
            response.delete_cookie("wos_session")
            return response

    return decorated_function


# +diff-end


@app.route("/login")
def login():
    authorization_url = workos.user_management.get_authorization_url(
        provider="authkit", redirect_uri=os.getenv("WORKOS_REDIRECT_URI")
    )

    return redirect(authorization_url)


@app.route("/callback")
def callback():
    code = request.args.get("code")

    try:
        auth_response = workos.user_management.authenticate_with_code(
            code=code,
            session={"seal_session": True, "cookie_password": cookie_password},
        )

        response = make_response(redirect("/"))

        # store the session in a cookie
        response.set_cookie(
            "wos_session",
            auth_response.sealed_session,
            secure=True,
            httponly=True,
            samesite="lax",
        )

        return response

    except Exception as e:
        print("Error authenticating with code", e)
        return redirect(url_for("/login"))


if __name__ == "__main__":
    app.run(debug=True, port=3000)
```



  Use the decorator in the route that should only be accessible to logged in users.

  #### server.py



```python
@app.route("/dashboard")
@with_auth
def dashboard():
    session = workos.user_management.load_sealed_session(
        sealed_session=request.cookies.get("wos_session"),
        cookie_password=cookie_password,
    )

    response = session.authenticate()

    current_user = response.user if response.authenticated else None

    print(f"User {current_user.first_name} is logged in")

    # Render a dashboard view


# +diff-end
```



  ### Ending the session

  Finally, ensure the user can end their session by redirecting them to the logout URL. After successfully signing out, the user will be redirected to your app's Logout redirect location, which is configured in the WorkOS dashboard.

  #### server.py



```python
@app.route("/logout")
def logout():
    session = workos.user_management.load_sealed_session(
        sealed_session=request.cookies.get("wos_session"),
        cookie_password=cookie_password,
    )
    url = session.get_logout_url()

    # After log out has succeeded, the user will be redirected to your
    # app homepage which is configured in the WorkOS dashboard
    response = make_response(redirect(url))
    response.delete_cookie("wos_session")

    return response
```



> If you haven't configured a [Logout redirect](/docs/authkit/sessions/configuring-sessions/logout-redirect) in the WorkOS dashboard, users will see an error when logging out.

### Validate the authentication flow

Navigate to the authentication endpoint we created and sign up for an account. You can then sign in with the newly created credentials and see the user listed in the _Users_ section of the [WorkOS Dashboard](https://dashboard.workos.com).

![Dashboard showing newly created user](https://images.workoscdn.com/images/54fa6e6c-4c6f-4959-9301-344aeb4eeac8.png?auto=format&fit=clip&q=80)
