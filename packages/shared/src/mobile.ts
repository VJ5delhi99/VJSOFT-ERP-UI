import { sharedModules } from './modules'

export const mobileWorkboard = {
  primaryModules: sharedModules.filter((module) => module.mobilePriority === 'primary'),
  secondaryModules: sharedModules.filter((module) => module.mobilePriority === 'secondary'),
  adminModules: sharedModules.filter((module) => module.mobilePriority === 'admin'),
  quickActions: [
    'Approve urgent work',
    'Review operational alerts',
    'Record a payment',
    'Check stock risk',
    'Update a service case'
  ]
}
