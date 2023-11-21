const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('../server')[0];
let connect = require('../server')[1];
const User = require('../models/user');
const Meeting = require('../models/meeting');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Admin Page User API Calls', () => {
    let connectStub;

    let userFindStub;
    let userFindByIdStub;
    let userSaveStub;
    let userDeleteStub;

    let meetingFindStub;
    let meetingSaveStub;

    const mockUsers = [
        {
            _id: '6551c0cd08b4900545248bc7',
            email: 'testmail1@csus.edu',
            password: 'testpassword1',
            role_id: 1,
            first_name: 'test1',
            last_name: 'user1',
            status_id: 1,
            first_question: '1',
            second_question: '2',
            first_answer: '11',
            second_answer: '22',
            last_logged_in: '2023-11-18T05:31:38.104+00:00',
        },
        {
            _id: '6451c0cd09b4910545248bd7',
            email: 'testmail2@csus.edu',
            password: 'testpassword2',
            role_id: 1,
            first_name: 'test2',
            last_name: 'user2',
            status_id: 2,
            first_question: '1',
            second_question: '2',
            firt_answer: '11',
            second_answer: '22',
            last_logged_in: '2023-11-18T05:31:38.104+00:00',
        },
    ];

    beforeAll(async () => {
        // Create a stub for the connect function
        connectStub = sinon.stub();
        connectStub.returns(Promise.resolve());

        // Replace the actual connect function with the stub
        connect = connectStub;
        
        // Call the connect function
        await connect();
    });

    beforeEach(() => {
        userFindStub = sinon.stub(User, 'find');
        userFindByIdStub = sinon.stub(User, 'findById');
        userSaveStub = sinon.stub(User.prototype, 'save').resolves();
        userDeleteStub = sinon.stub(User.prototype, 'deleteOne').resolves({ n: 1 });

         // To handle logic for meetings associated with users
        meetingFindStub = sinon.stub(Meeting, 'find').resolves([]);
        meetingSaveStub = sinon.stub(Meeting.prototype, 'save').resolves();
    });

    afterEach(() => {
      sinon.restore();
      userFindStub.reset();
      userFindByIdStub.reset();
      userSaveStub.reset();
      userDeleteStub.reset();
    });

    describe('GET /users', () => {
        it('should get all users', async () => {
            userFindStub.returns(mockUsers);

            const res = await chai
                .request(app)
                .get('/api/users');

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.deep.equal(mockUsers); // Check if the response matches mock data
        });

        it('should get a specific user', async () => {
            // Stub the findById method to resolve with the mockUser
            userFindByIdStub.withArgs(mockUsers[0]._id).resolves(mockUsers[0]);
        
            const res = await chai
                .request(app)
                .get(`/api/users/${mockUsers[0]._id}`);
        
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.deep.equal(mockUsers[0]);
        });
        
    });

    describe('PATCH /users/:id', () => {
        it('should update the account status of the user', async () => {
            const newMockUser = new User(
                mockUsers[0]
            );

            userFindByIdStub.returns(newMockUser);

            const updatedUserData = {
                status_id: 2,
            };
    
            const res = await chai
                .request(app)
                .patch(`/api/users/${newMockUser._id}`)
                .send(updatedUserData);
        
            sinon.assert.calledOnce(userSaveStub);
            sinon.assert.calledWithExactly(userSaveStub);
          
        });

        it('should update the user role and password', async () => {
            const newMockUser = new User(
                mockUsers[1]
            );

            userFindByIdStub.returns(newMockUser);

            const updatedUserData = {
                role_id: 2,
                password: 'testpassword3'
            };

            const res = await chai
                .request(app)
                .patch(`/api/users/${newMockUser._id}`)
                .send(updatedUserData);
        
            sinon.assert.calledOnce(userSaveStub);
            sinon.assert.calledWithExactly(userSaveStub);
        });
    });

    describe('DELETE /users/:id', () => {
        it('should delete a selected user', async () => {
            const newMockUser = new User(
                mockUsers[1]
            );

            userFindByIdStub.returns(newMockUser);

            console.log('Before delete request');
            const res = await chai
                .request(app)
                .delete(`/api/users/${newMockUser._id}`);
            console.log('After delete request');

            sinon.assert.calledOnce(userDeleteStub);
            sinon.assert.calledWithExactly(userDeleteStub);
              

        });
        
        it('should handle a user not found during deletion', async () => {
            const userIdToDelete = 'nonexistentuserid';
    
            // Stub the findById method to simulate a user not found
            userFindByIdStub.withArgs(userIdToDelete).resolves(null);
    
            const res = await chai
                .request(app)
                .delete(`/api/users/${userIdToDelete}`);
    
            expect(res).to.have.status(404);
            expect(res.body).to.deep.equal({ message: "Cannot find user" });
    
            sinon.assert.calledOnce(userFindByIdStub);
            sinon.assert.calledWithExactly(userFindByIdStub, userIdToDelete);
            sinon.assert.notCalled(userDeleteStub);
        });
    });
    
    
});