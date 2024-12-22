"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSlug = exports.findWithId = void 0;
const config_1 = require("@/config");
const mongoose_1 = __importDefault(require("mongoose"));
const findWithId = (id_1, Model_1, ...args_1) => __awaiter(void 0, [id_1, Model_1, ...args_1], void 0, function* (id, Model, options = {}) {
    try {
        const item = yield Model.findById(id, options);
        if (!item) {
            throw (0, config_1.createError)(404, `${Model.modelName} item not found with this id`);
        }
        return item;
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            throw (0, config_1.createError)(400, "Invalid item id");
        }
        throw error;
    }
});
exports.findWithId = findWithId;
const generateSlug = (courseName) => {
    const slug = courseName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .trim();
    return slug;
};
exports.generateSlug = generateSlug;
