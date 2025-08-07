# Email Verification Fix Plan

## Problem Analysis
- Backend generates verification links but doesn't send emails
- Frontend uses Firebase JS SDK's `sendEmailVerification()` but emails aren't being sent
- Missing email service integration

## Solution Overview

### 1. Backend Enhancement (PapeleriaApi)
- [ ] Create email service using SendGrid/SMTP
- [ ] Update UsuariosController to send verification emails
- [ ] Add email templates for verification

### 2. Frontend Enhancement (Angular)
- [ ] Ensure Firebase email verification is properly configured
- [ ] Add email verification status checking
- [ ] Improve user feedback for verification process

### 3. Firebase Configuration
- [ ] Verify Firebase project email templates
- [ ] Ensure custom email action URL is configured

## Implementation Steps

### Phase 1: Backend Email Service
1. Install SendGrid package
2. Create EmailService class
3. Update registration endpoint to trigger email
4. Add email verification endpoint

### Phase 2: Frontend Updates
1. Verify Firebase configuration
2. Add email verification flow
3. Add resend verification functionality

### Phase 3: Testing
1. Test email delivery
2. Test verification flow
3. Test edge cases
