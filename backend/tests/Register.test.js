const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('../server')[0];
let connect = require('../server')[1];
const User= require('../models/user');


const expect = chai.expect;
chai.use(chaiHttp);


describe('Users API Calls', () => {
   let connectStub;
   let userFindOneStub;
   let userInstance;
   let saveStub;
   let userConstructorStub;
   

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
    
    userFindOneStub = sinon.stub(User, 'findOne');
    userInstance = new User();
    userConstructorStub = sinon.stub(User, 'constructor');
    saveStub = sinon.stub(User.prototype, 'save');
    jest.setTimeout(60000);
})

afterEach(() => {
  sinon.restore();
});
   
   describe('POST /users', () =>{
       it('should create new user', async () => {
        
            const newUser = {
                first_name : 'Test',
                last_name : 'Account',
                email: 'usertestaccount@csus.edu',
                password: 'Password1234!',
                role_id: 1,
                status_id: 2,
                first_question:'favorite food?',
                second_question: 'favorite color?',
                first_answer:'pizza',
                second_answer: 'orange',
            };
            userConstructorStub.returns(newUser);
            saveStub.resolves(newUser);
            userFindOneStub.returns();
            
            const res = await chai 
                .request(app)
                .post('/api/users')
                .send(newUser);

            sinon.assert.calledOnce(saveStub);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('first_name');
            expect(res.body).to.have.property('last_name');
            expect(res.body).to.have.property('email');
            expect(res.body).to.have.property('password');
            expect(res.body).to.have.property('role_id');
            expect(res.body).to.have.property('status_id');
            expect(res.body).to.have.property('first_question');
            expect(res.body).to.have.property('second_question');
            expect(res.body).to.have.property('first_answer');
            expect(res.body).to.have.property('second_answer');
            
            
       });
       
       it('should handle if a user is already made with an email', async () =>{

            userFindOneStub.returns([{
                first_name : 'Test',
                last_name : 'Account',
                email: 'usertestaccount@csus.edu',
                password: 'Password1234!',
                role_id: 1,
                status_id: 2,
                first_question:'favorite food?',
                second_question: 'favorite color?',
                first_answer:'pizza',
                second_answer: 'orange',
            }]);

            const overlappingUser = {
                first_name : 'New',
                last_name : 'Account',
                email: 'usertestaccount@csus.edu',
                password: 'Password12345!',
                role_id: 1,
                status_id: 2,
                first_question:'favorite food?',
                second_question: 'favorite color?',
                first_answer:'chicken',
                second_answer: 'red',
            };

            const res = await chai
                .request(app)
                .post('/api/users')
                .send(overlappingUser);

            sinon.assert.notCalled(saveStub);
            expect(res).to.have.status(300);
            expect(res.body).to.have.property('message').equal('An account with that email address already exists.');
            

            

       });
   });




});
