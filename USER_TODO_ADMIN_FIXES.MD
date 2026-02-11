# Admin Dashboard Fixes Needed

## Gift Cards Tab Issues
- ❌ No Supabase CRUD operations (create, read, update, delete gift cards)
- ❌ Uses static mock data only
- ❌ "Create Gift Card", "Edit", "Send", "Redeem" buttons do nothing
- ❌ Gift cards table exists in schema but not connected

## Settings Tab Issues
- ❌ Notification templates not saved to database
- ❌ Marketing campaigns UI-only, no backend
- ❌ Integration "Connect" buttons are non-functional UI
- ❌ Language settings not persisted

## Required Implementation
1. Add Supabase client to admin dashboard
2. Implement gift_cards CRUD:
   - `createGiftCard()` - purchase new card
   - `getGiftCards()` - list all cards
   - `updateGiftCard()` - edit balance/status
   - `redeemGiftCard()` - apply to appointment
3. Save settings to database:
   - Notification templates in `notification_templates` table
   - Campaign data in `campaigns` table
   - Integration tokens in secure storage
4. Add proper error handling and loading states

## Priority
- **High**: Gift card functionality (revenue feature)
- **Medium**: Settings persistence
- **Low**: Integration connections (may need API keys first)
