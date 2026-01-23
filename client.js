import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: 'RkgIGHmicVlXNVCbhHZFwtxbS1gCWqXc',
    socket: {
        host: 'redis-13365.c330.asia-south1-1.gce.cloud.redislabs.com',
        port: 13365,
        connectTimeout: 20000 // Extended timeout
    }
});

client.on('error', err => console.log('Redis Client Error', err));

(async () => {
    try {
        await client.connect();
        console.log('Connected to Redis successfully');
    } catch (e) {
        console.error('Failed to connect to Redis. Please check your credentials and network connection.', e);
    }
})();

export default client;
