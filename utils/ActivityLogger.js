import mongoose from "mongoose";
import { ActivityLog } from "../models/ActivityLog.js";

export async function logActivity({ by, on, description, eventType, properties }) {
	const logger = new ActivityLog();
	logger.by = new mongoose.Types.ObjectId(by._id);
	if (on) {
		logger.on = {
			collection: on.collection.name,
			id: on._id,
		};
	}
	logger.eventType = eventType;
	logger.description = description;
	logger.createdAt = new Date();
	logger.updatedAt = new Date();
	logger.properties = properties;
	await logger.save();
	return logger;
}
