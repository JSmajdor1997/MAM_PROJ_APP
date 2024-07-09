import API from "./API";
import MockupAPI from "./implementations/MockupAPI";

let api: API | null = null
export default function getAPI(): API {
    if(api == null) {
        api = new MockupAPI()
    }

    return api
}