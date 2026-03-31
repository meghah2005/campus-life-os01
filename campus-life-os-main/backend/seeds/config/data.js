/**
 * Config database seed data
 * Contains application settings, feature flags, and notification configurations
 */

const settingsData = [
  {
    key: 'app_name',
    value: 'Campus Life OS',
    description: 'Application name',
    type: 'string'
  },
  {
    key: 'version',
    value: '1.0.0',
    description: 'App version',
    type: 'string'
  },
  {
    key: 'maintenance_mode',
    value: false,
    description: 'Is app in maintenance mode',
    type: 'boolean'
  },
  {
    key: 'max_upload_size_mb',
    value: 50,
    description: 'Maximum file upload size in MB',
    type: 'number'
  },
  {
    key: 'session_timeout_minutes',
    value: 120,
    description: 'Session timeout duration in minutes',
    type: 'number'
  },
  {
    key: 'email_verification_required',
    value: true,
    description: 'Require email verification on signup',
    type: 'boolean'
  },
  {
    key: 'two_factor_enabled',
    value: false,
    description: '2FA enabled for all users',
    type: 'boolean'
  }
];

const featuresData = [
  {
    id: 1,
    name: 'Study Timer',
    description: 'Pomodoro-style study timer with focus tracking',
    enabled: true,
    beta: false,
    users_with_access: 'all',
    createdAt: '2026-01-01'
  },
  {
    id: 2,
    name: 'Group Sessions',
    description: 'Collaborative study group scheduling and management',
    enabled: true,
    beta: false,
    users_with_access: 'all',
    createdAt: '2026-01-05'
  },
  {
    id: 3,
    name: 'Analytics Dashboard',
    description: 'Comprehensive study analytics and progress tracking',
    enabled: true,
    beta: false,
    users_with_access: 'all',
    createdAt: '2026-01-10'
  },
  {
    id: 4,
    name: 'Marketplace',
    description: 'Student services and skill-sharing marketplace (BETA)',
    enabled: true,
    beta: true,
    users_with_access: 'selected',
    createdAt: '2026-02-01'
  }
];

const notificationsConfigData = [
  {
    id: 1,
    type: 'email',
    enabled: true,
    template: 'welcome',
    description: 'Welcome email on signup',
    retryAttempts: 3
  },
  {
    id: 2,
    type: 'sms',
    enabled: false,
    template: 'alerts',
    description: 'SMS alerts for critical updates',
    retryAttempts: 2
  },
  {
    id: 3,
    type: 'push',
    enabled: true,
    template: 'reminders',
    description: 'Push notifications for reminders and deadlines',
    retryAttempts: 1
  }
];

module.exports = {
  settingsData,
  featuresData,
  notificationsConfigData
};
