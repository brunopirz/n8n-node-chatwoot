import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { chatwootApiRequest, getPortalSlug, getArticleId } from '../../shared/transport';
import type { HelpCenterOperation } from './types';

export async function executeHelpCenterOperation(
	context: IExecuteFunctions,
	operation: HelpCenterOperation,
	itemIndex: number,
): Promise<INodeExecutionData | INodeExecutionData[]> {
	switch (operation) {
		case 'listPortals':
			return listPortalsOperation(context);
		case 'listArticles':
			return listArticlesOperation(context, itemIndex);
		case 'getArticle':
			return getArticleOperation(context, itemIndex);
		case 'createArticle':
			return createArticleOperation(context, itemIndex);
		case 'updateArticle':
			return updateArticleOperation(context, itemIndex);
		case 'deleteArticle':
			return deleteArticleOperation(context, itemIndex);
	}
}

async function listPortalsOperation(
	context: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const response = (await chatwootApiRequest.call(
		context,
		'GET',
		'/api/v1/portals',
	)) as IDataObject;

	const payload = response.payload as IDataObject | IDataObject[];
	let portals: IDataObject[] = [];

	if (Array.isArray(payload)) {
		portals = payload;
	} else if (payload && typeof payload === 'object') {
		const inner = (payload as IDataObject).portals;
		portals = Array.isArray(inner) ? (inner as IDataObject[]) : [payload];
	} else if (Array.isArray(response)) {
		portals = response as IDataObject[];
	} else {
		portals = [response];
	}

	return portals.map((portal) => ({ json: portal }));
}

async function listArticlesOperation(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const portalSlug = getPortalSlug.call(context, itemIndex);
	const filters = context.getNodeParameter('filters', itemIndex, {}) as IDataObject;

	const query: IDataObject = {};
	if (filters.locale) query.locale = filters.locale;
	if (filters.page) query.page = filters.page;

	const response = (await chatwootApiRequest.call(
		context,
		'GET',
		`/api/v1/portals/${portalSlug}/articles`,
		undefined,
		query,
	)) as IDataObject;

	const payload = response.payload as IDataObject | IDataObject[];
	let articles: IDataObject[] = [];

	if (Array.isArray(payload)) {
		articles = payload;
	} else if (payload && typeof payload === 'object') {
		const inner = (payload as IDataObject).articles;
		articles = Array.isArray(inner) ? (inner as IDataObject[]) : [payload];
	} else if (Array.isArray(response)) {
		articles = response as IDataObject[];
	}

	return articles.map((article) => ({ json: article }));
}

async function getArticleOperation(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const portalSlug = getPortalSlug.call(context, itemIndex);
	const articleId = getArticleId.call(context, itemIndex);

	const response = (await chatwootApiRequest.call(
		context,
		'GET',
		`/api/v1/portals/${portalSlug}/articles/${articleId}`,
	)) as IDataObject;

	const payload = (response.payload ?? response) as IDataObject;
	return { json: payload };
}

async function createArticleOperation(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const portalSlug = getPortalSlug.call(context, itemIndex);
	const title = context.getNodeParameter('title', itemIndex) as string;
	const content = context.getNodeParameter('content', itemIndex) as string;
	const locale = context.getNodeParameter('locale', itemIndex) as string;
	const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

	const body: IDataObject = {
		title,
		content,
		locale,
	};

	if (additionalFields.status) body.status = additionalFields.status;
	if (additionalFields.description) body.description = additionalFields.description;
	if (additionalFields.author_id) body.author_id = additionalFields.author_id;
	if (additionalFields.category_id) body.category_id = additionalFields.category_id;

	const response = (await chatwootApiRequest.call(
		context,
		'POST',
		`/api/v1/portals/${portalSlug}/articles`,
		{ article: body },
	)) as IDataObject;

	const payload = (response.payload ?? response) as IDataObject;
	return { json: payload };
}

async function updateArticleOperation(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const portalSlug = getPortalSlug.call(context, itemIndex);
	const articleId = getArticleId.call(context, itemIndex);
	const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

	const body: IDataObject = {};
	if (updateFields.title) body.title = updateFields.title;
	if (updateFields.content) body.content = updateFields.content;
	if (updateFields.status) body.status = updateFields.status;
	if (updateFields.description) body.description = updateFields.description;
	if (updateFields.locale) body.locale = updateFields.locale;
	if (updateFields.category_id) body.category_id = updateFields.category_id;

	const response = (await chatwootApiRequest.call(
		context,
		'PATCH',
		`/api/v1/portals/${portalSlug}/articles/${articleId}`,
		{ article: body },
	)) as IDataObject;

	const payload = (response.payload ?? response) as IDataObject;
	return { json: payload };
}

async function deleteArticleOperation(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const portalSlug = getPortalSlug.call(context, itemIndex);
	const articleId = getArticleId.call(context, itemIndex);

	await chatwootApiRequest.call(
		context,
		'DELETE',
		`/api/v1/portals/${portalSlug}/articles/${articleId}`,
	);

	return { json: { success: true } };
}
