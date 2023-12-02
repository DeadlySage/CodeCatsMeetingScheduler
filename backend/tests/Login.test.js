const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('../server')[0];
let connect = require('../server')[1];
const User = require('../models/user');
const bcrypt = require('bcrypt');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Calendar Meeting API Calls', () => {
    let connectStub;
    let userFindOneStub;
    let saveStub;

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
        saveStub = sinon.stub(User.prototype, 'save').resolves();
    })

    afterEach(() => {
      sinon.restore();
    });

    describe('/login', () => {
        it('should find a valid user and update last logged in', async () => {
            const newUser = new User({
                email: 'testemail@csus.edu',
                password: 'password',
                status_id: 2,
                last_logged_in: Date.now()
            });

            userFindOneStub.returns(newUser)
            let bcryptCompareStub = sinon.stub(bcrypt, 'compare');
            bcryptCompareStub.resolves(true);

            const res = await chai
                .request(app)
                .get('/api/login')
                .query({email: 'testemail@csus.edu', password: 'passowrd'});

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('loggedInUserId');
            sinon.assert.calledOnce(userFindOneStub);
            sinon.assert.calledOnce(saveStub);
        });
        it('should not find a user for an invalid email', async () => {
            userFindOneStub.returns()

            const res = await chai
                .request(app)
                .get('/api/login')
                .query({email: 'testemail@csus.edu', password: 'passowrd'});

            expect(res).to.have.status(401);
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.equal('Invalid email or password')
            sinon.assert.calledOnce(userFindOneStub);
            sinon.assert.notCalled(saveStub);
        });
        it('should return an error for an invalid password', async () => {
            const newUser = new User({
                email: 'testemail@csus.edu',
                password: 'password',
                status_id: 2,
                last_logged_in: Date.now()
            });

            userFindOneStub.returns(newUser)
            let bcryptCompareStub = sinon.stub(bcrypt, 'compare');
            bcryptCompareStub.resolves(false);

            const res = await chai
                .request(app)
                .get('/api/login')
                .query({email: 'testemail@csus.edu', password: 'wrongPassword'});

            expect(res).to.have.status(401);
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.equal('Invalid email or password')
            sinon.assert.calledOnce(userFindOneStub);
            sinon.assert.notCalled(saveStub);
        });
        it('should return an error for a pending account', async () => {
            const newUser = new User({
                email: 'testemail@csus.edu',
                password: 'password',
                status_id: 1,
                last_logged_in: Date.now()
            });

            userFindOneStub.returns(newUser)
            let bcryptCompareStub = sinon.stub(bcrypt, 'compare');
            bcryptCompareStub.resolves(true);

            const res = await chai
                .request(app)
                .get('/api/login')
                .query({email: 'testemail@csus.edu', password: 'wrongPassword'});

            expect(res).to.have.status(401);
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.equal('Account is still awaiting approval')
            sinon.assert.calledOnce(userFindOneStub);
            sinon.assert.notCalled(saveStub);
        });
    });
})