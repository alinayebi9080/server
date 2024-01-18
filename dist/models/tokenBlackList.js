"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tokenBlackListSchema = new mongoose_1.Schema({
    token: {
        type: String,
        required: true,
    },
});
const TokenBlackList = (0, mongoose_1.model)('TokenBlackList', tokenBlackListSchema);
exports.default = TokenBlackList;
//# sourceMappingURL=tokenBlackList.js.map