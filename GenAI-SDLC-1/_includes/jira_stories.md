
# JIRA Stories

## Story 1: Login with Valid Credentials
**Summary:** User logs in with valid credentials  
**Description:** As a user, I want to log in using my valid user ID and password so that I can access my account.  
**Acceptance Criteria:**  
- Given a registered and active user  
- When they enter correct user ID and password  
- Then they are logged in successfully and redirected to the dashboard  

## Story 2: Login with Invalid Password
**Summary:** User attempts login with incorrect password  
**Description:** As a user, I want to be notified if my password is incorrect so I can try again.  
**Acceptance Criteria:**  
- Given a registered user  
- When they enter correct user ID but incorrect password  
- Then the system displays an "Invalid user ID or password" error message  

## Story 3: Login with Invalid User ID
**Summary:** User attempts login with non-existent account  
**Description:** As a user, I want to be notified if my account doesn't exist so I can register or correct my entry.  
**Acceptance Criteria:**  
- Given no account exists with provided user ID  
- When they attempt login  
- Then the system displays an "Invalid user ID or password" error message  

## Story 4: Account Lock After 3 Failed Attempts
**Summary:** System locks account after multiple failed logins  
**Description:** As a user, I want my account locked after 3 failed login attempts to protect against unauthorized access.  
**Acceptance Criteria:**  
- Given a registered and active account  
- When user enters wrong credentials 3 consecutive times  
- Then the account is locked for 15 minutes  

## Story 5: Login During Lockout Period
**Summary:** User attempts login while account is locked  
**Description:** As a user, I want to be notified when my account is locked so I know when to retry.  
**Acceptance Criteria:**  
- Given a locked account  
- When the user tries to log in  
- Then they see a message that account is locked for 15 minutes  

## Story 6: Login After Lockout Expires
**Summary:** User logs in successfully after lockout period  
**Description:** As a user, I want to be able to log in after the lockout period ends.  
**Acceptance Criteria:**  
- Given account was locked but lockout time has expired  
- When user enters valid credentials  
- Then login is successful  

## Story 7: Admin Unlocks Locked Account
**Summary:** Admin manually unlocks a user's account  
**Description:** As an admin, I want to unlock locked user accounts so they can log in before the lockout period ends.  
**Acceptance Criteria:**  
- Given account is locked  
- When admin unlocks the account  
- Then the user can log in immediately with valid credentials  

## Story 8: CAPTCHA after Multiple Failed Attempts
**Summary:** Display CAPTCHA after failed logins  
**Description:** As a system, I want to display a CAPTCHA after 3 failed attempts to prevent bots.  
**Acceptance Criteria:**  
- Given a registered user  
- When they fail to log in 3 times  
- Then a CAPTCHA challenge appears on next login attempt  

## Story 9: Password Reset with Valid Email
**Summary:** User requests password reset with valid email  
**Description:** As a user, I want to reset my password when I forget it by entering my registered email.  
**Acceptance Criteria:**  
- Given a registered user  
- When they request a password reset with their valid email  
- Then system sends password reset link to their email  

## Story 10: Password Reset with Invalid Email
**Summary:** User requests password reset with unregistered email  
**Description:** As a user, I want to be notified if my entered email is not associated with any account.  
**Acceptance Criteria:**  
- Given no account exists with entered email  
- When user requests a password reset  
- Then system shows "No account found with this email" message
