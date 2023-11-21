const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('../server')[0];
let connect = require('../server')[1];
const User = require('../models/user');

const expect = chai.expect;
chai.use(chaiHttp);

describe('User Settings API Calls', () => {
    let saveStub;
    let userFindByIdStub;


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
        saveStub = sinon.stub(User.prototype, 'save').resolves();
        userFindByIdStub = sinon.stub(User, 'findById');
    })

    afterEach(() => {
        sinon.restore();
    });

    describe('PATCH /api/users/:id', () => {
        it('should reset password succesfully', async () => {


            const newPassword = 'newPassword123!';

            const userData = new User ({
                id : '6451c0cd09b4910545248bd7',
                email: 'testinstructor@csus.edu',
                password: 'oldPassword123!',
                role_id: 2,
                first_name: 'Instructor',
                last_name: 'Test',
                status_id: 2,
                first_question: '1',
                second_question: '2',
                first_answer: '2',
                second_answer: '1',
            });

            userFindByIdStub.returns(userData);


            const res = await chai
                .request(app)
                .patch(`/api/users/${userData._id}`)
                .send(newPassword);

            expect(res).to.have.status(200);
            sinon.assert.calledOnce(saveStub);
            sinon.assert.calledWithExactly(saveStub);
            sinon.assert.calledOnce(userFindByIdStub);

        });

        it('should reset security questions', async () => {

            const newSecurityQuestions = {
                first_question: 'NewQuestion1',
                second_question: 'NewQuestion2',
                first_answer: 'NewAnswer1',
                second_answer: 'NewAnswer2'
            };
    
            const userData = new User ({
                email: 'testinstructor@csus.edu',
                password: 'oldPassword123!',
                role_id: 2,
                first_name: 'Instructor',
                last_name: 'Test',
                status_id: 2,
                first_question: '1',
                second_question: '2',
                first_answer: '2',
                second_answer: '1',
            });

            userFindByIdStub.returns(userData);


            const res = await chai
            .request(app)
            .patch(`/api/users/${userData._id}`)
            .send(newSecurityQuestions);
    
            expect(res).to.have.status(200);
            sinon.assert.calledOnce(saveStub);
            sinon.assert.calledWithExactly(saveStub);
            sinon.assert.calledOnce(userFindByIdStub);
        });
    });
});