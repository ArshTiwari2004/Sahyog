from pyspark.sql import SparkSession
from pyspark.sql.functions import col, from_json, window
from pyspark.sql.types import StructType, StructField, StringType, DoubleType, TimestampType

# Initialize Spark Session
spark = SparkSession.builder \
    .appName("SahyogDisasterAnalysis") \
    .config("spark.jars.packages", "org.apache.spark:spark-sql-kafka-0-10_2.12:3.3.0") \
    .getOrCreate()

# Define schema for incoming data
schema = StructType([
    StructField("disaster_type", StringType(), True),
    StructField("latitude", DoubleType(), True),
    StructField("longitude", DoubleType(), True),
    StructField("severity", DoubleType(), True),
    StructField("timestamp", TimestampType(), True)
])

# Read stream from Kafka
df = spark \
    .readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "localhost:9092") \
    .option("subscribe", "disaster-data") \
    .load()

# Parse JSON data
parsed_df = df \
    .select(from_json(col("value").cast("string"), schema).alias("data")) \
    .select("data.*")

# Window aggregation
windowed_counts = parsed_df \
    .withWatermark("timestamp", "10 minutes") \
    .groupBy(
        window(col("timestamp"), "10 minutes", "5 minutes"),
        col("disaster_type")
    ) \
    .avg("severity") \
    .alias("avg_severity")

# Write the output to console (for testing)
query = windowed_counts \
    .writeStream \
    .outputMode("complete") \
    .format("console") \
    .start()

# Wait for the query to terminate
query.awaitTermination()