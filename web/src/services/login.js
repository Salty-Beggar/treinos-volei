
import { api } from './api.js';

export async function register(signal) {
    console.log(signal);
	return await api.post('/register', {
		...signal
	});
}