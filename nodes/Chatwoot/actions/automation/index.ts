import type { INodeProperties } from 'n8n-workflow';
import { accountSelector, automationSelector } from '../../shared/descriptions';

const showOnlyForAutomation = {
	resource: ['automation'],
};

const automationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForAutomation,
		},
		options: [
			{
				name: 'Copy',
				value: 'copy',
				description: 'Duplicate an automation rule',
				action: 'Copy automation',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new automation rule',
				action: 'Create automation',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an automation rule',
				action: 'Delete automation',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific automation rule',
				action: 'Get automation',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all automation rules',
				action: 'List automations',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an automation rule',
				action: 'Update automation',
			},
		],
		default: 'list',
	},
];

const automationFields: INodeProperties[] = [
	{
		...accountSelector,
		displayOptions: {
			show: showOnlyForAutomation,
		},
	},
	{
		...automationSelector,
		displayOptions: {
			show: {
				...showOnlyForAutomation,
				operation: ['get', 'update', 'delete', 'copy'],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		description: 'Name of the automation rule',
		displayOptions: {
			show: {
				...showOnlyForAutomation,
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Event Name',
		name: 'event_name',
		type: 'options',
		options: [
			{ name: 'Conversation Created', value: 'conversation_created' },
			{ name: 'Conversation Status Changed', value: 'conversation_status_changed' },
			{ name: 'Conversation Assigned', value: 'conversation_assigned' },
			{ name: 'Message Created', value: 'message_created' },
			{ name: 'Conversation Updated', value: 'conversation_updated' },
		],
		default: 'conversation_created',
		required: true,
		description: 'The event that triggers this automation',
		displayOptions: {
			show: {
				...showOnlyForAutomation,
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Conditions (JSON)',
		name: 'conditions',
		type: 'string',
		default: '[]',
		required: true,
		typeOptions: {
			rows: 4,
		},
		description: 'Conditions array as JSON (e.g., [{"attribute_key":"status","filter_operator":"equal_to","values":["open"],"query_operator":null}])',
		displayOptions: {
			show: {
				...showOnlyForAutomation,
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Actions (JSON)',
		name: 'actions',
		type: 'string',
		default: '[]',
		required: true,
		typeOptions: {
			rows: 4,
		},
		description: 'Actions array as JSON (e.g., [{"action_name":"assign_a_team","action_params":[1]}])',
		displayOptions: {
			show: {
				...showOnlyForAutomation,
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				...showOnlyForAutomation,
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the automation rule',
			},
			{
				displayName: 'Active',
				name: 'active',
				type: 'boolean',
				default: true,
				description: 'Whether the automation rule is active',
			},
		],
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				...showOnlyForAutomation,
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the automation rule',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the automation rule',
			},
			{
				displayName: 'Event Name',
				name: 'event_name',
				type: 'options',
				options: [
					{ name: 'Conversation Created', value: 'conversation_created' },
					{ name: 'Conversation Status Changed', value: 'conversation_status_changed' },
					{ name: 'Conversation Assigned', value: 'conversation_assigned' },
					{ name: 'Message Created', value: 'message_created' },
					{ name: 'Conversation Updated', value: 'conversation_updated' },
				],
				default: 'conversation_created',
				description: 'The event that triggers this automation',
			},
			{
				displayName: 'Conditions (JSON)',
				name: 'conditions',
				type: 'string',
				default: '',
				typeOptions: {
					rows: 4,
				},
				description: 'Conditions array as JSON',
			},
			{
				displayName: 'Actions (JSON)',
				name: 'actions',
				type: 'string',
				default: '',
				typeOptions: {
					rows: 4,
				},
				description: 'Actions array as JSON',
			},
			{
				displayName: 'Active',
				name: 'active',
				type: 'boolean',
				default: true,
				description: 'Whether the automation rule is active',
			},
		],
	},
];

export const automationDescription: INodeProperties[] = [
	...automationOperations,
	...automationFields,
];

export { executeAutomationOperation } from './operations';
