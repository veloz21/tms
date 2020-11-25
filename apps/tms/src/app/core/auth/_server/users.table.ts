export class UsersTable {
	public static users: any = [
		{
			id: 1,
			username: 'admin',
			password: 'demo',
			email: 'admin@demo.com',
			accessToken: 'access-token-8f3ae836da744329a6f93bf20594b5cc',
			refreshToken: 'access-token-f8c137a2c98743f48b643e71161d90aa',
			roles: [1], // Administrator
			pic: './assets/media/users/300_25.jpg',
			createTime: '01/09/2038 03:14:07',
			updateTime: '01/09/2038 03:14:07',
			tenantId: 'galmex'
		},
		{
			id: 2,
			username: 'user',
			password: 'demo',
			email: 'user@demo.com',
			accessToken: 'access-token-6829bba69dd3421d8762-991e9e806dbf',
			refreshToken: 'access-token-f8e4c61a318e4d618b6c199ef96b9e55',
			roles: [2], // Manager
			pic: './assets/media/users/100_2.jpg',
			createTime: '01/09/2038 03:14:07',
			updateTime: '01/09/2038 03:14:07',
			tenantId: 'galmex'
        },
        {
			id: 3,
			username: 'guest',
			password: 'demo',
			email: 'guest@demo.com',
			accessToken: 'access-token-d2dff7b82f784de584b60964abbe45b9',
			refreshToken: 'access-token-c999ccfe74aa40d0aa1a64c5e620c1a5',
			roles: [3], // Guest
			pic: './assets/media/users/default.jpg',
			createTime: '01/09/2038 03:14:07',
			updateTime: '01/09/2038 03:14:07',
			tenantId: 'galmex'
		}	
	];

	public static tokens: any = [
		{
			id: 1,
			accessToken: 'access-token-' + Math.random(),
			refreshToken: 'access-token-' + Math.random()
		}
	];
}
