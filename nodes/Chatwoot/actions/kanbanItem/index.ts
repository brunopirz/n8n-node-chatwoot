import type { INodeProperties } from 'n8n-workflow';
import {
	accountSelector,
	kanbanItemSelector,
	kanbanStepSelector,
} from '../../shared/descriptions';

const showOnlyForKanbanItem = {
	resource: ['kanbanItem'],
};

const kanbanItemOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { ...showOnlyForKanbanItem },
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Add a conversation to a kanban step',
				action: 'Create a kanban item',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Remove an item from the kanban',
				action: 'Delete a kanban item',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all items in a kanban step',
				action: 'List kanban items',
			},
			{
				name: 'Move',
				value: 'move',
				description: 'Move an item to a different step',
				action: 'Move a kanban item',
			},
		],
		default: 'list',
	},
];

const kanbanItemFields: INodeProperties[] = [
	{
		...accountSelector,
		displayOptions: {
			show: { ...showOnlyForKanbanItem },
		},
	},
	// Step selector for list and create
	{
		...kanbanStepSelector,
		displayOptions: {
			show: {
				...showOnlyForKanbanItem,
				operation: ['list', 'create'],
			},
		},
		typeOptions: {
			...kanbanStepSelector.typeOptions,
			loadOptionsDependsOn: ['accountId'],
		},
	},
	// Item selector for move and delete
	{
		...kanbanItemSelector,
		displayOptions: {
			show: {
				...showOnlyForKanbanItem,
				operation: ['move', 'delete'],
			},
		},
		typeOptions: {
			...kanbanItemSelector.typeOptions,
			loadOptionsDependsOn: ['accountId'],
		},
	},
	// Conversation ID for create
	{
		displayName: 'Conversation ID',
		name: 'conversationId',
		type: 'number',
		default: '',
		required: true,
		description: 'ID of the conversation to add to the kanban step',
		displayOptions: {
			show: {
				...showOnlyForKanbanItem,
				operation: ['create'],
			},
		},
	},
	// Target step selector for move
	{
		...kanbanStepSelector,
		displayName: 'Target Step',
		description: 'The kanban step to move the item to.',
		displayOptions: {
			show: {
				...showOnlyForKanbanItem,
				operation: ['move'],
			},
		},
		typeOptions: {
			...kanbanStepSelector.typeOptions,
			loadOptionsDependsOn: ['accountId'],
		},
	},
	// Additional fields for move (position)
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				...showOnlyForKanbanItem,
				operation: ['move'],
			},
		},
		options: [
			{
				displayName: 'Position',
				name: 'position',
				type: 'number',
				default: 0,
				description: 'Position of the item within the target step (0-based)',
			},
		],
	},
];

export const kanbanItemDescription: INodeProperties[] = [
	...kanbanItemOperations,
	...kanbanItemFields,
];

export { executeKanbanItemOperation } from './operations';
