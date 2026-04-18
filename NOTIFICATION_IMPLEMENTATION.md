# Notification System Implementation Guide

## Overview
Complete notification system with database persistence, user preferences, and integrated notification center for both customers and admins.

## What Was Implemented

### 1. Database Schema Updates

#### New Migration: `scripts/009_notification_settings.sql`
- **notification_preferences** table with comprehensive user settings
- Enhanced **notifications** table with metadata, categories, and priorities
- Helper functions for managing preferences
- RLS policies for data security
- Automatic cleanup functions for old notifications

Key columns in notification_preferences:
- Email notifications (orders, products, promotions)
- In-app notifications (orders, products, promotions)
- Push notifications
- Email frequency (immediate, daily, weekly, never)
- Newsletter subscription
- Communication language

### 2. Server Actions

#### New File: `app/actions/notification-preferences.ts`
Complete CRUD operations:
- `getNotificationPreferences()` - Fetch user's notification settings
- `updateNotificationPreferences()` - Update user preferences
- `getUserNotifications()` - Paginated notification list
- `markNotificationAsRead()` - Mark single notification as read
- `markAllNotificationsAsRead()` - Mark all as read
- `deleteNotification()` - Delete specific notification

All actions include:
- Authentication checks
- Comprehensive error handling
- Logging for debugging
- Proper type safety
- Database operation validation

### 3. UI Components

#### Component: `components/notifications/notification-settings-form.tsx`
Full-featured settings form with:
- Email notification toggles
- In-app notification toggles
- Push notification toggles
- Email frequency selector
- Newsletter subscription toggle
- Language preference selector
- Save/reset functionality
- Loading states
- Error handling with toast notifications

#### Component: `components/notifications/notifications-list.tsx`
Notification center UI with:
- Paginated notification list
- Unread count display
- Mark as read functionality
- Delete notification option
- Mark all as read option
- Color-coded categories
- Priority indicators
- Timestamp formatting
- Quick action links
- Empty state handling

### 4. Page Integrations

#### Customer Pages Updated
**`app/account/settings/page.tsx`**
- Added Notification Preferences section
- Integrated NotificationSettingsForm component
- Bell icon for visual identification

**`app/account/notifications/page.tsx`**
- Converted from placeholder to functional notification center
- Integrated NotificationsList component
- Full notification management capabilities

#### Admin Pages Updated
**`app/admin/settings/page.tsx`**
- Added Notification Preferences section
- Integrated NotificationSettingsForm component
- Admins can customize their notification settings

**`app/admin/notifications/page.tsx`**
- Converted from placeholder to functional notification center
- Integrated NotificationsList component
- Admins see system and order notifications

### 5. Migration & Setup

#### Updated Migration Script: `scripts/execute-migrations-complete.mjs`
- Automated migration runner
- Executes all SQL migrations in correct order
- Includes new notification_settings migration
- Error handling and logging
- Progress tracking

#### Documentation: `scripts/README.md`
Comprehensive guide covering:
- All migration files and their purposes
- Schema relationships
- Running migrations
- Environment setup
- Troubleshooting

## How It Works

### User Notification Flow

```
User receives notification event
         ↓
Create notification in database
         ↓
Check user's notification_preferences
         ↓
Send via preferred channels (email, in-app, push)
         ↓
User views in notification center
         ↓
Mark as read/delete as desired
```

### Preference Management Flow

```
User visits settings → Notification Preferences section
         ↓
Load current preferences from database
         ↓
User adjusts settings
         ↓
Click Save
         ↓
Server action validates and updates database
         ↓
Success notification displayed
         ↓
Preferences saved for future notifications
```

## Integration with Existing Systems

### Cart & Wishlist Operations
The system is ready to create notifications for:
- New order notifications (to admins)
- Order status updates (to customers)

### Existing Notification Helpers
File: `lib/helpers/notification-helpers.ts`

Pre-built functions for specific scenarios:
- `createNewOrderNotification()` - Admin notification
- `createOrderConfirmedNotification()` - Customer confirmation
- `createOrderShippedNotification()` - With tracking number
- `createOrderDeliveredNotification()` - Delivery confirmation
- `notifyAdminsNewOrder()` - Broadcast to all admins

### Existing Toast Notifications
The `sonner` toast library continues to work alongside this system:
- Toast for immediate UI feedback
- Persistent notifications for historical tracking

## Database Schema

### notification_preferences Table
```sql
id (uuid, PK)
user_id (uuid, FK → users.id, unique)
-- Email notifications
email_new_order, email_order_confirmed, ... (boolean)
-- In-app notifications  
app_new_order, app_order_confirmed, ... (boolean)
-- Push notifications
push_orders, push_promotions (boolean)
-- Settings
email_frequency (immediate|daily|weekly|never)
newsletter_subscribed (boolean)
communication_language (en|ja)
created_at, updated_at (timestamps)
```

