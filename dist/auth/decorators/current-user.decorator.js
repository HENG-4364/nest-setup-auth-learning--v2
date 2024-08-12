"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = exports.getMeByContext = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const getMeByContext = (context) => {
    if (context.getType() === 'http') {
        return context.switchToHttp().getRequest().user;
    }
    const ctx = graphql_1.GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
};
exports.getMeByContext = getMeByContext;
exports.CurrentUser = (0, common_1.createParamDecorator)((_data, context) => (0, exports.getMeByContext)(context));
//# sourceMappingURL=current-user.decorator.js.map