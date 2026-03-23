import type { AccountOperation } from './account/types';
import type { AgentOperation } from './agent/types';
import type { CannedResponseOperation } from './cannedResponse/types';
import type { ContactOperation } from './contact/types';
import type { ConversationOperation } from './conversation/types';
import type { CustomAttributeOperation } from './customAttribute/types';
import type { AutomationOperation } from './automation/types';
import type { HelpCenterOperation } from './helpCenter/types';
import type { InboxOperation } from './inbox/types';
import type { KanbanBoardOperation } from './kanbanBoard/types';
import type { KanbanItemOperation } from './kanbanItem/types';
import type { KanbanStepOperation } from './kanbanStep/types';
import type { KanbanTaskOperation } from './kanbanTask/types';
import type { LabelOperation } from './label/types';
import type { ProfileOperation } from './profile/types';
import type { ReportOperation } from './report/types';
import type { ScheduledMessageOperation } from './scheduledMessage/types';
import type { TeamOperation } from './team/types';
import type { WebhookOperation } from './webhook/types';

export type ChatwootResources =
	| 'account'
	| 'agent'
	| 'automation'
	| 'cannedResponse'
	| 'contact'
	| 'conversation'
	| 'customAttribute'
	| 'helpCenter'
	| 'inbox'
	| 'kanbanBoard'
	| 'kanbanItem'
	| 'kanbanStep'
	| 'kanbanTask'
	| 'label'
	| 'profile'
	| 'report'
	| 'scheduledMessage'
	| 'team'
	| 'webhook';

export type ChatwootOperations =
	| AccountOperation
	| AgentOperation
	| AutomationOperation
	| CannedResponseOperation
	| ContactOperation
	| ConversationOperation
	| CustomAttributeOperation
	| HelpCenterOperation
	| InboxOperation
	| KanbanBoardOperation
	| KanbanItemOperation
	| KanbanStepOperation
	| KanbanTaskOperation
	| LabelOperation
	| ProfileOperation
	| ReportOperation
	| ScheduledMessageOperation
	| TeamOperation
	| WebhookOperation;

export type {
	AccountOperation,
	AgentOperation,
	AutomationOperation,
	CannedResponseOperation,
	ContactOperation,
	ConversationOperation,
	CustomAttributeOperation,
	HelpCenterOperation,
	InboxOperation,
	KanbanBoardOperation,
	KanbanItemOperation,
	KanbanStepOperation,
	KanbanTaskOperation,
	LabelOperation,
	ProfileOperation,
	ReportOperation,
	ScheduledMessageOperation,
	TeamOperation,
	WebhookOperation,
};
