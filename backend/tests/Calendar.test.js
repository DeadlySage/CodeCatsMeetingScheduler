const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('../server')[0];
let connect = require('../server')[1];
const Meeting = require('../models/meeting');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Non Student Meeting API', () => {
    let connectStub;
    let deleteManyStub;
    let meetingFindStub;
    let meetingFindByIdStub;
    let meetingInstance;
    let saveStub;
    let meetingConstructorStub;
    let meetingFindByIdAndDeleteStub;

    beforeAll(async () => {
        // Create a stub for the connect function
        connectStub = sinon.stub();
        connectStub.returns(Promise.resolve()); // You can adjust this based on the behavior you want to mimic

        // Replace the actual connect function with the stub
        connect = connectStub;
        
        // Call the connect function
        await connect();
    });

    beforeEach(() => {
        deleteManyStub = sinon.stub(Meeting, 'deleteMany').resolves({ /* mock result */ });
        meetingFindStub = sinon.stub(Meeting, 'find');
        meetingFindByIdStub = sinon.stub(Meeting, 'findById');
        meetingFindByIdAndDeleteStub = sinon.stub(Meeting, 'findByIdAndDelete');
        meetingInstance = new Meeting();
        meetingConstructorStub = sinon.stub(Meeting, 'constructor');
        saveStub = sinon.stub(Meeting.prototype, 'save').resolves();
    })

    afterEach(() => {
      sinon.restore();
    });

    describe('POST /meetings', () => {
        it('should create a new blocked time', async () => {
            meetingConstructorStub.returns(meetingInstance);
            meetingFindStub.returns([]);
    
            const newMeeting = {
                title: 'Blocked Time',
                start: "2023-10-19T08:00:00.000Z",
                end: "2023-10-19T08:30:00.000Z",
                instructor_id: '6551c0cd08b4900545248bc7',
                status: 'Approved',
                type_id: 2,
                notes: 'Fake notes',
            };

            const res = await chai
                .request(app)
                .post('/api/meetings')
                .send(newMeeting);

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('_id');
            expect(res.body).to.have.property('title');
            expect(res.body.title).to.equal('Blocked Time')
            expect(res.body).to.have.property('start');
            expect(res.body).to.have.property('end');
            expect(res.body).to.have.property('instructor_id');
            expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('type_id');
            expect(res.body).to.have.property('notes');
        });

        it('should handle overlapping meetings', async () => {
            meetingFindStub.returns([{ 
                title: 'Blocked Time',
                start: "2023-10-19T08:00:00.000Z",
                end: "2023-10-19T08:30:00.000Z",
                instructor_id: '6551c0cd08b4900545248bc7',
                status: 'Approved',
                type_id: 2,
                notes: 'Existing block time',
            }]);

            const overlappingMeeting = {
                title: 'Blocked Time',
                start: "2023-10-19T08:00:00.000Z",
                end: "2023-10-19T08:30:00.000Z",
                instructor_id: '6551c0cd08b4900545248bc7',
                status: 'Approved',
                type_id: 2,
                notes: 'New block time',
            };

            const res = await chai
                .request(app)
                .post('/api/meetings')
                .send(overlappingMeeting);

            expect(res).to.have.status(300);
            expect(res.body).to.have.property('message').equal('Overlapping meetings detected');
        });
    });

    describe('GET /meetings', () => {
        it('should get all meetings', async () => {
            meetingFindStub.returns([{
                title: 'Blocked Time',
                start: "2023-10-19T08:00:00.000Z",
                end: "2023-10-19T08:30:00.000Z",
                instructor_id: '6551c0cd08b4900545248bc7',
                status: 'Approved',
                type_id: 2,
                notes: 'Existing',
            }]);

            const res = await chai
                .request(app)
                .get('/api/meetings')

            sinon.assert.calledOnce(deleteManyStub);
            sinon.assert.calledOnce(meetingFindStub);
            sinon.assert.notCalled(meetingFindByIdStub);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body[0]).to.have.property('title');
            expect(res.body[0].title).to.equal('Blocked Time')
        });

        it('should get all meetings that match meetingId', async () => {
            meetingFindByIdStub.returns([{
                title: 'Specific Meeting',
                start: "2023-10-19T08:00:00.000Z",
                end: "2023-10-19T08:30:00.000Z",
                instructor_id: '6551c0cd08b4900545248bc7',
                status: 'Approved',
                type_id: 2,
                notes: 'Existing',
            }]);

            const res = await chai
                .request(app)
                .get('/api/meetings')
                .query({ meetingId: '6451c0cd09b4910545248bd7' });

            sinon.assert.calledOnce(deleteManyStub);
            sinon.assert.calledOnce(meetingFindByIdStub);
            sinon.assert.notCalled(meetingFindStub);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(1);
            expect(res.body[0]).to.have.property('title');
            expect(res.body[0].title).to.equal('Specific Meeting')
        });

        it('should get all meetings that match instructorId', async () => {

            meetingFindStub.returns([{
                title: 'InstructorId Meeting',
                start: "2023-10-19T08:00:00.000Z",
                end: "2023-10-19T08:30:00.000Z",
                instructor_id: '6451c0cd09b4910545248bd7',
                status: 'Approved',
                type_id: 2,
                notes: 'Existing',
            }]);

            const res = await chai
                .request(app)
                .get('/api/meetings')
                .query({ instructorId: '6451c0cd09b4910545248bd7' });

            sinon.assert.calledOnce(deleteManyStub);
            sinon.assert.notCalled(meetingFindByIdStub);
            sinon.assert.calledOnce(meetingFindStub);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(1);
            expect(res.body[0]).to.have.property('title');
            expect(res.body[0].title).to.equal('InstructorId Meeting')
        });
    });

    describe('PATCH /meetings/:id', () => {
        it('should update the meeting with passed in id', async () => {
            meetingFindStub.returns([]);

            const mockExistingMeeting = new Meeting({
                title: 'Original Title',
                start: "2023-10-19T08:00:00.000Z",
                end: "2023-10-19T08:30:00.000Z",
                instructor_id: '6551c0cd08b4900545248bc7',
                status: 'Approved',
                type_id: 2,
                notes: 'Original notes',
            });

            meetingFindByIdStub.returns(mockExistingMeeting);
    
            const updatedMeeting = {
                title: 'Updated Title',
                start: "2023-10-19T08:01:00.000Z",
                end: "2023-10-19T08:31:00.000Z",
                instructorId: '6551c0cd08b4900545248bc8',
                status: 'Pending',
                typeId: 1,
                notes: 'Updated notes',
            };

            const res = await chai
                .request(app)
                .patch('/api/meetings/6451c0cd09b4910545248bd7')
                .send(updatedMeeting);

            expect(res).to.have.status(200);
            sinon.assert.calledOnce(meetingFindByIdStub);
            sinon.assert.calledOnce(meetingFindStub);
            sinon.assert.calledOnce(saveStub);
        });

        it('should not update the meeting if it overlaps with another', async () => {
            meetingFindStub.returns([{
                title: 'Original Title',
                start: "2023-10-19T08:00:00.000Z",
                end: "2023-10-19T08:30:00.000Z",
                instructor_id: '6551c0cd08b4900545248bc7',
                status: 'Approved',
                type_id: 2,
                notes: 'Original notes',
            }]);

            const mockExistingMeeting = new Meeting({
                title: 'Original Title',
                start: "2023-10-19T08:00:00.000Z",
                end: "2023-10-19T08:30:00.000Z",
                instructor_id: '6551c0cd08b4900545248bc7',
                status: 'Approved',
                type_id: 2,
                notes: 'Original notes',
            });

            meetingFindByIdStub.returns(mockExistingMeeting);
    
            const updatedMeeting = {
                title: 'Updated Title',
                start: "2023-10-19T08:01:00.000Z",
                end: "2023-10-19T08:31:00.000Z",
                instructorId: '6551c0cd08b4900545248bc8',
                status: 'Pending',
                typeId: 1,
                notes: 'Updated notes',
            };

            const res = await chai
                .request(app)
                .patch('/api/meetings/6451c0cd09b4910545248bd7')
                .send(updatedMeeting);

            expect(res).to.have.status(300);
            expect(res.body.message).to.equal('Overlapping meetings detected')
            sinon.assert.calledOnce(meetingFindByIdStub);
            sinon.assert.calledOnce(meetingFindStub);
            sinon.assert.notCalled(saveStub);
        });
    });

    describe('DELETE /meetings/:id', () => {
        it('should delete the meeting for passed in id', async () => {
            meetingFindByIdAndDeleteStub.returns([{
                title: 'Original Title',
                start: "2023-10-19T08:00:00.000Z",
                end: "2023-10-19T08:30:00.000Z",
                instructor_id: '6551c0cd08b4900545248bc7',
                status: 'Approved',
                type_id: 2,
                notes: 'Original notes',
            }]);

            const res = await chai
                .request(app)
                .delete('/api/meetings/6451c0cd09b4910545248bd7')

            expect(res).to.have.status(200);
            expect(res.body.message).to.equal('Meeting deleted successfully');
            sinon.assert.calledOnce(meetingFindByIdAndDeleteStub);
        });

        it('should not delete a meeting for no meeting found', async () => {
            meetingFindByIdAndDeleteStub.returns();

            const res = await chai
                .request(app)
                .delete('/api/meetings/6451c0cd09b4910545248bd7')

            expect(res).to.have.status(404);
            expect(res.body.error).to.equal('Meeting not found');
            sinon.assert.calledOnce(meetingFindByIdAndDeleteStub);
        });
    });
});
