import type { INodeProperties } from 'n8n-workflow';
import { accountSelector, cannedResponseSelector } from '../../shared/descriptions';

const showOnlyForCannedResponse = {
	resource: ['cannedResponse'],
};

const cannedResponseOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForCannedResponse,
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new canned response',
				action: 'Create canned response',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a canned response',
				action: 'Delete canned response',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all canned responses',
				action: 'List canned responses',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a canned response',
				action: 'Update canned response',
			},
		],
		default: 'list',
	},
];

const cannedResponseFields: INodeProperties[] = [
	{
		...accountSelector,
		displayOptions: {
			show: showOnlyForCannedResponse,
		},
	},
	{
		...cannedResponseSelector,
		displayOptions: {
			show: {
				...showOnlyForCannedResponse,
				operation: ['update', 'delete'],
			},
		},
	},
	{
		displayName: 'Short Code',
		name: 'short_code',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'greeting',
		description: 'Short code to trigger this canned response (without the / prefix)',
		displayOptions: {
			show: {
				...showOnlyForCannedResponse,
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		default: '',
		required: true,
		typeOptions: {
			rows: 4,
		},
		description: 'The full content of the canned response',
		displayOptions: {
			show: {
				...showOnlyForCannedResponse,
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
				...showOnlyForCannedResponse,
				operation: ['list'],
			},
		},
		options: [
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Filter canned responses by short code or content',
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
				...showOnlyForCannedResponse,
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Short Code',
				name: 'short_code',
				type: 'string',
				default: '',
				description: 'Short code to trigger this canned response',
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				default: '',
				typeOptions: {
					rows: 4,
				},
				description: 'The full content of the canned response',
			},
		],
	},
];

export const cannedResponseDescription: INodeProperties[] = [
	...cannedResponseOperations,
	...cannedResponseFields,
];

export { executeCannedResponseOperation } from './operations';
