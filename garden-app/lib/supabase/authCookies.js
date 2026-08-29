export function expireAuthCookies(response, cookies) {
	for (const { name } of cookies) {
		if (name.startsWith('sb-')) {
			response.cookies.set(name, '', { path: '/', maxAge: 0 });
		}
	}
	return response;
}
