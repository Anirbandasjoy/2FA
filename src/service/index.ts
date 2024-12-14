import { createError } from "@/config";
import mongoose from "mongoose";

export const findWithId = async (id: string, Model: any, options = {}) => {
  try {
    const item = await Model.findById(id, options);
    if (!item) {
      throw createError(404, `${Model.modelName} item not found with this id`);
    }
    return item;
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createError(400, "Invalid item id");
    }
    throw error;
  }
};

export const generateSlug = (courseName: string): string => {
  const slug = courseName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .trim();

  return slug;
};
