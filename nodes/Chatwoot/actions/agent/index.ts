import type { INodeProperties } from 'n8n-workflow';
import { accountSelector, agentSelector } from '../../shared/descriptions';

const showOnlyForAgent = {
	resource: ['agent'],
};

const agentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForAgent,
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Add a new agent to account',
				action: 'Create agent',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Remove an agent from account',
				action: 'Delete agent',
			},
			{
				name: 'Get Availability',
				value: 'getAvailability',
				description: 'Get the availability status of an agent',
				action: 'Get agent availability',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all agents in account',
				action: 'List agents',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an agent in account',
				action: 'Update agent',
			},
			{
				name: 'Update Availability',
				value: 'updateAvailability',
				description: 'Update the availability status of an agent',
				action: 'Update agent availability',
			},
		],
		default: 'list',
	},
];

const agentFields: INodeProperties[] = [
	{
		...accountSelector,
		displayOptions: {
			show: showOnlyForAgent,
		},
	},
	{
		...agentSelector,
		displayOptions: {
			show: {
				...showOnlyForAgent,
				operation: ['delete', 'update', 'getAvailability', 'updateAvailability'],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		description: 'Full name of the agent',
		displayOptions: {
			show: {
				...showOnlyForAgent,
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		default: '',
		required: true,
		description: 'Email of the agent',
		displayOptions: {
			show: {
				...showOnlyForAgent,
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Role',
		name: 'role',
		type: 'options',
		options: [
			{
				name: 'Agent',
				value: 'agent',
			},
			{
				name: 'Administrator',
				value: 'administrator',
			},
		],
		default: 'agent',
		required: true,
		description: "Whether it's an agent or administrator",
		displayOptions: {
			show: {
				...showOnlyForAgent,
				operation: ['create', 'update'],
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
				...showOnlyForAgent,
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Full name of the agent',
			},
			{
				displayName: 'Auto Offline',
				name: 'auto_offline',
				type: 'boolean',
				default: true,
				description: 'Whether the availability status of agent is configured to go offline automatically when away',
			},
			{
				displayName: 'Availability Status',
				name: 'availability_status',
				type: 'options',
				options: [
					{
						name: 'Available',
						value: 'available',
					},
					{
						name: 'Busy',
						value: 'busy',
					},
					{
						name: 'Offline',
						value: 'offline',
					},
				],
				default: 'available',
				description: 'The availability status of the agent',
			},
		],
	},
	{
		displayName: 'Availability Status',
		name: 'availability_status',
		type: 'options',
		options: [
			{ name: 'Available', value: 'available' },
			{ name: 'Busy', value: 'busy' },
			{ name: 'Offline', value: 'offline' },
		],
		default: 'available',
		required: true,
		description: 'The new availability status for the agent',
		displayOptions: {
			show: {
				...showOnlyForAgent,
				operation: ['updateAvailability'],
			},
		},
	},
];

export const agentDescription: INodeProperties[] = [
	...agentOperations,
	...agentFields,
];

export { executeAgentOperation } from './operations';
