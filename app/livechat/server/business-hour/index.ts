import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import { BusinessHourManager } from './BusinessHourManager';
import { SingleBusinessHourBehavior } from './Single';
import { cronJobs } from '../../../utils/server/lib/cron/Cronjobs';
import { callbacks } from '../../../callbacks/server';
import { DefaultBusinessHour } from './Default';

export const businessHourManager = new BusinessHourManager(cronJobs);

Meteor.startup(() => {
	const { BusinessHourBehaviorClass } = callbacks.run('on-business-hour-start', { BusinessHourBehaviorClass: SingleBusinessHourBehavior });
	businessHourManager.registerBusinessHourBehavior(new BusinessHourBehaviorClass());
	businessHourManager.registerBusinessHourType(new DefaultBusinessHour());

	Accounts.onLogin(async ({ user }: { user: any }) => user?.roles?.includes('livechat-agent') && businessHourManager.onLogin(user._id));
});
