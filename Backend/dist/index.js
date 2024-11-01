"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config/config");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const vendorRoutes_1 = __importDefault(require("./routes/vendorRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const chat_1 = require("./utils/socket/chat");
const errorHandling_1 = require("./middleware/errorHandling");
const logger_1 = __importDefault(require("./utils/logger"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 5000;
const morganFormat = ":method :url :status :response-time ms";
(0, config_1.connectToMongoDB)();
const httpServer = (0, http_1.createServer)(app);
exports.io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "https://www.eventopia.shop",
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
(0, chat_1.socketHandler)(exports.io);
app.use((0, cors_1.default)({
    // origin: 'https://www.eventopia.shop',
    origin: ['https://www.eventopia.shop', 'https://eventopia.shop'],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)(morganFormat, {
    stream: {
        write: (message) => {
            const logObject = {
                method: message.split(" ")[0],
                url: message.split(" ")[1],
                status: message.split(" ")[2],
                responseTime: message.split(" ")[3],
            };
            logger_1.default.info(JSON.stringify(logObject));
        },
    },
}));
app.use('/user', userRoutes_1.default);
app.use('/vendor', vendorRoutes_1.default);
app.use('/admin', adminRoutes_1.default);
app.use('/chat', chatRoutes_1.default);
app.use(errorHandling_1.errorHandler);
httpServer.listen(PORT, () => {
    console.log(`Server started running on http://localhost:${PORT}/`);
});