### notifications Table (Enhanced)
```sql
id (uuid, PK)
user_id (uuid, FK → users.id)
title, message (text)
type (notification type)
category (order|product|system|promotional|general)
priority (low|normal|high)
read_status (boolean)
read_at (timestamp, nullable)
metadata (jsonb, flexible data storage)
created_at (timestamp)
```

## Usage Examples

### In Components
```typescript
import { useTransition } from "react";
import { getNotificationPreferences, updateNotificationPreferences } from "@/app/actions/notification-preferences";

// Get preferences
const result = await getNotificationPreferences();
if (result.data) {
  console.log(result.data.email_new_order); // true
}

// Update preferences
const updated = await updateNotificationPreferences({
  email_new_order: false,
  push_orders: true
});
```

### Creating Notifications
```typescript
import { createNewOrderNotification } from "@/lib/helpers/notification-helpers";

// When admin receives new order
await createNewOrderNotification(
  adminId,
  orderId,
  "Customer Name",
  99.99
);
```

### In Notification Center
- List all notifications with pagination
- Mark notifications as read
- Delete notifications
- Manage preferences
- Filter by category/priority

## Security Considerations

### Row-Level Security (RLS)
- Users can only view/update their own preferences
- Users can only manage their own notifications
- Admins have appropriate access levels

### Input Validation
- All inputs validated before database operations
- SQL injection prevention via parameterized queries
- Type-safe operations

### Authentication
- All operations require valid user session
- Middleware handles session validation
- Automatic redirect to login if needed

## Performance Optimizations

### Database Indexes
- `idx_notification_preferences_user_id` on user_id
- `idx_notifications_user_category` on (user_id, category)
- `idx_notifications_user_read` on (user_id, read_status)
- `idx_notifications_priority` on priority

### Pagination
- Notifications loaded in batches (default 20-50)
- Reduces initial load time
- Improved UX for large notification lists

### Caching
- Preferences cached in component state
- Only sync to database on save
- Reduces unnecessary database calls

## Future Enhancement Possibilities

1. **Real-time Notifications**
   - WebSocket integration for live updates
   - Supabase Realtime subscriptions

2. **Email Digest Service**
   - Background job to send email digests
   - Scheduled based on user preferences

3. **SMS Notifications**
   - Twilio or similar integration
   - For high-priority notifications

4. **Web Push Notifications**
   - Service Worker integration
   - Browser push notifications

5. **Notification Templates**
   - Customizable templates per category
   - Multi-language support

6. **Analytics**
   - Track notification open rates
   - Monitor delivery success
   - User engagement metrics

## Troubleshooting

### Notifications Not Showing
1. Check notification_preferences table exists
2. Verify user has preferences record
3. Check RLS policies allow access
4. Review server action logs

### Settings Not Saving
1. Verify authentication is valid
2. Check for database connection issues
3. Review update action response
4. Check browser console for errors

### Performance Issues
1. Add indexes if not present (see migration)
2. Implement pagination for large lists
3. Cache preferences client-side
4. Use database query optimization

## Testing

### Manual Testing
1. Create user accounts
2. Navigate to settings → Notification Preferences
3. Toggle preferences and save
4. Create notifications manually
5. View in notification center
6. Test mark as read, delete, etc.

### Database Testing
```sql
-- Check preferences were created
SELECT * FROM notification_preferences WHERE user_id = 'user-id';

-- Count unread notifications
SELECT COUNT(*) FROM notifications 
WHERE user_id = 'user-id' AND read_status = false;

-- List all notifications for user
SELECT * FROM notifications 
WHERE user_id = 'user-id' 
ORDER BY created_at DESC;
```

## Deployment Notes

1. Run migrations before deploying application code
2. Ensure environment variables are set
3. Test in staging environment first
4. Monitor for any RLS policy issues
5. Verify notification preferences created for existing users

## Files Modified/Created

### New Files
- `scripts/009_notification_settings.sql` - Database schema
- `scripts/execute-migrations-complete.mjs` - Migration runner
- `scripts/README.md` - Schema documentation
- `app/actions/notification-preferences.ts` - Server actions
- `components/notifications/notification-settings-form.tsx` - Settings UI
- `components/notifications/notifications-list.tsx` - Notification center UI
- `NOTIFICATION_IMPLEMENTATION.md` - This file

### Modified Files
- `app/account/settings/page.tsx` - Added notification settings
- `app/account/notifications/page.tsx` - Implemented notification center
- `app/admin/settings/page.tsx` - Added notification settings
- `app/admin/notifications/page.tsx` - Implemented notification center

## Support & Questions

For issues or questions:
1. Check the SQL migration logs
2. Review server action console logs (with `[v0]` prefix)
3. Check browser console for client-side errors
4. Verify all environment variables are set correctly
