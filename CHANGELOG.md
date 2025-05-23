# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.8.1](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v2.8.0...v2.8.1) (2025-05-15)

## [2.8.0](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v2.7.5...v2.8.0) (2025-05-15)


### Features

* add phone property in sing-up endpoints ([5384ed5](https://github.com/BrewInteractive/authentication-service-nestjs/commit/5384ed58f6105f19fcab8b979a369860aee86b0a))

### [2.7.5](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v2.7.4...v2.7.5) (2025-05-14)

### [2.7.4](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v2.7.3...v2.7.4) (2025-05-14)

### [2.7.3](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v2.7.2...v2.7.3) (2025-02-28)

### [2.7.2](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v2.7.1...v2.7.2) (2025-02-24)

### [2.7.1](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v2.7.0...v2.7.1) (2025-02-24)

## [2.7.0](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v2.6.2...v2.7.0) (2025-02-20)


### Features

* add language param for notification ([321542c](https://github.com/BrewInteractive/authentication-service-nestjs/commit/321542c0948fc57edb9f6b45960bd3a8367a5209))

### [2.6.2](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v2.6.1...v2.6.2) (2025-02-03)


### Bug Fixes

* fix for delete user error ([29d59a0](https://github.com/BrewInteractive/authentication-service-nestjs/commit/29d59a0981a95c92b60b20d342a619ac59379bbd))
* fix for token service ([97717f2](https://github.com/BrewInteractive/authentication-service-nestjs/commit/97717f253526287e52111bcd77b47b773cd59326))

### [2.6.1](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v2.6.0...v2.6.1) (2024-10-02)


### Bug Fixes

* fix custom claims user role mapping either flat or object userRole ([308c538](https://github.com/BrewInteractive/authentication-service-nestjs/commit/308c5385349ffe34fbf5a9c955bdb640ab864faa))

## [2.6.0](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v2.5.0...v2.6.0) (2024-08-21)


### Features

* Add TemplateModule to app.module.ts ([312c7ff](https://github.com/BrewInteractive/authentication-service-nestjs/commit/312c7ff17c88b53190545fdff26e0d8d4e574ad5))

## [2.5.0](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v2.4.2...v2.5.0) (2024-07-22)


### Features

* Add phone verified and alter password fields in users ([331f8ff](https://github.com/BrewInteractive/authentication-service-nestjs/commit/331f8ffcbf893a9ac64cc7c14632e252dc741484))
* add POST /send-signup-otp-email endpoint ([2f6171a](https://github.com/BrewInteractive/authentication-service-nestjs/commit/2f6171ae5f189e0494672636eddd71f9a23ce3fc))
* add POST /send-signup-otp-phone endpoint ([6df564b](https://github.com/BrewInteractive/authentication-service-nestjs/commit/6df564b2d47f6a4119e2c057b24ddbc286d2bc1e))
* add sign-up otp email e2e test with auth notification sign-up template ([8f6d6fb](https://github.com/BrewInteractive/authentication-service-nestjs/commit/8f6d6fb3cf13abf87e56bb93ae4cc2f9482a1ba6))
* add sign-up otp phone e2e test with auth notification sign-up template ([6da1ce7](https://github.com/BrewInteractive/authentication-service-nestjs/commit/6da1ce7b36b7fdbd01832b27ed6d1e365f7d45a4))
* add sign-up-otp-phone and email endpoint ([d9f1895](https://github.com/BrewInteractive/authentication-service-nestjs/commit/d9f189518afba411645524a8e13d417aa91f0405))
* add signup otp templates ([7257d2a](https://github.com/BrewInteractive/authentication-service-nestjs/commit/7257d2a409a7f61abaa7c57d426561ef0cbc5547))
* Drop user identifier constraint and add with phone number and country code in PostgreSQL migrations ([b01d153](https://github.com/BrewInteractive/authentication-service-nestjs/commit/b01d153184b454e4b00753362a3869de92530417))


### Bug Fixes

* lint, format and fix duplicate roles mapping ([36bc244](https://github.com/BrewInteractive/authentication-service-nestjs/commit/36bc244b0a590ffc292fd266234eccd007f14feb))

### [2.4.2](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v2.4.1...v2.4.2) (2024-07-05)


### Bug Fixes

* fix for token custom claims ([7f3a73a](https://github.com/BrewInteractive/authentication-service-nestjs/commit/7f3a73acddbb6e434a638734694f32e832ec4720))

### [2.4.1](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v2.4.0...v2.4.1) (2024-06-12)

## [2.4.0](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v2.3.0...v2.4.0) (2024-05-30)


### Features

* Add LoginPhoneOtpProfile for mapping LoginOtpPhoneRequest ([c982f88](https://github.com/BrewInteractive/authentication-service-nestjs/commit/c982f8883cec7afb83efb01f3757bd8629d7e4ff))
* Add RefreshTokenResponse to refresh token controller ([8092428](https://github.com/BrewInteractive/authentication-service-nestjs/commit/809242882beb3175c45a6165683a3eaeb46df60b))
* add send login otp phone controller and its tests. ([f875c63](https://github.com/BrewInteractive/authentication-service-nestjs/commit/f875c63ae9210ca28d467e650c0695e5698685bb))
* create sendgrid email provider ([72e752b](https://github.com/BrewInteractive/authentication-service-nestjs/commit/72e752bbdce02702e7cd89d8a51f03276437f11a))
* Remove LoginOtpPhoneRequest from LoginProfile ([e606817](https://github.com/BrewInteractive/authentication-service-nestjs/commit/e606817b240fcd1431fb27cba111f9741c2ed0db))


### Bug Fixes

* change send login otp phone request to adapt phone dto. ([c8d1105](https://github.com/BrewInteractive/authentication-service-nestjs/commit/c8d11052b5d522aeebbe7389fc0474686d490640))
* create migration to make country code and phone number to be unique together. ([0a522dd](https://github.com/BrewInteractive/authentication-service-nestjs/commit/0a522ddd368369ac332e83aea5601a40417887de))
* edit jest.setup ([e110788](https://github.com/BrewInteractive/authentication-service-nestjs/commit/e110788718014c5315f0626d75a7e43623a508af))
* edit jest.setup.ts ([239e1f0](https://github.com/BrewInteractive/authentication-service-nestjs/commit/239e1f0f1e018fd68365cec676ca5f3e4d6187a5))
* fixed typo in filename. ([d669005](https://github.com/BrewInteractive/authentication-service-nestjs/commit/d6690058845ecab4c5f0068c92bfce68445c38de))
* unused import ([9d1e7b6](https://github.com/BrewInteractive/authentication-service-nestjs/commit/9d1e7b65fca8d1db11d6798deb79d3e9c2f03471))

## [2.3.0](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v2.2.0...v2.3.0) (2024-05-27)


### Features

* Generate random OTP result when sending OTP ([f4b8322](https://github.com/BrewInteractive/authentication-service-nestjs/commit/f4b832241c74f6ea605f1d9b211e814695472f13))
* Remove unused import in otp.service.ts ([3db4e8e](https://github.com/BrewInteractive/authentication-service-nestjs/commit/3db4e8ef02b96866c2e728561827317ab222646a))

## [2.2.0](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v2.1.0...v2.2.0) (2024-05-27)


### Features

* Add fake OTP result for user not found ([f0a598f](https://github.com/BrewInteractive/authentication-service-nestjs/commit/f0a598f89de973ade2bc43103fe17f2f1642b2cc))
* Add fake OTP result for user not found ([430ce04](https://github.com/BrewInteractive/authentication-service-nestjs/commit/430ce048c47debc833d9b8aafd65ea08d4f8f590))
* Add faker library for generating fake OTP results ([3fcbab6](https://github.com/BrewInteractive/authentication-service-nestjs/commit/3fcbab6e08ab953ef168bc2742084760c54b4a72))
* Add faker library for generating fake OTP results ([736fed4](https://github.com/BrewInteractive/authentication-service-nestjs/commit/736fed482e000aa8e40cfec84527fff4ac2f49df))
* Fix error handling in SendLoginOtpEmailController ([4a8579d](https://github.com/BrewInteractive/authentication-service-nestjs/commit/4a8579d6dc461421625b802af6d4a23a2e1a3644))
* Fix error handling in SendLoginOtpEmailController ([618be7a](https://github.com/BrewInteractive/authentication-service-nestjs/commit/618be7a82ef38e7dc59ff61908f635bafdff578e))
* Handle invalid credentials in SendLoginOtpEmailController ([3b5f639](https://github.com/BrewInteractive/authentication-service-nestjs/commit/3b5f639c116126b27ecec726a2ee0b438b7136f0))
* Handle invalid credentials in SendLoginOtpEmailController ([971eb4e](https://github.com/BrewInteractive/authentication-service-nestjs/commit/971eb4edfbb3b09b67f1a2fcad8494f3fdea4a37))
* Refactor error classes to extend ExtendedError ([3163c54](https://github.com/BrewInteractive/authentication-service-nestjs/commit/3163c54e5c9cb15a32876c38a230d90ee0ed0aff))
* Refactor OTP service to support phone OTPs and create `createPhoneOtpAsync` method ([7c704c2](https://github.com/BrewInteractive/authentication-service-nestjs/commit/7c704c27c4a308a48150b624ed605ba5c089de3b))
* Refactor SendLoginOtpEmailController to handle user not found scenario ([b9d1e68](https://github.com/BrewInteractive/authentication-service-nestjs/commit/b9d1e68e658f1b6965481b1281464d18e380c8e3))
* Refactor SendLoginOtpEmailController to handle user not found scenario ([fbe1e9c](https://github.com/BrewInteractive/authentication-service-nestjs/commit/fbe1e9c9d80b9a9ee4f6b6924b499d8fe5624454))
* Remove duplicate import in otp.service.ts ([7cbef3e](https://github.com/BrewInteractive/authentication-service-nestjs/commit/7cbef3e7ecfe8f80b700effc8e6bd73f239b28f9))
* Remove unused imports in otp.service.spec.ts ([0cb982c](https://github.com/BrewInteractive/authentication-service-nestjs/commit/0cb982cba5d78aa9aa7d045ec3904f7bc700b6f3))

## [2.1.0](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v2.0.1...v2.1.0) (2024-05-24)


### Features

* Add login OTP SMS template and service method ([543eedc](https://github.com/BrewInteractive/authentication-service-nestjs/commit/543eedc86645de4c6b01b921f0ae28c350f4cd9d))
* Add MutluCell SMS service configuration ([d1a6a24](https://github.com/BrewInteractive/authentication-service-nestjs/commit/d1a6a245f7166cc25e2143d6b11c0954478e1c9b))
* add MutluCellSmsService implementation ([3813021](https://github.com/BrewInteractive/authentication-service-nestjs/commit/3813021ac2d98eefdbf2aead922334f5254a0978))
* add otp value generator ([4ff36c0](https://github.com/BrewInteractive/authentication-service-nestjs/commit/4ff36c0d4f0f27d8e6c191e17a2505877d46d3d6))
* add phone number and country code to users table. ([357bebe](https://github.com/BrewInteractive/authentication-service-nestjs/commit/357bebea4177ef60f89d76199518611bd3e7948a))
* Add phone number and country code validation to getUserAsync method ([7830eb1](https://github.com/BrewInteractive/authentication-service-nestjs/commit/7830eb1203132f6c091928d587af30ff9542e861))
* Add phone OTP created event ([cc39ad4](https://github.com/BrewInteractive/authentication-service-nestjs/commit/cc39ad4e621ea8a8791f512b9dfc50f83a7702cb))
* add sms service ([ac89f52](https://github.com/BrewInteractive/authentication-service-nestjs/commit/ac89f52819523d2cf45b51d2faf77dcda99f4bfe))
* create custom validation pipe and its tests. ([b4d64e9](https://github.com/BrewInteractive/authentication-service-nestjs/commit/b4d64e94ec35e374dec2f3b98587b2a817882052))
* expire otp function is added to otp service and used in login otp email controller. ([46a6d34](https://github.com/BrewInteractive/authentication-service-nestjs/commit/46a6d345a0f2f918ce1197c6f563c0d9dd5ab30e))
* Improve error message in getUserAsync method ([4b582b7](https://github.com/BrewInteractive/authentication-service-nestjs/commit/4b582b75143fd742c7d3ed3f3c06ee657658bd90))
* refactor create otp function to work with phone channel and create createPhoneOtpAsync method. ([057716d](https://github.com/BrewInteractive/authentication-service-nestjs/commit/057716d4737d953d264363e74836c3650970f39f))
* Refactor getUserAsync method to include all user arguments ([9f010f4](https://github.com/BrewInteractive/authentication-service-nestjs/commit/9f010f4d9a35c4e6383eeafd628244847e4e100d))


### Bug Fixes

* edit validation error fields message. ([3f762c6](https://github.com/BrewInteractive/authentication-service-nestjs/commit/3f762c634ab4f74ac3daea4ad4391854fadd3a2b))
* fix test case in controller login otp email. ([3aa0410](https://github.com/BrewInteractive/authentication-service-nestjs/commit/3aa0410b5237e02ebe5c21bceb6f9575ee6365d4))
* fix typo in field name phoneNumber. ([0987b38](https://github.com/BrewInteractive/authentication-service-nestjs/commit/0987b385b7086797dce6c65825ff839a87b831c6))
* fix validation error extention test case. ([c58d108](https://github.com/BrewInteractive/authentication-service-nestjs/commit/c58d108b2ab7773876b692b1c39d2eaf1be2692a))
* remove html files and add folder to gitignore. ([a998bba](https://github.com/BrewInteractive/authentication-service-nestjs/commit/a998bba029d8a6bc3e09e5e635e4089e58b09c49))
* remove unused import. ([134ea58](https://github.com/BrewInteractive/authentication-service-nestjs/commit/134ea583638fa5e940901affa032bc13be0f5d18))

### [2.0.1](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v2.0.0...v2.0.1) (2024-05-21)


### Bug Fixes

* Add NotificationModule to app.module.ts ([6d325f3](https://github.com/BrewInteractive/authentication-service-nestjs/commit/6d325f356dc5ab3be86c08ba308ae65acebf24af))

## [2.0.0](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.14.4...v2.0.0) (2024-05-20)


### ⚠ BREAKING CHANGES

* changes error responses and some controller succesful reponses.

### Features

* add forgot-password endpoint ([80cabe4](https://github.com/BrewInteractive/authentication-service-nestjs/commit/80cabe4dba632a05d9f193ddbbe4fc4b4ec02164))
* create an event handler reset-password-request-created event in notification service. ([9e2e162](https://github.com/BrewInteractive/authentication-service-nestjs/commit/9e2e1623ffca2fb2e4c4421e5fc87126254c9cb4))
* create createEmailOtpAsync method in otp service ([c7ee986](https://github.com/BrewInteractive/authentication-service-nestjs/commit/c7ee9862b508f9c67a9531fe7bf8d3aca7fd270d))
* create login otp email controller ([fb38a2f](https://github.com/BrewInteractive/authentication-service-nestjs/commit/fb38a2fa58f214fc789e08c1f4958e7afb71a8c4))
* create notification module ([08fbafa](https://github.com/BrewInteractive/authentication-service-nestjs/commit/08fbafa5112e3ec991597550c52ca329aee1b7de))
* create otp email template ([43c6fe1](https://github.com/BrewInteractive/authentication-service-nestjs/commit/43c6fe19515bf60d504dfc9d084cfe9815a19e9d))
* create otp module ([4971dc3](https://github.com/BrewInteractive/authentication-service-nestjs/commit/4971dc3d2ef1b4c0f0178abb822a6c00c0725f21))
* create otps tables ([59d206c](https://github.com/BrewInteractive/authentication-service-nestjs/commit/59d206c6f04aab66cce7407495a5dc4a2c142d5b))
* create smtp email provider ([6460343](https://github.com/BrewInteractive/authentication-service-nestjs/commit/646034343c06b1c54dc0480f3651ce2b2e62335d))
* **create-reset-password-request:** add reset password env to .env.example ([2af2aae](https://github.com/BrewInteractive/authentication-service-nestjs/commit/2af2aaee815eb4c7d9620acd457ad569a111f306))
* **create-reset-password-request:** createResetPasswordRequest function in reset-password service. ([eb4897d](https://github.com/BrewInteractive/authentication-service-nestjs/commit/eb4897dbb1c9f27f6b2b9de25966affd4602f411))
* created response classes. ([cc34c41](https://github.com/BrewInteractive/authentication-service-nestjs/commit/cc34c410194c5e5ae45ccf9482ce7c5f275670fd))
* Refactor reset password controller and service ([d5a02af](https://github.com/BrewInteractive/authentication-service-nestjs/commit/d5a02af42c7cd8b3540e406090475773bad4e89b))
* update configurations files ([3c2efe5](https://github.com/BrewInteractive/authentication-service-nestjs/commit/3c2efe549e2b1c317108dfc0fcd885c2fe3440eb))
* update template service ([512080a](https://github.com/BrewInteractive/authentication-service-nestjs/commit/512080a7ef9dbf161ab75b35b15b81cb8b03b59c))
* **VILLB-6:** add unit test for controller. ([be4e985](https://github.com/BrewInteractive/authentication-service-nestjs/commit/be4e9858e69d36a062739c615e4cd83f9043c236))
* **VILLB-6:** create send login otp email controller and test cases. ([42779da](https://github.com/BrewInteractive/authentication-service-nestjs/commit/42779da27443c27da299cec473a7fceda5aac318))
* **VILLB-6:** fix minor sonar issue ([5009cd6](https://github.com/BrewInteractive/authentication-service-nestjs/commit/5009cd6c7ea35f6e48a03c75dbea5f98f7534209))
* **VILLB-6:** make controller response snake case. ([9cc6523](https://github.com/BrewInteractive/authentication-service-nestjs/commit/9cc6523447e2cf450b702e408c1f3edfa5d9f894))
* **VILLB-6:** removed otpvalue from response, refactored event emitter call, removed EventEmitter module import from login module decl. ([4facaa1](https://github.com/BrewInteractive/authentication-service-nestjs/commit/4facaa1a1deaa9bbc764bd46d44faf4de97f3516))


### Bug Fixes

* Add ActiveResetPasswordRequestExistsError class ([3301176](https://github.com/BrewInteractive/authentication-service-nestjs/commit/3301176568112b7b9fb60bb8554a7fdba519b392))
* add foreign key constraints to User and Role in UserRole entity ([c93ecaa](https://github.com/BrewInteractive/authentication-service-nestjs/commit/c93ecaac880c923f41603e9246404b5e0974441e))
* add NOW() update for reset_password request expires_at before setting NOT NULL constraint ([fc067a5](https://github.com/BrewInteractive/authentication-service-nestjs/commit/fc067a51b881766b0597e019ac0de1e30710b119))
* **create-reset-password-request:** rename function and add expires at check to getActiveResetPasswordRequestByEmail. ([9e08b1c](https://github.com/BrewInteractive/authentication-service-nestjs/commit/9e08b1cda5332c39e85bed593ca45d68dbde4321))
* fix for nullable constraint for expires_at column in user-reset-password-request entity ([2b48072](https://github.com/BrewInteractive/authentication-service-nestjs/commit/2b48072deb59200c19429924cbff50d6cdd0366c))
* fix typo in function name. ([b338694](https://github.com/BrewInteractive/authentication-service-nestjs/commit/b338694d4a9979123a0a312d4b82809249e4cd2f))
* make the smtp secured. ([b9ac3d7](https://github.com/BrewInteractive/authentication-service-nestjs/commit/b9ac3d7575b57f9d2748ddc3042366fb8368f4c8))
* make the smtp secured. ([427c7ce](https://github.com/BrewInteractive/authentication-service-nestjs/commit/427c7ce42f2a53786045533a0ab082916ae5c25b))
* update reset password error handling ([3f8b6ad](https://github.com/BrewInteractive/authentication-service-nestjs/commit/3f8b6ad2e69d92609e8dd8579ed041849c8ff069))
* **VILLB-6:** change controller and controller spec file name, change test case descriptions, change variable names. ([0a236c2](https://github.com/BrewInteractive/authentication-service-nestjs/commit/0a236c26164310a156b8aed54e551cd6957bfd85))


* refactor responses. ([ff9f98d](https://github.com/BrewInteractive/authentication-service-nestjs/commit/ff9f98d8793381ce7d4afc596ff3cd8087d7dca0))

### [1.14.4](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.14.3...v1.14.4) (2024-04-26)


### Bug Fixes

* fix e2e test for remove jest mock ([3ab1953](https://github.com/BrewInteractive/authentication-service-nestjs/commit/3ab1953faad68591e9835088a53d3f4454b53179))
* fix for app module test ([3de7e09](https://github.com/BrewInteractive/authentication-service-nestjs/commit/3de7e091d573c5b9fc30508d6478cca0d398ae53))
* fixed password validation. ([daac595](https://github.com/BrewInteractive/authentication-service-nestjs/commit/daac595b8a791291fb799c04f72e251c7da8e029))

### [1.14.3](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.14.2...v1.14.3) (2024-01-23)

### [1.14.2](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.14.1...v1.14.2) (2024-01-23)

### [1.14.1](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.14.0...v1.14.1) (2024-01-22)


### Bug Fixes

* fix subject issue for MailService.sendEmail ([9727b68](https://github.com/BrewInteractive/authentication-service-nestjs/commit/9727b687f0e4c15e667236ffb11027ef77a665f9))

## [1.14.0](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.13.1...v1.14.0) (2024-01-05)


### Features

* Add basePath configuration to support API versioning ([8865d8c](https://github.com/BrewInteractive/authentication-service-nestjs/commit/8865d8caa7af5cc3c5f3576eb8b8d99662360c62))

### [1.13.1](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.13.0...v1.13.1) (2024-01-04)


### Bug Fixes

* Update user-reset-password-request entity and migrations ([fec87e8](https://github.com/BrewInteractive/authentication-service-nestjs/commit/fec87e8bc5e64c56d8337228cc9830b146c46100))

## [1.13.0](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.12.0...v1.13.0) (2024-01-04)


### Features

* **TS-209:** add send reset password email request ([f0f8ac0](https://github.com/BrewInteractive/authentication-service-nestjs/commit/f0f8ac0c80979242a8bca03be85a0f92df715646))


### Bug Fixes

* dynamic email service environment value for e2e tests ([911c722](https://github.com/BrewInteractive/authentication-service-nestjs/commit/911c722ed90cef4a01a9675a87e5565a4289fab4))
* format project ([3c87cb9](https://github.com/BrewInteractive/authentication-service-nestjs/commit/3c87cb908ebf15f0fe21d20efbf9dc9599a17777))
* mock config() in reset-password.module.spec.ts ([126deec](https://github.com/BrewInteractive/authentication-service-nestjs/commit/126deecd53aba5a3f6265bb8accf342c889f63d9))
* remove unnecessary type for sonar issue ([4148eca](https://github.com/BrewInteractive/authentication-service-nestjs/commit/4148ecab9f211fa8d1b00398dbe8a68bd883d3a3))
* **TS-209:** fix for app module test ([4306812](https://github.com/BrewInteractive/authentication-service-nestjs/commit/4306812db91666f6477929661844827b9921f151))
* **TS-252:** fix app module test ([38fb66b](https://github.com/BrewInteractive/authentication-service-nestjs/commit/38fb66bad275b403ba32d4d8cf733c873d13cd07))
* **TS-252:** fix for app and reset password test ([f9ddcb6](https://github.com/BrewInteractive/authentication-service-nestjs/commit/f9ddcb6cc254549a02679c68b6d1da9c9da18880))

## [1.12.0](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.11.1...v1.12.0) (2023-12-25)


### Features

* add user module ref in PluginModule ([28b25d3](https://github.com/BrewInteractive/authentication-service-nestjs/commit/28b25d313f78047ec58ecf9821cc0054fde71e25))
* plugin module integrated ([8fd1d38](https://github.com/BrewInteractive/authentication-service-nestjs/commit/8fd1d3884a850d0de49d41f498cddca87986d1a3))
* **TS-187:** create refresh-token module ([920a27c](https://github.com/BrewInteractive/authentication-service-nestjs/commit/920a27cd9916bfb3226536f7c124e52783a1c40d))
* **TS-204:** add template module tests. ([d8e8845](https://github.com/BrewInteractive/authentication-service-nestjs/commit/d8e88452d13370c9bac996d1651c4859462dc709))
* **TS-204:** add template plugin to read me. ([615ec30](https://github.com/BrewInteractive/authentication-service-nestjs/commit/615ec30d9e5ad1ebd494011a049f825fd0bf5cdc))
* **TS-204:** add test case for html. ([b730b46](https://github.com/BrewInteractive/authentication-service-nestjs/commit/b730b46a3f0a2116d5f3de70a6e877ba29ed1355))
* **TS-204:** injectData now only compiles mjml template and getResetPasswordEmailTemplate now only return html. ([1a76495](https://github.com/BrewInteractive/authentication-service-nestjs/commit/1a76495c2d62c80a591092fadf8e288e33819498))
* **TS-204:** made service editable via plugin and inject data now accepts html. ([1ee8612](https://github.com/BrewInteractive/authentication-service-nestjs/commit/1ee861222e15fe766f65e3a9eca207f97c011747))
* **TS-204:** template service and getResetPasswordEmail method. ([1375c78](https://github.com/BrewInteractive/authentication-service-nestjs/commit/1375c78643ec2657a1d344b1d07417caa35b9ff5))
* **TS-241:** implemented createRefreshTokenAsync func. ([8aa4158](https://github.com/BrewInteractive/authentication-service-nestjs/commit/8aa415808ea8b6247eefd39f8bd6962b05ca94bf))
* **TS-253:** update refresh token method ([3236a52](https://github.com/BrewInteractive/authentication-service-nestjs/commit/3236a527959f6d0985dc91e832b47ebddcd170d6))


### Bug Fixes

* fix for migrations ([b48fff2](https://github.com/BrewInteractive/authentication-service-nestjs/commit/b48fff28b9baddc86ca2f33cab75e64a49403251))
* **TS-204:** add property to ts-config esModuleInterop ([27887f0](https://github.com/BrewInteractive/authentication-service-nestjs/commit/27887f0c80af1fc577ffaf5263e70e522b7b0d77))
* **TS-204:** change mjml import to require. ([ba08884](https://github.com/BrewInteractive/authentication-service-nestjs/commit/ba088840c47a2ee3b32858a8894a0d88abe7af18))
* **TS-204:** created dto for reset password email data. ([170b7c4](https://github.com/BrewInteractive/authentication-service-nestjs/commit/170b7c44204c50745f48f263a44f078d883f6ee7))
* **TS-204:** edit test case to make into coverage. ([c6766a9](https://github.com/BrewInteractive/authentication-service-nestjs/commit/c6766a9feb94601210c376165aecad458e8a2a6f))
* **TS-204:** made template service test working. ([d5e336c](https://github.com/BrewInteractive/authentication-service-nestjs/commit/d5e336cd33a8f1d985f0b1267e9f3a132fb8b90c))
* **TS-204:** made templates folder to go into dist. ([81ca7a1](https://github.com/BrewInteractive/authentication-service-nestjs/commit/81ca7a1e8351f701976862a0c4fbe9bc94cfe9a0))
* **TS-204:** refactored template service. ([f57a32b](https://github.com/BrewInteractive/authentication-service-nestjs/commit/f57a32b385b5c0db74d3dd48d3c01a1d60254dd8))
* **TS-204:** remove getResetPasswordEmail, ([670d35b](https://github.com/BrewInteractive/authentication-service-nestjs/commit/670d35b6a60d2e0a27a5c170219a778578a76ae0))
* **TS-204:** removed code smell. ([f076609](https://github.com/BrewInteractive/authentication-service-nestjs/commit/f076609e9701169a2e2df72ecc0ae37adafd6e35))
* **TS-204:** removed code smell. ([584b2ce](https://github.com/BrewInteractive/authentication-service-nestjs/commit/584b2cef490222089b696c7fb0ab1a8be9f05d1d))
* **TS-204:** removed unused import. ([306bc47](https://github.com/BrewInteractive/authentication-service-nestjs/commit/306bc471fe2ea51e0f34f94cecda5ea3bf9bc11b))
* **TS-204:** rename private method. ([19b2110](https://github.com/BrewInteractive/authentication-service-nestjs/commit/19b211071882c1045b4204f9a5c8a125bee3c229))
* **TS-241:** covered all lines for tests. ([7ec9881](https://github.com/BrewInteractive/authentication-service-nestjs/commit/7ec98813b16b5785254bde0284cb054db378ef1b))
* **TS-241:** rafactor function names also in test cases. ([7d48821](https://github.com/BrewInteractive/authentication-service-nestjs/commit/7d48821a543fbf29309e54eff2d4f47fa17ee537))
* **TS-241:** refactor function and variable names. ([029cc68](https://github.com/BrewInteractive/authentication-service-nestjs/commit/029cc68914f527e71abfccae959c3fd30e343745))
* **TS-274:** validateResetPasswordRequest function name ([3243f2e](https://github.com/BrewInteractive/authentication-service-nestjs/commit/3243f2e6a2884384d0e2b4e81288c16c2d5db26a))
* type ([073b557](https://github.com/BrewInteractive/authentication-service-nestjs/commit/073b557c90622859604b691cbfbecb1c12a7d7c7))

### [1.11.1](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.11.0...v1.11.1) (2023-11-13)

## [1.11.0](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.10.0...v1.11.0) (2023-11-13)


### Features

* **TS-205:** add reset-password.mjml template ([099d695](https://github.com/BrewInteractive/authentication-service-nestjs/commit/099d69520cb5d1e463ea1b2c1a693ec99297f078))


### Bug Fixes

* fix for conflict ([5872e1d](https://github.com/BrewInteractive/authentication-service-nestjs/commit/5872e1dad91389f6b71a96a8d41e6a96e9a0d360))
* fix for conflict ([ddd547d](https://github.com/BrewInteractive/authentication-service-nestjs/commit/ddd547d345a51b8f3e1dc42f7542f343ec8d3247))
* fix for conflict ([e6fb7b8](https://github.com/BrewInteractive/authentication-service-nestjs/commit/e6fb7b87334b48039778cb96c0dee3a2b37b0079))
* fix for conflict file ([e1f15dc](https://github.com/BrewInteractive/authentication-service-nestjs/commit/e1f15dcccad4749b08bed9444986a511336a2deb))
* fix for package-lock.json ([8a063b9](https://github.com/BrewInteractive/authentication-service-nestjs/commit/8a063b9d33454ce4a079a979cd89fdc5c192fa62))
* fix for reset password convert number to string for user_id ([556b34b](https://github.com/BrewInteractive/authentication-service-nestjs/commit/556b34b454124d7ecb607188060a9d0fe676197c))
* **TS-205:** edit reset button href link ([41b03e3](https://github.com/BrewInteractive/authentication-service-nestjs/commit/41b03e3b6f51e07b46d4f16bb811689c2bc28053))

## [1.10.0](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.9.0...v1.10.0) (2023-10-30)


### Features

* **email service:** create aws email service, base email service ([7d37977](https://github.com/BrewInteractive/authentication-service-nestjs/commit/7d37977799884914c5bda059aa229f36a6b4a18a))
* **TS-200:** add email module ([199ce9b](https://github.com/BrewInteractive/authentication-service-nestjs/commit/199ce9b3be5127d83c16d0a4ed99e50ca0aa7e3a))
* **TS-212:** add expire old reset requests trigger migration ([75647c4](https://github.com/BrewInteractive/authentication-service-nestjs/commit/75647c4cb3d992716da9a05c74a1f133153db325))
* **TS-213:** add reset-password endpoint ([b3e3bb4](https://github.com/BrewInteractive/authentication-service-nestjs/commit/b3e3bb477d1bb5fedc2b96f84cef03a2e521d214))
* **TSV-30:** update register user importer interface ([f708a82](https://github.com/BrewInteractive/authentication-service-nestjs/commit/f708a821a71c3c441bae10e550c614d5c3994d83))


### Bug Fixes

* add aws config ([52cdf14](https://github.com/BrewInteractive/authentication-service-nestjs/commit/52cdf14c52e3d23e99d63cab279a0268421428a4))
* add aws ses client to package json ([bb7aab6](https://github.com/BrewInteractive/authentication-service-nestjs/commit/bb7aab6b1e8ff6506ba154a7cc595fc240f19f49))
* aws config, move abstract to domain folder, fix test for new config provider ([7ad85bb](https://github.com/BrewInteractive/authentication-service-nestjs/commit/7ad85bb50e209d6f3c93a6cc4ca0e70e519d926a))
* cleanup ([d6a7833](https://github.com/BrewInteractive/authentication-service-nestjs/commit/d6a7833f257d16f3defb40804082ae6607eec4b9))
* fix email module ([6b713cc](https://github.com/BrewInteractive/authentication-service-nestjs/commit/6b713cc8df786935069eba37a60ed17060e80b6a))
* move aws service to providers ([7d805b6](https://github.com/BrewInteractive/authentication-service-nestjs/commit/7d805b6abfd0d9a946dcf9bcc88046229564ae31))
* move env.s to docs, clean imports ([8609885](https://github.com/BrewInteractive/authentication-service-nestjs/commit/8609885e4c57e63d4bff0730fe8c01e0b00850fd))
* sonar warnings ([9ef3f68](https://github.com/BrewInteractive/authentication-service-nestjs/commit/9ef3f687d08ca48615bff4b8bc98f66bd180d2d4))
* **TS-206:** fix for migration name ([14d4bc7](https://github.com/BrewInteractive/authentication-service-nestjs/commit/14d4bc7fdea7add246d2ced2a0a8be7377c84b0e))
* **TS-206:** fix for migration name ([b2059a4](https://github.com/BrewInteractive/authentication-service-nestjs/commit/b2059a4914f9630df2211b926563a20c70c3c5d1))
* **TS-206:** random string function remove and add generate_reset_password_key function migration ([bae64c0](https://github.com/BrewInteractive/authentication-service-nestjs/commit/bae64c0cf99687784398c54629d313d3b0d7bf81))
* **TS-213:** fix for reset password e2e test ([e594d01](https://github.com/BrewInteractive/authentication-service-nestjs/commit/e594d01913d4c8b92398ff9e9a9c41f9c33c507a))
* **TS-213:** fix reset password fixture path ([846bc38](https://github.com/BrewInteractive/authentication-service-nestjs/commit/846bc387b9d6d4bf1945601b90f7929821ab9144))
* typo ([fb674a5](https://github.com/BrewInteractive/authentication-service-nestjs/commit/fb674a5c0c2a3824a9be8ad82135d20ce354e48c))

## [1.9.0](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.8.1...v1.9.0) (2023-10-19)


### Features

* add profile picture column in user table ([53a1080](https://github.com/BrewInteractive/authentication-service-nestjs/commit/53a10803982ceeb48c0f25e5fc389bff611d0c4e))
* **TS-206:** add users_reset_password_requests table as a migration ([26dcd2f](https://github.com/BrewInteractive/authentication-service-nestjs/commit/26dcd2f3b9212ecd16e3d2635b9ff632de8cbec5))
* **TS-8, TS-10:** the validateUser method should be customizable through plugins ([1ba0026](https://github.com/BrewInteractive/authentication-service-nestjs/commit/1ba0026414e6a4ced98aef193ec3d7a98d3ed353))
* **TSV-26, TSV-29:** appData property has been added to the SignUpDto and variable names in the auth controller have been updated. ([621d253](https://github.com/BrewInteractive/authentication-service-nestjs/commit/621d25328f043c712532a7ce9f75723da730d325))
* **TSV-30:** the createUser method should be customizable through plugins ([5f8da60](https://github.com/BrewInteractive/authentication-service-nestjs/commit/5f8da604065f4a39c03232d4fb7f215c42cbeb83))
* update addCustomClaim method in token service ([89c1905](https://github.com/BrewInteractive/authentication-service-nestjs/commit/89c1905edc1019c841a59a3e07ec55f84db8b4a2))
* updated role column as "text" ([76acd18](https://github.com/BrewInteractive/authentication-service-nestjs/commit/76acd18a9320311686f95ad65dac441b169b7916))

### [1.8.1](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.8.0...v1.8.1) (2023-09-04)


### Bug Fixes

* fixed migrations. ([9f40965](https://github.com/BrewInteractive/authentication-service-nestjs/commit/9f40965632089c18dae240781e37e886ed31adef))

## [1.8.0](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.7.2...v1.8.0) (2023-08-07)


### Features

* **SHBD-619:** add the default role feature to the user registration ([564f171](https://github.com/BrewInteractive/authentication-service-nestjs/commit/564f171cd9bb463807afb149a94a60f152e5cb20))
* token expiration time has been moved to env ([381f09c](https://github.com/BrewInteractive/authentication-service-nestjs/commit/381f09cb5868a3b2f55b9ca96d62fa772e4ed44d))


### Bug Fixes

* Update README.md ([ca31904](https://github.com/BrewInteractive/authentication-service-nestjs/commit/ca3190408dc8bd01ae1301516382ff3cdc0c7b7f))

### [1.7.2](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.7.1...v1.7.2) (2023-06-15)


### Bug Fixes

* fix for migration ([20429ad](https://github.com/BrewInteractive/authentication-service-nestjs/commit/20429ad25e58f293f7cb91bfcc6891b2037c2561))

### [1.7.1](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.7.0...v1.7.1) (2023-06-15)


### Bug Fixes

* fix for users roles model ([2943533](https://github.com/BrewInteractive/authentication-service-nestjs/commit/29435338a17ff4aa746ef88fe049425280e328c1))

## [1.7.0](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.6.0...v1.7.0) (2023-06-14)


### Features

* create cors config ([5ddc206](https://github.com/BrewInteractive/authentication-service-nestjs/commit/5ddc206aaa6b0228a0869f8d42e32b15effab9ae))


### Bug Fixes

* fix for users roles model ([a0a1216](https://github.com/BrewInteractive/authentication-service-nestjs/commit/a0a121606cbfb4094ca4e1115e9c324d444db39a))

## [1.6.0](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.5.1...v1.6.0) (2023-06-08)


### Features

* **SHBD-637:** add first_name and last_name in UserCustomClaimsImporter ([bc5564d](https://github.com/BrewInteractive/authentication-service-nestjs/commit/bc5564dfb517041b9deb8ae82e6db26acea5b1fe))

### [1.5.1](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.5.0...v1.5.1) (2023-06-07)

## [1.5.0](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.4.3...v1.5.0) (2023-06-06)


### Features

* create api key guard ([13d93bc](https://github.com/BrewInteractive/authentication-service-nestjs/commit/13d93bc4368b245bf7bf299131d6bd3f08272a27))
* **SHBD-358:** create hasura claims plugin. ([eae0d90](https://github.com/BrewInteractive/authentication-service-nestjs/commit/eae0d90bb7d1fdf6c760d0fbe057f38d0c9d3159))
* **SHBD-358:** token service is defined as global ([7e1fcda](https://github.com/BrewInteractive/authentication-service-nestjs/commit/7e1fcda4985dd70b09b7ab338a8a262def9252c8))
* **SHBD-358:** user information and role information were associated ([7eb1506](https://github.com/BrewInteractive/authentication-service-nestjs/commit/7eb1506f167ab808f2b56439930cde753c3f1ad5))


### Bug Fixes

* fixed Sonar bug. ([d514e3b](https://github.com/BrewInteractive/authentication-service-nestjs/commit/d514e3bfee8254e3a27a37f2c007b263ea2dc07d))
* relationships cannot be nullable ([55d1cbc](https://github.com/BrewInteractive/authentication-service-nestjs/commit/55d1cbcd6f5e19a3a8025dfcac8941c18ca55d37))

### [1.4.3](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.4.2...v1.4.3) (2023-04-29)


### Bug Fixes

* fix for data source ([aa7e158](https://github.com/BrewInteractive/authentication-service-nestjs/commit/aa7e158b8ce6cdca2b82d45756580a1bf814fcbd))

### [1.4.2](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.4.1...v1.4.2) (2023-04-28)


### Bug Fixes

* fix for data source ([c6eb26c](https://github.com/BrewInteractive/authentication-service-nestjs/commit/c6eb26c82ae4637a2783a530e2f34a33c897d23f))

### [1.4.1](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.4.0...v1.4.1) (2023-04-28)

## [1.4.0](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.3.6...v1.4.0) (2023-04-28)


### Features

* update data source ([c25d5a8](https://github.com/BrewInteractive/authentication-service-nestjs/commit/c25d5a8318f34bd417aec24a96b1d33ef9b4590b))

### [1.3.6](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.3.5...v1.3.6) (2023-04-28)

### [1.3.5](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.3.4...v1.3.5) (2023-04-28)

### [1.3.4](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.3.3...v1.3.4) (2023-04-28)

### [1.3.3](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.3.2...v1.3.3) (2023-04-28)

### [1.3.2](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.3.1...v1.3.2) (2023-04-28)

### [1.3.1](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.3.0...v1.3.1) (2023-04-28)


### Bug Fixes

* fix for npm publish action ([ca706d3](https://github.com/BrewInteractive/authentication-service-nestjs/commit/ca706d3f060b80fe863d8e6ffd0ce8405b2981c0))

## [1.3.0](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.2.1...v1.3.0) (2023-04-28)


### Features

* add module tests ([2348392](https://github.com/BrewInteractive/authentication-service-nestjs/commit/234839281b0f750a3834a23fed18fb1b31be9599))
* add swagger value for login and signup services ([41175e5](https://github.com/BrewInteractive/authentication-service-nestjs/commit/41175e5a9dcce69e1888e4c7203b7dab5664d516))
* **SHBD-357, SHBD-356:** add login and signup implement with test ([df1bc56](https://github.com/BrewInteractive/authentication-service-nestjs/commit/df1bc56f9a0fd119642c985dba25751b9ba4909e))


### Bug Fixes

* fix bcrypt mock for test and e2e test to fixture variable ([db7fdd5](https://github.com/BrewInteractive/authentication-service-nestjs/commit/db7fdd5f955a2563ab3a8fdb4cc59cc2cac1623a))
* fix for auth and user test mock jest ([b9e288d](https://github.com/BrewInteractive/authentication-service-nestjs/commit/b9e288d118d4de6678af5ffcab3574125fcd7f89))
* fix for auth e2e test ([f9c50bb](https://github.com/BrewInteractive/authentication-service-nestjs/commit/f9c50bb26c4525b095f9201fc90f96cb962c9bbc))
* fix for data source config ([a5a9516](https://github.com/BrewInteractive/authentication-service-nestjs/commit/a5a9516e421cfe4b2f891a95244f72fa7b6e8264))
* fix for dto transfer with automapper ([c566a94](https://github.com/BrewInteractive/authentication-service-nestjs/commit/c566a94709847e58791673f00bb64d58aae212ee))
* fix for e2e test ([30bd4c0](https://github.com/BrewInteractive/authentication-service-nestjs/commit/30bd4c0842c1a1f25054d5d330dd4cac840c82c9))
* fix for tests mock convert to fixture ([6bf7c7f](https://github.com/BrewInteractive/authentication-service-nestjs/commit/6bf7c7fdeb734cb4cec4a55e34681937312ada6d))
* fix for user service getUser method ([ed0b2a9](https://github.com/BrewInteractive/authentication-service-nestjs/commit/ed0b2a9f5f72718974ac4ca89551b67eea4f51e0))
* remove bcrypt dependencies in testing. ([be9e0a7](https://github.com/BrewInteractive/authentication-service-nestjs/commit/be9e0a775ba2a28bdbd4637eaa241f18ead65c22))

### [1.2.1](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.2.0...v1.2.1) (2023-04-25)

## [1.2.0](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.1.2...v1.2.0) (2023-04-25)


### Features

* **SHBD-302:** add readme ([c5d2a56](https://github.com/BrewInteractive/authentication-service-nestjs/commit/c5d2a56d077afe3a89b32cef25741c756d11d2d0))
* **SHBD-309:** add user service in auth module providers ([0d38948](https://github.com/BrewInteractive/authentication-service-nestjs/commit/0d38948a0442b52fbd74cc4f6555f8b3bfe9f1ce))
* **SHBD-309:** add UserService for TokenService to providers. ([caa8de9](https://github.com/BrewInteractive/authentication-service-nestjs/commit/caa8de9a7d2ef16756f537e4afff04f9deaaea0d))
* **SHBD-309:** add validateUser in user service and auth controller ([1e1df94](https://github.com/BrewInteractive/authentication-service-nestjs/commit/1e1df9473e7324ece26c2035a830379f896c061c))
* **SHBD-354:** Add validation for LoginDto ([55f74cf](https://github.com/BrewInteractive/authentication-service-nestjs/commit/55f74cf69099fec2fe6e27f4f1b3d3ec04ec9f0d))
* **SHBD-355:** Add sign up validation and tests ([1ffe3f2](https://github.com/BrewInteractive/authentication-service-nestjs/commit/1ffe3f2b52f4ddd0b52698506df9d72c1523cda6))
* **SHBD-365:** Add Swagger ([236c348](https://github.com/BrewInteractive/authentication-service-nestjs/commit/236c34877969dc41771033205ce54384009df8f8))
* typeorm integration and create user tables ([1188f6a](https://github.com/BrewInteractive/authentication-service-nestjs/commit/1188f6ad6df119cc0f1efb9334b4e06eee95da29))


### Bug Fixes

* fix for auth controller creating module tests ([08d5218](https://github.com/BrewInteractive/authentication-service-nestjs/commit/08d5218f30cf07b16d243c12115490538a8bca39))
* fix for data source config ([286b8cc](https://github.com/BrewInteractive/authentication-service-nestjs/commit/286b8cc562fb5523720f5b2bbca3d07e67576384))
* fix for user entity ([abdf1bc](https://github.com/BrewInteractive/authentication-service-nestjs/commit/abdf1bc465686d4ea09fb3aac1b2afccbe1a73b0))
* Injected UserService. ([af1dd48](https://github.com/BrewInteractive/authentication-service-nestjs/commit/af1dd482be17c61d81720aab18ade25c2e8bc1b0))
* **SHBD-309:** fix auth controller ([2840f76](https://github.com/BrewInteractive/authentication-service-nestjs/commit/2840f765d3144520a8152e64864848fa3daed0e9))
* **SHBD-309:** fix token module providers ([ddd7b8a](https://github.com/BrewInteractive/authentication-service-nestjs/commit/ddd7b8a89cbfab029aa8ff02dabde150fc906144))
* **SHBD-309:** remove token and user service in app module ([42b7ad3](https://github.com/BrewInteractive/authentication-service-nestjs/commit/42b7ad3d7457f27b3d32405b5bea11572b5f85fa))
* **SHBD-315:** fix auth controller ([01ea49e](https://github.com/BrewInteractive/authentication-service-nestjs/commit/01ea49e15c3f5071d70799f35f2f1d7df78737bf))
* **SHBD-315:** remove auth service and test ([0ccc902](https://github.com/BrewInteractive/authentication-service-nestjs/commit/0ccc902b0da93f1f1059c98df1212bd0d993ee2f))
* **SHBD-315:** remove TokenService in app module ([fd4b7a2](https://github.com/BrewInteractive/authentication-service-nestjs/commit/fd4b7a2204b005e971d70bff1169c71ba9fce813))
* **SHBD-354:** fix for get password matches from config env ([ea2e8fb](https://github.com/BrewInteractive/authentication-service-nestjs/commit/ea2e8fb1be3fcce2a9b2b9d30f11803ae6370c31))
* **SHBD-354:** fix validation code smells ([f13289c](https://github.com/BrewInteractive/authentication-service-nestjs/commit/f13289cee245107f72f78b4ab561ef38061070f8))
* **SHBD-365:** Fix swagger integration and environment-based swagger config ([f4e208e](https://github.com/BrewInteractive/authentication-service-nestjs/commit/f4e208e66660dbfd53b72c218577098352377897))
* **SHBD-365:** update swagger tittle and description ([e86daf3](https://github.com/BrewInteractive/authentication-service-nestjs/commit/e86daf35448d731d88a220b61f18e3793fcce0b4))
* update main.ts for swagger enable and .env.example for new variable ([4932bb4](https://github.com/BrewInteractive/authentication-service-nestjs/commit/4932bb4ae185ab74d29f52df58014177f2553215))
* update swagger enable control and readme.md ([b8b9abf](https://github.com/BrewInteractive/authentication-service-nestjs/commit/b8b9abfe38d9aee6b543266aff5729afe223a747))

### [1.1.2](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.1.1...v1.1.2) (2023-03-09)

### [1.1.1](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.1.0...v1.1.1) (2023-03-09)

## 1.1.0 (2023-03-09)


### Features

* **SHBD-108:** Created brew-authentication-api project. ([669fdea](https://github.com/BrewInteractive/authentication-service-nestjs/commit/669fdeaf553793003d7b8584b6950df84a9b3412))
* **SHBD-216:** Dockerized. ([8f421f7](https://github.com/BrewInteractive/authentication-service-nestjs/commit/8f421f7366166bfd925baf0bd5c30b6572bbc41e))
* **SHBD-310:** add token service and module with createToken method and addCustomClaims ([e488c05](https://github.com/BrewInteractive/authentication-service-nestjs/commit/e488c051d067c35624428b16bc36f5a9111d3533))


### Bug Fixes

* Added node_modules-path to import as a dependency. ([43e69d8](https://github.com/BrewInteractive/authentication-service-nestjs/commit/43e69d8dbb49d4fdf1f0b701740b167e7d8aa83a))
* Check for directory existence. ([4ab0f6b](https://github.com/BrewInteractive/authentication-service-nestjs/commit/4ab0f6b70058c7e2fc0f99ae74f891429eab7a32))
* Fixed authenticationService options in package.json. ([458f9b9](https://github.com/BrewInteractive/authentication-service-nestjs/commit/458f9b963adf58a01c135d80936a93ec5cfc4056))
* Fixed plugin path. ([1c23e82](https://github.com/BrewInteractive/authentication-service-nestjs/commit/1c23e822f324cd0e17894b1e8e9b6f3be389d713))
* **SHBD-310:** remove unnecessary uses for token service and fix test ([11e3d44](https://github.com/BrewInteractive/authentication-service-nestjs/commit/11e3d4406451e3036f6e6b34833ae742f8c5178a))
