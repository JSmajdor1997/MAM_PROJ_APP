import waitMs from "../../utils/waitMs";
import API, { APIResponse, GeneralError } from "../API";
import WisbObjectType from "../WisbObjectType";
import { Notification } from "../notifications";
import MockupAPI from "./MockupAPI";

type ParamExtractor<T extends (...args: any[]) => any> = (api: API, ...args: Parameters<T>) => Omit<Notification, "author">[];

interface Config<T extends (api: API, ...args: any[]) => any> {
    checkLogin?: boolean;
    altersData?: boolean;
    notification?: ParamExtractor<T>;
}

const MAX_API_LATENCY_MS = 300

export default function api_endpoint<T extends (...args: any[]) => Promise<any>>(config: Config<T>) {
    return function (target: any, key: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void {
        const originalMethod = descriptor.value!;

        descriptor.value = async function (this: MockupAPI, ...args: Parameters<T>): Promise<ReturnType<T>> {
            const currentUser = this.getCurrentUser()

            if (config.checkLogin && currentUser == null) {
                return {
                    error: GeneralError.UserNotAuthorized
                } as unknown as ReturnType<T>;
            }

            await waitMs(Math.floor(Math.random() * MAX_API_LATENCY_MS));
            const result = await originalMethod.apply(this, args) as APIResponse<any, any>;

            if (result.error == null && currentUser != null) {
                if (config.altersData) {
                    this.syncToDB();
                }

                if (config.notification) {
                    const extractedParam = config.notification(this, ...args);

                    extractedParam.forEach((it) => this.broadcastNotifications({ ...it, author: { type: WisbObjectType.User, id: currentUser.id } } as Notification))
                }
            }

            return result as ReturnType<T>;
        } as T;

        return descriptor;
    };
}