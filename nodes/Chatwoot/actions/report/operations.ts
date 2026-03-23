import { type IDataObject, type IExecuteFunctions, type INodeExecutionData } from 'n8n-workflow';
import { chatwootApiRequest, getAccountId } from '../../shared/transport';
import type { ReportOperation } from './types';

export async function executeReportOperation(
	context: IExecuteFunctions,
	operation: ReportOperation,
	itemIndex: number,
): Promise<INodeExecutionData | INodeExecutionData[]> {
	switch (operation) {
		case 'overview':
			return getAccountOverview(context, itemIndex);
		case 'summary':
			return getReportSummary(context, itemIndex);
		case 'agentConversations':
			return getAgentConversations(context, itemIndex);
	}
}

async function getAccountOverview(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);

	const result = await chatwootApiRequest.call(
		context,
		'GET',
		`/api/v1/accounts/${accountId}/reports/overview`,
	) as IDataObject;

	return { json: result };
}

async function getReportSummary(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const reportType = context.getNodeParameter('reportType', itemIndex) as string;
	const entityId = context.getNodeParameter('entityId', itemIndex, 0) as number;
	const since = context.getNodeParameter('since', itemIndex, 0) as number;
	const until = context.getNodeParameter('until', itemIndex, 0) as number;

	const query: IDataObject = { type: reportType };
	if (entityId) query.id = entityId;
	if (since) query.since = since;
	if (until) query.until = until;

	const result = await chatwootApiRequest.call(
		context,
		'GET',
		`/api/v1/accounts/${accountId}/reports/summary`,
		undefined,
		query,
	) as IDataObject;

	return { json: result };
}

async function getAgentConversations(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const accountId = getAccountId.call(context, itemIndex);
	const since = context.getNodeParameter('since', itemIndex, 0) as number;
	const until = context.getNodeParameter('until', itemIndex, 0) as number;

	const query: IDataObject = {};
	if (since) query.since = since;
	if (until) query.until = until;

	const result = await chatwootApiRequest.call(
		context,
		'GET',
		`/api/v1/accounts/${accountId}/reports/agents/conversations`,
		undefined,
		query,
	) as IDataObject[];

	return (result || []).map((item) => ({ json: item }));
}
