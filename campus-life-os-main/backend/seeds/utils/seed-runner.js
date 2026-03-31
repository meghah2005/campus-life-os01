const mongoose = require('mongoose');

/**
 * Seed runner utility for managing database seeding operations
 */
class SeedRunner {
  constructor(mongoUri, databaseName) {
    this.mongoUri = mongoUri;
    this.databaseName = databaseName;
  }

  /**
   * Connect to MongoDB database
   */
  async connect() {
    try {
      await mongoose.connect(this.mongoUri);
      console.log(`✓ Connected to database: ${this.databaseName}`);
      return true;
    } catch (error) {
      console.error(`✗ Failed to connect to ${this.databaseName}:`, error.message);
      return false;
    }
  }

  /**
   * Disconnect from MongoDB
   */
  async disconnect() {
    await mongoose.disconnect();
    console.log(`✓ Disconnected from ${this.databaseName}`);
  }

  /**
   * Clear a collection
   */
  async clearCollection(collectionName) {
    const db = mongoose.connection.db;
    await db.collection(collectionName).deleteMany({});
    console.log(`  ✓ Cleared ${collectionName}`);
  }

  /**
   * Seed a collection with data
   */
  async seedCollection(collectionName, data) {
    const db = mongoose.connection.db;
    await this.clearCollection(collectionName);
    const result = await db.collection(collectionName).insertMany(data);
    console.log(`  ✓ Seeded ${collectionName}: ${result.insertedCount} documents`);
    return result.insertedCount;
  }

  /**
   * Run a complete seed operation
   */
  async run(seedFn) {
    try {
      const connected = await this.connect();
      if (!connected) throw new Error('Connection failed');

      await seedFn(this);

      await this.disconnect();
      return true;
    } catch (error) {
      console.error(`\n✗ Seeding error (${this.databaseName}):`, error.message);
      await mongoose.disconnect();
      return false;
    }
  }
}

module.exports = SeedRunner;
