const { objDeepCopy, isEmpty, removeTimestamps } = require("../../../src/services/helpers/ObjectHelper");

const assert = require("assert");

describe("Object helper", () => {
    it("objDeepCopy", () => {
        assert("a" === objDeepCopy("a"));
    });

    it("isEmpty", () => {
        assert(isEmpty({}))
    });

    it("is not empty", () => {
        assert(!isEmpty({
            a: "A"
        }))
    });
});



describe('removeTimestamps', () => {
    it('should remove createdAt and updatedAt properties from a nested object', () => {
        const input = {
            message: {
                id: 2,
                organizer_email: 'fburman@fi.uba.ar',
                createdAt: '2023-04-16T20:04:08.240Z',
                updatedAt: '2023-04-16T20:04:08.240Z',
                users: [
                    {
                        email: 'fedeburmannansn@gmail.com',
                        group_group_participant: {
                            createdAt: '2023-04-16T20:38:01.149Z',
                            updatedAt: '2023-04-16T20:38:01.149Z',
                            groupId: 2,
                            userId: '8',
                        },
                    },
                    {
                        email: 'fburmann@fi.uba.ar',
                        group_group_participant: {
                            createdAt: '2023-04-16T20:46:10.866Z',
                            updatedAt: '2023-04-16T20:46:10.866Z',
                            groupId: 2,
                            userId: '2',
                        },
                    },
                ],
            },
        };

        const expectedOutput = {
            message: {
                id: 2,
                organizer_email: 'fburman@fi.uba.ar',
                users: [
                    {
                        email: 'fedeburmannansn@gmail.com',
                        group_group_participant: {
                            groupId: 2,
                            userId: '8',
                        },
                    },
                    {
                        email: 'fburmann@fi.uba.ar',
                        group_group_participant: {
                            groupId: 2,
                            userId: '2',
                        },
                    },
                ],
            },
        };

        const output = removeTimestamps(input);
        assert.deepStrictEqual(output, expectedOutput);
    });

    it('should return an empty object if input is an empty object', () => {
        const input = {};
        const expectedOutput = {};
        const output = removeTimestamps(input);
        assert.deepStrictEqual(output, expectedOutput);
    });
});


