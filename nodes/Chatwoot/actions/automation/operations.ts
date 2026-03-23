import { type IDataObject, type IExecuteFunctions, type INodeExecutionData } from 'n8n-workflow';
import { chatwootApiRequest, getAccountId, getAutomationId } from '../../shared/transport';
import type { AutomationOperation } from './types';

export async function executeAutomationOperation(
	context: IExecuteFunctions,
	operation: AutomationOperation,
	itemIndex: number,
): Promise<INodeExecutionData | INodeExecutionData[]> {
	switch (operation) {
		case 'create':
			return createAutomation(context, itemIndex);
		case 'list':
			return listAutomations(context, itemIndex);
		case 'get':
			return getAutomation(context, itemIndex);
		case 'update':
			return updateAutomation(context, itemIndex);
		case 'delete':
			return deleteAutomation(context, itemIndex);
		case 'copy':
			return copyAutomation(context, itemIndex);
	}
}

async function createAutomation(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const name = context.getNodeParameter('name', itemIndex) as string;
	const event_name = context.getNodeParameter('event_name', itemIndex) as string;
	const conditionsRaw = context.getNodeParameter('conditions', itemIndex) as string;
	const actionsRaw = context.getNodeParameter('actions', itemIndex) as string;
	const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

	const conditions = JSON.parse(conditionsRaw) as IDataObject[];
	const actions = JSON.parse(actionsRaw) as IDataObject[];

	const body: IDataObject = {
		name,
		event_name,
		conditions,
		actions,
		...additionalFields,
	};

	const result = await chatwootApiRequest.call(
		context,
		'POST',
		`/api/v1/accounts/${accountId}/automation_rules`,
		body,
	) as IDataObject;

	return { json: result };
}

async function listAutomations(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const accountId = getAccountId.call(context, itemIndex);

	const result = await chatwootApiRequest.call(
		context,
		'GET',
		`/api/v1/accounts/${accountId}/automation_rules`,
	) as { payload?: IDataObject[] } | IDataObject[];

	const items =
		(result as { payload?: IDataObject[] }).payload ||
		(result as IDataObject[]) ||
		[];

	return items.map((item) => ({ json: item }));
}

async function getAutomation(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const automationId = getAutomationId.call(context, itemIndex);

	const result = await chatwootApiRequest.call(
		context,
		'GET',
		`/api/v1/accounts/${accountId}/automation_rules/${automationId}`,
	) as IDataObject;

	return { json: result };
}

async function updateAutomation(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const automationId = getAutomationId.call(context, itemIndex);
	const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

	const body: IDataObject = {};
	if (updateFields.name) body.name = updateFields.name;
	if (updateFields.description !== undefined) body.description = updateFields.description;
	if (updateFields.event_name) body.event_name = updateFields.event_name;
	if (updateFields.active !== undefined) body.active = updateFields.active;
	if (updateFields.conditions) body.conditions = JSON.parse(updateFields.conditions as string) as IDataObject[];
	if (updateFields.actions) body.actions = JSON.parse(updateFields.actions as string) as IDataObject[];

	const result = await chatwootApiRequest.call(
		context,
		'PATCH',
		`/api/v1/accounts/${accountId}/automation_rules/${automationId}`,
		body,
	) as IDataObject;

	return { json: result };
}

async function deleteAutomation(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const automationId = getAutomationId.call(context, itemIndex);

	await chatwootApiRequest.call(
		context,
		'DELETE',
		`/api/v1/accounts/${accountId}/automation_rules/${automationId}`,
	);

	return { json: {} };
}

async function copyAutomation(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const automationId = getAutomationId.call(context, itemIndex);

	const result = await chatwootApiRequest.call(
		context,
		'POST',
		`/api/v1/accounts/${accountId}/automation_rules/${automationId}/copy`,
	) as IDataObject;

	return { json: result };
}
