const redis = require('redis');
const { promisify } = require('util');

let redisClient;

const getRedisClient = async () => {
  // If the client does not exist or is closed, create/reconnect it
  if (!redisClient || !redisClient.isOpen) {
    redisClient = redis.createClient({
      socket: {
        host: '18.180.162.113', // Remote Redis server
        port: 6379,            // Redis server port
      },
      password: '96854233',     // Redis password
      database: 0,
    });

    // Attach event listeners
    redisClient.on('error', (err) => {
      console.error('Redis error:', err);
    });

    redisClient.on('connect', () => {
      console.log('Connected to Redis');
    });

    // Connect the client
    try {
      await redisClient.connect();
      console.log('Redis client connected');
    } catch (err) {
      console.error('Error connecting to Redis:', err);
      throw err; // Rethrow the error if the connection fails
    }
  }

  return redisClient;
};

// Promisify Redis client methods for consistency with async/await
const redisService = {
  set: async (key, value, expirationInSeconds = 3600) => {
    try {
      const client = await getRedisClient(); // Ensure the client is connected
      await client.set(key, value, { EX: expirationInSeconds });
      console.log(`Key "${key}" set in Redis with expiration: ${expirationInSeconds}s`);
    } catch (err) {
      console.error('Error setting value in Redis:', err);
      throw err;
    }
  },

  get: async (key) => {
    try {
      console.log(`Key "${key}" fetching from Redis`);
      const client = await getRedisClient(); // Ensure the client is connected
      const value = await client.get(key);
      
      return value;
    } catch (err) {
      console.error('Error getting value from Redis:', err);
      throw err;
    }
  },

  hGet: async (key, field) => {
    try {
      const client = await getRedisClient(); // Ensure the client is connected
      const value = await client.hGet(key, field);
      return value;
    } catch (err) {
      console.error('Error getting value from Redis:', err);
      throw err;
    }
  },
  quit: async () => {
    if (redisClient && redisClient.isOpen) {
      await redisClient.quit();
      console.log('Redis client closed');
    }
  },
};

module.exports = redisService;