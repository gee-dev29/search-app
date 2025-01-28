import mongoose from "mongoose";

export const ActivityLog = mongoose.model(
	"ActivityLog",
	new mongoose.Schema(
		{
			by: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "user",
				required: true,
			},
			on: {
				type: Object,
				default: null,
			},
			description: {
				type: String,
				required: true,
			},
			eventType: {
				type: String,
				required: true,
			},
			properties: {
				type: Object,
				default: [],
			},
		},
		{ timestamps: true }
	)
);
