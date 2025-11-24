# Multi-Factor Authentication


## Introduction

The Multi-Factor Authentication (MFA) API is intended to be a composable, unopinionated set of endpoints that can be integrated into existing application/session management strategies.

The available types of authentication factors are:

- `totp` – Time-based one-time password
- `sms` – One-time password via SMS message

> The MFA API is not intended to be used with the WorkOS SSO feature. It’s recommended to leverage the MFA features of the Identity Provider that is powering your SSO implementation.

## What you’ll build

In this guide, we’ll walk you through the process of enrolling new authentication factors for a user, and the challenge/verification process for existing authentication factors.

This guide will show you how to:

1. Create an Authentication Factor
2. Challenge the Authentication Factor
3. Verify the Challenge

## Before getting started

To get the most out of this guide, you’ll need:

- A [WorkOS account](https://dashboard.workos.com/)

## API object definitions

[Authentication Factor](/docs/reference/mfa/authentication-factor)
: A factor of authentication that can be used in conjunction with a primary factor to provide multiple factors of authentication.

[Authentication Challenge](/docs/reference/mfa/authentication-challenge)
: A request for an Authentication Factor to be verified.

## (1) Create an Authentication Factor

We’ll first need to enroll a new Authentication Factor.

### Install the WorkOS SDK

WorkOS offers native SDKs in several popular programming languages. Choose a language below to see instructions in your application’s language.

<LanguageSelector>
  Install the SDK using the command below.

   #### Install the WorkOS SDK



```python
pip install workos
```



```go
go get -u github.com/workos/workos-go/...
```



```php
composer require workos/workos-php
```



```laravel
composer require workos/workos-php-laravel
```



```dotnet
nuget install WorkOS.net
```


    #### npm



```js
npm install @workos-inc/node
```


    #### Yarn



```js
yarn add @workos-inc/node
```


    #### Maven



```java
<dependency>
  <groupId>com.workos</groupId>
  <artifactId>workos</artifactId>
  <version>{version}</version>
</dependency>
```


    #### Gradle



```java
dependencies {
  implementation 'com.workos:workos:VERSION'
}
```


    #### Terminal



```ruby
gem install workos
```


    #### Bundler



```ruby
gem "workos"
```


  
</LanguageSelector>

### Set secrets

To make calls to WorkOS, provide the API key and, in some cases, the client ID. Store these values as managed secrets, such as `WORKOS_API_KEY` and `WORKOS_CLIENT_ID`, and pass them to the SDKs either as environment variables or directly in your app's configuration based on your preferences.

```plain title="Environment variables"
WORKOS_API_KEY='sk_example_123456789'
WORKOS_CLIENT_ID='client_123456789'
```

### Enroll the Authentication Factor

- | Using TOTP

  Use the TOTP type when the user is using a third-party authenticator app such as Google Authenticator or Authy.

  #### Enroll Endpoint



```js
import { WorkOS } from '@workos-inc/node';

const workos = new WorkOS('sk_example_123456789');

const factor = await workos.mfa.enrollFactor({
  type: 'totp',
  issuer: 'Foo Corp',
  user: 'alan.turing@example.com',
});
```



```ruby
require "workos"

WorkOS.configure do |config|
  config.key = "sk_example_123456789"
end

factor = WorkOS::MFA.enroll_factor(
  type: "totp",
  totp_issuer: "Foo Corp",
  totp_user: "alan.turing@example.com"
)
```



```python
from workos import WorkOSClient

workos_client = WorkOSClient(
    api_key="sk_example_123456789", client_id="client_123456789"
)

factor_type = "totp"
organization = "Foo Corp"
email = "alan.turing@example.com"
response = workos_client.mfa.enroll_factor(
    type=factor_type, totp_issuer=organization, totp_user=email
)
```



```go
package main

import (
	"context"

	"github.com/workos/workos-go/v3/pkg/mfa"
)

func main() {
	mfa.SetAPIKey("sk_example_123456789")

	enroll, err := mfa.EnrollFactor(context.Background(), mfa.EnrollFactorOpts{
		Type:       "totp",
		TOTPIssuer: "Foo Corp",
		TOTPUser:   "alan.turing@example.com",
	})
}
```



```php
<?php

WorkOS\WorkOS::setApiKey("sk_example_123456789");

$mfa = new WorkOS\MFA();

$type = "totp";
$totpIssuer = "Foo Corp";
$totpUser = "alan.turing@example.com";

$factor = $mfa->enrollFactor(
    type: $type,
    totpIssuer: $totpIssuer,
    totpUser: $totpUser
);
```



```laravel
<?php

WorkOS\WorkOS::setApiKey("sk_example_123456789");

$mfa = new WorkOS\MFA();

$type = "totp";
$totpIssuer = "Foo Corp";
$totpUser = "alan.turing@example.com";

$factor = $mfa->enrollFactor(
    type: $type,
    totpIssuer: $totpIssuer,
    totpUser: $totpUser
);
```



```java
import com.workos.WorkOS;
import com.workos.mfa.MfaApi.EnrollFactorOptions;
import com.workos.mfa.models.Factor;

WorkOS workos = new WorkOS("sk_example_123456789");

EnrollFactorOptions options = EnrollFactorOptions.builder()
                                  .type("totp")
                                  .issuer("Foo Corp")
                                  .user("alan.turing@example.com")
                                  .build();

Factor factor = workos.mfa.enrollFactor(options);
```



```dotnet
WorkOS.SetApiKey("sk_example_123456789");

var mfaService = new MfaService();

var options = new EnrollTotpFactorOptions("Foo Corp", "alan.turing@example.com");
var factor = await mfaService.EnrollFactor(options);
```



  The response returns a `qr_code` and a secret. The `qr_code` value is a base64 encoded data URI that is used to [display the QR code](https://css-tricks.com/data-uris/) in your application for enrollment with an authenticator application.

  The `secret` can be entered into some authenticator applications in place of scanning a QR code.

- | Using SMS

  Use the SMS type when the user wants to receive one time passwords as SMS messages to their mobile device.

  Phone number must be valid. An error will be returned for malformed or invalid phone numbers.

  #### Enroll Endpoint



```js
import { WorkOS } from '@workos-inc/node';

const workos = new WorkOS('sk_example_123456789');

const factor = await workos.mfa.enrollFactor({
  type: 'sms',
  phoneNumber: '+15005550006',
});
```



```python
from workos import WorkOSClient

workos_client = WorkOSClient(
    api_key="sk_example_123456789", client_id="client_123456789"
)

factor_type = "sms"
phone_number = "+15005550006"
response = workos_client.mfa.enroll_factor(type=factor_type, phone_number=phone_number)
```



```go
package main

import (
	"context"

	"github.com/workos/workos-go/v3/pkg/mfa"
)

func main() {
	mfa.SetAPIKey("sk_example_123456789")

	enroll, err := mfa.EnrollFactor(context.Background(), mfa.EnrollFactorOpts{
		Type:        "sms",
		PhoneNumber: "+15005550006",
	})
}
```



```php
<?php

WorkOS\WorkOS::setApiKey("sk_example_123456789");

$mfa = new WorkOS\MFA();

$type = "sms";
$phoneNumber = "+15005550006";

$factor = $mfa->enrollFactor(type: $type, phoneNumber: $phoneNumber);
```



```laravel
<?php

WorkOS\WorkOS::setApiKey("sk_example_123456789");

$mfa = new WorkOS\MFA();

$type = "sms";
$phoneNumber = "+15005550006";

$factor = $mfa->enrollFactor(type: $type, phoneNumber: $phoneNumber);
```



```java
import com.workos.WorkOS;
import com.workos.mfa.MfaApi.EnrollFactorOptions;
import com.workos.mfa.models.Factor;

WorkOS workos = new WorkOS("sk_example_123456789");

EnrollFactorOptions options =
    EnrollFactorOptions.builder().type("sms").phoneNumber("+15005550006").build();

Factor factor = workos.mfa.enrollFactor(options);
```



```dotnet
WorkOS.SetApiKey("sk_example_123456789");

var mfaService = new MfaService();

var options = new EnrollSmsFactorOptions("+15005550006");
var factor = await mfaService.EnrollFactor(options);
```



Now that we’ve successfully created an authentication factor, we’ll need to save the ID for later use. It’s recommended that you persist the factor ID in your own user model according to your application’s needs.

## (2) Challenge the Authentication Factor

Next we’ll initiate the authentication process for the newly created factor which we’ll refer to as a challenge.

- | Create Authentication Challenge

  #### Challenge Endpoint



```js
import { WorkOS } from '@workos-inc/node';

const workos = new WorkOS('sk_example_123456789');

const challenge = await workos.mfa.challengeFactor({
  authenticationFactorId: 'auth_factor_01FVYZ5QM8N98T9ME5BCB2BBMJ',
});
```



```ruby
require "workos"

WorkOS.configure do |config|
  config.key = "sk_example_123456789"
end

challenge = WorkOS::MFA.challenge_factor(
  authentication_factor_id: "auth_factor_01FZ4TS0MWPZR7GATS7KCXANQZ"
)
```



```python
from workos import WorkOSClient

workos_client = WorkOSClient(
    api_key="sk_example_123456789", client_id="client_123456789"
)

factor_id = "auth_factor_01FY7SABJNSPYR7CT052GNDQ49"
response = workos_client.mfa.challenge_factor(authentication_factor_id=factor_id)
```



```go
package main

import (
	"context"

	"github.com/workos/workos-go/v3/pkg/mfa"
)

func main() {
	mfa.SetAPIKey("sk_example_123456789")

	challenge, err := mfa.ChallengeFactor(context.Background(), mfa.ChallengeFactorOpts{
		FactorID: "auth_factor_01FVYZ5QM8N98T9ME5BCB2BBM",
	})
}
```



```php
<?php

WorkOS\WorkOS::setApiKey("sk_example_123456789");

$mfa = new WorkOS\MFA();

$authenticationFactorId = "auth_factor_01FXNWW32G7F3MG8MYK5D1HJJM";

$challenge = $mfa->challengeFactor($authenticationFactorId);
```



```laravel
<?php

WorkOS\WorkOS::setApiKey("sk_example_123456789");

$mfa = new WorkOS\MFA();

$authenticationFactorId = "auth_factor_01FXNWW32G7F3MG8MYK5D1HJJM";

$challenge = $mfa->challengeFactor($authenticationFactorId);
```



```java
import com.workos.WorkOS;
import com.workos.mfa.MfaApi.ChallengeFactorOptions;
import com.workos.mfa.models.Challenge;

WorkOS workos = new WorkOS("sk_example_123456789");

String authenticationFactorId = "auth_factor_01FY7SABJNSPYR7CT052GNDQ49";

ChallengeFactorOptions options = ChallengeFactorOptions.builder()
                                     .authenticationFactorId(authenticationFactorId)
                                     .build();

Challenge challenge = workos.mfa.challengeFactor(options);
```



```dotnet
WorkOS.SetApiKey("sk_example_123456789");

var mfaService = new MfaService();

var options = new ChallengeFactorOptions {
    FactorId = "auth_factor_01FVYZ5QM8N98T9ME5BCB2BBMJ",
};

var response = await mfaService.ChallengeFactor(options);
```



- | Sending Custom SMS Message

  When challenging an SMS authentication factor, you can pass an optional SMS template to customize the SMS message that is sent to the end user. Use the `{{code}}` token to inject the one time password into the message.

  #### Challenge Endpoint



```js
import { WorkOS } from '@workos-inc/node';

const workos = new WorkOS('sk_example_123456789');

const enrollResponse = await workos.mfa.challengeFactor({
  authenticationFactorId: 'auth_factor_01FVYZ5QM8N98T9ME5BCB2BBMJ',
  smsTemplate: 'Your FooCorp is {{code}}.',
});
```



```ruby
require "workos"

WorkOS.configure do |config|
  config.key = "sk_example_123456789"
end

challenge = WorkOS::MFA.challenge_factor(
  authentication_factor_id: "auth_factor_01FZ4TS14D1PHFNZ9GF6YD8M1F",
  sms_template: "Your code is {{code}}"
)
```



```python
from workos import WorkOSClient

workos_client = WorkOSClient(
    api_key="sk_example_123456789", client_id="client_123456789"
)

factor_id = "auth_factor_01FY7SABJNSPYR7CT052GNDQ49"
message = "Your code is {{code}}"
response = workos_client.mfa.challenge_factor(
    authentication_factor_id=factor_id, sms_template=message
)
```



```go
package main

import (
	"context"

	"github.com/workos/workos-go/v3/pkg/mfa"
)

func main() {
	mfa.SetAPIKey("sk_example_123456789")

	challenge, err := mfa.ChallengeFactor(context.Background(), mfa.ChallengeFactorOpts{
		FactorID:    "auth_factor_01FVYZ5QM8N98T9ME5BCB2BBM",
		SMSTemplate: "Your code is {{code}}",
	})
}
```



```php
<?php

WorkOS\WorkOS::setApiKey("sk_example_123456789");

$mfa = new WorkOS\MFA();

$authenticationFactorId = "auth_factor_01FXNWW32G7F3MG8MYK5D1HJJM";
$smsTemplate = "Your code is {{code}}";

$challenge = $mfa->challengeFactor($authenticationFactorId, $smsTemplate);
```



```laravel
<?php

WorkOS\WorkOS::setApiKey("sk_example_123456789");

$mfa = new WorkOS\MFA();

$authenticationFactorId = "auth_factor_01FXNWW32G7F3MG8MYK5D1HJJM";
$smsTemplate = "Your code is {{code}}";

$challenge = $mfa->challengeFactor($authenticationFactorId, $smsTemplate);
```



```java
import com.workos.WorkOS;
import com.workos.mfa.MfaApi.ChallengeFactorOptions;
import com.workos.mfa.models.Challenge;

WorkOS workos = new WorkOS("sk_example_123456789");

String authenticationFactorId = "auth_factor_01FY7SABJNSPYR7CT052GNDQ49";
String smsTemplate = "Your code is {{code}}";

ChallengeFactorOptions options = ChallengeFactorOptions.builder()
                                     .authenticationFactorId(authenticationFactorId)
                                     .smsTemplate(smsTemplate)
                                     .build();

Challenge challenge = workos.mfa.challengeFactor(options);
```



```dotnet
WorkOS.SetApiKey("sk_example_123456789");

var mfaService = new MfaService();

var options = new ChallengeSmsFactorOptions("Your FooCorp is {{code}}.") {
    FactorId = "auth_factor_01FVYZ5QM8N98T9ME5BCB2BBMJ",
};

var challenge = await mfaService.ChallengeFactor(options);
```



Now that we’ve successfully challenged the authentication factor, we’ll need to save the challenge ID for the last step, challenge verification.

## (3) Verify the Challenge

The last step in the authentication process is to verify the one time password provided by the end-user.

#### Verify Endpoint



```js
import { WorkOS } from '@workos-inc/node';

const workos = new WorkOS('sk_example_123456789');

const { challenge, valid } = await workos.mfa.verifyChallenge({
  authenticationChallengeId: 'auth_challenge_01FVYZWQTZQ5VB6BC5MPG2EYC5',
  code: '123456',
});
```



```ruby
require "workos"

WorkOS.configure do |config|
  config.key = "sk_example_123456789"
end

response = WorkOS::MFA.verify_challenge(
  authentication_challenge_id: "auth_challenge_01FZ4YVRBMXP5ZM0A7BP4AJ12J",
  code: "123456"
)
```



```python
from workos import WorkOSClient

workos_client = WorkOSClient(
    api_key="sk_example_123456789", client_id="client_123456789"
)

challenge_id = "auth_challenge_01FY7SGMZVEQ8AAGZER2XRQ5NJ"
challenge_code = "123456"
response = workos_client.mfa.verify_challenge(
    authentication_challenge_id=challenge_id, code=challenge_code
)
```



```go
package main

import (
	"context"

	"github.com/workos/workos-go/v3/pkg/mfa"
)

func main() {
	mfa.SetAPIKey("sk_example_123456789")

	verify, err := mfa.VerifyChallenge(context.Background(), mfa.VerifyChallengeOpts{
		ChallengeID: "auth_challenge_01FVYZWQTZQ5VB6BC5MPG2EYC5",
		Code:        "123456",
	})
}
```



```php
<?php

WorkOS\WorkOS::setApiKey("sk_example_123456789");

$mfa = new WorkOS\MFA();

$authenticationChallengeId = "auth_challenge_01FXNX3BTZPPJVKF65NNWGRHZJ";
$code = "123456";

$response = $mfa->verifyChallenge($authenticationChallengeId, $code);
```



```laravel
<?php

WorkOS\WorkOS::setApiKey("sk_example_123456789");

$mfa = new WorkOS\MFA();

$authenticationChallengeId = "auth_challenge_01FXNX3BTZPPJVKF65NNWGRHZJ";
$code = "123456";

$response = $mfa->verifyChallenge($authenticationChallengeId, $code);
```



```java
import com.workos.WorkOS;
import com.workos.mfa.MfaApi.VerifyChallengeOptions;
import com.workos.mfa.MfaApi.VerifyChallengeResponse;

WorkOS workos = new WorkOS("sk_example_123456789");

String authenticationChallengeId = "auth_challenge_01FVYZWQTZQ5VB6BC5MPG2EYC5";
String code = "123456";

VerifyChallengeOptions options = VerifyChallengeOptions.builder()
                                     .authenticationChallengeId(authenticationChallengeId)
                                     .code(code)
                                     .build();

VerifyChallengeResponse response = workos.mfa.verifyChallenge(options);
```



```dotnet
WorkOS.SetApiKey("sk_example_123456789");

var mfaService = new MfaService();

var options = new VerifyChallengeOptions {
    ChallengeId = "auth_challenge_01FVYZWQTZQ5VB6BC5MPG2EYC5",
    Code = "12345",
};

var response = await mfaService.VerifyChallenge(options);
```



### Verification Response

If the challenge is successfully verified `valid` will return `true`. Otherwise it will return `false` and another verification attempt must be made.

#### Response



```json
{
  "challenge": {
    "object": "authentication_challenge",
    "id": "auth_challenge_01FVYZWQTZQ5VB6BC5MPG2EYC5",
    "created_at": "2022-02-15T15:26:53.274Z",
    "updated_at": "2022-02-15T15:26:53.274Z",
    "expires_at": "2022-02-15T15:36:53.279Z",
    "authentication_factor_id": "auth_factor_01FVYZ5QM8N98T9ME5BCB2BBMJ"
  },
  "valid": true
}
```



### Already Verified Error

If a challenge was already successfully verified, it cannot be used a second time. If further verification is needed in your application, create a new challenge.

#### Response



```json
{
  "code": "authentication_challenge_previously_verified",
  "message": "The authentication challenge 'auth_challenge_01FVYZWQTZQ5VB6BC5MPG2EYC5' has already been verified."
}
```



### Expired Error

For SMS authentication factors, challenges are only available for verification for 10 minutes. After that they are expired and cannot be verified.

#### Response



```json
{
  "code": "authentication_challenge_expired",
  "message": "The authentication challenge 'auth_challenge_01FVYZWQTZQ5VB6BC5MPG2EYC5' has expired."
}
```



We’ve now successfully verified an end-user’s authentication factor. This authentication factor can now be used as a second factor of authentication in your application’s existing authentication strategy.

The ID of the authentication factor should be persisted in your application for future authentication challenges.
