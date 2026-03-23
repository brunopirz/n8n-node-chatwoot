import { type IDataObject, type IExecuteFunctions, type INodeExecutionData } from 'n8n-workflow';
import { chatwootApiRequest, getAccountId, getCannedResponseId } from '../../shared/transport';
import type { CannedResponseOperation } from './types';

export async function executeCannedResponseOperation(
	context: IExecuteFunctions,
	operation: CannedResponseOperation,
	itemIndex: number,
): Promise<INodeExecutionData | INodeExecutionData[]> {
	switch (operation) {
		case 'create':
			return createCannedResponse(context, itemIndex);
		case 'delete':
			return deleteCannedResponse(context, itemIndex);
		case 'list':
			return listCannedResponses(context, itemIndex);
		case 'update':
			return updateCannedResponse(context, itemIndex);
	}
}

async function createCannedResponse(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const short_code = context.getNodeParameter('short_code', itemIndex) as string;
	const content = context.getNodeParameter('content', itemIndex) as string;

	const result = await chatwootApiRequest.call(
		context,
		'POST',
		`/api/v1/accounts/${accountId}/canned_responses`,
		{ short_code, content },
	) as IDataObject;

	return { json: result };
}

async function listCannedResponses(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const accountId = getAccountId.call(context, itemIndex);
	const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

	const query: IDataObject = {};
	if (additionalFields.search) {
		query.search = additionalFields.search;
	}

	const result = await chatwootApiRequest.call(
		context,
		'GET',
		`/api/v1/accounts/${accountId}/canned_responses`,
		undefined,
		query,
	) as IDataObject[];

	return (result || []).map((item) => ({ json: item }));
}

async function updateCannedResponse(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const cannedResponseId = getCannedResponseId.call(context, itemIndex);
	const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

	const body: IDataObject = {};
	if (updateFields.short_code) body.short_code = updateFields.short_code;
	if (updateFields.content) body.content = updateFields.content;

	const result = await chatwootApiRequest.call(
		context,
		'PATCH',
		`/api/v1/accounts/${accountId}/canned_responses/${cannedResponseId}`,
		body,
	) as IDataObject;

	return { json: result };
}

async function deleteCannedResponse(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const cannedResponseId = getCannedResponseId.call(context, itemIndex);

	await chatwootApiRequest.call(
		context,
		'DELETE',
		`/api/v1/accounts/${accountId}/canned_responses/${cannedResponseId}`,
	);

	return { json: {} };
}
