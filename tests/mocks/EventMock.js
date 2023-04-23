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
}

module.exports = {
    EventMock
}
