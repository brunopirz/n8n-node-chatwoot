import { type IDataObject, type IExecuteFunctions, type INodeExecutionData } from 'n8n-workflow';
import { chatwootApiRequest, getAccountId, getKanbanItemId, getKanbanStepId } from '../../shared/transport';
import type { KanbanItemOperation } from './types';

export async function executeKanbanItemOperation(
	context: IExecuteFunctions,
	operation: KanbanItemOperation,
	itemIndex: number,
): Promise<INodeExecutionData | INodeExecutionData[]> {
	switch (operation) {
		case 'list':
			return listItems(context, itemIndex);
		case 'create':
			return createItem(context, itemIndex);
		case 'move':
			return moveItem(context, itemIndex);
		case 'delete':
			return deleteItem(context, itemIndex);
	}
}

async function listItems(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const stepId = getKanbanStepId.call(context, itemIndex);

	const result = await chatwootApiRequest.call(
		context,
		'GET',
		`/api/v1/accounts/${accountId}/kanban/steps/${stepId}/items`,
	) as IDataObject;

	return { json: result };
}

async function createItem(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const stepId = getKanbanStepId.call(context, itemIndex);
	const conversationId = context.getNodeParameter('conversationId', itemIndex) as number;

	const result = await chatwootApiRequest.call(
		context,
		'POST',
		`/api/v1/accounts/${accountId}/kanban/steps/${stepId}/items`,
		{ item: { conversation_id: conversationId } },
	) as IDataObject;

	return { json: result };
}

async function moveItem(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const itemId = getKanbanItemId.call(context, itemIndex);
	const targetStepId = getKanbanStepId.call(context, itemIndex);
	const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

	const item: IDataObject = { kanban_step_id: targetStepId };
	if (additionalFields.position !== undefined) {
		item.position = additionalFields.position;
	}

	const result = await chatwootApiRequest.call(
		context,
		'PATCH',
		`/api/v1/accounts/${accountId}/kanban/items/${itemId}`,
		{ item },
	) as IDataObject;

	return { json: result };
}

async function deleteItem(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const itemId = getKanbanItemId.call(context, itemIndex);

	await chatwootApiRequest.call(
		context,
		'DELETE',
		`/api/v1/accounts/${accountId}/kanban/items/${itemId}`,
	);

	return { json: {} };
}
