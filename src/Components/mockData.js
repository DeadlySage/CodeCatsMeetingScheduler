export const mockUser = {
    id: 'user1',
    name: 'John Doe'
};

const today = new Date();

const oneDayLater = new Date();
oneDayLater.setDate(today.getDate() + 1);

const twoDaysLater = new Date();
twoDaysLater.setDate(today.getDate() + 2);

export const mockMeetings = [
    {
        id: 'meeting1',
        title: 'Team Meeting 1',
        start: new Date(today),
        end: new Date(today.setHours(today.getHours() + 1)), // Assuming the meeting lasts 1 hour
        attendees: ['user1'],
        url: 'http://example.com/meeting1'
    },
    {
        id: 'meeting2',
        title: 'Team Meeting 2',
        start: new Date(oneDayLater),
        end: new Date(oneDayLater.setHours(oneDayLater.getHours() + 1)), // Assuming the meeting lasts 1 hour
        attendees: ['user2'],
        url: 'http://example.com/meeting2'
    },
    {
        id: 'meeting3',
        title: 'Team Meeting 3',
        start: new Date(twoDaysLater),
        end: new Date(twoDaysLater.setHours(twoDaysLater.getHours() + 1)), // Assuming the meeting lasts 1 hour
        attendees: ['user1', 'user2'],
        url: 'http://example.com/meeting3'
    },
];