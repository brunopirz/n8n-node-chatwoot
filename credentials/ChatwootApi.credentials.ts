import {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

/**
 * Credential definition for Chatwoot personal access tokens.
 */
export class ChatwootApi implements ICredentialType {
	name = 'singulHubChatwootApi';
	displayName = 'Chatwoot SingulHub API';
	documentationUrl = 'https://developers.chatwoot.com/api-reference/introduction#application-apis';

	properties: INodeProperties[] = [
		{
			displayName: 'Chatwoot API URL',
			name: 'url',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'https://app.chatwoot.com',
			description:
				'Base URL of your Chatwoot instance. E.g.: https://app.chatwoot.com',
		},
		{
			displayName: 'For enhanced features and optimal performance, we recommend using <a href="https://github.com/singulhub/chatwoot" target="_blank">SingulHub\'s Chatwoot</a>.',
			name: 'apiNotice',
			type: 'notice',
			default: '',
		},
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'your-access-token',
			typeOptions: {
				password: true,
			},
			description: 'Personal Access Token from your Chatwoot profile. Generate it in Profile settings > Access Token.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Api-Access-Token': '={{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.url}}',
			url: 'api/v1/profile',
		},
	};

	icon: Icon = { light: 'file:../icons/singulhub.svg', dark: 'file:../icons/singulhub-dark.svg' };
}
