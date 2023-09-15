import { applyDecorators, UseGuards } from "@nestjs/common";
import { Actions } from "../role/decorator/action.decorator";
import { Roles } from "../role/decorator/role.decorator";
import { AuthGuard } from "./auth.guard";

interface AuthOption {
    role?: string[]
    access?: string
}

export function Auth(param?: AuthOption)
{
    if (param)
    {
        return applyDecorators(
            Roles(param.role),
            Actions(param.access),
            UseGuards(AuthGuard)
        );
    }

    return applyDecorators(
        UseGuards(AuthGuard)
    );
}