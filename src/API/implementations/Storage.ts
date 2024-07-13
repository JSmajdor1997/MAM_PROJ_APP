import { MMKV } from "react-native-mmkv"
import { Invitation, WisbDumpster, WisbEvent, WisbMessage, WisbUser, WisbWasteland } from "../interfaces"
import getMockupDumpsters from "../generators/getMockupDumpsters"
import getMockupEvents from "../generators/getMockupEvents"
import getMockupInvitations from "../generators/getMockupInvitations"
import getMockupMessages from "../generators/getMockupMessages"
import getMockupUsers from "../generators/getMockupUsers"
import getMockupWastelands from "../generators/getMockupWastelands"

export interface DB {
    users: Map<string, WisbUser>
    events: Map<string, WisbEvent>
    wastelands: Map<string, WisbWasteland>
    dumpsters: Map<string, WisbDumpster>

    invitations: Map<string, Invitation[]>        //key is user id

    currentUser: WisbUser | null
    messages: Map<string, WisbMessage[]>              //key is event's id
}

export default class Storage {
    private static StringifyJSON: (key: string, value: any) => any = function (this: any, key, value) {
        if (value instanceof Map) {
            return {
                __type: 'Map',
                value: Object.fromEntries(value)
            };
        } else if (this[key] instanceof Date) {
            return {
                value: this[key].toUTCString(),
                __type: 'Date',
            }
        }

        return value;
    }
    private static ParseJSON: (key: string, value: any) => any = (key, value) => {
        if (value != null && typeof value == "object") {
            if (value.__type === 'Map') {
                return new Map(Object.entries(value.value));
            } else if (value.__type === 'Date') {
                return new Date(value.value)
            }
        }

        return value;
    }

    private static readonly DefaultUsers: WisbUser[] = [
        {
            id: 99999,
            email: "abc@abc.com",
            userName: "DefUser1",
            password: "123",
            photoUrl: "https://www.pngall.com/wp-content/uploads/15/Chad-Meme-PNG-Background.png",
            nrOfClearedWastelands: 123,
            addedDumpsters: 321,
            deletedDumpsters: 1,
        },
        {
            id: 999991,
            email: "cba@cba.com",
            userName: "DefUser2",
            password: "123",
            photoUrl: "https://ih1.redbubble.net/image.3392464379.8767/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.jpg",
            nrOfClearedWastelands: 123,
            addedDumpsters: 321,
            deletedDumpsters: 1,
        }
    ]

    private static readonly MMKV_ID = "mockup_api"
    private static readonly MMKV_KEY = "mockup_api"
    private mmkvStorage = new MMKV({
        id: Storage.MMKV_ID,
        encryptionKey: 'hunter2'
    })

    private readonly db: DB

    syncToDB() {
        this.mmkvStorage.set(Storage.MMKV_KEY, JSON.stringify(this.db, Storage.StringifyJSON))
    }

    get(): DB {
        return this.db
    }

    constructor() {
        if (!this.mmkvStorage.contains(Storage.MMKV_KEY)) {
            const users = getMockupUsers()
            for (const defUser of Storage.DefaultUsers) {
                users.set(defUser.id.toString(), defUser)
            }

            const dumpsters = getMockupDumpsters(users)
            const wastelands = getMockupWastelands(users)
            const events = getMockupEvents(users, wastelands)
            const invitations = getMockupInvitations(events, users)
            const messages = getMockupMessages(events, users)

            this.mmkvStorage.set(Storage.MMKV_KEY, JSON.stringify({
                currentUser: null,
                wastelands,
                users,
                dumpsters,
                events,
                invitations,
                messages
            }, Storage.StringifyJSON))
        }

        const rawDb = this.mmkvStorage.getString(Storage.MMKV_KEY)!
        let {
            currentUser,
            dumpsters,
            wastelands,
            events,
            invitations,
            users,
            messages
        } = JSON.parse(rawDb, Storage.ParseJSON) as DB

        this.db = {
            messages,
            wastelands,
            currentUser,
            dumpsters,
            users,
            invitations,
            events
        }
    }
}