import type { INodeProperties } from 'n8n-workflow';
import { portalSlugSelector } from '../../shared/descriptions';

const showOnlyForHelpCenter = {
	resource: ['helpCenter'],
};

const helpCenterOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForHelpCenter,
		},
		options: [
			{
				name: 'Create Article',
				value: 'createArticle',
				description: 'Create a new article in a portal',
				action: 'Create a Help Center article',
			},
			{
				name: 'Delete Article',
				value: 'deleteArticle',
				description: 'Delete an article from a portal',
				action: 'Delete a Help Center article',
			},
			{
				name: 'Get Article',
				value: 'getArticle',
				description: 'Get a specific article from a portal',
				action: 'Get a Help Center article',
			},
			{
				name: 'List Articles',
				value: 'listArticles',
				description: 'List all articles in a portal',
				action: 'List Help Center articles',
			},
			{
				name: 'List Portals',
				value: 'listPortals',
				description: 'List all Help Center portals',
				action: 'List Help Center portals',
			},
			{
				name: 'Update Article',
				value: 'updateArticle',
				description: 'Update an existing article in a portal',
				action: 'Update a Help Center article',
			},
		],
		default: 'listPortals',
	},
];

const helpCenterFields: INodeProperties[] = [
	// Portal slug — shown for all operations except listPortals
	{
		...portalSlugSelector,
		displayOptions: {
			show: {
				...showOnlyForHelpCenter,
				operation: ['listArticles', 'getArticle', 'createArticle', 'updateArticle', 'deleteArticle'],
			},
		},
	},
	// Article ID — shown for get, update, delete
	{
		displayName: 'Article ID',
		name: 'articleId',
		type: 'number',
		default: '',
		required: true,
		description: 'The ID of the article',
		displayOptions: {
			show: {
				...showOnlyForHelpCenter,
				operation: ['getArticle', 'updateArticle', 'deleteArticle'],
			},
		},
	},
	// Title — required for create
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		required: true,
		description: 'The title of the article',
		displayOptions: {
			show: {
				...showOnlyForHelpCenter,
				operation: ['createArticle'],
			},
		},
	},
	// Content — required for create
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		default: '',
		required: true,
		description: 'The HTML content of the article',
		typeOptions: {
			rows: 5,
		},
		displayOptions: {
			show: {
				...showOnlyForHelpCenter,
				operation: ['createArticle'],
			},
		},
	},
	// Locale — required for create
	{
		displayName: 'Locale',
		name: 'locale',
		type: 'string',
		default: 'en',
		required: true,
		placeholder: 'e.g. en',
		description: 'The locale/language code for the article (e.g. en, pt, es)',
		displayOptions: {
			show: {
				...showOnlyForHelpCenter,
				operation: ['createArticle'],
			},
		},
	},
	// Additional fields for create
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				...showOnlyForHelpCenter,
				operation: ['createArticle'],
			},
		},
		options: [
			{
				displayName: 'Author ID',
				name: 'author_id',
				type: 'number',
				default: '',
				description: 'ID of the agent to set as the article author',
			},
			{
				displayName: 'Category ID',
				name: 'category_id',
				type: 'number',
				default: '',
				description: 'ID of the category to assign the article to',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A short description or excerpt for the article',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: 'draft',
				options: [
					{ name: 'Archived', value: 'archived' },
					{ name: 'Draft', value: 'draft' },
					{ name: 'Published', value: 'published' },
				],
				description: 'The publish status of the article',
			},
		],
	},
	// Optional filters for listArticles
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				...showOnlyForHelpCenter,
				operation: ['listArticles'],
			},
		},
		options: [
			{
				displayName: 'Locale',
				name: 'locale',
				type: 'string',
				default: '',
				placeholder: 'e.g. en',
				description: 'Filter articles by locale/language code',
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				default: 1,
				description: 'Page number for pagination',
			},
		],
	},
	// Update fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				...showOnlyForHelpCenter,
				operation: ['updateArticle'],
			},
		},
		options: [
			{
				displayName: 'Category ID',
				name: 'category_id',
				type: 'number',
				default: '',
				description: 'ID of the category to assign the article to',
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				default: '',
				description: 'The HTML content of the article',
				typeOptions: {
					rows: 5,
				},
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A short description or excerpt for the article',
			},
			{
				displayName: 'Locale',
				name: 'locale',
				type: 'string',
				default: '',
				placeholder: 'e.g. en',
				description: 'The locale/language code for the article',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: 'draft',
				options: [
					{ name: 'Archived', value: 'archived' },
					{ name: 'Draft', value: 'draft' },
					{ name: 'Published', value: 'published' },
				],
				description: 'The publish status of the article',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'The title of the article',
			},
		],
	},
];

export const helpCenterDescription: INodeProperties[] = [
	...helpCenterOperations,
	...helpCenterFields,
];

export { executeHelpCenterOperation } from './operations';
