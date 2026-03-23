import type { INodeProperties } from 'n8n-workflow';
import { accountSelector } from '../../shared/descriptions';

const showOnlyForReport = {
	resource: ['report'],
};

const reportOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForReport,
		},
		options: [
			{
				name: 'Agent Conversations',
				value: 'agentConversations',
				description: 'Get conversation metrics per agent',
				action: 'Get agent conversations report',
			},
			{
				name: 'Overview',
				value: 'overview',
				description: 'Get live account overview (active conversations, agents)',
				action: 'Get account overview',
			},
			{
				name: 'Summary',
				value: 'summary',
				description: 'Get summary report by account, agent, inbox, or team',
				action: 'Get report summary',
			},
		],
		default: 'overview',
	},
];

const reportFields: INodeProperties[] = [
	{
		...accountSelector,
		displayOptions: {
			show: showOnlyForReport,
		},
	},
	{
		displayName: 'Report Type',
		name: 'reportType',
		type: 'options',
		options: [
			{ name: 'Account', value: 'account' },
			{ name: 'Agent', value: 'agent' },
			{ name: 'Inbox', value: 'inbox' },
			{ name: 'Team', value: 'team' },
		],
		default: 'account',
		required: true,
		description: 'The type of entity to report on',
		displayOptions: {
			show: {
				...showOnlyForReport,
				operation: ['summary'],
			},
		},
	},
	{
		displayName: 'Entity ID',
		name: 'entityId',
		type: 'number',
		default: 0,
		description: 'ID of the agent, inbox, or team (not needed for account type)',
		displayOptions: {
			show: {
				...showOnlyForReport,
				operation: ['summary'],
				reportType: ['agent', 'inbox', 'team'],
			},
		},
	},
	{
		displayName: 'Since',
		name: 'since',
		type: 'number',
		default: 0,
		description: 'Start timestamp (Unix epoch in seconds)',
		displayOptions: {
			show: {
				...showOnlyForReport,
				operation: ['summary', 'agentConversations'],
			},
		},
	},
	{
		displayName: 'Until',
		name: 'until',
		type: 'number',
		default: 0,
		description: 'End timestamp (Unix epoch in seconds)',
		displayOptions: {
			show: {
				...showOnlyForReport,
				operation: ['summary', 'agentConversations'],
			},
		},
	},
];

export const reportDescription: INodeProperties[] = [
	...reportOperations,
	...reportFields,
];

export { executeReportOperation } from './operations';
