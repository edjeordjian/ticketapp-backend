class EventMock {
    constructor() {
        this.id = 1;

        this.name = "name";

        this.event_types = [];
    }

    getOrganizer() {
        return {
            first_name: "First",

            last_name: "Last"
        };
    }

    addFAQs(x) {
        return {};
    }

    addSpeakers(x) {
        return {};
    }

    addEvent_types(x) {
        return {};
    }
}

module.exports = {
    EventMock
}
