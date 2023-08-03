import { isAdminGroup } from './bot';

// Create @AdminCommand decorator that checks if user is admin and if not, does not call the function
export function AdminCommand() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const ctx = args[0];
      if (!isAdminGroup(ctx)) {
        ctx.reply('Not admin group');
        return;
      }
      return originalMethod.apply(this, args);
    };
  };
}
