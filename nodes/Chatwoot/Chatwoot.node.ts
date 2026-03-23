import {
	NodeConnectionTypes,
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';

import type {
	ChatwootResources,
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
} from './actions/node.type';

import { profileDescription, executeProfileOperation } from './actions/profile';
import { accountDescription, executeAccountOperation } from './actions/account';
import { agentDescription, executeAgentOperation } from './actions/agent';
import { automationDescription, executeAutomationOperation } from './actions/automation';
import { cannedResponseDescription, executeCannedResponseOperation } from './actions/cannedResponse';
import { inboxDescription, executeInboxOperation } from './actions/inbox';
import { contactDescription, executeContactOperation } from './actions/contact';
import { conversationDescription, executeConversationOperation } from './actions/conversation';
import { customAttributeDescription, executeCustomAttributeOperation } from './actions/customAttribute';
import { labelDescription, executeLabelOperation } from './actions/label';
import { kanbanBoardDescription, executeKanbanBoardOperation } from './actions/kanbanBoard';
import { kanbanItemDescription, executeKanbanItemOperation } from './actions/kanbanItem';
import { kanbanStepDescription, executeKanbanStepOperation } from './actions/kanbanStep';
import { kanbanTaskDescription, executeKanbanTaskOperation } from './actions/kanbanTask';
import { reportDescription, executeReportOperation } from './actions/report';
import { teamDescription, executeTeamOperation } from './actions/team';
import { scheduledMessageDescription, executeScheduledMessageOperation } from './actions/scheduledMessage';
import { helpCenterDescription, executeHelpCenterOperation } from './actions/helpCenter';
import { webhookDescription, executeWebhookOperation } from './actions/webhook';
import { listSearch, loadOptions } from './methods';

/**
 * Node for interacting with the Chatwoot REST API.
 */
export class Chatwoot implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Chatwoot SingulHub',
		name: 'chatwoot',
		icon: { light: 'file:../../icons/singulhub.svg', dark: 'file:../../icons/singulhub-dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Interact with the Chatwoot API',
		defaults: {
			name: 'Chatwoot',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'singulHubChatwootApi',
				required: true,
			},
		],
		codex: {
			categories: ['Communication', 'Utility'],
		},
		usableAsTool: true,
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Account',
						value: 'account',
						description: 'Manage Chatwoot accounts',
					},
					{
						name: 'Agent',
						value: 'agent',
						description: 'Manage agents in account',
					},
					{
						name: 'Automation',
						value: 'automation',
						description: 'Manage automation rules',
					},
					{
						name: 'Canned Response',
						value: 'cannedResponse',
						description: 'Manage canned responses (quick replies)',
					},
					{
						name: 'Contact',
						value: 'contact',
						description: 'Manage contacts',
					},
					{
						name: 'Conversation',
						value: 'conversation',
						description: 'Manage conversations',
					},
					{
						name: 'Custom Attribute',
						value: 'customAttribute',
						description: 'Manage custom attributes on contacts and conversations',
					},
					{
						name: 'Help Center',
						value: 'helpCenter',
						description: 'Manage Help Center portals and articles',
					},
					{
						name: 'Inbox',
						value: 'inbox',
						description: 'Manage inboxes',
					},
					{
						name: 'Kanban Board',
						value: 'kanbanBoard',
						description: 'Manage Kanban boards',
					},
					{
						name: 'Kanban Item',
						value: 'kanbanItem',
						description: 'Manage Kanban items (conversations linked to steps)',
					},
					{
						name: 'Kanban Step',
						value: 'kanbanStep',
						description: 'Manage Kanban steps',
					},
					{
						name: 'Kanban Task',
						value: 'kanbanTask',
						description: 'Manage Kanban tasks',
					},
					{
						name: 'Label',
						value: 'label',
						description: 'Manage labels',
					},
					{
						name: 'Profile',
						value: 'profile',
						description: 'Access user profile and authentication info',
					},
					{
						name: 'Report',
						value: 'report',
						description: 'Access account, agent, inbox, and team reports',
					},
					{
						name: 'Scheduled Message',
						value: 'scheduledMessage',
						description: 'Manage scheduled messages in conversations',
					},
					{
						name: 'Team',
						value: 'team',
						description: 'Manage teams and team members',
					},
					{
						name: 'Webhook',
						value: 'webhook',
						description: 'Manage webhooks',
					},
				],
				default: 'conversation',
			},
			...profileDescription,
			...accountDescription,
			...agentDescription,
			...automationDescription,
			...cannedResponseDescription,
			...inboxDescription,
			...contactDescription,
			...conversationDescription,
			...customAttributeDescription,
			...labelDescription,
			...kanbanBoardDescription,
			...kanbanItemDescription,
			...kanbanStepDescription,
			...kanbanTaskDescription,
			...reportDescription,
			...scheduledMessageDescription,
			...teamDescription,
			...helpCenterDescription,
			...webhookDescription,
		],
	};

	methods = {
		listSearch,
		loadOptions,
	};

	/**
	 * Dispatches each incoming item to the selected Chatwoot resource/operation and wraps the API response for n8n.
	 */
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as ChatwootResources;
		const operation = this.getNodeParameter('operation', 0);

		// NOTE: When the node is used as an AI-agent tool, n8n's createNodeAsTool
		// wrapper (makeHandleToolInvocation) re-throws errors on the last retry,
		// which crashes the workflow. We catch errors and return a descriptive
		// string following the convention used by ToolCode and WorkflowToolService.
		const isToolMode = this.getNode().type.endsWith('Tool');

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: INodeExecutionData | INodeExecutionData[];
				switch (resource) {
					case 'profile':
						responseData = await executeProfileOperation(this, operation as ProfileOperation);
						break;
					case 'account':
						responseData = await executeAccountOperation(this, operation as AccountOperation, i);
						break;
					case 'agent':
						responseData = await executeAgentOperation(this, operation as AgentOperation, i);
						break;
					case 'automation':
						responseData = await executeAutomationOperation(this, operation as AutomationOperation, i);
						break;
					case 'cannedResponse':
						responseData = await executeCannedResponseOperation(this, operation as CannedResponseOperation, i);
						break;
					case 'inbox':
						responseData = await executeInboxOperation(this, operation as InboxOperation, i);
						break;
					case 'contact':
						responseData = await executeContactOperation(this, operation as ContactOperation, i);
						break;
					case 'conversation':
						responseData = await executeConversationOperation(this, operation as ConversationOperation, i);
						break;
					case 'customAttribute':
						responseData = await executeCustomAttributeOperation(this, operation as CustomAttributeOperation, i);
						break;
					case 'label':
						responseData = await executeLabelOperation(this, operation as LabelOperation, i);
						break;
					case 'kanbanBoard':
						responseData = await executeKanbanBoardOperation(this, operation as KanbanBoardOperation, i);
						break;
					case 'kanbanItem':
						responseData = await executeKanbanItemOperation(this, operation as KanbanItemOperation, i);
						break;
					case 'kanbanStep':
						responseData = await executeKanbanStepOperation(this, operation as KanbanStepOperation, i);
						break;
					case 'kanbanTask':
						responseData = await executeKanbanTaskOperation(this, operation as KanbanTaskOperation, i);
						break;
					case 'report':
						responseData = await executeReportOperation(this, operation as ReportOperation, i);
						break;
					case 'scheduledMessage':
						responseData = await executeScheduledMessageOperation(this, operation as ScheduledMessageOperation, i);
						break;
					case 'team':
						responseData = await executeTeamOperation(this, operation as TeamOperation, i);
						break;
					case 'helpCenter':
						responseData = await executeHelpCenterOperation(this, operation as HelpCenterOperation, i);
						break;
					case 'webhook':
						responseData = await executeWebhookOperation(this, operation as WebhookOperation, i);
						break;
				}

				if (Array.isArray(responseData)) {
					returnData.push(...responseData);
				} else {
					returnData.push(responseData);
				}
			} catch (error) {
				if (isToolMode) {
					returnData.push({
						json: { error: `There was an error: "${(error as Error).message}"` },
						pairedItem: { item: i },
					});
					continue;
				}

				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}

				throw error;
			}
		}

		return [returnData];
	}
}
